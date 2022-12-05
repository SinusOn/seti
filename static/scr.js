//отправка запроса на сервер
const form = document.querySelector("form");
const xhr = new XMLHttpRequest();
let fd = new FormData([form]);
fd.append(name, value);
xhr.open("POST", "/sendmail");
xhr.send(fd);
