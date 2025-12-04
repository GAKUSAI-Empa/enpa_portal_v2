import useAxiosClient from '@/lib/axios/useAxiosClient';
import { getSession } from 'next-auth/react';
import useSWR from 'swr';

const useUserDetailAPI = (username: string) => {
  const URL = '/api-be/manage/user/detail';
  const axiosClient = useAxiosClient();

  const fetcher = async (url: string) => {
    try {
      const session = await getSession();
      const headers = {
        Authorization: `${session?.user.accessToken}`,
      };
      const params = {
        username,
      };
      const response = await axiosClient.get(url, { headers, params });
      return response.data;
    } catch (err: any) {
      err.status = err?.response?.status;
      err.message = err?.response?.data?.detail || err.message;
      throw err;
    }
  };

  const { data, mutate, isLoading, error } = useSWR(URL, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  return {
    data: data?.entity,
    mutate,
    isLoading,
    error,
  };
};

export default useUserDetailAPI;
