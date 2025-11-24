'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/component/common/Card';
import { CheckboxGroup } from '@/component/common/CheckboxGroup';
import { TextArea } from '@/component/common/TextArea';
import { TextBox } from '@/component/common/TextBox';
import { IconLoader2 } from '@tabler/icons-react';
import { FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import * as Yup from 'yup';
import useAutomaticRegistrationAPI from './api/useAutomaticRegistrationAPI';

const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { createAutomaticRegistration } = useAutomaticRegistrationAPI();
  const [registSuccess, setRegistSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      companyName: '',
      personName: '',
      email: '',
      telephoneNumber: '',
      note: '',
      terms_of_use_check: [],
      privacy_policy_check: [],
    },
    validationSchema: Yup.object({
      companyName: Yup.string().trim().required('企業名を入力してください。'),
      personName: Yup.string().trim().required('ご担当者氏名を入力してください。'),
      email: Yup.string()
        .trim()
        .required('メールアドレスを入力してください。')
        .email('有効なメールアドレスを入力してください。'),
      telephoneNumber: Yup.string().trim().required('電話番号を入力してください。'),
      terms_of_use_check: Yup.array()
        .min(1, '利用規約に同意してください')
        .required('利用規約に同意してください'),
      privacy_policy_check: Yup.array()
        .min(1, 'プライバシーポリシーに同意してください')
        .required('プライバシーポリシーに同意してください'),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        let consultingFlag = false;
        const resData = await createAutomaticRegistration(
          values.companyName,
          values.personName,
          values.email,
          values.telephoneNumber,
          values.note,
          consultingFlag,
        );
        setRegistSuccess(true);
        toast.success(resData.detail);
      } catch (e: any) {
        setRegistSuccess(false);
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
      {!registSuccess && (
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col justify-center w-full mt-2">
              <div className="flex flex-col items-center justify-center h-full flex-1">
                <div className="w-full xl:max-w-[50%]">
                  <Card>
                    <CardHeader title="新規お申し込みフォーム" />
                    <CardContent>
                      <TextBox
                        id="companyName"
                        name="companyName"
                        isRequired={true}
                        label={'企業名'}
                        placeholder="〇〇株式会社"
                        direction="vertical"
                        disabled={formik.isSubmitting}
                      />
                      <TextBox
                        id="personName"
                        name="personName"
                        isRequired={true}
                        label={'ご担当者氏名'}
                        placeholder="山田 太郎"
                        direction="vertical"
                        disabled={formik.isSubmitting}
                      />
                      <TextBox
                        id="email"
                        name="email"
                        type="email"
                        isRequired={true}
                        label={'メールアドレス'}
                        placeholder="xxx@example.com"
                        direction="vertical"
                        disabled={formik.isSubmitting}
                      />
                      <TextBox
                        id="telephoneNumber"
                        name="telephoneNumber"
                        isRequired={true}
                        label={'電話番号'}
                        placeholder="01-2345-6789"
                        direction="vertical"
                        disabled={formik.isSubmitting}
                      />
                      <TextArea
                        id="note"
                        name="note"
                        label={'備考'}
                        rows={3}
                        placeholder="備考"
                        direction="vertical"
                        disabled={formik.isSubmitting}
                      />
                      <CheckboxGroup
                        id="terms_of_use_check"
                        name="terms_of_use_check"
                        label="利用規約を確認し、同意したらチェック"
                        options={[{ label: '同意する', value: 'true' }]}
                        direction="horizontal"
                        disabled={formik.isSubmitting}
                      />
                      <CheckboxGroup
                        id="privacy_policy_check"
                        name="privacy_policy_check"
                        label="プライバシーポリシーを確認し、同意したらチェック"
                        options={[{ label: '同意する', value: 'true' }]}
                        direction="horizontal"
                        disabled={formik.isSubmitting}
                      />
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button type="submit" disabled={isLoading} onClick={formik.submitForm}>
                        {isLoading ? <IconLoader2 className="animate-spin" /> : <>確認</>}
                      </Button>
                      <Button color="grey" disabled={formik.isSubmitting}>
                        戻る
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </form>
        </FormikProvider>
      )}
      {registSuccess && (
        <div className="flex flex-col justify-center w-full mt-2">
          <div className="flex flex-col items-center justify-center h-full flex-1">
            <div className="w-full xl:max-w-[50%]">
              <Card>
                <CardHeader title="新規お申し込みフォーム" />
                <CardContent>
                  <p>
                    お申し込みありがとうございます。ご入力いただいたメールアドレス宛にメールを送信いたしますので、ご確認ください。
                  </p>
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
