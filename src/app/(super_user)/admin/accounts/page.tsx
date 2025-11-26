'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import LoadingData from '@/component/common/LoadingData';
import Pagination from '@/component/common/Pagination';
import { Table } from '@/component/common/Table';
import { TextBox } from '@/component/common/TextBox';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { confirm } from 'material-ui-confirm';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import useUserListAPI from './api/useUserListAPI';
import useUserMainteAPI from './api/useUserMainteAPI';

const AccountManagePage = () => {
  const { data: session } = useSession();
  const [filters, setFilters] = useState({
    page: 1,
    page_size: 10,
    keyword: '',
  });
  const router = useRouter();

  const {
    data: list,
    total,
    isLoading,
    mutate,
  } = useUserListAPI(filters.page, filters.page_size, filters.keyword.trim());

  const { deleteUser } = useUserMainteAPI();

  const totalPages = Math.ceil(total / filters.page_size);

  const nextPage = () =>
    setFilters((prev) => ({ ...prev, page: Math.min(prev.page + 1, totalPages) }));

  const prevPage = () => setFilters((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }));

  const handleSearch = () => {
    // Reset về trang 1 khi tìm kiếm
    setFilters((prev) => ({
      ...prev,
      page: 1,
    }));

    mutate();
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      keyword: e.target.value,
    }));
  };

  const handleDelete = async (username: string) => {
    try {
      await confirm({
        title: `削除`,
        description: '削除します。よろしいでしょうか?',
      });

      const resData = await deleteUser(username);
      mutate();
      toast.success(resData.detail);
    } catch (e) {}
  };

  return (
    <Card>
      <CardHeader
        title="ユーザー管理"
        buttonGroup={
          <Button
            prefixIcon={IconPlus}
            color="primary"
            size="md"
            onClick={() => router.push('/admin/accounts/create')}
          >
            作成
          </Button>
        }
      />
      <CardContent>
        <TextBox
          id="keyword"
          name="keyword"
          label="キーワード"
          width="lg"
          value={filters.keyword}
          onChange={handleKeywordChange}
          suffix={
            <Button size="md" onClick={handleSearch}>
              検索
            </Button>
          }
        />
        {isLoading ? (
          <LoadingData />
        ) : (
          <>
            {/* Table */}
            <Table.Container>
              <Table.Head>
                <Table.Row>
                  <Table.Th>ユーザー名</Table.Th>
                  <Table.Th width="w-80">メールアドレス</Table.Th>
                  <Table.Th>企業名</Table.Th>
                  <Table.Th>権限</Table.Th>
                  <Table.Th>登録日</Table.Th>
                  <Table.Th width="w-24">変更</Table.Th>
                  <Table.Th width="w-24">削除</Table.Th>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {list?.map((item: any) => (
                  <Table.Row key={item.id}>
                    <Table.Td>{item.username}</Table.Td>
                    <Table.Td>{item.email}</Table.Td>
                    <Table.Td>{item.company_name}</Table.Td>
                    <Table.Td>{item.role_name}</Table.Td>
                    <Table.Td>{item.create_datetime}</Table.Td>
                    <Table.Button
                      onClick={() => router.push(`/admin/accounts/edit/${item.username}`)}
                    >
                      <IconEdit size={20} />
                    </Table.Button>
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
            {/* Pagination */}
            <Pagination
              page={filters.page}
              totalPages={totalPages}
              handleClickPrevPage={prevPage}
              handleClickNextPage={nextPage}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountManagePage;
