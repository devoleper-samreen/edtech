// @ts-ignore
import api from '../config/api';

export interface Batch {
  _id: string;
  course: {
    _id: string;
    title: string;
    name?: string;
  } | string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  startDate: string;
  timing: string;
  days: 'Weekday' | 'Weekend' | 'Daily';
  contact: string;
  maxStudents: number;
  enrolledCount: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export const batchService = {
  // Get all batches (admin)
  getAllBatches: async (params?: { course?: string; status?: string; page?: number; limit?: number }) => {
    const response = await api.get('/batches', { params });
    return response.data;
  },

  // Get batches by course ID (public)
  getBatchesByCourse: async (courseId: string) => {
    const response = await api.get(`/batches/course/${courseId}`);
    return response.data;
  },

  // Get single batch
  getBatch: async (id: string) => {
    const response = await api.get(`/batches/${id}`);
    return response.data;
  },

  // Create batch
  createBatch: async (data: {
    course: string;
    mode?: string;
    startDate: string;
    timing: string;
    days?: string;
    contact?: string;
    maxStudents?: number;
    status?: string;
  }) => {
    const response = await api.post('/batches', data);
    return response.data;
  },

  // Update batch
  updateBatch: async (id: string, data: Partial<{
    course: string;
    mode: string;
    startDate: string;
    timing: string;
    days: string;
    contact: string;
    maxStudents: number;
    status: string;
  }>) => {
    const response = await api.put(`/batches/${id}`, data);
    return response.data;
  },

  // Delete batch
  deleteBatch: async (id: string) => {
    const response = await api.delete(`/batches/${id}`);
    return response.data;
  }
};
