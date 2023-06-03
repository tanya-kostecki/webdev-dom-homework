
export function renderLoginComponent({ appEl, commentsHtml, setToken, renderApp }) {
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
          class="add-form-password"
          placeholder="Пароль"
        />
        <div class="add-form-row">
          <button id="login-button" class="login-button">Войти</button>
        </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    document.getElementById('login-button').addEventListener('click', (newToken) => {
      setToken(`Bearer ${newToken}`);
      renderApp();
      // fetchComment();
    });
}