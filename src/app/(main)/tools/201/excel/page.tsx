'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent } from '@/component/common/Card';
import RadioBox from '@/component/common/RadioBox';
import SelectBox from '@/component/common/SelectBox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/component/common/Tabs';
const page = () => {
  return (
    <Tabs defaultTab="tab1">
      <TabsList>
        <TabsTrigger value="tab1"></TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <Card>
          <CardContent>
            <RadioBox.Group label="操作方法" name="radioboxValue" direction="horizontal">
              <RadioBox.Option value="1">画面で</RadioBox.Option>
              <RadioBox.Option value="2">Excelで</RadioBox.Option>
            </RadioBox.Group>
            <div className="border-t border-gray-200 my-4"></div>

            <RadioBox.Group label="対象商品" name="radioboxValue" direction="horizontal">
              <RadioBox.Option value="1">販売中</RadioBox.Option>
              <RadioBox.Option value="2">在庫含め</RadioBox.Option>
            </RadioBox.Group>
            <div className="border-t border-gray-200 my-4"></div>

            <SelectBox
              id="selectboxValue"
              label="パータン設定"
              name="selectboxValue"
              width="full"
              options={[
                { value: 'Option 1', label: 'パータン１：商品ページも、販売金額も変更したい' },
                {
                  value: 'Option 2',
                  label: 'パータン2：商品ページを変更したい、販売金額を変更したくない',
                },
                {
                  value: 'Option 3',
                  label: 'パータン3：商品ページを変更したくない、販売金額を変更したい',
                },
              ]}
              isRequired={true}
            />
          </CardContent>
        </Card>
        <div className="flex justify-center my-6">
          <Button size="lg" type="button">
            実行
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};
export default page;
