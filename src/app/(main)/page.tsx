'use client';

import SalesLineChart from '@/component/chart/SalesLineChart';
import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import PageTitle from '@/component/common/PageTitle';
import { Table } from '@/component/common/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/component/common/Tabs';
import { IconAlertTriangle, IconCalendar } from '@tabler/icons-react';

export default function Home() {
  // Ví dụ dữ liệu số tiền bán hàng mỗi ngày
  const thisMonth = [
    12000, 15000, 8000, 20000, 25000, 18000, 22000, 17000, 19000, 21000, 16000, 23000, 24000, 20000,
    18000, 15000, 17000, 19000, 22000, 21000, 20000, 18000, 16000, 15000, 17000, 20000, 22000,
    23000, 21000, 19000,
  ];

  const lastMonth = [
    10000, 14000, 9000, 18000, 20000, 15000, 21000, 16000, 17000, 19000, 15000, 20000, 21000, 19000,
    17000, 14000, 16000, 18000, 20000, 19000, 18000, 16000, 15000, 14000, 16000, 19000, 20000,
    21000, 19000, 17000,
  ];
  return (
    <>
      <PageTitle title="楽天市場日報" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
        {/* Card 1 */}
        <div className="p-4 bg-white rounded-2xl shadow flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">昨日売上</p>
              <p className="text-xl font-bold">¥1,234,567</p>
            </div>
            <IconCalendar />
          </div>
          <p className="text-green-500 text-sm mt-2">↗ +10.0% (前年同日比)</p>
        </div>

        {/* Card 2 */}
        <div className="p-4 bg-white rounded-2xl shadow flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">過去7日間売上</p>
              <p className="text-xl font-bold">¥11,111,111</p>
            </div>
            <IconCalendar />
          </div>
          <p className="text-red-500 text-sm mt-2">↘ -5.2% (前年同期比)</p>
        </div>

        {/* Card 3 */}
        <div className="p-4 bg-white rounded-2xl shadow flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">月初来売上</p>
              <p className="text-xl font-bold">¥12,345,678</p>
            </div>
            <IconCalendar />
          </div>
          <p className="text-green-500 text-sm mt-2">↗ +12.5% (前年同月比)</p>
        </div>

        {/* Card 4 */}
        <div className="p-4 bg-white rounded-2xl shadow flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">新規レビュー</p>
              <p className="text-xl font-bold">25件</p>
              <p className="text-gray-400 text-xs">(昨日)</p>
            </div>
            <IconCalendar />
          </div>
        </div>
      </div>
      <Card>
        <CardHeader
          title="売上推移 (今月 vs 先月)"
          buttonGroup={
            <>
              <Button>先月比較</Button>
              <Button>前年比較</Button>
            </>
          }
        />
        <CardContent>
          <SalesLineChart thisMonth={thisMonth} lastMonth={lastMonth} />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
        <div className="col-span-1 md:col-span-4">
          <Card className="mb-2">
            <CardHeader
              title="低評価レビューアラート"
              prefixIcon={IconAlertTriangle}
              prefixIconHexColor={'#EAB308'}
              description="早急な対応が必要なレビューがあります。"
            />
            <CardContent></CardContent>
          </Card>
        </div>
        <div className="col-span-1 md:col-span-8">
          <Card className="mb-2">
            <CardHeader
              title="低評価レビューアラート"
              description="早急な対応が必要なレビューがあります。"
            />
            <CardContent>
              <Tabs defaultTab="tab1">
                <TabsList>
                  <TabsTrigger value="tab1">月間売上TOP20</TabsTrigger>
                  <TabsTrigger value="tab2">前年売上TOP20</TabsTrigger>
                  <TabsTrigger value="tab3">新商品レポート</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1"></TabsContent>
                <TabsContent value="tab2"></TabsContent>
                <TabsContent value="tab3"></TabsContent>
              </Tabs>
              <Table.Container>
                <Table.Head>
                  <Table.Row>
                    <Table.Th width="w-24">ID</Table.Th>
                    <Table.Th width="w-24">ImageCell</Table.Th>
                    <Table.Th>InputCell</Table.Th>
                    <Table.Th>SelectBox</Table.Th>
                    <Table.Th width="w-24">Button</Table.Th>
                  </Table.Row>
                </Table.Head>
              </Table.Container>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
