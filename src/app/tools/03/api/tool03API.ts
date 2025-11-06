import axios from 'axios';
import type { ProductRow } from '../types';

// Lấy URL Backend từ biến môi trường (giống đồng nghiệp của bạn)
export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_DOMAIN || 'http://localhost:8000';

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tool03API = {
  // Tạo job mới (POST)
  createJob: async (productRows: ProductRow[]) => {
    const response = await api.post('/api/tools/03/jobs', { productRows });
    return response.data;
  },

  // Cập nhật job (PATCH)
  updateJob: async (jobId: string, productRows: ProductRow[]) => {
    const response = await api.patch(`/api/tools/03/jobs/${jobId}`, { productRows });
    return response.data;
  },

  // Lấy trạng thái job (GET)
  getJobStatus: async (jobId: string) => {
    const response = await api.get(`/api/tools/03/jobs/${jobId}/status`);
    return response.data;
  },

  // Upload FTP (POST)
  uploadFTP: async (jobId: string, target: 'gold' | 'rcabinet') => {
    const response = await api.post(`/api/tools/03/jobs/${jobId}/upload`, { target });
    return response.data;
  },

  // Helper để lấy URL download (dùng cho window.open)
  getDownloadUrl: (jobId: string) => {
    return `${BACKEND_BASE_URL}/api/tools/03/jobs/${jobId}/download`;
  },

  // Helper để lấy URL hiển thị ảnh
  getImageUrl: (jobId: string, filename: string) => {
    return `${BACKEND_BASE_URL}/api/tools/03/jobs/${jobId}/image/${encodeURIComponent(filename)}`;
  },
};
