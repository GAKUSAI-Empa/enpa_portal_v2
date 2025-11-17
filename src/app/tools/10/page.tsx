'use client';

import React, { useState } from 'react';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import Slide from './components/Slide';
import { CardContent, CardHeader } from '@/component/common/Card';
import { Button } from '@/component/common/Button';
import { Table } from '@/component/common/Table';
import { IconTrash } from '@tabler/icons-react';

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
  // const formik = useFormik({
  //     initialValues: {
  //       // 1.基本設定
  //       topMessage: '',
  //       storeLogoUrl: '',
  //       hexColor: '#3B82F6',
  //       awards: [''],
  //       featureTitle: '',
  //       buttonText: '',
  //       buttonLink: '',
  //       colWidth: '2',
  //     },
  //     validationSchema: Yup.object({
  //       topMessage: Yup.string().trim().required('最上部メッセージを入力してください。'),
  //       storeLogoUrl: Yup.string().trim().required('店舗ロゴURLを入力してください。'),
  //       hexColor: Yup.string().trim().required('メインカラーを選択してください。'),
  //       featureTitle: Yup.string().trim(),
  //       buttonText: showButtonSetting
  //         ? Yup.string().trim().required('入力してください。')
  //         : Yup.string().trim(),
  //       buttonLink: showButtonSetting
  //         ? Yup.string().trim().required('入力してください。')
  //         : Yup.string().trim(),
  //     }),
  //     onSubmit: async (values) => {
  //       // Lấy template HTML
  //       const responseHtml = await fetch('/template_html/tools/4/header.html');
  //       let templateHtml = await responseHtml.text();

  //       templateHtml = editHtmlContent(templateHtml, values);

  //       reviewLivePage(templateHtml);
  //     },
  //   });

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
  return (
    <>
      <div className="mx-5">
        <div className="p-5  bg-white">
          <CardHeader title="1.テンプレート" />
          <Slide />
        </div>
      </div>

      <div className="mx-5 mt-[50px]">
        <div className="p-5  bg-white">
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
                    <Table.InputCell
                      value={item.templateName}
                      onChange={(e) => {
                        setTableList((prevRows) =>
                          prevRows.map((r) =>
                            r.id === item.id ? { ...r, templateName: e.target.value } : r,
                          ),
                        );
                      }}
                      placeholder="テンプレート1"
                    />

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
                    <Table.InputCell
                      value={item.discountUnit}
                      onChange={(e) => {
                        setTableList((prevRows) =>
                          prevRows.map((r) =>
                            r.id === item.id ? { ...r, discountUnit: e.target.value } : r,
                          ),
                        );
                      }}
                    />
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
            {/* <Button
              disabled={!formik.isValid || formik.isSubmitting}
              size="lg"
              type="submit"
              onClick={formik.submitForm}
            >
              プレビュー
            </Button> */}
          </CardContent>
        </div>
      </div>
    </>
  );
};

export default page;
