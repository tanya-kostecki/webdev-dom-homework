let token = null;
let comments = [];
let loadingComments = true;
let isLoadingAdd = false;

import { fetchComment, postApiFunction } from "./api.js";
import { renderLogin, name } from "./components/login-component.js";

//Рендер комментарий
export const getWrittenComments = async () => {
  renderApp(loadingComments);
  return fetchComment({ token })
    .then((responseData) => {
      const appComments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: new Date(comment.date),
          text: comment.text,
          likes: comment.likes,
          isLiked: comment.isLiked,
        };
      });
      comments = appComments;
      loadingComments = false;
      renderApp(loadingComments);
    })
    .catch((error) => {
      alert(error.message);
    });
};

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
};

//Рендер функция
const renderApp = (loadingComments) => {
  const appEl = document.getElementById('app');
  const commentsHtml = comments.map((comment, index) => {
    const date = new Date(comment.date);
    const validDate = `${("0" + date.getDate()).slice(-2)}.${("0" + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear().toString().slice(-2)} ${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}`;
    comment.isLiked ? comment.isLiked = '-active-like' : comment.isLiked = "";
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
          token = newToken;
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

getWrittenComments();

//Функция ответа на комментарий
export const commentResponse = () => {
  const commentTexts = document.querySelectorAll('.comment');
  const addFormText = document.querySelector('.add-form-text');
  for (const comment of commentTexts) {
    comment.addEventListener('click', () => {
      const message = comment.querySelector('.comment-body').textContent.trim();
      const author = comment.querySelector('.comment-name').textContent;
      addFormText.value = `>${message} \n @${author}`;
    });
  };
};

// Функция для добавления лайка к комментарию
const addLike = (event) => {
  const comment = comments[event.target.dataset.index];
  comment.likes++;
  comment.isLiked = true;
}

// Функция для удаления лайка к комментарию
const removeLike = (event) => {
  const comment = comments[event.target.dataset.index];
  comment.likes--;
  comment.isLiked = false;
}

//Вешаем обработчик события на кнопки лайк
export const addRemoveLike = () => {
  const likeClicks = document.querySelectorAll('.likes');
  for (const likeClick of likeClicks) {
    likeClick.addEventListener('click', (event) => {
      (comments[event.target.dataset.index].isLiked) ? removeLike(event) : addLike(event);
      //Отмена всплытия на кнопке лайка
      event.stopPropagation();
      renderApp();
    });
  }
}
