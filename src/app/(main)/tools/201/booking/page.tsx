'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import { Table } from '@/component/common/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/component/common/Tabs';
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

              <TabsContent value="A"></TabsContent>

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
