'use client';
import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import { Table } from '@/component/common/Table';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import useStaffListAPI from './api/useStaffListAPI';
import useStaffMainteAPI from './api/useStaffMainteAPI';
import { confirm } from 'material-ui-confirm';
const page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: list, error, isLoading, mutate } = useStaffListAPI(session?.user.company_id);
  const { deleteStaff } = useStaffMainteAPI();

  const handleDelete = async (username: string) => {
    try {
      await confirm({
        title: `削除`,
        description: '削除します。よろしいでしょうか?',
      });

      const resData = await deleteStaff(username);
      mutate();
      toast.success(resData.detail);
    } catch (e) {
      toast.error('エラーが発生しました。もう一度お試しください。');
    }
  };

  return (
    <>
      <Card>
        <CardHeader
          title={`${session?.user.company_name ? session.user.company_name : ''}スタッフ一覧`}
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
                <Table.Row key={item.id}>
                  <Table.Td>{index + 1}</Table.Td>
                  <Table.Td>{item.username}</Table.Td>
                  <Table.Td>{item.email}</Table.Td>
                  <Table.Td>{item.company_name}</Table.Td>
                  {item.username !== session?.user.username ? (
                    <Table.Button onClick={() => handleDelete(item.username)}>
                      <IconTrash size={20} />
                    </Table.Button>
                  ) : (
                    <Table.Td></Table.Td>
                  )}
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
