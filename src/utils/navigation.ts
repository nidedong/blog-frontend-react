import { NavigateFunction } from 'react-router';

let navigateRef: NavigateFunction | undefined;

export const setNavigate = (navigate: NavigateFunction) => {
  if (!navigateRef) {
    navigateRef = navigate;
  }
};

export const navigateTo: NavigateFunction = (...args) => {
  if (navigateRef) {
    (<any>navigateRef)(...args);
  } else {
    console.error('Navigate not initialized!');
  }
};

export const toHome = () => navigateTo('/home');
export const toLogin = () => navigateTo('/user/login');
export const toRegister = () => navigateTo('/user/register');
