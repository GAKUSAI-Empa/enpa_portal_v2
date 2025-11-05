/**Huyen */
'use client';

import { Button } from '@/component/tools/07/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import SelectBox from '@/component/common/SelectBox';
import { Tabs, TabsContent } from '@/component/common/Tabs';
import { TextBox } from '@/component/common/TextBox';
import SliderImagereview from '@/component/tools/07/SliderImage';
import { CheckBoxGroup } from '@/component/common/CheckBox';
import React, { useEffect, useState } from 'react';
import { useHeader } from '@/app/context/HeaderContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Page = () => {
  const { setTitle } = useHeader();
  const [loading, setLoading] = useState(false);
  const [imagePositionPc, setImagePositionPc] = useState<string[]>([]);
  const [imagePositionSp, setImagePositionSp] = useState<string[]>([]);

  useEffect(() => {
    setTitle('レビュー評価バナー自動掲載');
  }, [setTitle]);

  // --- Formik Setup ---
  const formik = useFormik({
    initialValues: {
      template_id: '',
      min_review_placement: 0,
      min_review_display: 0,
      pc_width: 0,
      pc_unit: 'px',
      sp_width: 0,
      sp_unit: '%',
    },
    validationSchema: Yup.object({
      min_review_placement: Yup.number().required('必須です'),
      min_review_display: Yup.number().required('必須です'),
    }),
    onSubmit: async (values) => {
      console.log('🟢 SUBMIT STARTED', values);
      try {
        setLoading(true);
        const payload = {
          ...values,
          pc_position: imagePositionPc,
          sp_position: imagePositionSp,
        };

        const res = await fetch('/tool07/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Save failed');

        alert('設定を保存しました。');
      } catch (err) {
        console.error(err);
        alert('保存に失敗しました。');
      } finally {
        setLoading(false);
      }
    },
  });

  // --- Fetch settings from backend ---
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/tool07/settings');
        const data = await res.json();

        formik.setValues({
          template_id: data.template_id || '2',
          min_review_placement: data.min_review_placement || 5,
          min_review_display: data.min_review_display || 12,
          pc_width: data.pc_width || 600,
          pc_unit: data.pc_unit || 'px',
          sp_width: data.sp_width || 90,
          sp_unit: data.sp_unit || '%',
        });

        setImagePositionPc(data.pc_position || []);
        setImagePositionSp(data.sp_position || []);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };

    fetchSettings();
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Tabs defaultTab="tab1">
        <TabsContent value="tab1">
          <Card>
            <CardHeader title="1.テンプレート選択" />
            <CardContent>
              <SliderImagereview />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="2.詳細設定" />
            <CardContent>
              {/* --- Minimum review counts --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 my-5">
                <TextBox
                  label="掲載されるための最低レビュー件数"
                  id="min_review_placement"
                  name="min_review_placement"
                  value={formik.values.min_review_placement}
                  onChange={formik.handleChange}
                  direction="horizontal"
                />

                <TextBox
                  label="レビュー件数表示のための最低レビュー件数"
                  id="min_review_display"
                  name="min_review_display"
                  value={formik.values.min_review_display}
                  onChange={formik.handleChange}
                  direction="horizontal"
                />
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              {/* --- PC Config --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 my-5">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    レビュ画像のサイズ設定（PC）
                  </h3>
                  <TextBox
                    label="PC用 横幅の調整"
                    id="pc_width"
                    name="pc_width"
                    value={formik.values.pc_width}
                    onChange={formik.handleChange}
                    direction="horizontal"
                    suffix={
                      <SelectBox
                        id="pc_unit"
                        name="pc_unit"
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

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">画像挿入位置（PC）</h3>
                  <CheckBoxGroup
                    name="pc_position"
                    defaultValue={imagePositionPc}
                    onChange={setImagePositionPc}
                    direction="vertical"
                  >
                    <CheckBoxGroup.Option value="1">説明文の前</CheckBoxGroup.Option>
                    <CheckBoxGroup.Option value="2">説明文の後</CheckBoxGroup.Option>
                  </CheckBoxGroup>
                </div>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              {/* --- SP Config --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 my-5">
                <div>
                  <TextBox
                    label="スマホ用 横幅の調整"
                    id="sp_width"
                    name="sp_width"
                    value={formik.values.sp_width}
                    onChange={formik.handleChange}
                    direction="horizontal"
                    suffix={
                      <SelectBox
                        id="sp_unit"
                        name="sp_unit"
                        value={formik.values.sp_unit}
                        onChange={formik.handleChange}
                        options={[
                          { value: 'px', label: 'px' },
                          { value: '%', label: '%' },
                        ]}
                      />
                    }
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">画像挿入位置（SP）</h3>
                  <CheckBoxGroup
                    name="sp_position"
                    defaultValue={imagePositionSp}
                    onChange={setImagePositionSp}
                    direction="vertical"
                  >
                    <CheckBoxGroup.Option value="1">説明文の前</CheckBoxGroup.Option>
                    <CheckBoxGroup.Option value="2">説明文の後</CheckBoxGroup.Option>
                  </CheckBoxGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* --- Save Button --- */}
          <div className="flex justify-center">
            <Button size="lg" type="submit" disabled={loading}>
              {loading ? '保存中...' : '設定を保存'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default Page;
