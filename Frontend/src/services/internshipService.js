// @ts-ignore
import api from '../config/api';

export const internshipService = {
  getAllPrograms: async (params = {}) => {
    const response = await api.get('/internships', { params });
    return response.data;
  },
  getActivePrograms: async () => {
    const response = await api.get('/internships/public');
    return response.data;
  },
  createProgram: async (data) => {
    const response = await api.post('/internships', data);
    return response.data;
  },
  updateProgram: async (id, data) => {
    const response = await api.put(`/internships/${id}`, data);
    return response.data;
  },
  deleteProgram: async (id) => {
    const response = await api.delete(`/internships/${id}`);
    return response.data;
  }
};
