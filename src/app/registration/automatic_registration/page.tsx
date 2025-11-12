'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/component/common/Card';
import SelectBox from '@/component/common/SelectBox';
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
    initialValues: {},
    validationSchema: Yup.object({}),
    onSubmit: async (values) => {
      setIsLoading(true);
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
                  <CardHeader title="店舗・ユーザー情報登録フォーム" />
                  <CardContent>
                    <TextBox
                      id=""
                      name=""
                      type=""
                      isRequired={true}
                      label={'ショップID'}
                      value={''}
                      placeholder=""
                      direction="vertical"
                    />
                    <TextBox
                      id=""
                      name=""
                      type=""
                      isRequired={true}
                      label={'店舗URL'}
                      value={''}
                      placeholder=""
                      direction="vertical"
                    />
                    <TextBox
                      id=""
                      name=""
                      type=""
                      isRequired={true}
                      label={'店舗名'}
                      value={''}
                      placeholder=""
                      direction="vertical"
                    />
                    <SelectBox
                      id=""
                      label="通常の税率"
                      name=""
                      width="full"
                      value={''}
                      options={[
                        { value: '', label: 'choose' },
                        { value: 'apple', label: 'apple' },
                        { value: 'banana', label: 'banana' },
                        { value: 'orange', label: 'orange' },
                      ]}
                      isRequired={true}
                    />
                    <SelectBox
                      id=""
                      label="消費税 1円未満端数"
                      name=""
                      width="full"
                      value={''}
                      options={[
                        { value: '', label: 'choose' },
                        { value: 'apple', label: 'apple' },
                        { value: 'banana', label: 'banana' },
                        { value: 'orange', label: 'orange' },
                      ]}
                      isRequired={true}
                    />
                    <TextBox
                      id=""
                      name=""
                      type=""
                      isRequired={true}
                      label={'ユーザー名'}
                      value={''}
                      placeholder=""
                      direction="vertical"
                    />
                    <TextBox
                      id=""
                      name=""
                      type=""
                      isRequired={true}
                      label={'ユーザーメールアドレス'}
                      value={''}
                      placeholder=""
                      direction="vertical"
                    />
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button type="submit" disabled={isLoading}>
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
