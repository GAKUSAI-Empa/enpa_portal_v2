'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import LoadingData from '@/component/common/LoadingData';
import Pagination from '@/component/common/pagination';
import { Table } from '@/component/common/Table';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import useUserListAPI from './api/useUserListAPI';

const AccountManagePage = () => {
  const [filters, setFilters] = useState({
    page: 1,
    page_size: 10,
  });

  const { data: list, total, isLoading } = useUserListAPI(filters.page, filters.page_size);

  const totalPages = Math.ceil(total / filters.page_size);

  const nextPage = () =>
    setFilters((prev) => ({ ...prev, page: Math.min(prev.page + 1, totalPages) }));

  const prevPage = () => setFilters((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }));

  return (
    <Card>
      <CardHeader
        title="ユーザー管理"
        buttonGroup={
          <Button prefixIcon={IconPlus} color="secondary" size="md">
            作成
          </Button>
        }
      />
      <CardContent>
        {/* Table */}
        <Table.Container>
          <Table.Head>
            <Table.Row>
              <Table.Th>ユーザー名</Table.Th>
              <Table.Th>メールアドレス</Table.Th>
              <Table.Th>企業名</Table.Th>
              <Table.Th>権限</Table.Th>
              <Table.Th>登録日</Table.Th>
              <Table.Th width="w-24">削除</Table.Th>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {!isLoading &&
              list?.map((item: any) => (
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
        {isLoading && <LoadingData />}

        {/* Pagination */}
        <Pagination
          page={filters.page}
          totalPages={totalPages}
          handleClickPrevPage={prevPage}
          handleClickNextPage={nextPage}
        />
      </CardContent>
    </Card>
  );
};

export default AccountManagePage;
