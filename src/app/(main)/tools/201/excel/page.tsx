'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent } from '@/component/common/Card';
import RadioBox from '@/component/common/RadioBox';
import SelectBox from '@/component/common/SelectBox';
const page = () => {
  return (
    <>
      <Card className="max-w-[600px] mx-auto mt-[80px]">
        <CardContent className="pt-6 leading-[2rem]">
          <form>
            <RadioBox.Group
              label="操作方法"
              name="radioboxValue"
              direction="horizontal"
              className="flex justify-around"
            >
              <RadioBox.Option value="1">画面で</RadioBox.Option>
              <RadioBox.Option value="2">Excelで</RadioBox.Option>
            </RadioBox.Group>

            <RadioBox.Group
              label="対象商品"
              name="radioboxValue"
              direction="horizontal"
              className="flex justify-around"
            >
              <RadioBox.Option value="1">販売中</RadioBox.Option>
              <RadioBox.Option value="2">在庫含め</RadioBox.Option>
            </RadioBox.Group>

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
            />
            <Button className="mt-[2rem] mx-auto" type="button">
              実行
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};
export default page;
