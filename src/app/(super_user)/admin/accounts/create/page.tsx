'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/component/common/Card';
import LoadingData from '@/component/common/LoadingData';
import SelectBox from '@/component/common/SelectBox';
import { TextBox } from '@/component/common/TextBox';
import { IconLoader2 } from '@tabler/icons-react';
import { FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import * as Yup from 'yup';
import useCompanyListAPI from '../api/useCompanyListAPI';
import useRoleListAPI from '../api/useRoleListAPI';
import useUserMainteAPI from '../api/useUserMainteAPI';

const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { createUser } = useUserMainteAPI();
  const { data: companyList, isLoading: isLoadingCompanyList } = useCompanyListAPI(1, 99);
  const { data: roleList, isLoading: isLoadingRoleList } = useRoleListAPI(1, 99);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      retypePassword: '',
      email: '',
      company_id: '',
      role_id: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .trim()
        .required('ユーザー名を入力してください。')
        .matches(/^[a-zA-Z0-9_]+$/, 'ユーザー名には英数字とアンダースコア（_）のみ使用できます。')
        .max(20, 'ユーザー名は20文字以内で入力してください。'),
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
      email: Yup.string()
        .email('メールアドレスの形式が正しくありません。')
        .required('メールアドレスを入力してください。'),
      company_id: Yup.string().trim().required('企業を選択してください。'),
      role_id: Yup.string().trim().required('パーミッションを選択してください。'),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const resData = await createUser(
          values.username,
          values.password,
          values.email,
          values.company_id,
          values.role_id,
        );
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
            <CardHeader title="ユーザー追加" />
            <CardContent>
              {isLoadingCompanyList && isLoadingRoleList ? (
                <LoadingData />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                  <div>
                    <TextBox
                      id="username"
                      name="username"
                      type="text"
                      isRequired={true}
                      label={'ユーザー名'}
                      placeholder="enpaportal"
                      direction="vertical"
                      maxLength={20}
                    />
                    <SelectBox
                      id="company_id"
                      label="企業名"
                      name="company_id"
                      width="full"
                      options={[
                        { value: '', label: '選んでください' },
                        ...(companyList || [])?.map((c: any) => ({
                          value: c.id,
                          label: c.company_name,
                        })),
                      ]}
                      isRequired={true}
                    />
                    <SelectBox
                      id="role_id"
                      label="パーミッション"
                      name="role_id"
                      width="full"
                      options={[
                        { value: '', label: '選んでください' },
                        ...(roleList || [])?.map((c: any) => ({
                          value: c.id,
                          label: c.role_name,
                        })),
                      ]}
                      isRequired={true}
                    />
                  </div>
                  <div>
                    <TextBox
                      id="email"
                      name="email"
                      type="text"
                      isRequired={true}
                      label={'メールアドレス'}
                      placeholder="enpaportal@gmail.com"
                      direction="vertical"
                      maxLength={254}
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
              )}
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

export default page;
