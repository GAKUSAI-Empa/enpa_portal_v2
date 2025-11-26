'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/component/common/Card';
import Label from '@/component/common/Label';
import LoadingData from '@/component/common/LoadingData';
import SelectBox from '@/component/common/SelectBox';
import { TextBox } from '@/component/common/TextBox';
import { IconLoader2 } from '@tabler/icons-react';
import { FormikProvider, useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import * as Yup from 'yup';
import useCompanyListAPI from '../../api/useCompanyListAPI';
import useRoleListAPI from '../../api/useRoleListAPI';
import useUserDetailAPI from '../../api/useUserDetailAPI';
import useUserMainteAPI from '../../api/useUserMainteAPI';

interface UserPageProps {
  params: {
    username: string;
  };
}
const page = ({ params }: UserPageProps) => {
  const { username } = params;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: userData } = useUserDetailAPI(username);
  const { data: companyList, isLoading: isLoadingCompanyList } = useCompanyListAPI(1, 99);
  const { data: roleList, isLoading: isLoadingRoleList } = useRoleListAPI(1, 99);
  const { updateUser } = useUserMainteAPI();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: userData?.username ?? '',
      email: userData?.email ?? '',
      company_id: userData?.company_id ?? '',
      role_id: userData?.role_id ?? '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('メールアドレスの形式が正しくありません。')
        .required('メールアドレスを入力してください。'),
      company_id: Yup.string().trim().required('企業を選択してください。'),
      role_id: Yup.string().trim().required('パーミッションを選択してください。'),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const resData = await updateUser(
          values.username,
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
            <CardHeader title="ユーザー変更" />
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
                      disabled={true}
                      label={'ユーザー名'}
                      placeholder="enpaportal"
                      direction="vertical"
                    />
                    <TextBox
                      id="email"
                      name="email"
                      type="text"
                      isRequired={true}
                      label={'メールアドレス'}
                      placeholder="enpaportal@gmail.com"
                      direction="vertical"
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
                    <Label>Password</Label>
                    <p>
                      生のパスワードは格納されていないため、このユーザのパスワードを確認する方法はありません。しかし
                      <Link
                        className="text-blue-600"
                        href={`/admin/accounts/change-password/${formik.values.username}`}
                      >
                        このフォーム
                      </Link>
                      を使用してパスワードを変更できます。
                    </p>
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
