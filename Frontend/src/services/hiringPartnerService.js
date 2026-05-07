// @ts-ignore
import api from '../config/api';

export const hiringPartnerService = {
  getActivePartners: async () => {
    const response = await api.get('/hiring-partners/public');
    return response.data;
  },

  getAllPartners: async () => {
    const response = await api.get('/hiring-partners');
    return response.data;
  },

  createPartner: async (data) => {
    const response = await api.post('/hiring-partners', data);
    return response.data;
  },

  updatePartner: async (id, data) => {
    const response = await api.put(`/hiring-partners/${id}`, data);
    return response.data;
  },

  deletePartner: async (id) => {
    const response = await api.delete(`/hiring-partners/${id}`);
    return response.data;
  }
};
