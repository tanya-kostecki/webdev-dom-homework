export let token = null;
export let comments = [];
let loadingComments = true;

export const getToken = () => token;
export const setToken = (newToken) => {
  token = newToken;
}


import { fetchComment } from "./api.js";
import { renderApp } from "./renderComments.js";
//Рендер имеющихся комментарий
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
          // isLikeLoading: false,
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
