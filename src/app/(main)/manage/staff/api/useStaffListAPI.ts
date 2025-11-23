import useAxiosClient from '@/lib/axios/useAxiosClient';
import { getSession } from 'next-auth/react';
import useSWR from 'swr';

const useStaffListAPI = (company_id?: string) => {
  const URL = '/api-be/staff/list';
  const axiosClient = useAxiosClient();
  const fetcher = async (url: string) => {
    try {
      const session = await getSession();
      const headers = {
        Authorization: `${session?.user.accessToken}`,
      };
      const params = {
        company_id: company_id,
      };
      const response = await axiosClient.get(URL, { headers, params });
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const { data, mutate, isLoading, error } = useSWR(company_id ? URL : null, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: false,
  });

  return {
    data: data?.list ?? [],
    mutate: mutate,
    isLoading: !error && !data,
    error: error,
  };
};

export default useStaffListAPI;
