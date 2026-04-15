// @ts-ignore
import api from '../config/api';

export const studentService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/student/dashboard');
    return response.data;
  },

  // Courses
  getMyCourses: async (params?: { status?: string }) => {
    const response = await api.get('/student/courses', { params });
    return response.data;
  },

  // Batches
  getMyBatches: async () => {
    const response = await api.get('/student/batches');
    return response.data;
  },

  // Enquiries
  getMyEnquiries: async (params?: { status?: string }) => {
    const response = await api.get('/student/enquiries', { params });
    return response.data;
  },

  // Callbacks
  getMyCallbacks: async (params?: { status?: string }) => {
    const response = await api.get('/student/callbacks', { params });
    return response.data;
  },

  // Profile
  getProfile: async () => {
    const response = await api.get('/student/profile');
    return response.data;
  },

  updateProfile: async (data: { name?: string; phone?: string; avatar?: string }) => {
    const response = await api.put('/student/profile', data);
    return response.data;
  },

  // Password
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.put('/student/change-password', data);
    return response.data;
  },

  // Certificate
  getCertificate: async (enrollmentId: string) => {
    const response = await api.get(`/student/certificate/${enrollmentId}`);
    return response.data;
  },
};
