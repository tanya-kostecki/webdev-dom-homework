const host = "https://wedev-api.sky.pro/api/v2/:tanya-kostecki/comments";

//Запрос на получение комментария из API
export async function fetchComment({ token }) {
  return fetch(host, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if(response.status === 401) {
      throw new Error ("Нет авторизации");
    }
    if(response.status === 500) {
      throw new Error ("Неполадки на сервере, попробуйте позже");
    }
    return response.json()
  });
}

//Запрос на добавление комментария в API
export async function postApiFunction({ text, token }) {
  return fetch(host, {
    method: "POST",
    body: JSON.stringify({
      text,
      // forceError: true,
    }),
    headers: {
      Authorization: token,
    }
  })
    .then((response) => {
      if (response.status === 400) {
        throw new Error ("Комментарий не должны быть короче 3-х символов")
      } 
      if (response.status === 500) {
        throw new Error('Неполадки на сервере, попробуйте позже');
      } 
      return response.json();
    });
}

// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md
//Авторизация пользователя
export async function loginUser({ login, password }) {
  return fetch("https://wedev-api.sky.pro/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if(response.status === 400) {
      throw new Error('Неверный логин или пароль');
    }
    return response.json();
  });
}

//Регистрация нового пользователя
export async function registerUser({ login, password, name }) {
  return fetch("https://wedev-api.sky.pro/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name
    }),
  }).then((response) => {
    if(response.status === 400) {
      throw new Error('Такой пользватель уже существует');
    }
    return response.json();
  });
}