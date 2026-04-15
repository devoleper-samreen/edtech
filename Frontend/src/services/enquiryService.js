import api from '../config/api';

export const enquiryService = {
  getAllEnquiries: async (params) => {
    const response = await api.get('/enquiries', { params });
    return response.data;
  },

  getEnquiry: async (id) => {
    const response = await api.get(`/enquiries/${id}`);
    return response.data;
  },

  createEnquiry: async (enquiryData) => {
    const response = await api.post('/enquiries', enquiryData);
    return response.data;
  },

  updateEnquiry: async (id, enquiryData) => {
    const response = await api.put(`/enquiries/${id}`, enquiryData);
    return response.data;
  },

  deleteEnquiry: async (id) => {
    const response = await api.delete(`/enquiries/${id}`);
    return response.data;
  },
};
