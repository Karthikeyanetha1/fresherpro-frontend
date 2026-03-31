import API from './client';

export const createOrUpdatePortfolio = (data) => API.post('/portfolios', data);

export const getMyPortfolio = () => API.get('/portfolios/me');

export const getPublicPortfolio = (username) => API.get(`/portfolios/${username}`);

export const deletePortfolio = () => API.delete('/portfolios');
