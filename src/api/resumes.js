import API from './client';

export const createResume = (data) => API.post('/resumes', data);

export const getMyResumes = () => API.get('/resumes');

export const getResumeById = (id) => API.get(`/resumes/${id}`);

export const updateResume = (id, data) => API.put(`/resumes/${id}`, data);

export const deleteResume = (id) => API.delete(`/resumes/${id}`);
