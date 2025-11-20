import useAxiosClient from '@/lib/axios/useAxiosClient';
import { getSession } from 'next-auth/react';
import useSWR from 'swr';

const useNotificationCountAPI = () => {
  const URL = '/notification/count/read-status';
  const axiosClient = useAxiosClient();

  const fetcher = async (url: string) => {
    const session = await getSession();
    const headers = {
      Authorization: `${session?.user.accessToken}`,
    };
    const response = await axiosClient.get(url, { headers });
    // Backend trả { read_count, unread_count }
    return response.data;
  };

  const { data, mutate, isLoading, error } = useSWR(URL, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: false,
  });

  return {
    readCount: data?.read_count ?? 0,
    unreadCount: data?.unread_count ?? 0,
    mutate,
    isLoading: !error && !data,
    error,
  };
};

export default useNotificationCountAPI;
