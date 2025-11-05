import { AxiosResponse } from 'axios';
import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_DOMAIN;

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
    const defaultAxios = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = await defaultAxios.post(url, body);
    console.log(response);
    return response;
  } catch (error) {
    throw error;
  }
};
