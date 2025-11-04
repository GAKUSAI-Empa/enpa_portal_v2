"use client"

import { Button } from '@/component/common/Button'
import { Card, CardContent, CardHeader } from '@/component/common/Card'
import RadioBox from '@/component/common/RadioBox'
import SelectBox from '@/component/common/SelectBox'
import SliderImage from '@/component/tools/09/SliderImage'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/component/common/Tabs'
import { TextBox } from '@/component/common/TextBox'
import React, { useEffect } from 'react'
import Slider from 'react-slick'
import { useHeader } from '@/app/context/HeaderContext'
import { FormikProvider, useFormik } from "formik";
import * as Yup from 'yup';
import ColorPicker from '@/component/common/ColorPicker'

import { CheckBoxGroup } from '@/component/common/CheckBox'

const page = () => {

    const { setTitle } = useHeader();

    useEffect(() => {
        setTitle("コンテンツページ 自動生成");
    }, [setTitle]);

    const initialValues = {
        topMessage: '',
        storeLogoUrl: '',
        hexColor: '#6e9de9', // Thêm giá trị khởi tạo cho hexColor
    };

    const validationSchema = Yup.object({
        // Định nghĩa các quy tắc xác thực của bạn ở đây
        // Ví dụ:
        // topMessage: Yup.string().required('必須項目です'),
        hexColor: Yup.string().required('必須項目です'),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            console.log(values);
            // Xử lý logic gửi form tại đây
        },
    });

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        arrows: true,
    };
    const pageOptions = [
    { value: 'page1', label: 'ランキング（売上）' },
    { value: 'page2', label: 'ランキング（個数）' },
    { value: 'page3', label: '新商品' },
];
    

    return (

        <FormikProvider value={formik}> 
        <>
            <Tabs defaultTab="tab1">
                <TabsList>
                    <TabsTrigger value="tab1">サムネイル作成</TabsTrigger>
                    <TabsTrigger value="tab2">ページ作成</TabsTrigger>
                    <TabsTrigger value="tab3">ページ一覧</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">
                    <Card>
                        <CardHeader title='1.テンプレート選択' />
                        <CardContent>
                            <SliderImage />
                        </CardContent>
                    </Card>

                    <div className="flex flex-col lg:flex-row lg:space-x-4">
 <Card className="w-full lg:w-1/2 **mr-auto**">
    <CardHeader title='2.サムネイル設定' />

    <CardContent>
        {/* Giữ lại div này làm container grid chính */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* TextBox 1: "作成ファイル名" */}
            <TextBox
                id="top"
                name="top"
                type="text"
                isRequired={true}
                label={"作成ファイル名"}
                value={""}
                placeholder="ファイル名を入力"
                direction="vertical"
                width='lg'
                readOnly={true}
            />
            
            {/* ColorPicker */}
            <ColorPicker
                id='hexColor'
                name='hexColor'
                value={formik.values.hexColor}
                onColorChange={(color) => {
                    formik.setFieldValue("hexColor", color);
                }}
            />

            {/* TextBox 2: "小見出し" */}
            <TextBox
                id="storeLogoUrl"
                name="storeLogoUrl"
                type="text"
                isRequired={true}
                label={"小見出し"}
                value={""}
                placeholder="小見出し最大20文字"
                direction="vertical"
                width='lg'
                readOnly={true}
            />

            {/* TextBox 3: "小見出し1" */}
            <TextBox
                id="topMessage1"
                name="topMessage1"
                type="text"
                isRequired={true}
                label={"小見出し1"}
                value={""}
                placeholder="小見出し最大20文字"
                direction="vertical"
                width='lg'
                readOnly={true}
            />

            {/* TextBox 4: "小見出し2" */}
            <TextBox
                id="topMessage2"
                name="topMessage2"
                type="text"
                isRequired={true}
                label={"小見出し2"}
                value={""}
                placeholder="小見出し最大20文字"
                direction="vertical"
                width='lg'
                readOnly={true}
            />

            {/* TextBox 5: "小見出し3" */}
            <TextBox
                id="topMessage3"
                name="topMessage3"
                type="text"
                isRequired={true}
                label={"小見出し3"}
                value={""}
                placeholder="小見出し最大20文字"
                direction="vertical"
                width='lg'
                readOnly={true}
            />

            {/* TextBox 6: "画像URL (商品など)" */}
            <TextBox
                id="storeLogoUrl1"
                name="storeLogoUrl1"
                type="text"
                isRequired={true}
                label={"画像URL (商品など)"}
                value={""}
                placeholder="https://image.rakuten.co.jp/shop/cabinet/image.jpg"
                direction="vertical"
                width='lg'
                readOnly={true}
            />

            {/* TextBox 7: "ロゴURL" */}
            <TextBox
                id="storeLogoUrl"
                name="storeLogoUrl"
                type="text"
                isRequired={true}
                label={"ロゴURL"}
                value={""}
                placeholder="https://image.rakuten.co.jp/shop/cabinet/logo.jpg"
                direction="vertical"
                width='lg'
                readOnly={true}
            />
        </div>
    </CardContent>
              <div className='flex justify-center'>
                <Button
                  size='lg'
                  type='submit'
                  disabled={!(formik.isValid && formik.dirty)}
                  onClick={formik.submitForm}>
                  プレビュー
                </Button>
              </div>
</Card>

<Card className="w-full lg:w-1/2 **mr-auto**">
    <CardHeader title='サムネイルプレビュー' />
    <CardContent>
        {/* Giữ lại div này làm container grid chính */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

        </div>
    </CardContent>

</Card>

</div>

                </TabsContent>
                <TabsContent value="tab2">
                     <Card className="w-full mr-auto">
    <CardHeader title='1. ページ情報設定' />
    <CardContent>
        {/* Giữ lại div này làm container grid chính */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* <TextBox
                id="storeLogoUrl"
                name="storeLogoUrl"
                type="text"
                isRequired={true}
                label={"コンテンツページの種類"}
                value={""}
                placeholder="小見出し最大20文字"
                direction="vertical"
          
                readOnly={true}
            /> */}

            <SelectBox
    id="storeLogoUrl" // Giữ nguyên id và name
    name="storeLogoUrl"
    isRequired={true}
    label={"コンテンツページの種類"} // "Loại trang nội dung"
    options={pageOptions} // Truyền mảng options đã định nghĩa
    direction="vertical" // Giữ nguyên direction
    width='full'
/>
            

            <TextBox
                id="topMessage1"
                name="topMessage1"
                type="text"
                isRequired={true}
                label={"メインキーワード"}
                value={""}
                placeholder="10文字以内 (ページのタイトルや説明文に使用)"
                direction="vertical"
    
                readOnly={true}
            />

            {/* TextBox 4: "小見出し2" */}
            <TextBox
                id="pageUrl"
                name="pageUrl"
                type="text"
                isRequired={true}
                label={"ページURL"}
                value={""}
                placeholder="最大5階層、各階層最大20文字"
                direction="vertical"
       
                readOnly={true}
            />

            {/* TextBox 5: "小見出し3" */}
            <TextBox
                id="topMessage3"
                name="topMessage3"
                type="text"
                isRequired={true}
                label={"サムネイルURL"}
                value={""}
                placeholder="R-CabinetのURL。推奨: 1280×720px"
                direction="vertical"
   
                readOnly={true}
            />


        </div>
    </CardContent>

</Card>

<Card className="w-full mr-auto">
    <CardHeader title='2. 表示商品の抽出設定' />
    <CardContent>
        {/* Giữ lại div này làm container grid chính */}
        <div className="grid grid-cols-1  gap-y-4">
            {/* TextBox 1: "作成ファイル名" */}

            <TextBox
                id="storeLogoUrl"
                name="storeLogoUrl"
                type="text"
                isRequired={true}
                label={"ジャンルIDによる抽出"}
                value={""}
                placeholder="中間階層のIDも使用可能です。"
                direction="vertical"
            
                readOnly={true}
            />

            {/* TextBox 3: "小見出し1" */}
            <TextBox
                id="topMessage1"
                name="topMessage1"
                type="text"
                isRequired={true}
                label={"キーワードによる抽出"}
                value={""}
                placeholder="商品名に含まれるキーワードで検索します。"
                direction="vertical"
             width='full'
                readOnly={true}
            />

            {/* TextBox 4: "小見出し2" */}
            <TextBox
                id="topMessage2"
                name="topMessage2"
                type="text"
                isRequired={true}
                label={"カテゴリーページのURLによる抽出"}
                value={""}
                placeholder="指定した店舗内カテゴリの商品を抽出します。"
                direction="vertical"
       
                readOnly={true}
            />

           
        </div>
    </CardContent>

</Card>

<Card className="w-full mr-auto">
    <CardHeader title='3. 公開と更新の設定' />
    <CardContent>
        {/* Giữ lại div này làm container grid chính */}
        <div className="grid grid-cols-1  gap-y-4">
            {/* TextBox 1: "作成ファイル名" */}

                                      <CheckBoxGroup
                                           direction='vertical'
                                       >
                                           <CheckBoxGroup.Option value="1">ページを公開する</CheckBoxGroup.Option>
                                           <CheckBoxGroup.Option value="2">検索エンジンにページを表示</CheckBoxGroup.Option>
                                           <CheckBoxGroup.Option value="3">自動更新を有効にする（毎月3日）</CheckBoxGroup.Option>
                                       </CheckBoxGroup>
        </div>
    </CardContent>

</Card>
              <div className='flex justify-center'>
                <Button
                  size='lg'
                  type='submit'
                  disabled={!(formik.isValid && formik.dirty)}
                  onClick={formik.submitForm}>
                  ページを作成
                </Button>
              </div>

                    


                </TabsContent>

                               <TabsContent value="tab3">
                     <Card className="w-full mr-auto">
    <CardHeader title='' />
    <CardContent>
        {/* Giữ lại div này làm container grid chính */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        </div>
    </CardContent>

</Card>

                    


                </TabsContent>
            </Tabs>

        </>
       </FormikProvider>
        
    )
}


export default page
