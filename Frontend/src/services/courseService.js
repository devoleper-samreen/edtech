import api from '../config/api';

export const courseService = {
  getAllCourses: async (params) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  getCourse: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  createCourse: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  updateCourse: async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  enrollInCourse: async (id) => {
    const response = await api.post(`/courses/${id}/enroll`);
    return response.data;
  },
};
