'use client';
import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import { Table } from '@/component/common/Table';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useStaffAPI from './api/useStaffMainteAPI';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import useStaffListAPI from './api/useStaffListAPI';

const page = () => {
  const router = useRouter();
  const [staffs, setStaffs] = useState([]);
  const { data: session } = useSession();
  const { data: list, error, isLoading, mutate } = useStaffListAPI(session?.user.company_id);

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
                <Table.Th width="w-40">企業名</Table.Th>
                <Table.Th width="w-16">削除</Table.Th>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {list?.map((item: any, index: number) => (
                <Table.Row>
                  <Table.Td>{index}</Table.Td>
                  <Table.Td>{item.username}</Table.Td>
                  <Table.Td>{item.email}</Table.Td>
                  <Table.Td>{item.company_id}</Table.Td>
                  <Table.Button>
                    <IconTrash size={20} />
                  </Table.Button>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Container>
        </CardContent>
      </Card>
    </>
  );
};

export default page;
