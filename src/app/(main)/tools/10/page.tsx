'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import { Table } from '@/component/common/Table';
import { IconTrash } from '@tabler/icons-react';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import * as Yup from 'yup';
import Slide from './components/Slide';

type TableItem = {
  id: number;
  template: string;
  coupon_message1: string;
  coupon_message2: string;
  discount_value: number;
  discount_unit: string;
  available_condition: string;
  start_date: string;
  end_date: string;
};

type ImageItem = {
  file_name: string;
  image_base64: string;
};

const page = () => {
  const requestUrl = 'http://127.0.0.1:8000/coupon/generate-preview';
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [images, setImages] = useState<ImageItem[]>([]);

  const formik = useFormik({
    initialValues: {
      id: 1,
      template: '',
      coupon_message1: '',
      coupon_message2: '',
      discount_value: 0,
      discount_unit: '',
      available_condition: '',
      start_date: '',
      end_date: '',
    },
    validationSchema: Yup.object({
      couponList: Yup.array()
        .of(
          Yup.object().shape({
            template: Yup.string().trim().required('テンプレート名を入力してください。'),
            coupon_message1: Yup.string().trim().required('文言１を入力してください。'),
            coupon_message2: Yup.string().trim().required('文言１を入力してください。'),
            discount_value: Yup.number()
              .typeError('割引は数値で入力してください。')
              .min(0, '割引は0以上である必要があります。')
              .required('割引を入力してください。'),
            discount_unit: Yup.string().trim().required('割引単位を選択してください。'),
            start_date: Yup.string().trim().required('開始時間を選択してください。'),
            end_date: Yup.string().trim().required('終了時間を選択してください。'),
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
      template: '1',
      coupon_message1: '',
      coupon_message2: '',
      discount_value: 0,
      discount_unit: '円',
      available_condition: '',
      start_date: '',
      end_date: '',
    },
  ]);
  const addTableRow = (numberRow: number = 1) => {
    setTableList((prev) => {
      const newRows: TableItem[] = [];
      for (let i = 0; i < numberRow; i++) {
        newRows.push({
          id: prev.length + i + 1,
          template: '',
          coupon_message1: '',
          coupon_message2: '',
          discount_value: 0,
          discount_unit: '',
          available_condition: '',
          start_date: '',
          end_date: '',
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

  const handleSubmit = async () => {
    const payloadList = TableList.map((item) => ({
      file_name: String(item.id),
      template: item.template,
      coupon_message1: item.coupon_message1,
      coupon_message2: item.coupon_message2,
      discount_value: item.discount_value,
      discount_unit: item.discount_unit,
      available_condition: item.available_condition,
      start_date: item.start_date,
      end_date: item.end_date,
    }));

    const requestBody = {
      items: payloadList,
    };

    // const token = session?.user?.accessToken;

    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYmJmNDkzYy1mZjc5LTQ4YjgtODQ4MC1lOWJhNjcwNWY4ZjkiLCJleHAiOjE3NjM5NjcwMjQsInVzZXJfbmFtZSI6ImFkbWluIiwicm9sZV9uYW1lIjoiUk9MRV9BRE1JTiJ9.jX4NE5rhN6hMDE4YCVweqXRkBFepr-yrA-EHXiLq65I';

    if (!token) {
      alert('token có vấn đề!');

      return;
    }

    try {
      setLoading(true);
      const res = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(requestBody),
      });
      console.log('data', JSON.stringify(requestBody, null, 2));

      const data = await res.json();
      console.log('Server Response:', data);
      setImages(data.images);
    } catch (error) {
      console.error('Đã xảy ra lỗi khi gửi dữ liệu:', error);
    } finally {
      setLoading(false);
    }
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
                    <Table.SelectBox
                      name="template"
                      value={item.template}
                      onChange={(e) => {
                        setTableList((prevRows) =>
                          prevRows.map((r) =>
                            r.id === item.id ? { ...r, template: e.target.value } : r,
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
                      value={item.coupon_message1}
                      onChange={(e) => {
                        setTableList((prevRows) =>
                          prevRows.map((r) =>
                            r.id === item.id ? { ...r, coupon_message1: e.target.value } : r,
                          ),
                        );
                      }}
                      placeholder="特別クーポン"
                    />

                    <Table.InputCell
                      value={item.coupon_message2}
                      placeholder="今すぐゲット！"
                      onChange={(e) => {
                        setTableList((prevRows) =>
                          prevRows.map((r) =>
                            r.id === item.id ? { ...r, coupon_message2: e.target.value } : r,
                          ),
                        );
                      }}
                    />

                    <Table.InputCell
                      value={item.discount_value}
                      onChange={(e) => {
                        setTableList((prevRows) =>
                          prevRows.map((r) =>
                            r.id === item.id ? { ...r, discount_value: Number(e.target.value) } : r,
                          ),
                        );
                      }}
                    />

                    <Table.SelectBox
                      name="couponUnit"
                      value={item.discount_unit}
                      onChange={(e) => {
                        setTableList((prevRows) =>
                          prevRows.map((r) =>
                            r.id === item.id ? { ...r, discount_unit: e.target.value } : r,
                          ),
                        );
                      }}
                      className="w-[60px] text-center"
                    >
                      <Table.Option value="option1">円</Table.Option>

                      <Table.Option value="option2">%</Table.Option>
                    </Table.SelectBox>
                    <Table.InputCell
                      value={item.available_condition}
                      placeholder="3000円以上"
                      onChange={(e) => {
                        setTableList((provRows) =>
                          provRows.map((r) =>
                            r.id === item.id ? { ...r, available_condition: e.target.value } : r,
                          ),
                        );
                      }}
                    />

                    <Table.InputCell
                      type="datetime-local"
                      value={item.start_date}
                      onChange={(e) => {
                        setTableList((provRows) =>
                          provRows.map((r) =>
                            r.id === item.id ? { ...r, start_date: e.target.value } : r,
                          ),
                        );
                      }}
                    />

                    <Table.InputCell
                      type="datetime-local"
                      value={item.end_date}
                      onChange={(e) => {
                        setTableList((provRows) =>
                          provRows.map((r) =>
                            r.id === item.id ? { ...r, end_date: e.target.value } : r,
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
          <Button className={'flex flexEnd'} size="lg" onClick={() => handleSubmit()}>
            プレビュー
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap gap-4 mt-5">
        {images?.length > 0 ? (
          images.map((imgItem, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={`data:image/png;base64,${imgItem.image_base64}`}
                alt={`Image ${imgItem.file_name}`}
                className="max-w-[200px] h-auto border"
              />

              <span className="mt-1 text-sm">{imgItem.file_name}</span>
            </div>
          ))
        ) : (
          <p>プレビュー画像はここに表示されます</p>
        )}
      </div>
    </>
  );
};

export default page;
