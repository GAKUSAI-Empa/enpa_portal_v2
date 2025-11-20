'use client';

import SliderImage from '@/app/tools/13/components/SliderImage';
import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import { CheckboxGroup } from '@/component/common/CheckboxGroup';
import ColorPicker from '@/component/common/ColorPicker';
import SelectBox from '@/component/common/SelectBox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/component/common/Tabs';
import { TextBox } from '@/component/common/TextBox';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
// import ContentPageTable from './components/ContentPageTable';
// import ThumbnailActions from './components/ThumbnailActions';
// import ThumbnailPreview from './components/ThumbnailPreview';
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
      fileName: Yup.string().trim().required('作成ファイル名を入力してください'),
      subTitle: Yup.string().trim().required('小見出しを入力してください'),
      subTitle1: Yup.string().trim().required('小見出し1を入力してください'),
      subTitle2: Yup.string().trim().required('小見出し2を入力してください'),
      subTitle3: Yup.string().trim().required('小見出し3を入力してください'),
      imageURL: Yup.string().trim().required('画像URL (商品など)を入力してください'),
      storeLogoUrl: Yup.string().trim().required('ロゴURLを入力してください'),
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
      startDate: '',
      endDate: '',
    },
    validationSchema: Yup.object({
      mainKey: Yup.string().trim().required('メインキーワードを入力してください'),
      pageUrl: Yup.string().trim().required('ページURLを入力してください'),
      thumbnailUrl: Yup.string().trim().required('サムネイルURLを入力してください'),
      genreId: Yup.string().trim().required('ジャンルIDを入力してください'),
      keyWord: Yup.string().trim().required('キーワードを入力してください'),
      categoryPageUrl: Yup.string().trim().required('カテゴリーページのURLを入力してください'),
    }),
    onSubmit: (values) => {
      console.log('📝 ページを作成 values:', values);
      // TODO: logic tạo page
    },
  });

  // const settings = {
  //   dots: false,
  //   infinite: false,
  //   speed: 500,
  //   slidesToShow: 4,
  //   slidesToScroll: 1,
  //   autoplay: true,
  //   arrows: true,
  // };

  const dummyData = [
    {
      id: 1,
      title: '商品一覧ページ',
      url: 'https://example.com/product-list',
      createdAt: '公開',
      updatedAt: '2025-11-05',
    },
    {
      id: 2,
      title: 'お問い合わせページ',
      url: 'https://example.com/contact',
      createdAt: '非公開',
      updatedAt: '2025-10-02',
    },
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
                      // error={thumbnailFormik.errors.fileName}
                      // touched={thumbnailFormik.touched.fileName}
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
                      // error={thumbnailFormik.errors.subTitle}
                      // touched={thumbnailFormik.touched.subTitle}
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
                      // error={thumbnailFormik.errors.subTitle1}
                      // touched={thumbnailFormik.touched.subTitle1}
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
                      // error={thumbnailFormik.errors.subTitle2}
                      // touched={thumbnailFormik.touched.subTitle2}
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
                      // error={thumbnailFormik.errors.subTitle3}
                      // touched={thumbnailFormik.touched.subTitle3}
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
                      // error={thumbnailFormik.errors.imageURL}
                      // touched={thumbnailFormik.touched.imageURL}
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
                      // error={thumbnailFormik.errors.storeLogoUrl}
                      // touched={thumbnailFormik.touched.storeLogoUrl}
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
                    type="button"
                    onClick={() => {
                      // Gọi validate form trước
                      thumbnailFormik.validateForm().then((errors) => {
                        if (Object.keys(errors).length === 0) {
                          // Nếu không có lỗi, in ra console toàn bộ dữ liệu
                          console.log('🔍 プレビュー values:', thumbnailFormik.values);
                        } else {
                          console.log('⚠️ 入力エラー:', errors);
                        }
                      });
                    }}
                  >
                    プレビュー
                  </Button>
                </div>
              </Card>

              <Card className="w-full lg:w-1/2">
                <CardHeader title="サムネイルプレビュー" />
                <CardContent>
                  {/* <ThumbnailPreview
                    fileName={thumbnailFormik.values.fileName}
                    subTitle={thumbnailFormik.values.subTitle}
                    subTitle1={thumbnailFormik.values.subTitle1}
                    subTitle2={thumbnailFormik.values.subTitle2}
                    subTitle3={thumbnailFormik.values.subTitle3}
                    imageURL={thumbnailFormik.values.imageURL}
                    storeLogoUrl={thumbnailFormik.values.storeLogoUrl}
                    hexColor={thumbnailFormik.values.hexColor}
                  />
                  <ThumbnailActions
                    onDownload={() => console.log('🖼 ダウンロード')}
                    onUploadRCabinet={() => console.log('📤 R-cabinet upload')}
                    onUploadGold={() => console.log('📤 GOLD upload')}
                  /> */}
                </CardContent>
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
                    id="selectboxValue"
                    label="コンテンツページの種類"
                    name="selectboxValue"
                    width="full"
                    options={[
                      { value: '', label: '選んでください' },
                      { value: 'Option 1', label: 'ランキング（売上）' },
                      { value: 'Option 2', label: 'ランキング（個数）' },
                      { value: 'Option 3', label: '新商品' },
                    ]}
                    isRequired={true}
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
                    // error={pageFormik.errors.mainKey}
                    // touched={pageFormik.touched.mainKey}
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
                    // error={pageFormik.errors.pageUrl}
                    // touched={pageFormik.touched.pageUrl}
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
                    // error={pageFormik.errors.thumbnailUrl}
                    // touched={pageFormik.touched.thumbnailUrl}
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

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">抽出期間</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextBox
                      id="startDate"
                      name="startDate"
                      type="datetime-local"
                      direction="vertical"
                      value={pageFormik.values.startDate}
                      onChange={pageFormik.handleChange}
                      label=""
                    />
                    <TextBox
                      id="endDate"
                      name="endDate"
                      type="datetime-local"
                      direction="vertical"
                      value={pageFormik.values.endDate}
                      onChange={pageFormik.handleChange}
                      label=""
                    />
                  </div>
                </div>

                <label className="block text-sm font-medium text-gray-400">
                  ランキングの集計期間、または新商品の登録期間。
                </label>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader title="3. 公開と更新の設定" />
              <CardContent>
                <CheckboxGroup
                  id="checkboxValue"
                  name="checkboxValue"
                  label=""
                  options={[
                    { label: 'ページを公開する', value: '1' },
                    { label: '検索エンジンにページを表示', value: '2' },
                    { label: '自動更新を有効にする（毎月3日）', value: '3' },
                  ]}
                  direction="vertical"
                />
                <div className="border-t border-gray-200 my-4"></div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    トピックス枠への表示期間
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextBox
                      id="startDate"
                      name="startDate"
                      type="datetime-local"
                      direction="vertical"
                      value={pageFormik.values.startDate}
                      onChange={pageFormik.handleChange}
                      label=""
                    />
                    <TextBox
                      id="endDate"
                      name="endDate"
                      type="datetime-local"
                      direction="vertical"
                      value={pageFormik.values.endDate}
                      onChange={pageFormik.handleChange}
                      label=""
                    />
                  </div>
                </div>
                <label className="block text-sm font-medium text-gray-400">
                  サムネイルURLの入力とページの公開が必要です。
                </label>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                size="lg"
                type="button"
                onClick={() => {
                  pageFormik.submitForm();
                  console.log('📝 現在の入力値:', pageFormik.values);
                }}
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
          <CardContent>
            {/* <ContentPageTable
              data={dummyData}
              onEdit={(id) => alert(`Edit ID: ${id}`)}
              onDelete={(id) => alert(`Delete ID: ${id}`)}
            /> */}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default Page;
