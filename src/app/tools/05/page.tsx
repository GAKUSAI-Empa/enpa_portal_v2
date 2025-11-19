'use client';

// 1. Import đầy đủ (thêm Formik và Form)
import SliderImage from '@/app/tools/05/components/SliderImage';
import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import RadioBox from '@/component/common/RadioBox';
import SelectBox from '@/component/common/SelectBox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/component/common/Tabs';
import { TextBox } from '@/component/common/TextBox';
import { Form, Formik } from 'formik';

const page = () => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    arrows: true,
  };

  return (
    // 2. Bọc toàn bộ UI bằng <Formik>
    <Formik
      // 3. Cung cấp giá trị ban đầu cho TẤT CẢ các trường trong form
      initialValues={{
        pc_width: '',
        pc_width_unit: 'px',
        image_position_pc: '2', // Giá trị mặc định cho RadioBox (thay cho defaultValue)
        sp_width: '',
        sp_width_unit: 'px',
        image_position_sp: '2', // Giá trị mặc định cho RadioBox (thay cho defaultValue)
      }}
      // 4. Xử lý khi nhấn nút "submit"
      onSubmit={(values) => {
        console.log('Form submitted:', values);
        // Gọi API lưu trữ ở đây
      }}
    >
      {/* 5. Bọc nội dung form bằng <Form> của Formik */}
      <Form>
        <Tabs defaultTab="tab1">
          <TabsList>
            <TabsTrigger value="tab1">ランキング画像設定</TabsTrigger>
            <TabsTrigger value="tab2">ランキング一覧</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <Card>
              <CardHeader title="1.テンプレート選択" />
              <CardContent>
                <SliderImage />
              </CardContent>
            </Card>
            <Card>
              <CardHeader title="2.詳細設定" />
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-10">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      ランキング画像のサイズ設定
                    </h3>
                    {/* Cập nhật: Thêm 'name' cho TextBox và SelectBox */}
                    <TextBox
                      label="PC用 横幅の調整"
                      id="pc_width"
                      name="pc_width" // Cần 'name' để Formik hoạt động
                      // 'value' sẽ được Formik tự động quản lý
                      direction="horizontal"
                      suffix={
                        <SelectBox
                          id="pc_width_unit"
                          name="pc_width_unit" // Cần 'name'
                          classNameParent="mb-0"
                          options={[
                            { value: 'pixel', label: 'px' },
                            { value: 'percent', label: '%' },
                          ]}
                          // 'defaultValue' sẽ được quản lý bằng 'initialValues'
                        />
                      }
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">画像挿入位置</h3>
                    {/* Component này bây giờ sẽ hoạt động vì đã có Formik context */}
                    <RadioBox.Group name="image_position_pc" direction="vertical">
                      <RadioBox.Option value="1">説明文の前</RadioBox.Option>
                      <RadioBox.Option value="2">説明文の後</RadioBox.Option>
                    </RadioBox.Group>
                  </div>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-10">
                  <div>
                    {/* Cập nhật: Thêm 'name' cho TextBox và SelectBox */}
                    <TextBox
                      label="スマホ用 横幅の調整"
                      id="sp_width"
                      name="sp_width" // Cần 'name'
                      direction="horizontal"
                      suffix={
                        <SelectBox
                          id="sp_width_unit"
                          name="sp_width_unit"
                          classNameParent="mb-0"
                          options={[
                            { value: 'pixel', label: 'px' },
                            { value: 'percent', label: '%' },
                          ]}
                        />
                      }
                    />
                  </div>
                  <div>
                    <RadioBox.Group name="image_position_sp" direction="vertical">
                      <RadioBox.Option value="1">説明文の前</RadioBox.Option>
                      <RadioBox.Option value="2">説明文の後</RadioBox.Option>
                    </RadioBox.Group>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-center">
              {/* Nút này bây giờ sẽ trigger onSubmit của Formik */}
              <Button size="lg" type="submit">
                設定を保存
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="tab2"></TabsContent>
        </Tabs>
      </Form>
    </Formik>
  );
};

export default page;
