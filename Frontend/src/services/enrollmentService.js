import api from '../config/api';

export const enrollmentService = {
  getAllEnrollments: async (params) => {
    const response = await api.get('/enrollments', { params });
    return response.data;
  },

  getEnrollment: async (id) => {
    const response = await api.get(`/enrollments/${id}`);
    return response.data;
  },

  createEnrollment: async (enrollmentData) => {
    const response = await api.post('/enrollments', enrollmentData);
    return response.data;
  },

  updateEnrollment: async (id, enrollmentData) => {
    const response = await api.put(`/enrollments/${id}`, enrollmentData);
    return response.data;
  },

  deleteEnrollment: async (id) => {
    const response = await api.delete(`/enrollments/${id}`);
    return response.data;
  },
};
