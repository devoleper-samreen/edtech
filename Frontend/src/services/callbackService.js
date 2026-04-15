import api from '../config/api';

export const callbackService = {
  getAllCallbacks: async (params) => {
    const response = await api.get('/callbacks', { params });
    return response.data;
  },

  getCallback: async (id) => {
    const response = await api.get(`/callbacks/${id}`);
    return response.data;
  },

  createCallback: async (callbackData) => {
    const response = await api.post('/callbacks', callbackData);
    return response.data;
  },

  updateCallback: async (id, callbackData) => {
    const response = await api.put(`/callbacks/${id}`, callbackData);
    return response.data;
  },

  deleteCallback: async (id) => {
    const response = await api.delete(`/callbacks/${id}`);
    return response.data;
  },

  markCompleted: async (id) => {
    const response = await api.patch(`/callbacks/${id}/complete`);
    return response.data;
  },
};
