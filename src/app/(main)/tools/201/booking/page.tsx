'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import SelectBox from '@/component/common/SelectBox';
import { Table } from '@/component/common/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/component/common/Tabs';
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
          <CardHeader title="編集内容記入" />

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
                <form>
                  <table className="w-full">
                    <tbody>
                      <tr className="w-full">
                        <td className="w-1/2">
                          <TextBox
                            id="textboxValue"
                            name="textboxValue"
                            isRequired={true}
                            label={'商品名に挿入したい文言'}
                            placeholder="Text box sample"
                            direction="vertical"
                            className="w-[34rem]"
                          />
                        </td>
                        <td className="w-1/2">
                          <div className="flex flex-start gap-20">
                            <TextBox
                              label="PCの画像幅"
                              id="sp_width"
                              name="sp_width"
                              isRequired
                              width="sm"
                              direction="vertical"
                              suffix={
                                <SelectBox
                                  id="sp_unit"
                                  name="sp_unit"
                                  isRequired
                                  classNameParent="mb-0 w-10"
                                  options={[
                                    { value: 'px', label: 'px' },
                                    { value: '%', label: '%' },
                                  ]}
                                />
                              }
                            />

                            <TextBox
                              label="スマホの画像幅"
                              id="sp_width"
                              name="sp_width"
                              isRequired
                              width="sm"
                              direction="vertical"
                              suffix={
                                <SelectBox
                                  id="sp_unit"
                                  name="sp_unit"
                                  isRequired
                                  classNameParent="mb-0 w-10"
                                  options={[
                                    { value: 'px', label: 'px' },
                                    { value: '%', label: '%' },
                                  ]}
                                />
                              }
                            />
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td className="w-1/2">
                          <SelectBox
                            id="selectBoxValue"
                            label="販売期間更新方法指定："
                            name="selectBoxValue"
                            width="full"
                            classNameParent="w-[34rem]"
                            value=""
                            options={[
                              {
                                value: '0',
                                label: '０：現在商品ページに設定されている販売期間を削除する',
                              },
                              { value: '1', label: '１：販売期間をツールで更新する' },
                              { value: '2', label: '２：販売期間をツールで更新しない' },
                            ]}
                            isRequired={true}
                          />
                        </td>
                        <td className="w-1/2">
                          <SelectBox
                            id="selectBoxValue"
                            label="復元時の価格更新の指定："
                            name="selectBoxValue"
                            width="full"
                            classNameParent="w-[34rem]"
                            value=""
                            options={[
                              { value: '1', label: '0:復元時にをツールで更新する' },
                              { value: '2', label: 'banana' },
                              { value: '3', label: 'orange' },
                            ]}
                            isRequired={true}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>

                <div className="flex flex-col">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <TextBox
                      id="saleStartDate"
                      name="saleStartDate"
                      type="datetime-local"
                      direction="horizontal"
                      placeholder="YYYY/MM/DD HH:mm"
                      label="セール開始日時"
                      width="sm"
                    />
                    <TextBox
                      id="saleEndDate"
                      name="saleEndDate"
                      type="datetime-local"
                      placeholder="YYYY/MM/DD HH:mm"
                      direction="horizontal"
                      label="修了日時（共通）"
                      width="sm"
                    />
                  </div>
                </div>
                <TextBox
                  id="textboxValue"
                  name="textboxValue"
                  isRequired={true}
                  label={'二重価格画像を保存したフォルダ'}
                  placeholder="https://image.rakuten.co.jp/sample/cabinet/campaign/supersale/ss_b"
                  direction="vertical"
                  width="lg"
                />
                <TextBox
                  id="textboxValue"
                  name="textboxValue"
                  isRequired={true}
                  label={'全ての商品ページに挿入する共通画像'}
                  placeholder="Text box sample"
                  direction="vertical"
                  width="lg"
                />
                <TextBox
                  id="textboxValue"
                  name="textboxValue"
                  isRequired={true}
                  label={'お気に入り登録案内画像URL'}
                  placeholder="Text box sample"
                  direction="vertical"
                  width="lg"
                />
                <TextBox
                  id="textboxValue"
                  name="textboxValue"
                  isRequired={true}
                  label={'コピーページ案内画像URL'}
                  placeholder="Text box sample"
                  direction="vertical"
                  width="lg"
                />
                <TextBox
                  id="textboxValue"
                  name="textboxValue"
                  isRequired={true}
                  label={'PC用販売説明文'}
                  placeholder="Text box sample"
                  direction="vertical"
                  width="lg"
                />
                <TextBox
                  id="textboxValue"
                  name="textboxValue"
                  isRequired={true}
                  label={'スマートフォン用販売説明文'}
                  placeholder="Text box sample"
                  direction="vertical"
                  width="lg"
                />
              </TabsContent>

              <TabsContent value="B"></TabsContent>

              <TabsContent value="C"></TabsContent>

              <TabsContent value="D"></TabsContent>

              <TabsContent value="E"></TabsContent>

              <TabsContent value="F"></TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default page;
