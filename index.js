const http = require("http");
const fs = require("fs");
const nodemailer = require("nodemailer");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

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

http.createServer({}, app).listen(3000, () => {
  console.log("Server started");
});

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
  if (!req.body.email) return res.end("Email empty");
  if (!req.body.pass) return res.end("Pass empty");
  if (req.body.mail == "") return res.end("Text empty");
  if (!req.body.dist) return res.end("Email destination empty");
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
      // res.sendStatus(400);
      // res.redirect("/index.html");
      res.status(400).redirect("http://localhost:3000/error");
    } else {
      res.redirect("http://localhost:3000");
    }
  });
});
