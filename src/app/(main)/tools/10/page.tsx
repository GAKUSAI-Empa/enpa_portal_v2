'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/component/common/Card';
import { Table } from '@/component/common/Table';
import { IconTrash } from '@tabler/icons-react';
import { formatISO } from 'date-fns';
import { FormikProvider, useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
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
  const requestUrl = 'http://127.0.0.1:8000/api-be/coupon/generate-preview';
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [images, setImages] = useState<ImageItem[]>([]);

  const formik = useFormik({
    initialValues: {
      couponList: [
        {
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
      ],
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
            end_date: Yup.string()
              .trim()
              .required('終了時間を選択してください。')
              .test(
                'is-after-start',
                '終了時間は開始時間より後である必要があります。',
                function (end_date) {
                  const { start_date } = this.parent;

                  if (!start_date || !end_date) return true;

                  const start = new Date(start_date);
                  const end = new Date(end_date);

                  return end > start;
                },
              ),
          }),
        )
        .min(1, '商品情報を最低１行入力してください。'),
    }),
    onSubmit: async (values) => {
      const payloadList = values.couponList.map((item) => ({
        file_name: String(item.id),
        template: item.template,
        coupon_message1: item.coupon_message1,
        coupon_message2: item.coupon_message2,
        discount_value: item.discount_value,
        discount_unit: item.discount_unit,
        available_condition: item.available_condition,
        start_date: formatISO(new Date(item.start_date)),
        end_date: formatISO(new Date(item.end_date)),
      }));

      const requestBody = {
        items: payloadList,
      }; // const token = session?.user?.accessToken;

      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NWU0NDI0Mi0xOGJjLTQ0YTQtODRjZS05NDQ2NWNmNjNkMTEiLCJleHAiOjE3NjQxNDA4MzUsInVzZXJfbmFtZSI6ImFkbWluIiwicm9sZV9uYW1lIjoiUk9MRV9BRE1JTiJ9.a6zuaXWLYFrzZ4scT3RG1YkwGF6tod_ODtpq_GOzO8o';

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
    },
  });

  const handleAddRow = (numberRow: number) => {
    const currentMaxId =
      formik.values.couponList.length > 0
        ? formik.values.couponList[formik.values.couponList.length - 1].id
        : 0;

    const newRows = Array.from({ length: numberRow }, (_, index) => ({
      id: currentMaxId + index + 1,
      template: '',
      coupon_message1: '',
      coupon_message2: '',
      discount_value: 0,
      discount_unit: '',
      available_condition: '',
      start_date: '',
      end_date: '',
    }));

    formik.setFieldValue('couponList', [...formik.values.couponList, ...newRows]);
  };

  const deleteTableRow = (id: number) => {
    const updateList = formik.values.couponList.filter((item) => item.id !== id);
    const reindexedList = updateList.map((item, index) => ({
      ...item,
      id: index + 1,
    }));
    formik.setFieldValue('couponList', reindexedList);
  }; // Import CSV function start

  const parseJapaneseDate = (dateString: string): string => {
    if (!dateString) return '';
    const parts = dateString.split(/[\/\s:]/);
    if (parts.length >= 5) {
      const [year, month, day, hour, minute] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    }
    return dateString.replace(/\//g, '-').replace(' ', 'T');
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click(); // Mở dialog chọn file
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
      テンプレート: 'template',
      クーポン文言１: 'coupon_message1',
      クーポン文言２: 'coupon_message2',
      '割引（値）': 'discount_value',
      '割引（単位）': 'discount_unit',
      使用可能条件: 'available_condition',
      開始日時: 'start_date',
      終了日時: 'end_date',
    };

    const parseJapaneseDate = (v: string) => {
      if (!v) return '';
      const parts = v.split(/[\/\s:]/);
      if (parts.length >= 5) {
        const [y, m, d, h, min] = parts;
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T${h.padStart(
          2,
          '0',
        )}:${min.padStart(2, '0')}`;
      }
      return v.replace(/\//g, '-').replace(' ', 'T');
    };

    const newRows: TableItem[] = [];
    const currentMaxId =
      formik.values.couponList.length > 0
        ? formik.values.couponList[formik.values.couponList.length - 1].id
        : 0;

    // ========================
    // XLSX FILE PROCESS
    // ========================
    if (isExcel) {
      const XLSX = await import('xlsx');
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<any>(sheet, { header: 1 });

      const rows = json as string[][];

      if (rows.length < 2) {
        alert('Excel にデータがありません');
        return;
      }

      const headers = rows[0].slice(1); // bỏ cột A

      rows.slice(1).forEach((row, idx) => {
        const cols = row.slice(1);

        if (cols.every((v) => !v)) return;

        const item: TableItem = {
          id: currentMaxId + newRows.length + 1,
          template: '',
          coupon_message1: '',
          coupon_message2: '',
          discount_value: 0,
          discount_unit: '',
          available_condition: '',
          start_date: '',
          end_date: '',
        };

        headers.forEach((h, i) => {
          const key = headerMapping[h];
          if (!key) return;

          const value = cols[i] ?? '';

          if (key === 'start_date' || key === 'end_date') {
            if (typeof value === 'number') {
              //  Excel date → JS date
              const date = XLSX.SSF.parse_date_code(value);
              if (date) {
                const yyyy = date.y;
                const mm = String(date.m).padStart(2, '0');
                const dd = String(date.d).padStart(2, '0');
                const hh = String(date.H).padStart(2, '0');
                const mi = String(date.M).padStart(2, '0');
                item[key] = `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
              }
            } else {
              //  CSV hoặc Excel dạng chuỗi
              item[key] = parseJapaneseDate(String(value));
            }
          } else if (key === 'discount_value') {
            item[key] = Number(value) || 0;
          } else {
            (item as any)[key] = String(value);
          }
        });

        newRows.push(item);
      });
    }

    // ========================
    // CSV FILE PROCESS
    // ========================
    if (isCSV) {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');

      const headers = lines[0].split(',').slice(1);

      lines.slice(1).forEach((line) => {
        const cols = line.split(',').slice(1);
        if (cols.every((v) => !v)) return;

        const item: TableItem = {
          id: currentMaxId + newRows.length + 1,
          template: '',
          coupon_message1: '',
          coupon_message2: '',
          discount_value: 0,
          discount_unit: '',
          available_condition: '',
          start_date: '',
          end_date: '',
        };

        headers.forEach((h, i) => {
          const key = headerMapping[h];
          if (!key) return;

          const value = cols[i] ?? '';

          if (key === 'start_date' || key === 'end_date') {
            item[key] = parseJapaneseDate(value);
          } else if (key === 'discount_value') {
            item[key] = Number(value) || 0;
          } else {
            (item as any)[key] = String(value);
          }
        });

        newRows.push(item);
      });
    }

    // Merge vào Formik
    if (newRows.length > 0) {
      const isFirstRowEmpty = (list: TableItem[]) => {
        if (list.length !== 1) return false;
        const { id, ...rest } = list[0]; // loại bỏ id
        return Object.values(rest).every(
          (v) => (typeof v === 'string' && v === '') || (typeof v === 'number' && v === 0),
        );
      };

      const finalRows = isFirstRowEmpty(formik.values.couponList)
        ? newRows.map((r, idx) => ({ ...r, id: idx + 1 }))
        : [...formik.values.couponList, ...newRows];

      formik.setFieldValue('couponList', finalRows);

      alert(`${newRows.length} 件インポートしました。`);
    }

    e.target.value = '';
  };

  // Import CSV function end
  return (
    <>
      <Card className="truncate pb-5">
        <CardHeader title="1.テンプレート" />
        <Slide />
      </Card>

      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col justify-center w-full">
            <div className="flex flex-col items-center justify-center h-full flex-1">
              <div className="w-full xl:max-w-full">
                <Card>
                  <CardHeader
                    isSticky={true}
                    title="2. 商品情報入力"
                    buttonGroup={
                      <>
                        <Button color="secondary" size="sm" onClick={() => handleAddRow(1)}>
                          行を追加
                        </Button>
                        <Button color="secondary" size="sm" onClick={() => handleAddRow(5)}>
                          5行追加
                        </Button>
                        <label className="inline-block">
                          <input
                            type="file"
                            accept=".xls,.xlsx,.csv"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={(e) => handleImportFile(e)}
                          />
                          <Button color="grey" onClick={handleFileButtonClick}>
                            CSVで一括取り込む
                          </Button>
                        </label>
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
                          <Table.Th width="w-[70px]">割引単位</Table.Th>
                          <Table.Th>使用条件</Table.Th>
                          <Table.Th>開始時間</Table.Th>
                          <Table.Th>終了時間</Table.Th>
                          <Table.Th width="w-10">削除</Table.Th>
                        </Table.Row>
                      </Table.Head>

                      <Table.Body>
                        {formik.values.couponList?.map((item, index) => (
                          <Table.Row key={`coupon-${index}`}>
                            <Table.Td>{item.id}</Table.Td>

                            <Table.SelectFormik name={`couponList[${index}].template`}>
                              {[...Array(18)].map((_, i) => (
                                <Table.SelectFormikOption key={i} value={`${i + 1}`}>
                                  テンプレート{i + 1}
                                </Table.SelectFormikOption>
                              ))}
                            </Table.SelectFormik>

                            <Table.InputCellFormik
                              name={`couponList[${index}].coupon_message1`}
                              placeholder="特別クーポン"
                            />

                            <Table.InputCellFormik
                              name={`couponList[${index}].coupon_message2`}
                              placeholder="今すぐゲット！"
                            />
                            <Table.InputCellFormik name={`couponList[${index}].discount_value`} />

                            <Table.SelectFormik name={`couponList[${index}].discount_unit`}>
                              <Table.SelectFormikOption value={'円'}>円</Table.SelectFormikOption>
                              <Table.SelectFormikOption value={'%'}>%</Table.SelectFormikOption>
                            </Table.SelectFormik>

                            <Table.InputCellFormik
                              name={`couponList[${index}].available_condition`}
                              value={item.available_condition}
                              placeholder="3000円以上"
                            />

                            <Table.InputCellFormik
                              name={`couponList[${index}].start_date`}
                              type="datetime-local"
                            />
                            <Table.InputCellFormik
                              name={`couponList[${index}].end_date`}
                              type="datetime-local"
                            />

                            <Table.Button
                              onClick={() => deleteTableRow(item.id)}
                              disabled={formik.values.couponList.length === 1}
                              className={
                                formik.values.couponList.length === 1
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
                  <CardFooter className="justify-center">
                    <Button type="submit">プレビュー</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
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

export default page;
