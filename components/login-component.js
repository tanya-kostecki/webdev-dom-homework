
export function renderLoginComponent({ appEl, commentsHtml, setToken, renderApp }) {
    const appHtml = `
    <ul class="comments">
      <!-- рендерится в js -->
      ${commentsHtml}
    </ul>  
    <div class="login-form">
        Чтобы оставить комментарий, необходимо войти в аккаунт <br></br>
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
    <div class="sign-up"> Нет аккаунта?
      <button id="sign-up-button" class="sign-up-button">Зарегистрироваться</button>
    </div>
  `;

    appEl.innerHTML = appHtml;
    const loginButton = document.querySelector('.login-button');
    // const loginName = document.querySelector('.add-form-login');
    // const loginPassword = document.querySelector('.add-form-password');

    loginButton.addEventListener('click', (newToken) => {
      // inputsCheck();
      setToken(`Bearer ${newToken}`);
      renderApp();
      // fetchComment();
    });

    // function inputsCheck() {
    //   if(loginName === '') {
    //     loginName.placeholder = 'Введите логин';
    //     loginName.classList.add('error');
    //     return
    //   } else {
    //     loginName.classList.remove('error');
    //   }

    //   if(loginPassword === '') {
    //     loginPassword.placeholder = 'Введите пароль';
    //     loginPassword.classList.add('error');
    //     return
    //   } else {
    //     loginPassword.classList.remove('error');
    //   }
    // }
}