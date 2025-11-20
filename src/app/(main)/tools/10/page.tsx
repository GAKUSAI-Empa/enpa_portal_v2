'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import { Table } from '@/component/common/Table';
import { IconTrash } from '@tabler/icons-react';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import Slide from './components/Slide';

type TableItem = {
  id: number;
  templateName: string;
  content1: string;
  content2: string;
  discount: number;
  discountUnit: string;
  condition: string;
  startDate: string;
  endDate: string;
};

const page = () => {
  const requestUrl = 'http://127.0.0.1:8000/';

  const formik = useFormik({
    initialValues: {
      id: 1,
      templateName: '',
      content1: '',
      content2: '',
      discount: 0,
      discountUnit: '',
      condition: '',
      startDate: '',
      endDate: '',
    },
    validationSchema: Yup.object({
      couponList: Yup.array()
        .of(
          Yup.object().shape({
            templateName: Yup.string().trim().required('テンプレート名を入力してください。'),
            content1: Yup.string().trim().required('文言１を入力してください。'),
            content2: Yup.string().trim().required('文言１を入力してください。'),
            discount: Yup.number()
              .typeError('割引は数値で入力してください。')
              .min(0, '割引は0以上である必要があります。')
              .required('割引を入力してください。'),
            discountUnit: Yup.string().trim().required('割引単位を選択してください。'),
            startDate: Yup.string().trim().required('開始時間を選択してください。'),
            endDate: Yup.string().trim().required('終了時間を選択してください。'),
          }),
        )
        .min(1, '商品情報を最低１行入力してください。'),
    }),
    onSubmit: (values) => {
      console.log('Form submitted with values:', values);
    },
  });
  const [TableList, setTableList] = useState<TableItem[]>([
    {
      id: 1,
      templateName: '',
      content1: '',
      content2: '',
      discount: 0,
      discountUnit: '',
      condition: '',
      startDate: '',
      endDate: '',
    },
  ]);
  const addTableRow = (numberRow: number = 1) => {
    setTableList((prev) => {
      const newRows: TableItem[] = [];
      for (let i = 0; i < numberRow; i++) {
        newRows.push({
          id: prev.length + i + 1,
          templateName: '',
          content1: '',
          content2: '',
          discount: 0,
          discountUnit: '',
          condition: '',
          startDate: '',
          endDate: '',
        });
      }
      return [...prev, ...newRows];
    });

    console.log(numberRow);
  };

  const deleteTableRow = (id: number) => {
    setTableList((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return filtered.map((r, index) => ({ ...r, id: index + 1 }));
    });
  };

  const handleSubmit = () => {
    console.log('data', TableList);
    fetch(requestUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ TableList }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log('data >>>>', TableList);
      });
  };
  return (
    <>
      <Card className="truncate pb-5">
        <CardHeader title="1.テンプレート" />
        <Slide />
      </Card>

      <form method="POST" action={'#'}>
        <Card>
          <CardHeader
            title="2. 商品情報入力"
            buttonGroup={
              <>
                <Button color="secondary" size="sm" onClick={() => addTableRow(1)}>
                  行を追加
                </Button>
                <Button color="secondary" size="sm" onClick={() => addTableRow(5)}>
                  5行追加
                </Button>
                <Button color="grey">CSVで一括取り込む</Button>
              </>
            }
          />

          <CardContent>
            <Table.Container>
              <Table.Head>
                <Table.Row>
                  <Table.Th width="w-24">ID</Table.Th>
                  <Table.Th>テンプレート</Table.Th>
                  <Table.Th>文言１</Table.Th>
                  <Table.Th>文言２</Table.Th>
                  <Table.Th>割引</Table.Th>
                  <Table.Th>割引</Table.Th>
                  <Table.Th>使用条件</Table.Th>
                  <Table.Th>開始時間</Table.Th>
                  <Table.Th>終了時間</Table.Th>
                  <Table.Th>削除</Table.Th>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {TableList?.map((item, index) => (
                  <Table.Row key={`coupon-${index}`}>
                    <Table.Td>{item.id}</Table.Td>
                    {/* <Table.InputCell
                      value={item.templateName}
                      onChange={(e) => {
                        setTableList((prevRows) =>
                          prevRows.map((r) =>
                            r.id === item.id ? { ...r, templateName: e.target.value } : r,
                          ),
                        );
                      }}
                      placeholder="テンプレート1"
                    /> */}

                    <Table.SelectBox
                      name="templateName"
                      value={item.templateName}
                      onChange={(e) => {
                        setTableList((prevRows) =>
                          prevRows.map((r) =>
                            r.id === item.id ? { ...r, templateName: e.target.value } : r,
                          ),
                        );
                      }}
                      className="w-[140px]"
                    >
                      <Table.Option value="1">テンプレート1</Table.Option>
                      <Table.Option value="2">テンプレート2</Table.Option>
                      <Table.Option value="3">テンプレート3</Table.Option>
                      <Table.Option value="4">テンプレート4</Table.Option>
                      <Table.Option value="5">テンプレート5</Table.Option>
                      <Table.Option value="6">テンプレート6</Table.Option>
                      <Table.Option value="7">テンプレート7</Table.Option>
                      <Table.Option value="8">テンプレート8</Table.Option>
                      <Table.Option value="9">テンプレート9</Table.Option>
                      <Table.Option value="10">テンプレート10</Table.Option>
                      <Table.Option value="11">テンプレート11</Table.Option>
                      <Table.Option value="12">テンプレート12</Table.Option>
                      <Table.Option value="13">テンプレート13</Table.Option>
                      <Table.Option value="14">テンプレート14</Table.Option>
                      <Table.Option value="15">テンプレート15</Table.Option>
                      <Table.Option value="16">テンプレート16</Table.Option>
                      <Table.Option value="17">テンプレート17</Table.Option>
                      <Table.Option value="18">テンプレート18</Table.Option>
                    </Table.SelectBox>

                    <Table.InputCell
                      value={item.content1}
                      onChange={(e) => {
                        setTableList((prevRows) =>
                          prevRows.map((r) =>
                            r.id === item.id ? { ...r, content1: e.target.value } : r,
                          ),
                        );
                      }}
                      placeholder="特別クーポン"
                    />
                    <Table.InputCell
                      value={item.content2}
                      placeholder="今すぐゲット！"
                      onChange={(e) => {
                        setTableList((prevRows) =>
                          prevRows.map((r) =>
                            r.id === item.id ? { ...r, content2: e.target.value } : r,
                          ),
                        );
                      }}
                    />
                    <Table.InputCell
                      value={item.discount}
                      onChange={(e) => {
                        setTableList((prevRows) =>
                          prevRows.map((r) =>
                            r.id === item.id ? { ...r, discount: Number(e.target.value) } : r,
                          ),
                        );
                      }}
                    />

                    <Table.SelectBox
                      name="couponUnit"
                      value={item.discountUnit}
                      onChange={(e) => {
                        setTableList((prevRows) =>
                          prevRows.map((r) =>
                            r.id === item.id ? { ...r, discountUnit: e.target.value } : r,
                          ),
                        );
                      }}
                      className="w-[60px] text-center"
                    >
                      <Table.Option value="option1">%</Table.Option>
                      <Table.Option value="option2">円</Table.Option>
                    </Table.SelectBox>

                    {/* <Table.InputCell
                      value={item.discountUnit}
                      onChange={(e) => {
                        setTableList((prevRows) =>
                          prevRows.map((r) =>
                            r.id === item.id ? { ...r, discountUnit: e.target.value } : r,
                          ),
                        );
                      }}
                    > */}
                    <Table.InputCell
                      value={item.condition}
                      placeholder="3000円以上"
                      onChange={(e) => {
                        setTableList((provRows) =>
                          provRows.map((r) =>
                            r.id === item.id ? { ...r, condition: e.target.value } : r,
                          ),
                        );
                      }}
                    />
                    <Table.InputCell
                      type="datetime-local"
                      value={item.startDate}
                      onChange={(e) => {
                        setTableList((provRows) =>
                          provRows.map((r) =>
                            r.id === item.id ? { ...r, startDate: e.target.value } : r,
                          ),
                        );
                      }}
                    />
                    <Table.InputCell
                      type="datetime-local"
                      value={item.endDate}
                      onChange={(e) => {
                        setTableList((provRows) =>
                          provRows.map((r) =>
                            r.id === item.id ? { ...r, endDate: e.target.value } : r,
                          ),
                        );
                      }}
                    />
                    <Table.Button onClick={() => deleteTableRow(item.id)}>
                      <IconTrash />
                    </Table.Button>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Container>
          </CardContent>
        </Card>
        <div className="flex items-center justify-center">
          <Button className={'flex flexEnd'} size="lg" type="submit" onClick={() => handleSubmit()}>
            プレビュー
          </Button>
        </div>
      </form>
    </>
  );
};

export default page;
