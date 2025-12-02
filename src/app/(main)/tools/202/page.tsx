'use client';

import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import FilePicker from '@/component/common/FilePicker';
import { Table } from '@/component/common/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/component/common/Tabs';
import { TextBox } from '@/component/common/TextBox';

const page = () => {
  const formik = useFormik({
    initialValues: {
      startDate: '',
      file: null,
      rows: [
        {
          fileName: 'sample.jpg',
          status: '予約済み',
          executeDate: '2025-02-02 10:00',
        },
      ],
    },

    validationSchema: Yup.object({
      startDate: Yup.string().required('予約日時は必須です'),
    }),

    onSubmit: (values) => {
      console.log('Submit data:', values);
      alert('予約を保存しました');
    },
  });

  const handleDelete = (index: number) => {
    const newRows = [...formik.values.rows];
    newRows.splice(index, 1);
    formik.setFieldValue('rows', newRows);
  };

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Tabs defaultTab="tab1">
          <TabsList>
            <TabsTrigger value="tab1">送信予約登録</TabsTrigger>
            <TabsTrigger value="tab2">予約一覧</TabsTrigger>
          </TabsList>

          {/* ================== TAB 1 ================== */}
          <TabsContent value="tab1">
            <Card>
              <CardHeader title="" />

              <div className="flex justify-center">
                <CardContent>
                  <TextBox
                    id="startDate"
                    name="startDate"
                    type="datetime-local"
                    direction="vertical"
                    label="予約日時"
                    width="md"
                    value={formik.values.startDate}
                    onChange={formik.handleChange}
                  />
                </CardContent>

                <CardContent>
                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      <FilePicker
                        accept=".pdf,.jpg,.png"
                        onChange={(file) => {
                          formik.setFieldValue('file', file);
                        }}
                      />

                      <Button type="submit">予約を保存</Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </TabsContent>

          {/* ================== TAB 2 ================== */}
          <TabsContent value="tab2">
            <Card>
              <CardHeader title="" />

              <CardContent>
                <Table.Container>
                  <Table.Head>
                    <Table.Row>
                      <Table.Th>ファイル名</Table.Th>
                      <Table.Th>ステータス</Table.Th>
                      <Table.Th>実行日時</Table.Th>
                      <Table.Th>操作</Table.Th>
                    </Table.Row>
                  </Table.Head>

                  <Table.Body>
                    {formik.values.rows.map((row, index) => (
                      <Table.Row key={index}>
                        <Table.Td>{row.fileName}</Table.Td>
                        <Table.Td>{row.status}</Table.Td>
                        <Table.Td>{row.executeDate}</Table.Td>
                        <Table.Td>
                          <div className="flex gap-3">
                            {/* 予約時間の変更 */}
                            <Button
                              type="button"
                              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                              予約時間の変更
                            </Button>

                            <Button
                              type="button"
                              className=" px-6 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition "
                            >
                              キャンセル
                            </Button>
                          </div>
                        </Table.Td>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Container>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </FormikProvider>
  );
};

export default page;
