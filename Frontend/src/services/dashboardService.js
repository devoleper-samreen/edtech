import api from '../config/api';

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getUserGrowth: async (months = 6) => {
    const response = await api.get('/dashboard/user-growth', { params: { months } });
    return response.data;
  },

  getCoursePopularity: async () => {
    const response = await api.get('/dashboard/course-popularity');
    return response.data;
  },

  getCategoryDistribution: async () => {
    const response = await api.get('/dashboard/category-distribution');
    return response.data;
  },
};
