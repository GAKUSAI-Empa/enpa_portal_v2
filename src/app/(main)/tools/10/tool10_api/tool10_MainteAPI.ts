import useAxiosClient from '@/lib/axios/useAxiosClient';
import { formatISO } from 'date-fns';
import { getSession } from 'next-auth/react';

const tool10MainteAPI = () => {
  const URL_PREFIX = '/api-be/coupon';
  const axiosClient = useAxiosClient();

  const generatePreviews = async (couponList: any[]) => {
    try {
      const session = await getSession();
      const formattedCouponList = couponList.map((coupon) => ({
        template: coupon.template,
        file_name: String(coupon.id),
        coupon_message1: coupon.coupon_message1,
        coupon_message2: coupon.coupon_message2,
        discount_value: coupon.discount_value,
        discount_unit: coupon.discount_unit,
        available_condition: coupon.available_condition,
        start_date: formatISO(new Date(coupon.start_date)),
        end_date: formatISO(new Date(coupon.end_date)),
      }));
      const body = {
        items: formattedCouponList,
      };
      const headers = {
        Authorization: `${session?.user.accessToken}`,
      };
      const response = await axiosClient.post(URL_PREFIX + '/generate-preview', body, { headers });
      return response.data;
    } catch (e: any) {
      throw e;
    }
  };
  return {
    generatePreviews,
  };
};

export default tool10MainteAPI;
