const https = require("https");
const fs = require("fs");
const nodemailer = require("nodemailer");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.use(express.static(`${__dirname}/static`));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// сервер

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
  tema = "",
  mail = "",
  dist = "";

app.post("/sendmail", (req, res) => {
  //прием данных
  email = req.body.email;
  pass = req.body.pass;
  tema = req.body.tema;
  mail = req.body.text;
  dist = req.body.dist;

  //проверка данных
  if (!email) return res.end("Email empty");
  if (!pass) return res.end("Pass empty");
  if (!mail) return res.end("Text empty");
  if (!dist) return res.end("Email destination empty");
  console.log("Данные получены");
  console.log(`мыло источника ${email}; пароль ист${pass};
  тема письма ${tema}; само письмо ${mail}; кому отправлено ${dist}`);

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
    subject: tema,
    text: mail,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log("Error");
      res.status(400).redirect(`https://localhost:${PORT}/error`);
    } else {
      res.redirect(`https://localhost:${PORT}`);
    }
  });
  (email = ""), (pass = ""), (tema = ""), (mail = ""), (dist = "");
  console.log("конец");
});
