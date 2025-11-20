import useAxiosClient from '@/lib/axios/useAxiosClient';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import type { ProductRow } from '../types';

const useTool03API = () => {
  const api = useAxiosClient();
  const { data: session } = useSession();

  const getAuthHeaders = () => {
    if (session?.user?.accessToken) {
      const token = session.user.accessToken;
      return {
        Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
      };
    }
    return {};
  };

  const service = useMemo(
    () => ({
      createJob: async (productRows: ProductRow[]) => {
        const response = await api.post(
          '/api/tools/03/jobs',
          { productRows },
          { headers: getAuthHeaders() },
        );
        return response.data;
      },

      updateJob: async (jobId: string, productRows: ProductRow[]) => {
        const response = await api.patch(
          `/api/tools/03/jobs/${jobId}`,
          { productRows },
          { headers: getAuthHeaders() },
        );
        return response.data;
      },

      getJobStatus: async (jobId: string) => {
        const response = await api.get(`/api/tools/03/jobs/${jobId}/status`, {
          headers: getAuthHeaders(),
        });
        return response.data;
      },

      uploadFTP: async (jobId: string, target: 'gold' | 'rcabinet') => {
        const response = await api.post(
          `/api/tools/03/jobs/${jobId}/upload`,
          { target },
          { headers: getAuthHeaders() },
        );
        return response.data;
      },

      // Thay vì getDownloadUrl trả string, tạo hàm downloadZip
      downloadZip: async (jobId: string) => {
        const response = await api.get(`/api/tools/03/jobs/${jobId}/download`, {
          headers: getAuthHeaders(),
          responseType: 'blob', // Báo cho axios biết đây là file nhị phân
        });
        return response.data; // Trả về Blob
      },

      fetchImagePresignedUrl: async (jobId: string, filename: string) => {
        const endpoint = `/api/tools/03/jobs/${jobId}/image/${encodeURIComponent(filename)}`;
        const response = await api.get(endpoint, { headers: getAuthHeaders() });
        return response.data?.url;
      },
    }),
    [api, session],
  );

  return service;
};

export default useTool03API;
