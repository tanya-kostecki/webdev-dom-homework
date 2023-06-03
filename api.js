import { loader, addFormName, addFormText, addForm } from "./main.js";
import renderApp from "./renderComments.js";
export let comments = [];

const host = 'https://wedev-api.sky.pro/api/v2/:tanya-kostecki/comments';
// let token = "Bearer asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k";
// token = null;
// export { token };

//Запрос на получение комментария из API
export function fetchComment(token) {
  return fetch(host, {
    method: "GET",
    headers: {
      Authorization: token
    }
  }).then((response) => {
    return response.json()
  })
    .then((responseData) => {
      loader.classList.add('hidden');
      //Преобразовываем данные api в формат приложения
      const appComments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: new Date(comment.date),
          text: comment.text,
          likes: comment.likes,//
          liked: false
        }
      }
      )
      comments = appComments;
      renderApp();
    })
    .catch((error) => {
      alert(error.message);
    })
}
fetchComment();

//Запрос на добавление комментария в API
export function postApiFunction(token) {
  return fetch(host, {
    method: 'POST',
    body: JSON.stringify({
      name: addFormName.value
        .replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
      text: addFormText.value
        .replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
      forceError: true,
    }),
    headers: {
      Authorization: token
    }
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      } else if (response.status === 500) {
        throw new Error('Неполадки на сервере, попробуйте позже');
      } else if (response.status === 400 || addFormName.value.length < 3 && addFormText.value.length < 3) {
        throw new Error('Имя и комментарий не должны быть короче 3-х символов');
      }
    })
    .then((responseData) => {
      return fetchComment(responseData);
    })
    .then((data) => {
      loader.classList.add('hidden');
      addForm.classList.remove('hidden');
      addFormName.value = '';
      addFormText.value = '';
    })
    .catch((error) => {
      if (error.message === 'Неполадки на сервере, попробуйте позже') {
        alert(error.message);
        postApiFunction();
      } else if (error.message === 'Failed to fetch') {
        alert('Проблемы с подключением к сети Интетрет');
        loader.classList.add('hidden');
        addForm.classList.remove('hidden');
      } else if (error.message === 'Имя и комментарий не должны быть короче 3-х символов') {
        loader.classList.add('hidden');
        addForm.classList.remove('hidden');
        alert(error.message);
      } else {
        alert(error.message);
        console.warn(error);
      }
    })
}