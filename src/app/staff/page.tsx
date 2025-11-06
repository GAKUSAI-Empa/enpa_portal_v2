'use client';
import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import { Table } from '@/component/common/Table';
import { IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const page = () => {
  const router = useRouter();

  return (
    <>
      <Card>
        <CardHeader
          title="エンパタウン株式会社 スタッフ一覧"
          buttonGroup={
            <Button
              onClick={() => router.push('/staff/create')}
              prefixIcon={IconPlus}
              color="primary"
              size="sm"
            >
              スタッフの追加
            </Button>
          }
        />
        <CardContent>
          <Table.Container>
            <Table.Head>
              <Table.Row>
                <Table.Th width="w-16"></Table.Th>
                <Table.Th width="w-40">ユーザー名 </Table.Th>
                <Table.Th width="w-40">メールアドレス </Table.Th>
                <Table.Th width="w-40">ChatWorkルームID</Table.Th>
                <Table.Th width="w-40">企業名</Table.Th>
                <Table.Th width="w-16">削除</Table.Th>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Td>1</Table.Td>
                <Table.Td>AB123</Table.Td>
                <Table.Td>https://example.com/image.png</Table.Td>
                <Table.Td>id_string</Table.Td>
                <Table.Td>id_string</Table.Td>
                <Table.Td>
                  <button className="text-red-500 hover:text-red-700">削除</button>
                </Table.Td>
              </Table.Row>
              {/* More rows */}
            </Table.Body>
          </Table.Container>
        </CardContent>
      </Card>
    </>
  );
};

export default page;
