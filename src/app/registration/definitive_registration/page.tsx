'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/component/common/Card';
import SelectBox from '@/component/common/SelectBox';
import { TextBox } from '@/component/common/TextBox';
import { IconLoader2 } from '@tabler/icons-react';
import { FormikProvider, useFormik } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import * as Yup from 'yup';
import useDefinitiveRegistrationAPI from './api/useDefinitiveRegistrationAPI';

const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isProvisRegisIdValid, setIsProvisRegisIdValid] = useState<boolean>();
  const { provisionalRegistrationCheck, definitiveRegistration } = useDefinitiveRegistrationAPI();
  const router = useRouter();
  const searchParams = useSearchParams();
  const provis_regis_id = searchParams?.get('provis_regis_id') ?? '';

  const formik = useFormik({
    initialValues: {
      prov_reg_id: '',
      store_id: '',
      store_url: '',
      store_name: '',
      default_tax_rate: '',
      tax_rounding: '',
      username: '',
    },
    validationSchema: Yup.object({
      prov_reg_id: Yup.string().trim().required('企業名を入力してください。'),
      store_id: Yup.string()
        .trim()
        .max(6, 'ショップIDは6文字以内で入力してください。')
        .required('ショップIDを入力してください。'),
      store_url: Yup.string()
        .trim()
        .required('店舗URLを入力してください。')
        .max(100, '店舗URLは100文字以内で入力してください。'),
      store_name: Yup.string()
        .trim()
        .max(20, '店舗名は20文字以内で入力してください。')
        .required('店舗名を入力してください。'),
      default_tax_rate: Yup.string().trim().required('通常の税率を入力してください。'),
      tax_rounding: Yup.string().trim().required('消費税1円未満端数を入力してください。'),
      username: Yup.string()
        .trim()
        .max(20, 'ユーザー名は20文字以内で入力してください。')
        .required('ユーザー名を入力してください。'),
    }),
    onSubmit: async (values) => {
      try {
        console.log(values);
        setIsLoading(true);
        const dataRes = await definitiveRegistration(
          values.prov_reg_id,
          values.store_id,
          values.store_url,
          values.store_name,
          values.default_tax_rate,
          values.tax_rounding,
          values.username,
        );
        toast.success(dataRes.detail);
        router.push('/login');
      } catch (e: any) {
        console.log(e);
        const backendMessage =
          e?.response?.data?.detail || 'エラーが発生しました。もう一度お試しください。';
        toast.error(backendMessage);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const provisRegisIdCheck = async () => {
      if (!provis_regis_id) return;

      try {
        const resData = await provisionalRegistrationCheck(provis_regis_id);
        setIsProvisRegisIdValid(false);
        if (resData?.valid) {
          setIsProvisRegisIdValid(true);
        }
      } catch (error) {
        setIsProvisRegisIdValid(false);
      }
    };

    provisRegisIdCheck();
  }, [provis_regis_id]);

  return (
    <>
      {isProvisRegisIdValid ? (
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col justify-center w-full mt-2">
              <div className="flex flex-col items-center justify-center h-full flex-1">
                <div className="w-full xl:max-w-[50%]">
                  <Card>
                    <CardHeader title="店舗・ユーザー情報登録フォーム" />
                    <CardContent>
                      <TextBox
                        id="store_id"
                        name="store_id"
                        isRequired={true}
                        label={'ショップID'}
                        placeholder="123456"
                        direction="vertical"
                      />
                      <TextBox
                        id="store_url"
                        name="store_url"
                        isRequired={true}
                        label={'店舗URL'}
                        placeholder="empotown"
                        direction="vertical"
                      />
                      <TextBox
                        id="store_name"
                        name="store_name"
                        isRequired={true}
                        label={'店舗名'}
                        placeholder="エンパタウン"
                        direction="vertical"
                      />
                      <SelectBox
                        id="default_tax_rate"
                        name="default_tax_rate"
                        label="通常の税率"
                        width="full"
                        options={[
                          { value: '', label: '通常の税率を選択してください' },
                          { value: '0.08', label: '8%' },
                          { value: '0.10', label: '10%' },
                        ]}
                        isRequired={true}
                      />
                      <SelectBox
                        id="tax_rounding"
                        name="tax_rounding"
                        label="消費税 1円未満端数"
                        width="full"
                        options={[
                          { value: '', label: '端数の扱いを選択してください' },
                          { value: 'up', label: '切り上げ' },
                          { value: 'down', label: '切り捨て' },
                          { value: 'off', label: '四捨五入' },
                        ]}
                        isRequired={true}
                      />
                      <TextBox
                        id="username"
                        name="username"
                        isRequired={true}
                        label={'ユーザー名'}
                        placeholder="empo-user01"
                        direction="vertical"
                      />
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button type="submit" disabled={isLoading} onClick={formik.submitForm}>
                        {isLoading ? <IconLoader2 className="animate-spin" /> : <>確認</>}
                      </Button>
                      <Button color="grey">戻る</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </form>
        </FormikProvider>
      ) : (
        <div className="flex flex-col justify-center w-full mt-2">
          <div className="flex flex-col items-center justify-center h-full flex-1">
            <div className="w-full xl:max-w-[50%]">
              <Card>
                <CardHeader title="店舗・ユーザー情報登録フォーム" />
                <CardContent>
                  <p>無効なURLです。</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default page;
