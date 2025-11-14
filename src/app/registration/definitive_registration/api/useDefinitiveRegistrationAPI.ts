import useAxiosClient from '@/lib/axios/useAxiosClient';

const useDefinitiveRegistrationAPI = () => {
  const URL_PREFIX = '/registration';
  const axiosClient = useAxiosClient();

  const provisionalRegistrationCheck = async (provis_regis_id: string) => {
    try {
      const headers = {};
      const params = {
        provis_regis_id: provis_regis_id,
      };
      const response = await axiosClient.get(URL_PREFIX + '/provisional_registration/check', {
        headers,
        params,
      });
      return response.data;
    } catch (e: any) {
      throw e;
    }
  };

  const definitiveRegistration = async (
    prov_reg_id: string,
    store_id: string,
    store_url: string,
    store_name: string,
    default_tax_rate: string,
    tax_rounding: string,
    username: string,
  ) => {
    try {
      const body = {
        prov_reg_id,
        store_id,
        store_url,
        store_name,
        default_tax_rate,
        tax_rounding,
        username,
      };
      const headers = {};
      const response = await axiosClient.post(URL_PREFIX + '/definitive_registration', body, {
        headers,
      });
      return response.data;
    } catch (e: any) {
      throw e;
    }
  };

  return {
    provisionalRegistrationCheck,
    definitiveRegistration,
  };
};

export default useDefinitiveRegistrationAPI;
