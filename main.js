import { fetchComment, postApiFunction, comments } from "./api.js";
import renderApp from "./renderComments.js";

const addFormName = document.querySelector('.add-form-name');
const addFormText = document.querySelector('.add-form-text');
const addFormButton = document.querySelector('.add-form-button');
const commentsElement = document.querySelector('.comments');

const container = document.querySelector('.container');
const addForm = document.querySelector('.add-form');
const loader = document.createElement('span');
export { loader, addFormName, addFormText, addFormButton, addForm, commentsElement}

// Массив имеющихся комментариев

//Загрузка комментариев на странице
loader.textContent = 'Комментарий  загружается...';
container.appendChild(loader);

// Функция для добавления лайка к комментарию
const addLike =(event) => {
  const comment = comments[event.target.dataset.index];
  comment.likes++;
  comment.liked = true;
}

// Функция для удаления лайка к комментарию
const removeLike =(event) => {
  const comment = comments[event.target.dataset.index];
  comment.likes--;
  comment.liked = false;
}

//Вешаем обработчик события на кнопки лайк
export const initLikeClickListener = () => {
  const likeClicks = document.querySelectorAll('.likes');
  for(const likeClick of likeClicks) {
    likeClick.addEventListener('click', (event) => {
      (comments[event.target.dataset.index].liked) ? removeLike(event) : addLike(event);
      //Отмена всплытия на кнопке лайка
      event.stopPropagation();
      renderApp();
    });
  }
}

//Функция ответа на комментарий
export const commentResponse = () => {
  const commentTexts = document.querySelectorAll('.comment');
  const addFormText = document.querySelector('.add-form-text');
  for(const comment of commentTexts) {
    comment.addEventListener('click', (event) => {
      const message = comment.querySelector('.comment-body').textContent.trim();
      const author = comment.querySelector('.comment-name').textContent;
      addFormText.value = `>${message} \n @${author}`;
    })
  }
}

renderApp();
fetchComment();

//Создание нового комментария  
function createNewComment() {
  const date = new Date();
  const newCommentDate = `${("0" + date.getDate()).slice(-2)}.${("0" + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear().toString().slice(-2)} ${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}`;
  const newComment = {
    //Закрытие уязвимостей
    name:addFormName.value.replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;"),
    date: newCommentDate,
    text: addFormText.value.replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;"),
    likes: 0
  }
  postApiFunction(newComment);
  //Загрузка комментария
  addForm.classList.add('hidden');
  loader.classList.remove('hidden');
    
  renderApp();
}