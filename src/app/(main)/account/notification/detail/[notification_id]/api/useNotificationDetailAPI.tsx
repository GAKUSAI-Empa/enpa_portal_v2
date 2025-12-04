import useAxiosClient from '@/lib/axios/useAxiosClient';
import { getSession } from 'next-auth/react';
import useSWR from 'swr';

const useNotificationDetailAPI = (notification_id: string) => {
  const URL = '/api-be/notification/detail';
  const axiosClient = useAxiosClient();

  const fetcher = async (url: string) => {
    try {
      const session = await getSession();
      const headers = {
        Authorization: `${session?.user.accessToken}`,
      };
      const params = {
        notification_id: notification_id,
      };
      const response = await axiosClient.get(url, { headers, params });
      return response.data;
    } catch (err: any) {
      err.status = err?.response?.status;
      err.message = err?.response?.data?.detail || err.message;
      throw err;
    }
  };

  const { data, mutate, isLoading, error } = useSWR(notification_id ? URL : null, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  return {
    data: data?.notification,
    mutate,
    isLoading,
    error,
  };
};

export default useNotificationDetailAPI;
