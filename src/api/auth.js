import API from './client';

export const register = (userData) => API.post('/auth/register', userData);

export const login = (credentials) => API.post('/auth/login', credentials);

export const getMe = () => API.get('/auth/me');

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};
