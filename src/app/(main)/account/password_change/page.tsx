'use client';
import { Button } from '@/component/common/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/component/common/Card';
import { TextBox } from '@/component/common/TextBox';
import { IconLoader2 } from '@tabler/icons-react';
import { FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import * as Yup from 'yup';
import useAccountMainteAPI from '../api/useAccountMainteAPI';

const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { updatePassword } = useAccountMainteAPI();

  const formik = useFormik({
    initialValues: {
      current_password: '',
      new_password: '',
      retype_password: '',
    },
    validationSchema: Yup.object({
      current_password: Yup.string().trim().required('現在のパスワードを入力してください。'),
      new_password: Yup.string()
        .trim()
        // .matches(
        //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
        //   'パスワードは英大文字・英小文字・数字を含めてください。',
        // )
        .min(8, 'パスワードは8文字以上で入力してください。')
        .required('新しいパスワードを入力してください。'),
      retype_password: Yup.string()
        .trim()
        .oneOf([Yup.ref('new_password')], 'パスワードが一致しません。')
        .required('新しいパスワード(確認用)を入力してください。'),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const resData = await updatePassword(values.current_password, values.new_password);
        toast.success(resData.detail);
        router.push('/account');
      } catch (e: any) {
        const backendMessage =
          e?.response?.data?.detail || 'エラーが発生しました。もう一度お試しください。';
        toast.error(backendMessage);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <Card>
            <CardHeader title="パスワードの変更" />
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                <div>
                  <TextBox
                    id="current_password"
                    name="current_password"
                    type="password"
                    isRequired={true}
                    label={'現在のパスワード'}
                    placeholder=""
                    direction="vertical"
                  />
                  <TextBox
                    id="new_password"
                    name="new_password"
                    type="password"
                    isRequired={true}
                    label={'新しいパスワード'}
                    placeholder=""
                    direction="vertical"
                  />
                  <TextBox
                    id="retype_password"
                    name="retype_password"
                    type="password"
                    isRequired={true}
                    label={'新しいパスワード(確認用)'}
                    placeholder=""
                    direction="vertical"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button type="submit" disabled={isLoading} onClick={formik.submitForm}>
                {isLoading ? <IconLoader2 className="animate-spin" /> : <>パスワード変更</>}
              </Button>
              <Button color="grey" onClick={() => router.push('/account')}>
                戻る
              </Button>
            </CardFooter>
          </Card>
        </form>
      </FormikProvider>
    </>
  );
};

export default page;
