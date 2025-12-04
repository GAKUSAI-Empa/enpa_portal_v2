import useAxiosClient from '@/lib/axios/useAxiosClient';
import { getSession } from 'next-auth/react';

const useUserMainteAPI = () => {
  const URL_PREFIX = '/api-be/manage/user';
  const axiosClient = useAxiosClient();

  const updatePassword = async (username: string, password: string) => {
    try {
      const session = await getSession();
      const body = {
        username,
        password,
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

  const createUser = async (
    username: string,
    password: string,
    email: string,
    company_id: string,
    role_id: string,
  ) => {
    try {
      const session = await getSession();
      const body = {
        username,
        password,
        email,
        company_id,
        role_id,
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

  const updateUser = async (
    username: string,
    email: string,
    company_id: string,
    role_id: string,
  ) => {
    try {
      const session = await getSession();
      const body = {
        username,
        email,
        company_id,
        role_id,
      };
      const headers = {
        Authorization: `${session?.user.accessToken}`,
      };
      const response = await axiosClient.put(URL_PREFIX + '/edit', body, { headers });
      return response.data;
    } catch (e: any) {
      throw e;
    }
  };

  const deleteUser = async (username: string) => {
    try {
      const session = await getSession();
      const headers = {
        Authorization: `${session?.user.accessToken}`,
      };
      const params = {
        username,
      };
      const response = await axiosClient.delete(URL_PREFIX + '/delete', { headers, params });
      return response.data;
    } catch (e: any) {
      throw e;
    }
  };

  return {
    updatePassword,
    createUser,
    deleteUser,
    updateUser,
  };
};

export default useUserMainteAPI;
