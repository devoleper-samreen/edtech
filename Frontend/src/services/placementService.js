// @ts-ignore
import api from '../config/api';

export const placementService = {
  getAllPlacements: async (params = {}) => {
    const response = await api.get('/placements', { params });
    return response.data;
  },

  getActivePlacements: async (limit = 6) => {
    const response = await api.get('/placements/public', { params: { limit } });
    return response.data;
  },

  createPlacement: async (data) => {
    const response = await api.post('/placements', data);
    return response.data;
  },

  updatePlacement: async (id, data) => {
    const response = await api.put(`/placements/${id}`, data);
    return response.data;
  },

  deletePlacement: async (id) => {
    const response = await api.delete(`/placements/${id}`);
    return response.data;
  },

  getPlacementsVisibility: async () => {
    const response = await api.get('/settings/show_placements_section');
    return response.data;
  }
};
