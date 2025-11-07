'use client';
import { Button } from '@/component/common/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/component/common/Card';
import Hint from '@/component/common/Hint';
import SelectBox from '@/component/common/SelectBox';
import { TextBox } from '@/component/common/TextBox';
import { IconLoader2 } from '@tabler/icons-react';
import { FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import * as Yup from 'yup';
import useStaffMainteAPI from '../api/useStaffMainteAPI';
import { toast } from 'sonner';

const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { createStaff } = useStaffMainteAPI();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      isAdmin: '0',
      password: '',
      retypePassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .trim()
        .required('ユーザー名を入力してください。')
        .matches(/^[a-zA-Z0-9_]+$/, 'ユーザー名には英数字とアンダースコア（_）のみ使用できます。')
        .max(20, 'ユーザー名は20文字以内で入力してください。'),
      email: Yup.string()
        .email('メールアドレスの形式が正しくありません。')
        .required('メールアドレスを入力してください。'),
      isAdmin: Yup.string().trim().required('権限を選択してください。'),
      password: Yup.string()
        .trim()
        // .matches(
        //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
        //   'パスワードは英大文字・英小文字・数字を含めてください。',
        // )
        // .min(8, 'パスワードは8文字以上で入力してください。')
        .required('パスワードを入力してください。'),
      retypePassword: Yup.string()
        .trim()
        .oneOf([Yup.ref('password')], 'パスワードが一致しません。')
        .required('パスワードを確認してください。'),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const resData = await createStaff(
          values.username,
          values.email,
          values.isAdmin,
          values.password,
        );
        toast.success(resData.detail);
        router.push('/staff');
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

  return (
    <>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <Card>
            <CardHeader
              title="スタッフ追加"
              description="スタッフ名・メールアドレスは重複しないように設定してください。"
            />
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                <div>
                  <TextBox
                    id="username"
                    name="username"
                    type="text"
                    isRequired={true}
                    label={'ユーザー名'}
                    value={formik.values.username}
                    placeholder="enpaportal"
                    direction="vertical"
                    onChange={formik.handleChange}
                    error={formik.errors.username}
                    touched={formik.touched.username}
                  />
                  <TextBox
                    id="email"
                    name="email"
                    type="email"
                    isRequired={true}
                    label={'メールアドレス'}
                    value={formik.values.email}
                    placeholder="enpaportal@gmail.com"
                    direction="vertical"
                    onChange={formik.handleChange}
                    error={formik.errors.email}
                    touched={formik.touched.email}
                  />
                  <SelectBox
                    id="isAdmin"
                    name="isAdmin"
                    type="text"
                    isRequired={true}
                    label={'管理者権限'}
                    value={formik.values.isAdmin}
                    direction="vertical"
                    width="full"
                    onChange={formik.handleChange}
                    error={formik.errors.isAdmin}
                    touched={formik.touched.isAdmin}
                    options={[
                      { value: '0', label: '無効' },
                      { value: '1', label: '有効' },
                    ]}
                    suffix={
                      <Hint message={'料金支払い、スタッフの追加ができるようになります。\n'} />
                    }
                  />
                </div>
                <div>
                  <TextBox
                    id="password"
                    name="password"
                    type="password"
                    isRequired={true}
                    label={'パスワード'}
                    value={formik.values.password}
                    placeholder=""
                    direction="vertical"
                    onChange={formik.handleChange}
                    error={formik.errors.password}
                    touched={formik.touched.password}
                  />
                  <TextBox
                    id="retypePassword"
                    name="retypePassword"
                    type="password"
                    isRequired={true}
                    label={'パスワード(確認用)'}
                    value={formik.values.retypePassword}
                    placeholder=""
                    direction="vertical"
                    onChange={formik.handleChange}
                    error={formik.errors.retypePassword}
                    touched={formik.touched.retypePassword}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button type="submit" disabled={isLoading} onClick={formik.submitForm}>
                {isLoading ? <IconLoader2 className="animate-spin" /> : <>追加</>}
              </Button>
              <Button color="grey" onClick={() => router.push('/staff')}>
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
