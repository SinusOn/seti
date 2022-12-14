const https = require("https");
const fs = require("fs");
const nodemailer = require("nodemailer");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.use(express.static(`${__dirname}/static`));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

//

app.get("/", (req, res) => {
  fs.createReadStream("./index.html").pipe(res);
});
app.get("/error", (req, res) => {
  fs.createReadStream("static/error.html").pipe(res);
});

https
  .createServer(
    {
      key: fs.readFileSync(__dirname + "/cert/key.pem"),
      cert: fs.readFileSync(__dirname + "/cert/cert.pem"),
    },
    app
  )
  .listen(PORT, () => {
    console.log(`Server started: https://localhost:${PORT}`);
  });

//
let email = "",
  pass = "",
  theme = "",
  mail = "",
  dist = "";

app.post("/sendmail", (req, res) => {
  //прием данных
  email = req.body.email;
  pass = req.body.pass;
  theme = req.body.theme;
  mail = req.body.text;
  dist = req.body.dist;

  //проверка данных
  if (!email) return res.end("Your Email empty");
  if (!pass) return res.end("Your password empty");
  if (!mail && !theme) return res.end("Theme or text message empty");
  if (!dist) return res.end("Email destination empty");
  console.log("Данные получены");

  // отправка почты

  const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true,
    auth: {
      user: email,
      pass: pass,
    },
  });

  const mailOptions = {
    from: email,
    to: dist,
    subject: theme,
    text: mail,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log("Error");
    } else {
      res.redirect(`https://localhost:${PORT}`);
    }
  });
  (email = ""), (pass = ""), (theme = ""), (mail = ""), (dist = "");
});
