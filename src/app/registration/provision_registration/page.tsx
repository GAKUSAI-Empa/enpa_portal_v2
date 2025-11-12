'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/component/common/Card';
import { CheckboxGroup } from '@/component/common/CheckboxGroup';
import RadioBox from '@/component/common/RadioBox';
import SelectBox from '@/component/common/SelectBox';
import { TextArea } from '@/component/common/TextArea';
import { TextBox } from '@/component/common/TextBox';
import { IconLoader2 } from '@tabler/icons-react';
import { FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as Yup from 'yup';

const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      companyName: '',
      personName: '',
      email: '',
      telephoneNumber: '',
      note: 'aaaaa',
      terms_of_use_check: [],
      privacy_policy_check: [],
      selectboxValue: 'apple',
      radioboxValue: '1',
    },
    validationSchema: Yup.object({
      companyName: Yup.string().trim().required('企業名を入力してください。'),
      note: Yup.string().trim().required('備考入力してください。'),

      terms_of_use_check: Yup.array()
        .min(1, '利用規約に同意してください')
        .required('利用規約に同意してください'),
      selectboxValue: Yup.string().trim().required('入力してください。'),
      radioboxValue: Yup.string().trim().required('入力してください。'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      console.log(values);
      setIsLoading(false);
    },
  });

  return (
    <>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col justify-center w-full h-screen">
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
                      placeholder="企業名"
                      direction="vertical"
                    />
                    <TextBox
                      id="personName"
                      name="personName"
                      isRequired={true}
                      label={'ご担当者氏名'}
                      placeholder=""
                      direction="vertical"
                    />
                    <TextBox
                      id="email"
                      name="email"
                      isRequired={true}
                      label={'メールアドレス'}
                      placeholder=""
                      direction="vertical"
                    />
                    <TextBox
                      id="telephoneNumber"
                      name="telephoneNumber"
                      isRequired={true}
                      label={'電話番号'}
                      placeholder=""
                      direction="vertical"
                    />
                    <TextArea
                      id="note"
                      name="note"
                      label={'備考'}
                      rows={3}
                      placeholder=""
                      direction="vertical"
                    />
                    <CheckboxGroup
                      id="terms_of_use_check"
                      name="terms_of_use_check"
                      label="利用規約を確認し、同意したらチェック"
                      options={[{ label: '同意する', value: 'true' }]}
                      direction="horizontal"
                    />
                    <CheckboxGroup
                      id=""
                      name=""
                      label="プライバシーポリシーを確認し、同意したらチェック"
                      options={[{ label: '同意する', value: 'true' }]}
                      direction="horizontal"
                    />
                    <SelectBox
                      id="selectboxValue"
                      label="消費税 1円未満端数"
                      name="selectboxValue"
                      width="full"
                      options={[
                        { value: '', label: 'choose' },
                        { value: 'apple', label: 'apple' },
                        { value: 'banana', label: 'banana' },
                        { value: 'orange', label: 'orange' },
                      ]}
                      isRequired={true}
                    />
                    <RadioBox.Group label="label1" name="radioboxValue">
                      <RadioBox.Option value="1">Option 1</RadioBox.Option>
                      <RadioBox.Option value="2">Option 2</RadioBox.Option>
                      <RadioBox.Option value="3" disabled={true}>
                        Option 3 (Disabled)
                      </RadioBox.Option>
                    </RadioBox.Group>
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
              </div>
            </div>
          </div>
        </form>
      </FormikProvider>
    </>
  );
};

export default page;
