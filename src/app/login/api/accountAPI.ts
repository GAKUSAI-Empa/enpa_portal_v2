import { AxiosResponse } from 'axios';
import defaultAxios from '@/lib/axios/axiosAuth';

export const APIUserLogin = async (
  username: string = '',
  password: string = '',
): Promise<AxiosResponse<any, any>> => {
  const url = '/auth/login';
  const body = {
    username: username,
    password: password,
  };

  try {
    const response = await defaultAxios.post(url, body);
    console.log(response);
    return response;
  } catch (error) {
    throw error; // Rethrow the error so it can be caught by the caller if needed
  }
};
