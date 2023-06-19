import {  getWrittenComments, comments, addRemoveLike, token, setToken, commentResponse } from "./main.js";
import { postApiFunction } from "./api.js";
import { renderLogin, name } from "./components/login-component.js";
import { format } from "date-fns";

let isLoadingAdd = false;

//Рендер формы
const renderForm = (isLoading) => {
  const addForm = document.querySelector('.add-form');
  const loader = document.getElementById('loader');

  if (isLoading) {
    loader.classList.remove('hidden');
    addForm.classList.add('hidden');
  } else {
    loader.classList.add('hidden');
    addForm.classList.remove(hidden);
  }
}

// Рендер функция
export const renderApp = (loadingComments) => {
  const appEl = document.getElementById('app');
  const commentsHtml = comments.map((comment, index) => {
    // Вызываем функцию format из date-fns
    const validDate = format(new Date(comment.date), 'yyyy-MM-dd hh:mm:ss');
    comment.isLiked ? comment.isLiked = '-active-like' : comment.isLiked = '';
    return `<li class="comment" data-index="${index}">
    <div class="comment-header">
      <div class="comment-name">${comment.name}.</div>
      <div>${validDate}</div>
    </div>
    <div class="comment-body">
      <div class="comment-text">
        ${comment.text}
      </div>
    </div>
    <div class="comment-footer">
      <div class="likes">
        <span class="likes-counter">${comment.likes}</span>
        <button data-index="${index}" class="like-button ${comment.isLiked}"></button>
      </div>
    </div>
    </li>`;
  })
    .join('')

  if (!token) {
    const appHtml = `
        <ul class="comments">
          ${
            loadingComments 
            ? "<p>Комментарии загружаются...</p>"
            : ""
          }
          ${commentsHtml}
        </ul>
        <p class="warning">Чтобы оставить комментарий, <button class="login-button">авторизуйтесь</buttton></p>
    `;

    appEl.innerHTML = appHtml;
    document.querySelector('.login-button').addEventListener('click', () => {
      renderLogin({
        appEl,
        setToken: (newToken) => {
          setToken(newToken);
        },
        getWrittenComments,
      });
    });

    return;
  }

  const appHtml = `
    <ul class="comments">
      ${
        loadingComments 
          ? "<p>Комментарии загружаются...</p>"
          : ""
      }
      ${commentsHtml}
    </ul>
    <div class="add-form">
      <input
        type="text"
        class="add-form-name"
        placeholder="Введите ваше имя"
      />
      <textarea
        type="textarea"
        class="add-form-text"
        placeholder="Введите ваш коментарий"
        rows="4"
      ></textarea>
      <div class="add-form-row">
        <button class="add-form-button" id="button-add">Написать</button>
      </div>
    </div>
    <div class="loading-comment hidden" id="loader">Комментарий добавляется...</div>
  `;

  appEl.innerHTML = appHtml;

  const addFormName = document.querySelector('.add-form-name');
  const addFormText = document.querySelector('.add-form-text');
  const addFormButton = document.querySelector('.add-form-button');
  addFormButton.disabled = true;

  addFormName.value = name;
  addFormName.disabled = true;

  addFormText.addEventListener('input', () => {
    addFormButton.disabled = false;
  });

  //Обработяик события для создания комментария
  addFormButton.addEventListener('click', () => {
    addFormText.classList.remove('error');

    isLoadingAdd = true;
    renderForm(isLoadingAdd); //main.js file

    postApiFunction({
      text: addFormText.value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;"),
      token,
    })
      .then(() => {
        return getWrittenComments();
      })
      .then(() => {
        isLoadingAdd = false;
        renderForm(isLoadingAdd);
        addFormText.value = "";
      })
      .catch((error) => {
        isLoadingAdd = false;
        renderForm(isLoadingAdd);
        alert(error.message);
      });
  });

  //Ввод текста
  addFormButton.disabled = true;
  addFormButton.classList.add('empty');
  addFormText.addEventListener('input', () => {
    if(addFormText.value.trim() !== '') {
      addFormButton.disabled = false;
      addFormButton.classList.remove('empty');
    } else {
      addFormButton.disabled = true;
      addFormButton.classList.add('empty');
    }
  });

  addRemoveLike(comments);
  commentResponse();
};
