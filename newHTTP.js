//ЗАДАНИЕ №1
//Дана функция http() которая возвращает объект с методами get и post, который
//мы делали на занятии.
//Переписать методы в этой функции на Promises и fetch

// function http() {
//   return {
//     get(url, cb) {
//       try {
//         const xhr = new XMLHttpRequest();
//         xhr.open('GET', url);
//         xhr.addEventListener('load', () => {
//           if (Math.floor(xhr.status / 100) !== 2) {
//             cb(`Error. Status code: ${xhr.status}`, xhr);
//             return;
//           }
//           const response = JSON.parse(xhr.responseText);
//           cb(null, response);
//         });
//         xhr.addEventListener('error', () => {
//           cb(`Error. Status code: ${xhr.status}`, xhr);
//         });
//         xhr.send();
//       } catch (error) {
//         cb(error);
//       }
//     },
//     post(url, body, headers, cb) {
//       try {
//         const xhr = new XMLHttpRequest();
//         xhr.open('POST', url);
//         xhr.addEventListener('load', () => {
//           if (Math.floor(xhr.status / 100) !== 2) {
//             cb(`Error. Status code: ${xhr.status}`, xhr);
//             return;
//           }
//           const response = JSON.parse(xhr.responseText);
//           cb(null, response);
//         });
//         xhr.addEventListener('error', () => {
//           cb(`Error. Status code: ${xhr.status}`, xhr);
//         });
//         if (headers) {
//           Object.entries(headers).forEach(([key, value]) => {
//             xhr.setRequestHeader(key, value);
//           });
//         }
//         xhr.send(JSON.stringify(body));
//       } catch (error) {
//         cb(error);
//       }
//     },
//   };
// }

//Переписал http как объект, т.к. тело предложенной ф-ци пустое
//Объект http с методами, переписанными на promises и fetch
const http = {
  get(url, cb) {
    fetch(url)
      .then(response => response.json())
      .then(data => cb(null, data))
      .catch(err => cb(err.message));
  },
  post(url, body, headers, cb) {
    fetch(url, { method: "POST", body: JSON.stringify(body), headers })
      .then(response => response.json())
      .then(data => cb(null, data))
      .catch(err => cb(err.message));
  }
};

//Проверка

const myURL = "https://jsonplaceholder.typicode.com/users";
const myHeaders = { "Content-Type": "application/json" };
const myUser = { name: "Petya", username: "Vasichkin" };

//Функция коллбэк
function cb(err, body) {
  if (err) return alert(err);
  return console.dir(body);
}

//Вызываем наши методы
http.get(myURL, cb);
http.post(myURL, myUser, myHeaders, cb);
