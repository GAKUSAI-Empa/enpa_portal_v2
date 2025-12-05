'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/component/common/Card';
import RadioBox from '@/component/common/RadioBox';
import SelectBox from '@/component/common/SelectBox';
import { Tabs, TabsContent } from '@/component/common/Tabs';
import { TextBox } from '@/component/common/TextBox';
import { useState } from 'react';

const FormRow = ({ label, children }: any) => {
  return (
    <div className="grid grid-cols-12 gap-4 items-start mb-6">
      <div className="col-span-2 text-sm text-gray-600 pt-2">{label}</div>
      <div className="col-span-10">{children}</div>
    </div>
  );
};

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Tabs defaultTab="tab1">
      <TabsContent value="tab1">
        <Card>
          <CardHeader title="" />
          <CardContent>
            {/* キーワード */}
            <FormRow label="キーワード">
              <TextBox id="keyword" name="keyword" placeholder="" direction="vertical" label="" />
            </FormRow>

            {/* 表示件数 */}
            <FormRow label="表示件数">
              <TextBox
                id="limit"
                name="limit"
                placeholder="最大3000件"
                direction="vertical"
                label=""
              />
            </FormRow>

            {/* キャリア */}
            <FormRow label="キャリア">
              <RadioBox.Group direction="horizontal" name="radioboxValue">
                <RadioBox.Option value="1">PC</RadioBox.Option>
                <RadioBox.Option value="2">モバイル</RadioBox.Option>
              </RadioBox.Group>
            </FormRow>

            {/* ソート */}
            <FormRow label="ソート">
              <SelectBox
                id="selectboxValue"
                name="selectboxValue"
                width="full"
                options={[
                  { value: '', label: '標準' },
                  { value: 'Option 1', label: 'レビュー件数順' },
                  { value: 'Option 2', label: 'レビュー平均点順' },
                  { value: 'Option 3', label: '価格が安い順' },
                  { value: 'Option 4', label: '価格が高い順' },
                  { value: 'Option 5', label: '更新日時が新しい順' },
                ]}
                isRequired={true}
              />
            </FormRow>

            {/* 商品価格 */}
            <FormRow label="商品価格">
              <div className="grid grid-cols-2 gap-4">
                <TextBox id="price_from" name="price_from" placeholder="¥" width="full" label="" />

                <TextBox id="price_to" name="price_to" placeholder="¥" width="full" label="" />
              </div>
            </FormRow>

            {/* 販売可能 */}
            <FormRow label="販売可能">
              <RadioBox.Group direction="horizontal" name="sellable">
                <RadioBox.Option value="1">すべての商品</RadioBox.Option>
                <RadioBox.Option value="2">販売可能な商品のみ</RadioBox.Option>
              </RadioBox.Group>
            </FormRow>

            {/* ジャンルID */}
            <FormRow label="ジャンルID">
              <TextBox id="genre_id" name="genre_id" placeholder="" direction="vertical" label="" />
            </FormRow>

            {/* タグID */}
            <FormRow label="タグID">
              <TextBox id="tag_id" name="tag_id" placeholder="" direction="vertical" label="" />
            </FormRow>

            {/* アフィリエイト率 */}
            <FormRow label="アフィリエイト率">
              <div className="grid grid-cols-2 gap-4">
                <TextBox
                  id="affiliate_from"
                  name="affiliate_from"
                  placeholder="%"
                  width="full"
                  label=""
                />
                <TextBox
                  id="affiliate_to"
                  name="affiliate_to"
                  placeholder="%"
                  width="full"
                  label=""
                />
              </div>
            </FormRow>

            {/* あす楽フラグ */}
            <FormRow label="あす楽フラグ">
              <RadioBox.Group direction="horizontal" name="asuraku">
                <RadioBox.Option value="1">すべての商品</RadioBox.Option>
                <RadioBox.Option value="2">あす楽対応可能な商品のみ</RadioBox.Option>
              </RadioBox.Group>
            </FormRow>

            {/* ポイント倍付けフラグ */}
            <FormRow label="ポイント倍付けフラグ">
              <RadioBox.Group direction="horizontal" name="point">
                <RadioBox.Option value="1">すべての商品</RadioBox.Option>
                <RadioBox.Option value="2">ポイント倍付け可能な商品のみ</RadioBox.Option>
              </RadioBox.Group>
            </FormRow>

            {/* 送料フラグ */}
            <FormRow label="送料フラグ">
              <RadioBox.Group direction="horizontal" name="shipping">
                <RadioBox.Option value="1">すべての商品</RadioBox.Option>
                <RadioBox.Option value="2">送料無料の商品のみ</RadioBox.Option>
              </RadioBox.Group>
            </FormRow>

            {/* ギフト対応フラグ */}
            <FormRow label="ギフト対応フラグ">
              <RadioBox.Group direction="horizontal" name="gift">
                <RadioBox.Option value="1">すべての商品</RadioBox.Option>
                <RadioBox.Option value="2">ギフト対応可能な商品のみ</RadioBox.Option>
              </RadioBox.Group>
            </FormRow>

            {/* レビューありフラグ */}
            <FormRow label="レビューありフラグ">
              <RadioBox.Group direction="horizontal" name="review">
                <RadioBox.Option value="1">すべての商品</RadioBox.Option>
                <RadioBox.Option value="2">レビューがある商品のみ</RadioBox.Option>
              </RadioBox.Group>
            </FormRow>

            {/* 配送日指定対応フラグ */}
            <FormRow label="配送日指定対応フラグ">
              <RadioBox.Group direction="horizontal" name="date_delivery">
                <RadioBox.Option value="1">すべての商品</RadioBox.Option>
                <RadioBox.Option value="2">配送日指定対応可能な商品のみ</RadioBox.Option>
              </RadioBox.Group>
            </FormRow>

            {/* 海外配送フラグ */}
            <FormRow label="海外配送フラグ">
              <RadioBox.Group direction="horizontal" name="overseas">
                <RadioBox.Option value="1">すべての商品</RadioBox.Option>
                <RadioBox.Option value="2">海外配送対応可能な商品のみ</RadioBox.Option>
              </RadioBox.Group>
            </FormRow>

            {/* 購入種別 */}
            <FormRow label="購入種別">
              <RadioBox.Group direction="horizontal" name="buy_type">
                <RadioBox.Option value="1">すべての商品</RadioBox.Option>
                <RadioBox.Option value="2">中古品</RadioBox.Option>
                <RadioBox.Option value="3">予約商品</RadioBox.Option>
              </RadioBox.Group>
            </FormRow>
          </CardContent>

          <CardFooter className="flex justify-center py-6">
            <Button type="submit" className="bg-red-600 text-white w-32">
              実行
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default Page;
