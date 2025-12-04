import useAxiosClient from '@/lib/axios/useAxiosClient';

const useConsultingRegistrationAPI = () => {
  const URL_PREFIX = '/api-be/registration';
  const axiosClient = useAxiosClient();

  const createConsultingRegistration = async (
    company_name: string,
    person_name: string,
    email: string,
    telephone_number: string,
    note: string,
  ) => {
    try {
      const body = {
        company_name,
        person_name,
        email,
        telephone_number,
        note,
        consulting_flag: true,
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
    createConsultingRegistration,
  };
};

export default useConsultingRegistrationAPI;
