'use client';
import { Alert } from '@/component/common/Alert';
import { Button } from '@/component/common/Button';
import { TextBox } from '@/component/common/TextBox';
import { IconLoader2 } from '@tabler/icons-react';
import { FormikProvider, useFormik } from 'formik';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import * as Yup from 'yup';

const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSessionExpired = searchParams ? searchParams.get('isSessionExpired') === 'true' : false;

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().trim().required('ユーザー名を入力してください。'),
      password: Yup.string().trim().required('パスワードを入力してください。'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      const res = await signIn('credentials', {
        username: values?.username,
        password: values?.password,
        redirect: false,
      });
      if (res && res.error) {
        toast.error(res.error);
      } else {
        router.replace('/tools/dashboard');
      }

      setIsLoading(false);
    },
  });

  return (
    <FormikProvider value={formik}>
      <div className="flex flex-col justify-center w-full h-screen lg:flex-row">
        <div className="flex flex-col items-center justify-center h-full flex-1 bg-white">
          {/* Form */}
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="relative flex items-center justify-center mb-8 w-full h-[100px]">
              <div className="flex-1 flex justify-end relative h-full">
                <Image
                  src="/img/logo/emportal_logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex-[4] flex justify-start relative h-full">
                <Image
                  src="/img/logo/emportal_logo_text.png"
                  alt="Logo Text"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {isSessionExpired && (
              <Alert variant="warning">セッションが切れました。再度ログインしてください</Alert>
            )}

            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col mb-3">
                {/* Username */}
                <TextBox
                  id="username"
                  name="username"
                  type="text"
                  isRequired={true}
                  label={'ユーザー名'}
                  placeholder="EnpaPortal"
                  direction="vertical"
                />
                {/* Password */}
                <TextBox
                  id="password"
                  name="password"
                  type="password"
                  isRequired={true}
                  label={'パスワード'}
                  placeholder=""
                  direction="vertical"
                />
              </div>
              <div className="flex items-center justify-center">
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="w-80 py-2 bg-white rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition disabled:text-white"
                  onClick={formik.submitForm}
                >
                  {isLoading ? <IconLoader2 className="animate-spin" /> : <>ログイン</>}
                </Button>
              </div>
              {/* Extra links */}
              <div className="flex flex-col items-center">
                <Link
                  href={'/legal_disclosure'}
                  className="text-sm text-blue-600 hover:underline  my-6"
                >
                  特定商取引法に基づく表記
                </Link>
                <Button
                  size="lg"
                  className="w-80 py-2 bg-white rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition"
                  onClick={() => router.push('/registration/automatic_registration')}
                >
                  新規申し込み
                </Button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <footer className="mt-8 text-xs text-gray-400">©EMPOWERMENT TOWN PORTAL</footer>
        </div>
      </div>
    </FormikProvider>
  );
};

export default page;
