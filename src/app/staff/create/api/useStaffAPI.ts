import useAxiosClient from '@/lib/axios/useAxiosClient';
import { getSession } from 'next-auth/react';

const useStaffAPI = () => {
  const URL_PREFIX = '/staff';
  const axiosClient = useAxiosClient();

  const createStaff = async (
    username: string,
    email: string,
    chatwork_id: string,
    is_admin: string,
    password: string,
  ) => {
    try {
      const session = await getSession();
      const body = {
        username,
        email,
        chatwork_id,
        is_admin,
        password,
      };
      const headers = {
        Authorization: `${session?.user.accessToken}`,
      };
      const response = await axiosClient.post(URL_PREFIX + '/create_staff', body, { headers });
      return response.data;
    } catch (e: any) {
      console.log(e);
      throw new Error(e);
    }
  };
  return {
    createStaff,
  };
};

export default useStaffAPI;
