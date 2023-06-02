import { initLikeClickListener, commentResponse, commentsElement } from "./main.js";
import { comments } from "./api.js";

// Создаем для каждого комментария HTML-разметку 
const renderComments = () => {
  const appEl = document.getElementById('app');
  const commentsHtml = comments.map((comment, index) => {
    const date = new Date(comment.date);
    const validDate = `${("0" + date.getDate()).slice(-2)}.${("0" + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear().toString().slice(-2)} ${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}`;
    comment.liked ? comment.liked = '-active-like' : comment.liked = '';
    return `<li class="comment" >
    <div class="comment-header" data-index="${index}">
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
        <button data-index="${index}" class="like-button ${comment.liked}"></button>
      </div>
    </div>
    </li>`;
    })
    .join('')

  const appHtml = `
    <ul class="comments">
      <!-- рендерится в js -->
      ${commentsHtml}
    </ul>

    <div class="add-form">
      Форма входа <br></br>
      <input
        type="text"
        class="add-form-login"
        placeholder="Введите ваше имя"
      />
      <input
        type="password"
        class="add-form-text"
        placeholder="Пароль"
    />
      <div class="add-form-row">
        <button class="login-button">Войти</button>
      </div>
    </div>

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
        <button class="add-form-button">Написать</button>
      </div>
    </div>
    `
   
  appEl.innerHTML = appHtml;

  const addFormName = document.querySelector('.add-form-name');
  const addFormText = document.querySelector('.add-form-text');
  const addFormButton = document.querySelector('.add-form-button');

  addFormButton.addEventListener('click', () => {
  
    addFormName.classList.remove('error');
    addFormText.classList.remove('error');
  
    if(addFormName.value ==='') {
       addFormName.classList.add('error');
       return
    } else {
       addFormName.classList.remove('error');
    }
  
    if(addFormText.value === '') {
       addFormText.classList.add('error');
       return
    } else {
      addFormText.classList.remove('error');
    }
  
    createNewComment();
  });
      
  initLikeClickListener();
  commentResponse();
};
  export default renderComments