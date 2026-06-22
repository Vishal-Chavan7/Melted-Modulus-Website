const AUTH_REDIRECT_KEY = 'auth_redirect';

export const setAuthRedirect = (path) => {
  sessionStorage.setItem(AUTH_REDIRECT_KEY, path);
};

export const consumeAuthRedirect = () => {
  const path = sessionStorage.getItem(AUTH_REDIRECT_KEY);
  sessionStorage.removeItem(AUTH_REDIRECT_KEY);
  return path;
};

export const peekAuthRedirect = () => sessionStorage.getItem(AUTH_REDIRECT_KEY);
