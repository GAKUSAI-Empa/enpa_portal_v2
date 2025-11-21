import useAxiosClient from '@/lib/axios/useAxiosClient';
import { getSession } from 'next-auth/react';

const useNotificationMainteAPI = () => {
  const URL_PREFIX = '/notification';
  const axiosClient = useAxiosClient();

  const markAsRead = async (notification_id: string) => {
    try {
      const session = await getSession();
      const body = {};
      const headers = {
        Authorization: `${session?.user.accessToken}`,
      };
      const params = {
        notification_id,
      };
      const response = await axiosClient.put(URL_PREFIX + '/mark-as-read', body, {
        headers,
        params,
      });
      return response.data;
    } catch (e: any) {
      throw e;
    }
  };

  return {
    markAsRead,
  };
};

export default useNotificationMainteAPI;
