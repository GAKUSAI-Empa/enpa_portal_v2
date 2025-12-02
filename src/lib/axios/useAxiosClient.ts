'use client';
import axios, { AxiosError } from 'axios';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_DOMAIN;
const axiosAuth = axios.create({
  //axios instance create
  //Stater config for axios calling
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
const useAxiosClient = () => {
  //================================
  //    INTERCEPTOR: BEFORE SENDING REQUEST & AFTER SENDING REQUEST
  //================================
  const { data: session, update } = useSession();

  //========================================
  //With 401 status error from apis
  //========================================
  const handle401Error = async (error: AxiosError) => {
    sessionStorage.setItem('isSessionExpired', 'true');
    await signOut({ callbackUrl: '/login' });
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
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [session]);

  return axiosAuth;
};

export default useAxiosClient;
