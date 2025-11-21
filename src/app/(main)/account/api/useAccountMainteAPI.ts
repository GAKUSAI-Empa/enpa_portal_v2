import useAxiosClient from '@/lib/axios/useAxiosClient';
import { getSession } from 'next-auth/react';

const useAccountMainteAPI = () => {
  const URL_PREFIX = '/account';
  const axiosClient = useAxiosClient();

  const updatePassword = async (current_password: string, new_password: string) => {
    try {
      const session = await getSession();
      const body = {
        current_password,
        new_password,
      };
      const headers = {
        Authorization: `${session?.user.accessToken}`,
      };
      const response = await axiosClient.put(URL_PREFIX + '/change-password', body, { headers });
      return response.data;
    } catch (e: any) {
      throw e;
    }
  };

  return { updatePassword };
};

export default useAccountMainteAPI;
