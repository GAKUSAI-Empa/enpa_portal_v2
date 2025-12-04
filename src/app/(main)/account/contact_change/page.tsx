'use client';
import { Button } from '@/component/common/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/component/common/Card';
import { TextBox } from '@/component/common/TextBox';
import { IconLoader2 } from '@tabler/icons-react';
import { FormikProvider, useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import * as Yup from 'yup';
import useAccountMainteAPI from '../api/useAccountMainteAPI';

const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, update: updateSession, status } = useSession();
  const router = useRouter();
  const { changeEmail } = useAccountMainteAPI();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: session?.user.email ?? '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .required('メールアドレスを入力してください。')
        .matches(
          /^[A-Za-z0-9._%+-]+@(?:(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)\.)+[A-Za-z]{2,63}$/,
          '有効なメールアドレスを入力してください。',
        ),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const resData = await changeEmail(values.email);
        console.log(resData);
        if (resData) {
          await updateSession({
            user: {
              ...session?.user,
              email: values.email,
            },
          });
        }
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
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <CardHeader title="連絡先の変更" />
          <CardContent>
            <TextBox
              id="email"
              name="email"
              width="lg"
              isRequired={true}
              label={'メールアドレス'}
              placeholder="enpaportal@gmail.com"
              direction="vertical"
              maxLength={254}
            />
          </CardContent>
          <CardFooter className="gap-2">
            <Button type="submit" disabled={isLoading} onClick={formik.submitForm}>
              {isLoading ? <IconLoader2 className="animate-spin" /> : <>変更</>}
            </Button>
            <Button color="grey" onClick={() => router.push('/account')}>
              戻る
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormikProvider>
  );
};

export default page;
