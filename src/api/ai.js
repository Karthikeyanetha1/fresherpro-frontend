import API from './client';

export const generateSummary = (data) => API.post('/ai/generate-summary', data);
