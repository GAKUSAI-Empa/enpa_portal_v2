import useAxiosClient from '@/lib/axios/useAxiosClient';

const useAutomaticRegistrationAPI = () => {
  const URL_PREFIX = '/registration';
  const axiosClient = useAxiosClient();

  const createAutomaticRegistration = async (
    company_name: string,
    person_name: string,
    email: string,
    telephone_number: string,
    note: string,
    consulting_flag: boolean,
  ) => {
    try {
      const body = {
        company_name,
        person_name,
        email,
        telephone_number,
        note,
        consulting_flag,
      };
      const headers = {};
      const response = await axiosClient.post(URL_PREFIX + '/automatic_registration', body, {
        headers,
      });
      return response.data;
    } catch (e: any) {
      throw e;
    }
  };

  return {
    createAutomaticRegistration,
  };
};

export default useAutomaticRegistrationAPI;
