import { initLikeClickListener, commentResponse, commentsElement } from "./main.js";
import { comments } from "./api.js";

// Создаем для каждого комментария HTML-разметку 
const renderComments = () => {
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
      commentsElement.innerHTML = commentsHtml;
      
      initLikeClickListener();
      commentResponse();
  
    };
  export default renderComments