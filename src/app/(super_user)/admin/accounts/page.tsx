'use client';
import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import { Table } from '@/component/common/Table';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import useUserListAPI from './api/useUserListAPI';

const AccountManagePage = () => {
  const { data: list, error, isLoading, mutate } = useUserListAPI(1, 99);
  return (
    <>
      <Card>
        <CardHeader
          title="ユーザー管理"
          buttonGroup={
            <>
              <Button prefixIcon={IconPlus} color="secondary" size="md">
                作成
              </Button>
            </>
          }
        />
        <CardContent>
          <Table.Container>
            <Table.Head>
              <Table.Row>
                <Table.Th>ユーザー名</Table.Th>
                <Table.Th>メールアドレス</Table.Th>
                <Table.Th>企業名</Table.Th>
                <Table.Th>権限</Table.Th>
                <Table.Th>登録日</Table.Th>
                <Table.Th>削除</Table.Th>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {list?.map((item: any, index: number) => (
                <Table.Row key={item.id}>
                  <Table.Td>{item.username}</Table.Td>
                  <Table.Td>{item.email}</Table.Td>
                  <Table.Td>{item.company_name}</Table.Td>
                  <Table.Td>{item.role_name}</Table.Td>
                  <Table.Td>{item.create_datetime}</Table.Td>
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

export default AccountManagePage;
