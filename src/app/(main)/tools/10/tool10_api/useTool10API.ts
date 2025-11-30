import useAxiosClient from '@/lib/axios/useAxiosClient';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { ProductRow } from '../tool10_type';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_DOMAIN;
const API_BASE_URL = 'api-be/tools/106';

const useTool10API = () => {
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
        // debugger;
        const response = await axios.post<{ jobId: string; totalItems: number }>(
          `${BASE_URL + `/` + API_BASE_URL}/jobs`,
          { productRows },
          { headers: getAuthHeaders() },
        );
        return response.data;
      },
      updateJob: async (jobId: string, rowsToUpdate: ProductRow[]) => {
        const response = await axios.patch(
          `${BASE_URL + `/` + API_BASE_URL}/jobs/${jobId}`,
          { rows: rowsToUpdate },
          { headers: getAuthHeaders() },
        );
        return response.data;
      },
      uploadFTP: async (jobId: string, target: 'gold' | 'rcabinet') => {
        const response = await api.post(
          `${BASE_URL + `/` + API_BASE_URL}/jobs/${jobId}/upload`,
          { target },
          { headers: getAuthHeaders() },
        );
        return response.data;
      },

      getJobStatus: async (jobId: string) => {
        // debugger;
        const response = await axios.get(`${BASE_URL + `/` + API_BASE_URL}/jobs/${jobId}/status`, {
          headers: getAuthHeaders(),
        });
        return response.data;
      },

      downloadZip: async (jobId: string) => {
        const response = await axios.get(
          `${BASE_URL + `/` + API_BASE_URL}/jobs/${jobId}/download`,
          {
            headers: getAuthHeaders(),
            responseType: 'blob',
          },
        );
        return response.data;
      },

      fetchImagePresignedUrl: async (jobId: string, filename: string) => {
        const endpoint = `${BASE_URL + `/` + API_BASE_URL}/jobs/${jobId}/images/presigned-url?filename=${encodeURIComponent(filename)}`;
        const response = await api.get(endpoint, { headers: getAuthHeaders() });
        return response.data;
      },
    }),
    [api, session],
  );

  return service;
};

export default useTool10API;
