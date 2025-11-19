'use client';
import axios, { AxiosError } from 'axios';
import { signOut } from 'next-auth/react';
import { useEffect, useMemo } from 'react';

const useAxiosClient = () => {
  // Base URL thông minh
  // Production: Dùng relative path '/api-be'
  // Dev: Dùng localhost hoặc biến môi trường
  const baseURL = useMemo(() => {
    if (process.env.NODE_ENV === 'production') {
      return '/api-be';
    }
    return process.env.NEXT_PUBLIC_BACKEND_DOMAIN || 'http://localhost:8000';
  }, []);

  const axiosAuth = useMemo(() => {
    return axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }, [baseURL]);

  const handle401Error = async (error: AxiosError) => {
    await signOut({ callbackUrl: '/login?isSessionExpired=true' }); // clear session
  };

  useEffect(() => {
    //Response interceptor & handle error occur
    const responseIntercept = axiosAuth.interceptors.response.use(
      async (response: any) => response,
      async (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
          handle401Error(error);
          return Promise.reject(error); //reject other error 401
        }
        return Promise.reject(error); //reject other error 5xx
      },
    );

    return () => {
      //clean up hook
      // axiosAuth.interceptors.request.eject(requestIntercept);

      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [axiosAuth]);

  return axiosAuth;
};

export default useAxiosClient;
