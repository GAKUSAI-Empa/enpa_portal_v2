import useAxiosClient from '@/lib/axios/useAxiosClient';
import { getSession } from 'next-auth/react';
import useSWR from 'swr';

const useNotificationListAPI = (page: number = 1, page_size: number = 3) => {
  const URL = '/api-be/notification/history';
  const axiosClient = useAxiosClient();

  const fetcher = async ([url, page, page_size]: [string, number, number]) => {
    const session = await getSession();
    const headers = {
      Authorization: `${session?.user.accessToken}`,
    };
    const params = { page, page_size };
    const response = await axiosClient.get(url, { headers, params });
    return response.data;
  };

  // KEY thay đổi theo page & page_size
  const { data, mutate, isLoading, error } = useSWR([URL, page, page_size], fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  return {
    data: data?.list ?? [],
    total: data?.total ?? 0,
    mutate: mutate,
    isLoading: !error && !data,
    error: error,
  };
};

export default useNotificationListAPI;
