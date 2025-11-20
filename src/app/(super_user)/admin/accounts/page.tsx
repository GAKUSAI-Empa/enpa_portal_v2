'use client';
import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import { Table } from '@/component/common/Table';
import { IconPlus } from '@tabler/icons-react';

const AccountManagePage = () => {
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
              {/* {slideList?.map((item, index) => (
                <Table.Row key={`slide-${index}`}>
                  <Table.Td>{item.id}</Table.Td>
                  <Table.ImageCell src={item.slideImg} alt="slide" />
                  <Table.InputCell
                    value={item.slideImg}
                    onChange={(e) => {
                      setSlideList((prevRows) =>
                        prevRows.map((r) =>
                          r.id === item.id ? { ...r, slideImg: e.target.value } : r,
                        ),
                      );
                    }}
                  />
                  <Table.InputCell
                    value={item.url}
                    onChange={(e) => {
                      setSlideList((prevRows) =>
                        prevRows.map((r) => (r.id === item.id ? { ...r, url: e.target.value } : r)),
                      );
                    }}
                  />
                  <Table.Button onClick={() => deleteSlideRow(item.id)}>
                    <IconTrash size={20} />
                  </Table.Button>
                </Table.Row>
              ))} */}
            </Table.Body>
          </Table.Container>
        </CardContent>
      </Card>
    </>
  );
};

export default AccountManagePage;
