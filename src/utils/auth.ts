import { toLogin } from './navigation';

export const ACCESS_TOKEN_KEY = 'access_token';

export const getToken = () => {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setToken = (token: string | undefined) => {
  if (!token) {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    return;
  }
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const logout = () => {
  setToken(undefined);
  toLogin();
  localStorage.clear();
  window.location.reload();
};
