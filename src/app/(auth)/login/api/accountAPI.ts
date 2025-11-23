import axios, { AxiosResponse } from 'axios';
// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_DOMAIN;

// Ưu tiên đọc biến BACKEND_URL (Runtime - cho Server Side)
// Nếu không có thì mới đọc NEXT_PUBLIC_... (Build time - cho Client Side)
const BASE_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_DOMAIN;

export const APIUserLogin = async (
  username: string = '',
  password: string = '',
): Promise<AxiosResponse<any, any>> => {
  const url = '/api-be/auth/login';
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
    return response;
  } catch (error) {
    throw error;
  }
};
