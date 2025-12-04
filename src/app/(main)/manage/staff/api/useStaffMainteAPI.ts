import useAxiosClient from '@/lib/axios/useAxiosClient';
import { getSession } from 'next-auth/react';

const useStaffMainteAPI = () => {
  const URL_PREFIX = '/api-be/staff';
  const axiosClient = useAxiosClient();

  const createStaff = async (
    username: string,
    email: string,
    is_manager: string,
    password: string,
  ) => {
    try {
      const session = await getSession();
      const body = {
        username,
        email,
        is_manager,
        password,
      };
      const headers = {
        Authorization: `${session?.user.accessToken}`,
      };
      const response = await axiosClient.post(URL_PREFIX + '/create', body, { headers });
      return response.data;
    } catch (e: any) {
      throw e;
    }
  };

  const deleteStaff = async (username: string) => {
    try {
      const session = await getSession();
      const headers = {
        Authorization: `${session?.user.accessToken}`,
      };
      const params = {
        username: username,
      };
      const response = await axiosClient.delete(URL_PREFIX + '/delete', { headers, params });
      return response.data;
    } catch (e: any) {
      throw e;
    }
  };

  return {
    createStaff,
    deleteStaff,
  };
};

export default useStaffMainteAPI;
