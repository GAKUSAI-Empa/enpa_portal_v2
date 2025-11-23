import useAxiosClient from '@/lib/axios/useAxiosClient';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import type { ProductRow } from '../types';

const BASE_URL = '/api-be/tools/101';

const useTool101API = () => {
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
          `${BASE_URL}/jobs`,
          { productRows },
          { headers: getAuthHeaders() },
        );
        return response.data;
      },

      updateJob: async (jobId: string, productRows: ProductRow[]) => {
        const response = await api.patch(
          `${BASE_URL}/jobs/${jobId}`,
          { productRows },
          { headers: getAuthHeaders() },
        );
        return response.data;
      },

      getJobStatus: async (jobId: string) => {
        const response = await api.get(`${BASE_URL}/jobs/${jobId}/status`, {
          headers: getAuthHeaders(),
        });
        return response.data;
      },

      uploadFTP: async (jobId: string, target: 'gold' | 'rcabinet') => {
        const response = await api.post(
          `${BASE_URL}/jobs/${jobId}/upload`,
          { target },
          { headers: getAuthHeaders() },
        );
        return response.data;
      },

      downloadZip: async (jobId: string) => {
        const response = await api.get(`${BASE_URL}/jobs/${jobId}/download`, {
          headers: getAuthHeaders(),
          responseType: 'blob',
        });
        return response.data;
      },

      fetchImagePresignedUrl: async (jobId: string, filename: string) => {
        const endpoint = `${BASE_URL}/jobs/${jobId}/image/${encodeURIComponent(filename)}`;
        const response = await api.get(endpoint, { headers: getAuthHeaders() });
        return response.data?.url;
      },
    }),
    [api, session],
  );

  return service;
};

export default useTool101API;
