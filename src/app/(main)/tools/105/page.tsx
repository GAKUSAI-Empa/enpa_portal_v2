'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/component/common/Card';
import { Table } from '@/component/common/Table';
import { IconTrash } from '@tabler/icons-react';
import { formatISO } from 'date-fns';
import { FormikProvider, useFormik } from 'formik';
import { useRef, useState } from 'react';
import * as Yup from 'yup';
import Slide from './components/Slide';

type TableItem = {
  id: number;
  template_id: string;
  product_number: string;
  theme_color: string;
  background_color: string;
  catchcopy: string;
  price: number;
  product_name: string;
  description: string;
  button_text: string;
  image_url: string;
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

const Page = () => {
  const requestUrl = '';
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      TableList: [
        {
          id: 1,
          template_id: '',
          product_number: '',
          theme_color: '',
          background_color: '',
          catchcopy: '',
          price: 0,
          product_name: '',
          description: '',
          button_text: '',
          image_url: '',
          discount_value: 0,
          discount_unit: '%',
          available_condition: '',
          start_date: '',
          end_date: '',
        },
      ],
    },
    validationSchema: Yup.object({
      TableList: Yup.array()
        .of(
          Yup.object().shape({
            template_id: Yup.string().required('テンプレートを選択してください。'),
            product_number: Yup.string().required('商品管理番号を入力してください。'),
            product_name: Yup.string().required('商品名を入力してください。'),
            price: Yup.number().min(0).required('価格を入力してください。'),
            discount_value: Yup.number().min(0).required('割引を入力してください。'),
            discount_unit: Yup.string().required('割引単位を選択してください。'),
            start_date: Yup.string().required('開始日を選択してください。'),
            end_date: Yup.string()
              .required('終了日を選択してください。')
              .test(
                'is-after-start',
                '終了日は開始日より後である必要があります。',
                function (end_date) {
                  const { start_date } = this.parent;
                  if (!start_date || !end_date) return true;
                  return new Date(end_date) > new Date(start_date);
                },
              ),
          }),
        )
        .min(1, '商品情報を最低１行入力してください。'),
    }),
    onSubmit: async (values) => {
      const payloadList = values.TableList.map((item) => ({
        file_name: String(item.id),
        ...item,
        start_date: formatISO(new Date(item.start_date)),
        end_date: formatISO(new Date(item.end_date)),
      }));

      try {
        setLoading(true);
        const res = await fetch(requestUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ payloadList }),
        });
        const data = await res.json();
        setImages(data.images || []);
      } catch (error) {
        console.error('Đã xảy ra lỗi khi gửi dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleAddRow = (numberRow: number) => {
    const currentMaxId =
      formik.values.TableList.length > 0
        ? formik.values.TableList[formik.values.TableList.length - 1].id
        : 0;

    const newRows = Array.from({ length: numberRow }, (_, index) => ({
      id: currentMaxId + index + 1,
      template_id: '',
      product_number: '',
      theme_color: '',
      background_color: '',
      catchcopy: '',
      price: 0,
      product_name: '',
      description: '',
      button_text: '',
      image_url: '',
      discount_value: 0,
      discount_unit: '%',
      available_condition: '',
      start_date: '',
      end_date: '',
    }));

    formik.setFieldValue('TableList', [...formik.values.TableList, ...newRows]);
  };

  const deleteTableRow = (id: number) => {
    const updateList = formik.values.TableList.filter((item) => item.id !== id);
    const reindexedList = updateList.map((item, index) => ({ ...item, id: index + 1 }));
    formik.setFieldValue('TableList', reindexedList);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
    const isCSV = fileName.endsWith('.csv');

    if (!isExcel && !isCSV) {
      alert('CSV または Excel ファイルを選択してください。');
      return;
    }

    const headerMapping: { [key: string]: keyof TableItem } = {
      テンプレート: 'template_id',
      商品管理番号: 'product_number',
      テーマカラー: 'theme_color',
      背景カラー: 'background_color',
      キャッチコピー: 'catchcopy',
      価格: 'price',
      商品名: 'product_name',
      説明文: 'description',
      ボタン文言: 'button_text',
      画像URL: 'image_url',
      割引: 'discount_value',
      単位: 'discount_unit',
      適用条件: 'available_condition',
      開始日: 'start_date',
      終了日: 'end_date',
    };

    const parseDate = (v: string) => {
      if (!v) return '';
      const parts = v.split(/[\/\s:]/);
      if (parts.length >= 3) {
        const [y, m, d, h = '00', min = '00'] = parts;
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T${h.padStart(2, '0')}:${min.padStart(2, '0')}`;
      }
      return v.replace(/\//g, '-').replace(' ', 'T');
    };

    const newRows: TableItem[] = [];
    const currentMaxId =
      formik.values.TableList.length > 0
        ? formik.values.TableList[formik.values.TableList.length - 1].id
        : 0;

    if (isExcel) {
      const XLSX = await import('xlsx');
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<any>(sheet, { header: 1 });
      const rows = json as string[][];
      const headers = rows[0].slice(1);

      rows.slice(1).forEach((row) => {
        const cols = row.slice(1);
        if (cols.every((v) => !v)) return;

        const item: TableItem = {
          id: currentMaxId + newRows.length + 1,
          template_id: '',
          product_number: '',
          theme_color: '',
          background_color: '',
          catchcopy: '',
          price: 0,
          product_name: '',
          description: '',
          button_text: '',
          image_url: '',
          discount_value: 0,
          discount_unit: '%',
          available_condition: '',
          start_date: '',
          end_date: '',
        };

        headers.forEach((h, i) => {
          const key = headerMapping[h];
          if (!key) return;
          const value = cols[i] ?? '';
          if (key === 'price' || key === 'discount_value') item[key] = Number(value) || 0;
          else if (key === 'start_date' || key === 'end_date') item[key] = parseDate(String(value));
          else (item as any)[key] = String(value);
        });

        newRows.push(item);
      });
    }

    if (isCSV) {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');
      const headers = lines[0].split(',').slice(1);
      lines.slice(1).forEach((line) => {
        const cols = line.split(',').slice(1);
        if (cols.every((v) => !v)) return;

        const item: TableItem = {
          id: currentMaxId + newRows.length + 1,
          template_id: '',
          product_number: '',
          theme_color: '',
          background_color: '',
          catchcopy: '',
          price: 0,
          product_name: '',
          description: '',
          button_text: '',
          image_url: '',
          discount_value: 0,
          discount_unit: '%',
          available_condition: '',
          start_date: '',
          end_date: '',
        };

        headers.forEach((h, i) => {
          const key = headerMapping[h];
          if (!key) return;
          const value = cols[i] ?? '';
          if (key === 'price' || key === 'discount_value') item[key] = Number(value) || 0;
          else if (key === 'start_date' || key === 'end_date') item[key] = parseDate(String(value));
          else (item as any)[key] = String(value);
        });

        newRows.push(item);
      });
    }

    if (newRows.length > 0) {
      formik.setFieldValue('TableList', [...formik.values.TableList, ...newRows]);
      alert(`${newRows.length} 件インポートしました。`);
    }

    e.target.value = '';
  };

  return (
    <>
      <Card className="truncate pb-5">
        <CardHeader title="1.テンプレート" />
        <Slide />
      </Card>

      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <Card>
            <CardHeader
              title="2. 商品情報入力"
              buttonGroup={
                <>
                  <Button color="secondary" size="sm" onClick={() => handleAddRow(1)}>
                    行を追加
                  </Button>
                  <Button color="secondary" size="sm" onClick={() => handleAddRow(5)}>
                    5行追加
                  </Button>
                  <label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleImportFile}
                    />
                    <Button color="grey" onClick={handleFileButtonClick}>
                      CSVで一括取り込む
                    </Button>
                  </label>
                </>
              }
            />
            <CardContent>
              <Table.Container className="min-w-[800px]">
                <Table.Head>
                  <Table.Row className="bg-gray-50">
                    <Table.Th className="min-w-[80px] px-4 py-2 text-center">ID</Table.Th>

                    <Table.Th className="min-w-[180px] px-4 py-2 text-left">テンプレート</Table.Th>

                    <Table.Th className="min-w-[260px] px-4 py-2 text-left">商品管理番号</Table.Th>

                    <Table.Th className="min-w-[180px] px-4 py-2 text-left">テーマカラー</Table.Th>

                    <Table.Th className="min-w-[180px] px-4 py-2 text-left">背景カラー</Table.Th>

                    <Table.Th className="min-w-[240px] px-4 py-2 text-left">
                      キャッチコピー
                    </Table.Th>

                    <Table.Th className="min-w-[120px] px-4 py-2 text-left">価格</Table.Th>

                    <Table.Th className="min-w-[240px] px-4 py-2 text-left">商品名</Table.Th>

                    <Table.Th className="min-w-[280px] px-4 py-2 text-left">説明文</Table.Th>

                    <Table.Th className="min-w-[200px] px-4 py-2 text-left">ボタン文言</Table.Th>

                    <Table.Th className="min-w-[240px] px-4 py-2 text-left">画像URL</Table.Th>

                    <Table.Th className="min-w-[120px] px-4 py-2 text-left">割引</Table.Th>

                    <Table.Th className="min-w-[100px] px-4 py-2 text-left">単位</Table.Th>

                    <Table.Th className="min-w-[240px] px-4 py-2 text-left">適用条件</Table.Th>

                    <Table.Th className="min-w-[180px] px-4 py-2 text-left">開始日</Table.Th>

                    <Table.Th className="min-w-[180px] px-4 py-2 text-left">終了日</Table.Th>

                    <Table.Th className="min-w-[100px] px-4 py-2 text-center">削除</Table.Th>
                  </Table.Row>
                </Table.Head>

                <Table.Body>
                  {formik.values.TableList.map((item, index) => (
                    <Table.Row key={item.id}>
                      <Table.Td>{item.id}</Table.Td>
                      <Table.SelectFormik name={`TableList[${index}].template_id`}>
                        {[...Array(4)].map((_, i) => (
                          <Table.SelectFormikOption key={i} value={`${i + 1}`}>
                            テンプレート{i + 1}
                          </Table.SelectFormikOption>
                        ))}
                      </Table.SelectFormik>
                      <Table.InputCellFormik name={`TableList[${index}].product_number`} />
                      <Table.InputCellFormik name={`TableList[${index}].theme_color`} />
                      <Table.InputCellFormik name={`TableList[${index}].background_color`} />
                      <Table.InputCellFormik name={`TableList[${index}].catchcopy`} />
                      <Table.InputCellFormik name={`TableList[${index}].price`} type="number" />
                      <Table.InputCellFormik name={`TableList[${index}].product_name`} />
                      <Table.InputCellFormik name={`TableList[${index}].description`} />
                      <Table.InputCellFormik name={`TableList[${index}].button_text`} />
                      <Table.InputCellFormik name={`TableList[${index}].image_url`} />
                      <Table.InputCellFormik
                        name={`TableList[${index}].discount_value`}
                        type="number"
                      />
                      <Table.SelectFormik name={`TableList[${index}].discount_unit`}>
                        <Table.SelectFormikOption value="%">%</Table.SelectFormikOption>
                        <Table.SelectFormikOption value="yen">円</Table.SelectFormikOption>
                      </Table.SelectFormik>
                      <Table.InputCellFormik name={`TableList[${index}].available_condition`} />
                      <Table.InputCellFormik
                        name={`TableList[${index}].start_date`}
                        type="datetime-local"
                      />
                      <Table.InputCellFormik
                        name={`TableList[${index}].end_date`}
                        type="datetime-local"
                      />
                      <Table.Button
                        onClick={() => deleteTableRow(item.id)}
                        disabled={formik.values.TableList.length === 1}
                        className={
                          formik.values.TableList.length === 1
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }
                      >
                        <IconTrash />
                      </Table.Button>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Container>
            </CardContent>
            <CardFooter className="justify-center ">
              <Button type="submit">プレビュー</Button>
            </CardFooter>
          </Card>
        </form>
      </FormikProvider>

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

export default Page;
