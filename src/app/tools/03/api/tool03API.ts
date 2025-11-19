import useAxiosClient from '@/lib/axios/useAxiosClient';
import { useSession } from 'next-auth/react'; // [NEW] Import useSession
import { useMemo } from 'react';
import type { ProductRow } from '../types';

const useTool03API = () => {
  const api = useAxiosClient();
  const { data: session } = useSession(); // [NEW] Lấy session tại đây

  // Hàm helper để lấy header (tránh lặp code)
  const getAuthHeaders = () => {
    if (session?.user?.accessToken) {
      const token = session.user.accessToken;
      // Kiểm tra xem token đã có prefix 'Bearer ' chưa để tránh duplicate
      return {
        Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
      };
    }
    return {};
  };

  // Sử dụng useMemo để ổn định object
  const service = useMemo(
    () => ({
      createJob: async (productRows: ProductRow[]) => {
        // [NEW] Gắn headers thủ công
        const response = await api.post(
          '/api/tools/03/jobs',
          { productRows },
          { headers: getAuthHeaders() },
        );
        return response.data;
      },

      updateJob: async (jobId: string, productRows: ProductRow[]) => {
        // [NEW] Gắn headers thủ công
        const response = await api.patch(
          `/api/tools/03/jobs/${jobId}`,
          { productRows },
          { headers: getAuthHeaders() },
        );
        return response.data;
      },

      getJobStatus: async (jobId: string) => {
        // [NEW] Gắn headers thủ công
        const response = await api.get(`/api/tools/03/jobs/${jobId}/status`, {
          headers: getAuthHeaders(),
        });
        return response.data;
      },

      uploadFTP: async (jobId: string, target: 'gold' | 'rcabinet') => {
        // [NEW] Gắn headers thủ công
        const response = await api.post(
          `/api/tools/03/jobs/${jobId}/upload`,
          { target },
          { headers: getAuthHeaders() },
        );
        return response.data;
      },

      getDownloadUrl: (jobId: string) => {
        // URL download thường mở tab mới, trình duyệt tự gọi GET nên không gắn header Authorization được.
        // Backend cần xử lý xác thực qua query param (ví dụ ?token=...) hoặc cookie nếu cần bảo mật chặt.
        // Hiện tại giữ nguyên logic cũ.
        return `${api.defaults.baseURL}/api/tools/03/jobs/${jobId}/download`;
      },

      fetchImagePresignedUrl: async (jobId: string, filename: string) => {
        const endpoint = `/api/tools/03/jobs/${jobId}/image/${encodeURIComponent(filename)}`;
        // [NEW] Gắn headers thủ công
        const response = await api.get(endpoint, {
          headers: getAuthHeaders(),
        });
        return response.data?.url;
      },
    }),
    [api, session],
  ); // [IMPORTANT] Thêm session vào dependency vì getAuthHeaders dùng nó

  return service;
};

export default useTool03API;
