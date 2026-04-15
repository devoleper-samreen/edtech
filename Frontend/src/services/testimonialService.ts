// @ts-ignore
import api from '../config/api';

export interface Testimonial {
  _id: string;
  company: string;
  contactPerson: string;
  designation: string;
  shortText: string;
  fullText: string;
  rating: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export const testimonialService = {
  // Get all testimonials (admin)
  getAllTestimonials: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await api.get('/testimonials', { params });
    return response.data;
  },

  // Get active testimonials (public)
  getActiveTestimonials: async () => {
    const response = await api.get('/testimonials/public');
    return response.data;
  },

  // Get single testimonial
  getTestimonial: async (id: string) => {
    const response = await api.get(`/testimonials/${id}`);
    return response.data;
  },

  // Create testimonial
  createTestimonial: async (data: {
    company: string;
    contactPerson: string;
    designation: string;
    shortText: string;
    fullText: string;
    rating?: number;
    status?: string;
  }) => {
    const response = await api.post('/testimonials', data);
    return response.data;
  },

  // Update testimonial
  updateTestimonial: async (id: string, data: Partial<{
    company: string;
    contactPerson: string;
    designation: string;
    shortText: string;
    fullText: string;
    rating: number;
    status: string;
  }>) => {
    const response = await api.put(`/testimonials/${id}`, data);
    return response.data;
  },

  // Delete testimonial
  deleteTestimonial: async (id: string) => {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  }
};
