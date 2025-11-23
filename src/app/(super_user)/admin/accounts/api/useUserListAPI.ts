import useAxiosClient from '@/lib/axios/useAxiosClient';
import { getSession } from 'next-auth/react';
import useSWR from 'swr';

const useUserListAPI = (page: number = 1, page_size: number = 5) => {
  const URL = '/api-be/user/list';
  const axiosClient = useAxiosClient();
  const fetcher = async (url: string) => {
    try {
      const session = await getSession();
      const headers = {
        Authorization: `${session?.user.accessToken}`,
      };
      const params = {
        page,
        page_size,
      };
      const response = await axiosClient.get(URL, { headers, params });
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const { data, mutate, isLoading, error } = useSWR(URL, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  return {
    data: data?.list ?? [],
    mutate: mutate,
    isLoading: !error && !data,
    error: error,
  };
};

export default useUserListAPI;
