import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const getAuthToken = () => {
  return cookies.get('accessToken') || cookies.get('authToken') || null;
};

export const getUserId = () => {
  return cookies.get('userId') || null;
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

export const setAuthTokens = (authData) => {
  const cookieOptions = {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 дней
    sameSite: 'lax',
  };

  if (authData.tokens?.access) {
    cookies.set('accessToken', authData.tokens.access, cookieOptions);
  }
  if (authData.tokens?.refresh) {
    cookies.set('refreshToken', authData.tokens.refresh, cookieOptions);
  }
  if (authData.user_id) {
    cookies.set('userId', authData.user_id, cookieOptions);
  }
  if (authData.phone) {
    cookies.set('userPhone', authData.phone, cookieOptions);
  }
};

export const clearAuthData = () => {
  cookies.remove('authToken', { path: '/' });
  cookies.remove('user', { path: '/' });
  cookies.remove('accessToken', { path: '/' });
  cookies.remove('refreshToken', { path: '/' });
  cookies.remove('userId', { path: '/' });
  cookies.remove('userPhone', { path: '/' });
};

export const isAuthenticated = () => {
  return !!cookies.get('accessToken');
};

export const getUserPhone = () => {
  return cookies.get('userPhone') || null;
};