'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import SelectBox from '@/component/common/SelectBox';
import { Table } from '@/component/common/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/component/common/Tabs';
import { TextArea } from '@/component/common/TextArea';
import { TextBox } from '@/component/common/TextBox';
import { useState } from 'react';
const page = () => {
  const [subTab, setSubTab] = useState('A');

  return (
    <Tabs defaultTab="tab1">
      <TabsList>
        <TabsTrigger value="tab1">編集内容対応表</TabsTrigger>
        <TabsTrigger value="tab2">編集内容記入</TabsTrigger>
      </TabsList>

      {/* ========== TAB 1 ========== */}
      <TabsContent value="tab1">
        <Card>
          <CardHeader title="" />
          <CardContent>
            <Table.Container>
              <Table.Head>
                <Table.Row>
                  <Table.Th width="w-40">商品管理番号</Table.Th>
                  <Table.Th width="w-16">編集内容</Table.Th>
                  <Table.Th width="w-48">お気に入り登録URL</Table.Th>
                  <Table.Th width="w-32">コピーページ商品管理番号</Table.Th>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                <Table.InputCell name="" value="" placeholder="beauty" />
                <Table.SelectBox value="">
                  <Table.Option value="A">A</Table.Option>
                  <Table.Option value="B">B</Table.Option>
                  <Table.Option value="C">C</Table.Option>
                  <Table.Option value="D">D</Table.Option>
                  <Table.Option value="E">E</Table.Option>
                  <Table.Option value="F">F</Table.Option>
                </Table.SelectBox>
                <Table.InputCell name="" value="" placeholder="https://sample.favorite.url" />
                <Table.InputCell name="" value="" placeholder="" />
              </Table.Body>
            </Table.Container>
          </CardContent>
        </Card>

        <div className="flex justify-center my-6">
          <Button size="lg" type="button">
            チェック
          </Button>
        </div>
      </TabsContent>

      {/* ========== TAB 2 ========== */}
      <TabsContent value="tab2">
        <Card>
          <CardHeader title="" />

          <CardContent>
            {/* TAB CON */}
            <Tabs defaultTab={subTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="A">編集内容記入A</TabsTrigger>
                <TabsTrigger value="B">編集内容記入B</TabsTrigger>
                <TabsTrigger value="C">編集内容記入C</TabsTrigger>
                <TabsTrigger value="D">編集内容記入D</TabsTrigger>
                <TabsTrigger value="E">編集内容記入E</TabsTrigger>
                <TabsTrigger value="F">編集内容記入F</TabsTrigger>
              </TabsList>

              <TabsContent value="A">
                {/* ===== HÀNG 1 ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 商品名 */}
                  <TextBox
                    id="textboxValue"
                    name="textboxValue"
                    label="商品名に挿入したい文言"
                    placeholder="Text box sample"
                    direction="vertical"
                    width="full"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextBox
                      label="PCの画像幅"
                      id="pc_width"
                      name="pc_width"
                      width="full"
                      direction="vertical"
                      suffix={
                        <SelectBox
                          id="pc_unit"
                          name="pc_unit"
                          width="sm"
                          classNameParent="mb-0"
                          options={[
                            { value: 'px', label: 'px' },
                            { value: '%', label: '%' },
                          ]}
                        />
                      }
                    />

                    <TextBox
                      label="スマートフォンの画像幅"
                      id="sp_width"
                      name="sp_width"
                      width="full"
                      direction="vertical"
                      suffix={
                        <SelectBox
                          id="sp_unit"
                          name="sp_unit"
                          width="sm"
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

                {/* ===== HÀNG 2 ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <SelectBox
                    id="selectBoxValue"
                    label="販売期間更新方法指定："
                    name="selectBoxValue"
                    width="full"
                    value=""
                    options={[
                      { value: '1', label: '1:販売期間をツールで更新する' },
                      { value: '2', label: '２：販売期間をツールで更新しない' },
                    ]}
                    isRequired={true}
                  />

                  <SelectBox
                    id="restorePrice"
                    label="復元時の価格更新の指定："
                    name="restorePrice"
                    width="full"
                    value=""
                    options={[
                      { value: '1', label: '0:復元時に価格の更新を行わない' },
                      { value: '2', label: '１：SALE価格対応表のセール後価格に更新' },
                    ]}
                    isRequired={true}
                  />
                </div>

                {/* ===== HÀNG 3 ===== */}
                <div className="flex gap-3 mt-6">
                  <TextBox
                    id="saleStartDate"
                    name="saleStartDate"
                    type="datetime-local"
                    direction="vertical"
                    label="開始日時"
                    width="lg"
                  />

                  <TextBox
                    id="saleEndDate"
                    name="saleEndDate"
                    type="datetime-local"
                    direction="vertical"
                    label="終了日時"
                    width="lg"
                  />
                </div>

                {/* ===== URL ===== */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <TextBox
                    id="doublePriceFolder"
                    name="doublePriceFolder"
                    label="二重価格画像を保存したフォルダ"
                    placeholder="https://www.rakuten.ne.jp/gold/sample/empo/img/2nd"
                    direction="vertical"
                    width="full"
                  />

                  <TextBox
                    id="commonImage"
                    name="commonImage"
                    label="全ての商品ページに挿入する共通画像"
                    placeholder="https://image.rakuten.co.jp/sample/cabinet/sample/sample_20off.jpg"
                    direction="vertical"
                    width="full"
                  />

                  <TextBox
                    id="favoriteImage"
                    name="favoriteImage"
                    label="お気に入り登録案内画像URL"
                    placeholder="https://image.rakuten.co.jp/sample/cabinet/campaign/supersale/ss_button_recommend.jpg"
                    direction="vertical"
                    width="full"
                  />

                  <TextBox
                    id="copyImage"
                    name="copyImage"
                    label="コピーページ案内画像URL"
                    placeholder="https://image.rakuten.co.jp/sample/cabinet/campaign/supersale/ss_button_buy.jpg"
                    direction="vertical"
                    width="full"
                  />
                </div>

                {/* ===== DESCRIPTION ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <TextArea
                    id="pcDesc"
                    name="pcDesc"
                    label="PC用販売説明文"
                    placeholder="<!--二重価格画像組み込みタグ-->..."
                    direction="vertical"
                    width="full"
                  />

                  <TextArea
                    id="spDesc"
                    name="spDesc"
                    label="スマートフォン用販売説明文"
                    placeholder="<!--二重価格画像組み込みタグ-->..."
                    direction="vertical"
                    width="full"
                  />
                </div>

                <div className="flex justify-center">
                  <Button type="submit">チェック</Button>
                </div>
              </TabsContent>

              <TabsContent value="B">
                {/* ===== HÀNG 1 ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 商品名 */}
                  <TextBox
                    id="textboxValue"
                    name="textboxValue"
                    label="商品名に挿入したい文言"
                    placeholder="Text box sample"
                    direction="vertical"
                    width="full"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextBox
                      label="PCの画像幅"
                      id="pc_width"
                      name="pc_width"
                      width="full"
                      direction="vertical"
                      suffix={
                        <SelectBox
                          id="pc_unit"
                          name="pc_unit"
                          width="sm"
                          classNameParent="mb-0"
                          options={[
                            { value: 'px', label: 'px' },
                            { value: '%', label: '%' },
                          ]}
                        />
                      }
                    />

                    <TextBox
                      label="スマートフォンの画像幅"
                      id="sp_width"
                      name="sp_width"
                      width="full"
                      direction="vertical"
                      suffix={
                        <SelectBox
                          id="sp_unit"
                          name="sp_unit"
                          width="sm"
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

                {/* ===== HÀNG 2 ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <SelectBox
                    id="selectBoxValue"
                    label="販売期間更新方法指定："
                    name="selectBoxValue"
                    width="full"
                    value=""
                    options={[
                      { value: '1', label: '1:販売期間をツールで更新する' },
                      { value: '2', label: '２：販売期間をツールで更新しない' },
                    ]}
                    isRequired={true}
                  />

                  <SelectBox
                    id="restorePrice"
                    label="復元時の価格更新の指定："
                    name="restorePrice"
                    width="full"
                    value=""
                    options={[
                      { value: '1', label: '0:復元時に価格の更新を行わない' },
                      { value: '2', label: '１：SALE価格対応表のセール後価格に更新' },
                    ]}
                    isRequired={true}
                  />
                </div>

                {/* ===== HÀNG 3 ===== */}
                <div className="flex gap-3 mt-6">
                  <TextBox
                    id="saleStartDate"
                    name="saleStartDate"
                    type="datetime-local"
                    direction="vertical"
                    label="開始日時"
                    width="lg"
                  />

                  <TextBox
                    id="saleEndDate"
                    name="saleEndDate"
                    type="datetime-local"
                    direction="vertical"
                    label="終了日時"
                    width="lg"
                  />
                </div>

                {/* ===== URL ===== */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <TextBox
                    id="doublePriceFolder"
                    name="doublePriceFolder"
                    label="二重価格画像を保存したフォルダ"
                    placeholder="https://www.rakuten.ne.jp/gold/sample/empo/img/2nd"
                    direction="vertical"
                    width="full"
                  />

                  <TextBox
                    id="commonImage"
                    name="commonImage"
                    label="全ての商品ページに挿入する共通画像"
                    placeholder="https://image.rakuten.co.jp/sample/cabinet/sample/sample_20off.jpg"
                    direction="vertical"
                    width="full"
                  />

                  <TextBox
                    id="favoriteImage"
                    name="favoriteImage"
                    label="お気に入り登録案内画像URL"
                    placeholder="https://image.rakuten.co.jp/sample/cabinet/campaign/supersale/ss_button_recommend.jpg"
                    direction="vertical"
                    width="full"
                  />

                  <TextBox
                    id="copyImage"
                    name="copyImage"
                    label="コピーページ案内画像URL"
                    placeholder="https://image.rakuten.co.jp/sample/cabinet/campaign/supersale/ss_button_buy.jpg"
                    direction="vertical"
                    width="full"
                  />
                </div>

                {/* ===== DESCRIPTION ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <TextArea
                    id="pcDesc"
                    name="pcDesc"
                    label="PC用販売説明文"
                    placeholder="<!--二重価格画像組み込みタグ-->..."
                    direction="vertical"
                    width="full"
                  />

                  <TextArea
                    id="spDesc"
                    name="spDesc"
                    label="スマートフォン用販売説明文"
                    placeholder="<!--二重価格画像組み込みタグ-->..."
                    direction="vertical"
                    width="full"
                  />
                </div>

                <div className="flex justify-center">
                  <Button type="submit">チェック</Button>
                </div>
              </TabsContent>

              <TabsContent value="C">
                {/* ===== HÀNG 1 ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 商品名 */}
                  <TextBox
                    id="textboxValue"
                    name="textboxValue"
                    label="商品名に挿入したい文言"
                    placeholder="Text box sample"
                    direction="vertical"
                    width="full"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextBox
                      label="PCの画像幅"
                      id="pc_width"
                      name="pc_width"
                      width="full"
                      direction="vertical"
                      suffix={
                        <SelectBox
                          id="pc_unit"
                          name="pc_unit"
                          width="sm"
                          classNameParent="mb-0"
                          options={[
                            { value: 'px', label: 'px' },
                            { value: '%', label: '%' },
                          ]}
                        />
                      }
                    />

                    <TextBox
                      label="スマートフォンの画像幅"
                      id="sp_width"
                      name="sp_width"
                      width="full"
                      direction="vertical"
                      suffix={
                        <SelectBox
                          id="sp_unit"
                          name="sp_unit"
                          width="sm"
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

                {/* ===== HÀNG 2 ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <SelectBox
                    id="selectBoxValue"
                    label="販売期間更新方法指定："
                    name="selectBoxValue"
                    width="full"
                    value=""
                    options={[
                      { value: '1', label: '1:販売期間をツールで更新する' },
                      { value: '2', label: '２：販売期間をツールで更新しない' },
                    ]}
                    isRequired={true}
                  />

                  <SelectBox
                    id="restorePrice"
                    label="復元時の価格更新の指定："
                    name="restorePrice"
                    width="full"
                    value=""
                    options={[
                      { value: '1', label: '0:復元時に価格の更新を行わない' },
                      { value: '2', label: '１：SALE価格対応表のセール後価格に更新' },
                    ]}
                    isRequired={true}
                  />
                </div>

                {/* ===== HÀNG 3 ===== */}
                <div className="flex gap-3 mt-6">
                  <TextBox
                    id="saleStartDate"
                    name="saleStartDate"
                    type="datetime-local"
                    direction="vertical"
                    label="開始日時"
                    width="lg"
                  />

                  <TextBox
                    id="saleEndDate"
                    name="saleEndDate"
                    type="datetime-local"
                    direction="vertical"
                    label="終了日時"
                    width="lg"
                  />
                </div>

                {/* ===== URL ===== */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <TextBox
                    id="doublePriceFolder"
                    name="doublePriceFolder"
                    label="二重価格画像を保存したフォルダ"
                    placeholder="https://www.rakuten.ne.jp/gold/sample/empo/img/2nd"
                    direction="vertical"
                    width="full"
                  />

                  <TextBox
                    id="commonImage"
                    name="commonImage"
                    label="全ての商品ページに挿入する共通画像"
                    placeholder="https://image.rakuten.co.jp/sample/cabinet/sample/sample_20off.jpg"
                    direction="vertical"
                    width="full"
                  />

                  <TextBox
                    id="favoriteImage"
                    name="favoriteImage"
                    label="お気に入り登録案内画像URL"
                    placeholder="https://image.rakuten.co.jp/sample/cabinet/campaign/supersale/ss_button_recommend.jpg"
                    direction="vertical"
                    width="full"
                  />

                  <TextBox
                    id="copyImage"
                    name="copyImage"
                    label="コピーページ案内画像URL"
                    placeholder="https://image.rakuten.co.jp/sample/cabinet/campaign/supersale/ss_button_buy.jpg"
                    direction="vertical"
                    width="full"
                  />
                </div>

                {/* ===== DESCRIPTION ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <TextArea
                    id="pcDesc"
                    name="pcDesc"
                    label="PC用販売説明文"
                    placeholder="<!--二重価格画像組み込みタグ-->..."
                    direction="vertical"
                    width="full"
                  />

                  <TextArea
                    id="spDesc"
                    name="spDesc"
                    label="スマートフォン用販売説明文"
                    placeholder="<!--二重価格画像組み込みタグ-->..."
                    direction="vertical"
                    width="full"
                  />
                </div>

                <div className="flex justify-center">
                  <Button type="submit">チェック</Button>
                </div>
              </TabsContent>

              <TabsContent value="D">
                {/* ===== HÀNG 1 ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 商品名 */}
                  <TextBox
                    id="textboxValue"
                    name="textboxValue"
                    label="商品名に挿入したい文言"
                    placeholder="Text box sample"
                    direction="vertical"
                    width="full"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextBox
                      label="PCの画像幅"
                      id="pc_width"
                      name="pc_width"
                      width="full"
                      direction="vertical"
                      suffix={
                        <SelectBox
                          id="pc_unit"
                          name="pc_unit"
                          width="sm"
                          classNameParent="mb-0"
                          options={[
                            { value: 'px', label: 'px' },
                            { value: '%', label: '%' },
                          ]}
                        />
                      }
                    />

                    <TextBox
                      label="スマートフォンの画像幅"
                      id="sp_width"
                      name="sp_width"
                      width="full"
                      direction="vertical"
                      suffix={
                        <SelectBox
                          id="sp_unit"
                          name="sp_unit"
                          width="sm"
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

                {/* ===== HÀNG 2 ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <SelectBox
                    id="selectBoxValue"
                    label="販売期間更新方法指定："
                    name="selectBoxValue"
                    width="full"
                    value=""
                    options={[
                      { value: '1', label: '1:販売期間をツールで更新する' },
                      { value: '2', label: '２：販売期間をツールで更新しない' },
                    ]}
                    isRequired={true}
                  />

                  <SelectBox
                    id="restorePrice"
                    label="復元時の価格更新の指定："
                    name="restorePrice"
                    width="full"
                    value=""
                    options={[
                      { value: '1', label: '0:復元時に価格の更新を行わない' },
                      { value: '2', label: '１：SALE価格対応表のセール後価格に更新' },
                    ]}
                    isRequired={true}
                  />
                </div>

                {/* ===== HÀNG 3 ===== */}
                <div className="flex gap-3 mt-6">
                  <TextBox
                    id="saleStartDate"
                    name="saleStartDate"
                    type="datetime-local"
                    direction="vertical"
                    label="開始日時"
                    width="lg"
                  />

                  <TextBox
                    id="saleEndDate"
                    name="saleEndDate"
                    type="datetime-local"
                    direction="vertical"
                    label="終了日時"
                    width="lg"
                  />
                </div>

                {/* ===== URL ===== */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <TextBox
                    id="doublePriceFolder"
                    name="doublePriceFolder"
                    label="二重価格画像を保存したフォルダ"
                    placeholder="https://www.rakuten.ne.jp/gold/sample/empo/img/2nd"
                    direction="vertical"
                    width="full"
                  />

                  <TextBox
                    id="commonImage"
                    name="commonImage"
                    label="全ての商品ページに挿入する共通画像"
                    placeholder="https://image.rakuten.co.jp/sample/cabinet/sample/sample_20off.jpg"
                    direction="vertical"
                    width="full"
                  />

                  <TextBox
                    id="favoriteImage"
                    name="favoriteImage"
                    label="お気に入り登録案内画像URL"
                    placeholder="https://image.rakuten.co.jp/sample/cabinet/campaign/supersale/ss_button_recommend.jpg"
                    direction="vertical"
                    width="full"
                  />

                  <TextBox
                    id="copyImage"
                    name="copyImage"
                    label="コピーページ案内画像URL"
                    placeholder="https://image.rakuten.co.jp/sample/cabinet/campaign/supersale/ss_button_buy.jpg"
                    direction="vertical"
                    width="full"
                  />
                </div>

                {/* ===== DESCRIPTION ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <TextArea
                    id="pcDesc"
                    name="pcDesc"
                    label="PC用販売説明文"
                    placeholder="<!--二重価格画像組み込みタグ-->..."
                    direction="vertical"
                    width="full"
                  />

                  <TextArea
                    id="spDesc"
                    name="spDesc"
                    label="スマートフォン用販売説明文"
                    placeholder="<!--二重価格画像組み込みタグ-->..."
                    direction="vertical"
                    width="full"
                  />
                </div>

                <div className="flex justify-center">
                  <Button type="submit">チェック</Button>
                </div>
              </TabsContent>

              <TabsContent value="E">
                {/* ===== HÀNG 1 ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 商品名 */}
                  <TextBox
                    id="textboxValue"
                    name="textboxValue"
                    label="商品名に挿入したい文言"
                    placeholder="Text box sample"
                    direction="vertical"
                    width="full"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextBox
                      label="PCの画像幅"
                      id="pc_width"
                      name="pc_width"
                      width="full"
                      direction="vertical"
                      suffix={
                        <SelectBox
                          id="pc_unit"
                          name="pc_unit"
                          width="sm"
                          classNameParent="mb-0"
                          options={[
                            { value: 'px', label: 'px' },
                            { value: '%', label: '%' },
                          ]}
                        />
                      }
                    />

                    <TextBox
                      label="スマートフォンの画像幅"
                      id="sp_width"
                      name="sp_width"
                      width="full"
                      direction="vertical"
                      suffix={
                        <SelectBox
                          id="sp_unit"
                          name="sp_unit"
                          width="sm"
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

                {/* ===== HÀNG 2 ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <SelectBox
                    id="selectBoxValue"
                    label="販売期間更新方法指定："
                    name="selectBoxValue"
                    width="full"
                    value=""
                    options={[
                      { value: '1', label: '1:販売期間をツールで更新する' },
                      { value: '2', label: '２：販売期間をツールで更新しない' },
                    ]}
                    isRequired={true}
                  />

                  <SelectBox
                    id="restorePrice"
                    label="復元時の価格更新の指定："
                    name="restorePrice"
                    width="full"
                    value=""
                    options={[
                      { value: '1', label: '0:復元時に価格の更新を行わない' },
                      { value: '2', label: '１：SALE価格対応表のセール後価格に更新' },
                    ]}
                    isRequired={true}
                  />
                </div>

                {/* ===== HÀNG 3 ===== */}
                <div className="flex gap-3 mt-6">
                  <TextBox
                    id="saleStartDate"
                    name="saleStartDate"
                    type="datetime-local"
                    direction="vertical"
                    label="開始日時"
                    width="lg"
                  />

                  <TextBox
                    id="saleEndDate"
                    name="saleEndDate"
                    type="datetime-local"
                    direction="vertical"
                    label="終了日時"
                    width="lg"
                  />
                </div>

                {/* ===== URL ===== */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <TextBox
                    id="doublePriceFolder"
                    name="doublePriceFolder"
                    label="二重価格画像を保存したフォルダ"
                    placeholder="https://www.rakuten.ne.jp/gold/sample/empo/img/2nd"
                    direction="vertical"
                    width="full"
                  />

                  <TextBox
                    id="commonImage"
                    name="commonImage"
                    label="全ての商品ページに挿入する共通画像"
                    placeholder="https://image.rakuten.co.jp/sample/cabinet/sample/sample_20off.jpg"
                    direction="vertical"
                    width="full"
                  />

                  <TextBox
                    id="favoriteImage"
                    name="favoriteImage"
                    label="お気に入り登録案内画像URL"
                    placeholder="https://image.rakuten.co.jp/sample/cabinet/campaign/supersale/ss_button_recommend.jpg"
                    direction="vertical"
                    width="full"
                  />

                  <TextBox
                    id="copyImage"
                    name="copyImage"
                    label="コピーページ案内画像URL"
                    placeholder="https://image.rakuten.co.jp/sample/cabinet/campaign/supersale/ss_button_buy.jpg"
                    direction="vertical"
                    width="full"
                  />
                </div>

                {/* ===== DESCRIPTION ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <TextArea
                    id="pcDesc"
                    name="pcDesc"
                    label="PC用販売説明文"
                    placeholder="<!--二重価格画像組み込みタグ-->..."
                    direction="vertical"
                    width="full"
                  />

                  <TextArea
                    id="spDesc"
                    name="spDesc"
                    label="スマートフォン用販売説明文"
                    placeholder="<!--二重価格画像組み込みタグ-->..."
                    direction="vertical"
                    width="full"
                  />
                </div>

                <div className="flex justify-center">
                  <Button type="submit">チェック</Button>
                </div>
              </TabsContent>

              <TabsContent value="F">
                {/* ===== HÀNG 1 ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 商品名 */}
                  <TextBox
                    id="textboxValue"
                    name="textboxValue"
                    label="商品名に挿入したい文言"
                    placeholder="Text box sample"
                    direction="vertical"
                    width="full"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextBox
                      label="PCの画像幅"
                      id="pc_width"
                      name="pc_width"
                      width="full"
                      direction="vertical"
                      suffix={
                        <SelectBox
                          id="pc_unit"
                          name="pc_unit"
                          width="sm"
                          classNameParent="mb-0"
                          options={[
                            { value: 'px', label: 'px' },
                            { value: '%', label: '%' },
                          ]}
                        />
                      }
                    />

                    <TextBox
                      label="スマートフォンの画像幅"
                      id="sp_width"
                      name="sp_width"
                      width="full"
                      direction="vertical"
                      suffix={
                        <SelectBox
                          id="sp_unit"
                          name="sp_unit"
                          width="sm"
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

                {/* ===== HÀNG 2 ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <SelectBox
                    id="selectBoxValue"
                    label="販売期間更新方法指定："
                    name="selectBoxValue"
                    width="full"
                    value=""
                    options={[
                      { value: '1', label: '1:販売期間をツールで更新する' },
                      { value: '2', label: '２：販売期間をツールで更新しない' },
                    ]}
                    isRequired={true}
                  />

                  <SelectBox
                    id="restorePrice"
                    label="復元時の価格更新の指定："
                    name="restorePrice"
                    width="full"
                    value=""
                    options={[
                      { value: '1', label: '0:復元時に価格の更新を行わない' },
                      { value: '2', label: '１：SALE価格対応表のセール後価格に更新' },
                    ]}
                    isRequired={true}
                  />
                </div>

                {/* ===== HÀNG 3 ===== */}
                <div className="flex gap-3 mt-6">
                  <TextBox
                    id="saleStartDate"
                    name="saleStartDate"
                    type="datetime-local"
                    direction="vertical"
                    label="開始日時"
                    width="lg"
                  />

                  <TextBox
                    id="saleEndDate"
                    name="saleEndDate"
                    type="datetime-local"
                    direction="vertical"
                    label="終了日時"
                    width="lg"
                  />
                </div>

                {/* ===== URL ===== */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <TextBox
                    id="doublePriceFolder"
                    name="doublePriceFolder"
                    label="二重価格画像を保存したフォルダ"
                    placeholder="https://www.rakuten.ne.jp/gold/sample/empo/img/2nd"
                    direction="vertical"
                    width="full"
                  />

                  <TextBox
                    id="commonImage"
                    name="commonImage"
                    label="全ての商品ページに挿入する共通画像"
                    placeholder="https://image.rakuten.co.jp/sample/cabinet/sample/sample_20off.jpg"
                    direction="vertical"
                    width="full"
                  />

                  <TextBox
                    id="favoriteImage"
                    name="favoriteImage"
                    label="お気に入り登録案内画像URL"
                    placeholder="https://image.rakuten.co.jp/sample/cabinet/campaign/supersale/ss_button_recommend.jpg"
                    direction="vertical"
                    width="full"
                  />

                  <TextBox
                    id="copyImage"
                    name="copyImage"
                    label="コピーページ案内画像URL"
                    placeholder="https://image.rakuten.co.jp/sample/cabinet/campaign/supersale/ss_button_buy.jpg"
                    direction="vertical"
                    width="full"
                  />
                </div>

                {/* ===== DESCRIPTION ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <TextArea
                    id="pcDesc"
                    name="pcDesc"
                    label="PC用販売説明文"
                    placeholder="<!--二重価格画像組み込みタグ-->..."
                    direction="vertical"
                    width="full"
                  />

                  <TextArea
                    id="spDesc"
                    name="spDesc"
                    label="スマートフォン用販売説明文"
                    placeholder="<!--二重価格画像組み込みタグ-->..."
                    direction="vertical"
                    width="full"
                  />
                </div>

                <div className="flex justify-center">
                  <Button type="submit">チェック</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default page;
