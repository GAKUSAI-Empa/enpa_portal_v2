/**Huyen */
'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import { CheckboxGroup } from '@/component/common/CheckboxGroup';
import SelectBox from '@/component/common/SelectBox';
import { Tabs, TabsContent } from '@/component/common/Tabs';
import { TextBox } from '@/component/common/TextBox';
import { FormikProvider, useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import * as Yup from 'yup';
import SliderImagereview from './components/SliderImage';
const Page = () => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  // const token = session?.user?.accessToken;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYzQyZWNkMC02ODgxLTRkZjktOTAwMi05YjA2ZTQ1YmJhZmQiLCJleHAiOjE3NjM3MDkzNDMsInVzZXJfbmFtZSI6ImFkbWluIiwicm9sZV9uYW1lIjoiUk9MRV9BRE1JTiJ9.rX7uxCjMZA3WU7p3ustlAj_uqAyKIrX_JFpp3NAhwto';

  // --- Formik Setup ---
  const formik = useFormik({
    initialValues: {
      template_id: 'templateD',
      min_review_placement: '',
      min_review_display: '',
      pc_width: '',
      pc_unit: 'px',
      sp_width: '',
      sp_unit: 'px',
      pc_position: [],
      sp_position: [],
    },
    validationSchema: Yup.object({
      min_review_placement: Yup.number()
        .typeError('数字を入力してください')
        .required('掲載されるための最低レビュー件数を入力してください'),
      min_review_display: Yup.number()
        .typeError('数字を入力してください')
        .required('レビュー件数表示のための最低レビュー件数を入力してください'),
      pc_width: Yup.number()
        .typeError('数字を入力してください')
        .required('PC用横幅を入力してください'),
      sp_width: Yup.number()
        .typeError('数字を入力してください')
        .required('スマホ用横幅を入力してください'),

      pc_position: Yup.array().min(1, '選択してください'),
      sp_position: Yup.array().min(1, '選択してください'),
    }),
    // onSubmit: async (values) => {
    //   console.log('SUBMIT STARTED', values);
    // },

    onSubmit: async (values) => {
      const payload = {
        ...values,
        min_review_placement: Number(values.min_review_placement),
        min_review_display: Number(values.min_review_display),
        pc_width: Number(values.pc_width),
        sp_width: Number(values.sp_width),
      };
      try {
        const res = await fetch('http://localhost:8000/tool11/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        console.log(result);
      } catch (err) {
        console.error(err);
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Tabs defaultTab="tab1">
          <TabsContent value="tab1">
            <Card>
              <CardHeader title="1.テンプレート選択" />
              <CardContent>
                <SliderImagereview
                  value={formik.values.template_id}
                  onChange={(val) => formik.setFieldValue('template_id', val)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="2.詳細設定" />
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 my-5">
                  <TextBox
                    label="掲載されるための最低レビュー件数"
                    id="min_review_placement"
                    name="min_review_placement"
                    value={formik.values.min_review_placement}
                    onChange={formik.handleChange}
                    direction="vertical"
                    isRequired
                    width="lg"
                  />

                  <TextBox
                    label="レビュー件数表示のための最低レビュー件数"
                    id="min_review_display"
                    name="min_review_display"
                    value={formik.values.min_review_display}
                    onChange={formik.handleChange}
                    direction="vertical"
                    isRequired
                    width="lg"
                  />
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 my-5">
                  {/* PC width setting */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      レビュー画像のサイズ設定
                    </h3>

                    <div className="flex items-center gap-3   w-full">
                      <div className="min-w-[360px]">
                        <TextBox
                          label="PC用横幅の調整  "
                          id="pc_width"
                          name="pc_width"
                          isRequired
                          value={formik.values.pc_width}
                          onChange={formik.handleChange}
                          direction="vertical"
                          suffix={
                            <SelectBox
                              id="pc_unit"
                              name="pc_unit"
                              isRequired
                              classNameParent="mb-0"
                              value={formik.values.pc_unit}
                              onChange={formik.handleChange}
                              options={[
                                { value: 'px', label: 'px' },
                                { value: '%', label: '%' },
                              ]}
                            />
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* PC position setting */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">画像挿入位置</h3>
                    <CheckboxGroup
                      id="pc_position"
                      name="pc_position"
                      label=""
                      options={[
                        { label: '説明文の前', value: '1' },
                        { label: '説明文の後', value: '2' },
                      ]}
                      direction="vertical"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                {/* --- SP Config --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 my-5">
                  {/* SP width setting */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4"></h3>

                    <div className="flex items-center gap-3">
                      <div className="min-w-[360px]">
                        <TextBox
                          label="スマホ用横幅の調整"
                          id="sp_width"
                          name="sp_width"
                          isRequired
                          value={formik.values.sp_width}
                          onChange={formik.handleChange}
                          direction="vertical"
                          suffix={
                            <SelectBox
                              id="sp_unit"
                              name="sp_unit"
                              isRequired
                              value={formik.values.sp_unit}
                              onChange={formik.handleChange}
                              classNameParent="mb-0"
                              options={[
                                { value: 'px', label: 'px' },
                                { value: '%', label: '%' },
                              ]}
                            />
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* SP position setting */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4"></h3>
                    <CheckboxGroup
                      id="sp_position"
                      name="sp_position"
                      label=""
                      options={[
                        { label: '説明文の前', value: '1' },
                        { label: '説明文の後', value: '2' },
                      ]}
                      direction="vertical"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* --- Save Button --- */}
            <div className="flex justify-center">
              <Button size="lg" type="submit" onClick={formik.submitForm}>
                設定を保存
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </FormikProvider>
  );
};

export default Page;
