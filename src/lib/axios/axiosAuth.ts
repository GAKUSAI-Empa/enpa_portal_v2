//====================================
//          Axios configuration
//====================================
//Note: Only allow one enviroment, comment 1 of these your enviroment you are not using
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_DOMAIN;
import axios from 'axios';

export default axios.create({
  //default instance axios config for axios calling
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: '',
  },
});
export const axiosAuth = axios.create({
  //axios instance create
  //Stater config for axios calling
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
