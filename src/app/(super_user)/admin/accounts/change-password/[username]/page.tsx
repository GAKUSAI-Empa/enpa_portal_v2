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
import useUserMainteAPI from '../../api/useUserMainteAPI';

interface UserPageProps {
  params: {
    username: string;
  };
}
const UserPage = ({ params }: UserPageProps) => {
  const { username } = params;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { updatePassword } = useUserMainteAPI();

  const formik = useFormik({
    initialValues: {
      username: username,
      password: '',
      retypePassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .trim()
        .min(8, 'パスワードは8文字以上で入力してください。')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
          'パスワードは英大文字・英小文字・数字を含めてください。',
        )
        .required('パスワードを入力してください。'),
      retypePassword: Yup.string()
        .trim()
        .oneOf([Yup.ref('password')], 'パスワードが一致しません。')
        .required('パスワード(確認用)を入力してください。'),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const resData = await updatePassword(username, values.password);
        toast.success(resData.detail);
        router.push('/admin/accounts');
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
            <CardHeader title={`パスワードの変更：${formik.values.username}`} />
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                <div>
                  <TextBox
                    id="username"
                    name="username"
                    type="text"
                    isRequired={true}
                    disabled={true}
                    label={'ユーザー名'}
                    placeholder="enpaportal"
                    direction="vertical"
                  />
                  <TextBox
                    id="password"
                    name="password"
                    type="password"
                    isRequired={true}
                    label={'パスワード'}
                    direction="vertical"
                  />
                  <TextBox
                    id="retypePassword"
                    name="retypePassword"
                    type="password"
                    isRequired={true}
                    label={'パスワード(確認用)'}
                    direction="vertical"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button type="submit" disabled={isLoading} onClick={formik.submitForm}>
                {isLoading ? <IconLoader2 className="animate-spin" /> : <>保存</>}
              </Button>
              <Button color="grey" onClick={() => router.push('/admin/accounts')}>
                戻る
              </Button>
            </CardFooter>
          </Card>
        </form>
      </FormikProvider>
    </>
  );
};

export default UserPage;
