'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import { CheckBoxGroup } from '@/component/common/CheckBox';
import SelectBox from '@/component/common/SelectBox';
import SliderImage from '@/component/tools/09/SliderImage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/component/common/Tabs';
import { TextBox } from '@/component/common/TextBox';
import React from 'react';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import ColorPicker from '@/component/common/ColorPicker';
import DateRangePicker from './components/DateRangePicker';

// =========================== COMPONENT ===========================
const Page = () => {
  // ---------- Formik for サムネイル作成 ----------
  const thumbnailFormik = useFormik({
    initialValues: {
      fileName: '',
      subTitle: '',
      subTitle1: '',
      subTitle2: '',
      subTitle3: '',
      imageURL: '',
      storeLogoUrl: '',
      hexColor: '#6e9de9',
    },
    validationSchema: Yup.object({
      fileName: Yup.string().trim().required('必須項目です'),
      subTitle: Yup.string().trim().required('必須項目です'),
      subTitle1: Yup.string().trim().required('必須項目です'),
      subTitle2: Yup.string().trim().required('必須項目です'),
      subTitle3: Yup.string().trim().required('必須項目です'),
      imageURL: Yup.string().trim().required('必須項目です'),
      storeLogoUrl: Yup.string().trim().required('必須項目です'),
    }),
    onSubmit: (values) => {
      console.log('🔍 プレビュー values:', values);
      // TODO: logic xem trước (preview)
    },
  });

  // ---------- Formik for ページ作成 ----------
  const pageFormik = useFormik({
    initialValues: {
      mainKey: '',
      pageUrl: '',
      thumbnailUrl: '',
      genreId: '',
      keyWord: '',
      categoryPageUrl: '',
    },
    validationSchema: Yup.object({
      mainKey: Yup.string().trim().required('必須項目です'),
      pageUrl: Yup.string().trim().required('必須項目です'),
      thumbnailUrl: Yup.string().trim().required('必須項目です'),
    }),
    onSubmit: (values) => {
      console.log('📝 ページを作成 values:', values);
      // TODO: logic tạo page
    },
  });

  const pageOptions = [
    { value: 'page1', label: 'ランキング（売上）' },
    { value: 'page2', label: 'ランキング（個数）' },
    { value: 'page3', label: '新商品' },
  ];

  return (
    <Tabs defaultTab="tab1">
      <TabsList>
        <TabsTrigger value="tab1">サムネイル作成</TabsTrigger>
        <TabsTrigger value="tab2">ページ作成</TabsTrigger>
        <TabsTrigger value="tab3">ページ一覧</TabsTrigger>
      </TabsList>

      {/* ============ TAB 1: サムネイル作成 ============ */}
      <TabsContent value="tab1">
        <FormikProvider value={thumbnailFormik}>
          <form onSubmit={thumbnailFormik.handleSubmit}>
            <Card>
              <CardHeader title="1.テンプレート選択" />
              <CardContent>
                <SliderImage />
              </CardContent>
            </Card>

            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <Card className="w-full lg:w-1/2">
                <CardHeader title="2.サムネイル設定" />
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <TextBox
                      id="fileName"
                      name="fileName"
                      type="text"
                      label="作成ファイル名"
                      isRequired
                      direction="vertical"
                      width="lg"
                      placeholder="ファイル名を入力"
                      value={thumbnailFormik.values.fileName}
                      onChange={thumbnailFormik.handleChange}
                      error={thumbnailFormik.errors.fileName}
                      touched={thumbnailFormik.touched.fileName}
                    />
                    <TextBox
                      id="subTitle"
                      name="subTitle"
                      type="text"
                      label="小見出し"
                      isRequired
                      direction="vertical"
                      width="lg"
                      placeholder="小見出し最大20文字"
                      value={thumbnailFormik.values.subTitle}
                      onChange={thumbnailFormik.handleChange}
                      error={thumbnailFormik.errors.subTitle}
                      touched={thumbnailFormik.touched.subTitle}
                    />
                    <TextBox
                      id="subTitle1"
                      name="subTitle1"
                      type="text"
                      label="小見出し1"
                      isRequired
                      direction="vertical"
                      width="lg"
                      placeholder="小見出し最大20文字"
                      value={thumbnailFormik.values.subTitle1}
                      onChange={thumbnailFormik.handleChange}
                      error={thumbnailFormik.errors.subTitle1}
                      touched={thumbnailFormik.touched.subTitle1}
                    />
                    <TextBox
                      id="subTitle2"
                      name="subTitle2"
                      type="text"
                      label="小見出し2"
                      isRequired
                      direction="vertical"
                      width="lg"
                      placeholder="小見出し最大20文字"
                      value={thumbnailFormik.values.subTitle2}
                      onChange={thumbnailFormik.handleChange}
                      error={thumbnailFormik.errors.subTitle2}
                      touched={thumbnailFormik.touched.subTitle2}
                    />
                    <TextBox
                      id="subTitle3"
                      name="subTitle3"
                      type="text"
                      label="小見出し3"
                      isRequired
                      direction="vertical"
                      width="lg"
                      placeholder="小見出し最大20文字"
                      value={thumbnailFormik.values.subTitle3}
                      onChange={thumbnailFormik.handleChange}
                      error={thumbnailFormik.errors.subTitle3}
                      touched={thumbnailFormik.touched.subTitle3}
                    />
                    <TextBox
                      id="imageURL"
                      name="imageURL"
                      type="text"
                      label="画像URL (商品など)"
                      isRequired
                      direction="vertical"
                      width="lg"
                      placeholder="https://image.rakuten.co.jp/shop/cabinet/image.jpg"
                      value={thumbnailFormik.values.imageURL}
                      onChange={thumbnailFormik.handleChange}
                      error={thumbnailFormik.errors.imageURL}
                      touched={thumbnailFormik.touched.imageURL}
                    />
                    <TextBox
                      id="storeLogoUrl"
                      name="storeLogoUrl"
                      type="text"
                      label="ロゴURL"
                      isRequired
                      direction="vertical"
                      width="lg"
                      placeholder="https://image.rakuten.co.jp/shop/cabinet/logo.jpg"
                      value={thumbnailFormik.values.storeLogoUrl}
                      onChange={thumbnailFormik.handleChange}
                      error={thumbnailFormik.errors.storeLogoUrl}
                      touched={thumbnailFormik.touched.storeLogoUrl}
                    />
                    <ColorPicker
                      id="hexColor"
                      name="hexColor"
                      value={thumbnailFormik.values.hexColor}
                      onColorChange={(color) => thumbnailFormik.setFieldValue('hexColor', color)}
                    />
                  </div>
                </CardContent>
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    type="submit"
                    disabled={!(thumbnailFormik.isValid && thumbnailFormik.dirty)}
                    onClick={thumbnailFormik.submitForm}
                  >
                    プレビュー
                  </Button>
                </div>
              </Card>

              <Card className="w-full lg:w-1/2">
                <CardHeader title="サムネイルプレビュー" />
                <CardContent>{/* Vùng hiển thị preview thumbnail */}</CardContent>
              </Card>
            </div>
          </form>
        </FormikProvider>
      </TabsContent>

      {/* ============ TAB 2: ページ作成 ============ */}
      <TabsContent value="tab2">
        <FormikProvider value={pageFormik}>
          <form onSubmit={pageFormik.handleSubmit}>
            <Card className="w-full">
              <CardHeader title="1. ページ情報設定" />
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <SelectBox
                    id="contentType"
                    name="contentType"
                    isRequired
                    label="コンテンツページの種類"
                    options={pageOptions}
                    direction="vertical"
                    width="full"
                  />
                  <TextBox
                    id="mainKey"
                    name="mainKey"
                    type="text"
                    label="メインキーワード"
                    isRequired
                    direction="vertical"
                    placeholder="10文字以内 (ページのタイトルや説明文に使用)"
                    value={pageFormik.values.mainKey}
                    onChange={pageFormik.handleChange}
                    error={pageFormik.errors.mainKey}
                    touched={pageFormik.touched.mainKey}
                  />
                  <TextBox
                    id="pageUrl"
                    name="pageUrl"
                    type="text"
                    label="ページURL"
                    isRequired
                    direction="vertical"
                    placeholder="最大5階層、各階層最大20文字"
                    value={pageFormik.values.pageUrl}
                    onChange={pageFormik.handleChange}
                    error={pageFormik.errors.pageUrl}
                    touched={pageFormik.touched.pageUrl}
                  />
                  <TextBox
                    id="thumbnailUrl"
                    name="thumbnailUrl"
                    type="text"
                    label="サムネイルURL"
                    isRequired
                    direction="vertical"
                    placeholder="R-CabinetのURL。推奨: 1280×720px"
                    value={pageFormik.values.thumbnailUrl}
                    onChange={pageFormik.handleChange}
                    error={pageFormik.errors.thumbnailUrl}
                    touched={pageFormik.touched.thumbnailUrl}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader title="2. 表示商品の抽出設定" />
              <CardContent>
                <div className="grid grid-cols-1 gap-y-4">
                  <TextBox
                    id="genreId"
                    name="genreId"
                    type="text"
                    label="ジャンルIDによる抽出"
                    isRequired
                    direction="vertical"
                    placeholder="中間階層のIDも使用可能です。"
                    value={pageFormik.values.genreId}
                    onChange={pageFormik.handleChange}
                  />
                  <TextBox
                    id="keyWord"
                    name="keyWord"
                    type="text"
                    label="キーワードによる抽出"
                    isRequired
                    direction="vertical"
                    placeholder="商品名に含まれるキーワードで検索します。"
                    value={pageFormik.values.keyWord}
                    onChange={pageFormik.handleChange}
                  />
                  <TextBox
                    id="categoryPageUrl"
                    name="categoryPageUrl"
                    type="text"
                    label="カテゴリーページのURLによる抽出"
                    isRequired
                    direction="vertical"
                    placeholder="指定した店舗内カテゴリの商品を抽出します。"
                    value={pageFormik.values.categoryPageUrl}
                    onChange={pageFormik.handleChange}
                  />
                </div>
                <DateRangePicker label="抽出期間" />
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader title="3. 公開と更新の設定" />
              <CardContent>
                <CheckBoxGroup direction="vertical">
                  <CheckBoxGroup.Option value="1">ページを公開する</CheckBoxGroup.Option>
                  <CheckBoxGroup.Option value="2">検索エンジンにページを表示</CheckBoxGroup.Option>
                  <CheckBoxGroup.Option value="3">
                    自動更新を有効にする（毎月3日）
                  </CheckBoxGroup.Option>
                </CheckBoxGroup>
                <DateRangePicker label="トピックス枠への表示期間" />
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                size="lg"
                type="submit"
                disabled={!(pageFormik.isValid && pageFormik.dirty)}
                onClick={pageFormik.submitForm}
              >
                ページを作成
              </Button>
            </div>
          </form>
        </FormikProvider>
      </TabsContent>

      {/* ============ TAB 3: ページ一覧 ============ */}
      <TabsContent value="tab3">
        <Card>
          <CardHeader title="ページ一覧" />
          <CardContent>{/* Hiển thị danh sách page ở đây */}</CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default Page;
