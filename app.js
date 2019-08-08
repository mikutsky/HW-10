//Модуль http предачи и получения сообщений
// const http = {
//   get(url, cb) {
//     try {
//       const xhr = new XMLHttpRequest();
//       xhr.open("GET", url);

//       xhr.addEventListener("load", () => {
//         if (xhr.status < 200 && xhr.status > 299) {
//           cb(`Error. Status code: ${xhr.status}`, xhr);
//           return;
//         }
//         const response = JSON.parse(xhr.responseText);
//         cb(null, response);
//       });

//       xhr.addEventListener("error", () => {
//         cb(`Error. Status code: ${xhr.status}`, xhr);
//       });

//       xhr.send();
//     } catch (error) {
//       cb(error);
//     }
//   },
//   post(url, body, headers, cb) {
//     try {
//       const xhr = new XMLHttpRequest();
//       xhr.open("POST", url);

//       xhr.addEventListener("load", () => {
//         if (xhr.status < 200 && xhr.status > 299) {
//           cb(`Error. Status code: ${xhr.status}`, xhr);
//           return;
//         }
//         const response = JSON.parse(xhr.responseText);
//         cb(null, response);
//       });

//       xhr.addEventListener("error", () => {
//         cb(`Error. Status code: ${xhr.status}`, xhr);
//       });

//       if (headers) {
//         Object.entries(headers).forEach(([key, value]) => {
//           xhr.setRequestHeader(key, value);
//         });
//       }

//       xhr.send(JSON.stringify(body));
//     } catch (error) {
//       cb(error);
//     }
//   }
// };

//Модуль для работы с новостным API
const newsService = (function() {
  const apiKey = "a483e3dbc3fd4ca5a460d940ec87a00a";
  const apiUrl = "https://newsapi.org/v2";

  return {
    topHeadlines(country = "ua", category = "general", cb) {
      http.get(
        `${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`,
        cb
      );
    },
    everything(text, cb) {
      http.get(`${apiUrl}/everything?q=${text}&apiKey=${apiKey}`, cb);
    }
  };
})();

//Функция формирует и отправляет запрос на сервер, по параметрам указанным
//пользователем в форме
function loadNews() {
  const selectCountry = document.querySelector("#country").value;
  const selectCategory = document.querySelector("#category").value;
  const inputQuery = document.querySelector("#query").value;

  if (inputQuery === "")
    newsService.topHeadlines(selectCountry, selectCategory, onGetResponse);
  else newsService.everything(inputQuery, onGetResponse);
}

//Функция-обработчик полученного ответа от сервера
function onGetResponse(err, res) {
  if (err) {
    alert(err);
    return;
  }

  if (!res.articles.length) {
    alert("Новостей не найдено");
    return;
  }

  renderNews(res.articles);
}

//Функция выводит полученный список новостей
function renderNews(newsItems) {
  let fragment = "";

  newsItems.forEach(item => {
    const el = newsTemplate(item);
    fragment += el;
  });

  newsContainer.insertAdjacentHTML("afterbegin", fragment);
}

//Функция подготавливает полученную новость, оборачивает в шаблон
function newsTemplate({ url, title, description, urlToImage } = {}) {
  return `
    <div class="col s12">
      <div class="card">
        <div class="card-image">
          <img src="${urlToImage}">
          <span class="card-title">${title || ""}</span>
        </div>
        <div class="card-content">
          <p>${description || ""}</p>
        </div>
        <div class="card-action">
          <a href="${url}">Read more</a>
        </div>
      </div>
    </div>
  `;
}

//Получаем указатели на элементы инициализируем скрипты,
//загружаем стартовые новости
const newsContainer = document.querySelector(".news-container .row");
document.addEventListener("DOMContentLoaded", function() {
  M.AutoInit();
  loadNews();
});

//Устанавливаем событие на submit формы
document.forms[0].addEventListener("submit", el => {
  el.preventDefault();

  newsContainer.innerHTML = "";
  loadNews();
});
