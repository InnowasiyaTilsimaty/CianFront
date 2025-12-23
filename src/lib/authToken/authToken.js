import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const getAuthToken = () => {
  return cookies.get('authToken') || null;
};

export const getUser = () => {
  return cookies.get('user') || null;
};

export const setAuthData = (token, user) => {
  const cookieOptions = {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 дней
    sameSite: 'lax',
  };

  cookies.set('authToken', token, cookieOptions);
  if (user) {
    cookies.set('user', user, cookieOptions);
  }
};

export const clearAuthData = () => {
  cookies.remove('authToken', { path: '/' });
  cookies.remove('user', { path: '/' });
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};