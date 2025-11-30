'use client';
import { Button } from '@/component/common/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/component/common/Card';
import Hint from '@/component/common/Hint';
import SelectBox from '@/component/common/SelectBox';
import { TextBox } from '@/component/common/TextBox';
import { IconLoader2 } from '@tabler/icons-react';
import { FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import * as Yup from 'yup';
import useStaffMainteAPI from '../api/useStaffMainteAPI';

const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { createStaff } = useStaffMainteAPI();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      isManager: '0',
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
      isManager: Yup.string().trim().required('権限を選択してください。'),
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
        const resData = await createStaff(
          values.username,
          values.email,
          values.isManager,
          values.password,
        );
        toast.success(resData.detail);
        router.push('/manage/staff');
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
                    placeholder="enpaportal"
                    direction="vertical"
                    maxLength={20}
                  />
                  <TextBox
                    id="email"
                    name="email"
                    type="email"
                    isRequired={true}
                    label={'メールアドレス'}
                    placeholder="enpaportal@gmail.com"
                    direction="vertical"
                  />
                  <SelectBox
                    id="isManager"
                    name="isManager"
                    type="text"
                    isRequired={true}
                    label={'管理者権限'}
                    direction="vertical"
                    width="full"
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
                    placeholder=""
                    direction="vertical"
                  />
                  <TextBox
                    id="retypePassword"
                    name="retypePassword"
                    type="password"
                    isRequired={true}
                    label={'パスワード(確認用)'}
                    placeholder=""
                    direction="vertical"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button type="submit" disabled={isLoading} onClick={formik.submitForm}>
                {isLoading ? <IconLoader2 className="animate-spin" /> : <>追加</>}
              </Button>
              <Button color="grey" onClick={() => router.push('/manage/staff')}>
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
