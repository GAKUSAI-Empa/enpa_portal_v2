import useAxiosClient from '@/lib/axios/useAxiosClient';
import { getSession } from 'next-auth/react';
import useSWR from 'swr';

const useStaffAPI = () => {
  const URL_PREFIX = '/staff';
  const axiosClient = useAxiosClient();

  const createStaff = async (
    username: string,
    email: string,
    is_admin: string,
    password: string,
  ) => {
    try {
      const session = await getSession();
      const body = {
        username,
        email,
        is_admin,
        password,
      };
      const headers = {
        Authorization: `${session?.user.accessToken}`,
      };
      const response = await axiosClient.post(URL_PREFIX + '/create_staff', body, { headers });
      return response.data;
    } catch (e: any) {
      throw e;
    }
  };

  return {
    createStaff,
  };
};

export default useStaffAPI;
