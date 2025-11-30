'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import { Table } from '@/component/common/Table';
import { cn } from '@/lib/utils';
import { IconAlertCircle, IconTrash } from '@tabler/icons-react';
import { FormikProvider, useFormik, useFormikContext } from 'formik';
import React, { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { AllErrors, ProductRow } from '../tool10_type';
import Slide from './Slide';

const ValidationSchema = Yup.object({
  rows: Yup.array()
    .of(
      Yup.object().shape({
        coupon_message1: Yup.string().trim().required('文言１を入力してください。'),
        coupon_message2: Yup.string().trim().required('文言2を入力してください。'),
        discount_value: Yup.number()
          .typeError('割引は数値で入力してください。')
          .min(0, '割引は0以上である必要があります。')
          .required('割引を入力してください。'),
        // discount_unit: Yup.string().trim().required('割引単位を選択してください。'),
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
              return new Date(end_date) > new Date(start_date);
            },
          ),
      }),
    )
    .min(1, '商品情報を最低１行入力してください。'),
});

// Helper components (FormObserver, ErrorTooltip, FormRefHandler) kept simple
const FormObserver = ({
  setRows,
}: {
  setRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
}) => {
  const { values } = useFormikContext<{ rows: ProductRow[] }>();
  const prevRowsRef = useRef<string>(JSON.stringify(values.rows));
  useEffect(() => {
    const cur = JSON.stringify(values.rows);
    if (cur !== prevRowsRef.current) {
      setRows(values.rows);
      prevRowsRef.current = cur;
    }
  }, [values.rows, setRows]);
  return null;
};

const ErrorTooltip = ({ error, className }: { error?: string; className?: string }) => {
  if (!error) return null;
  return (
    <div
      className={cn(
        'group absolute top-1/3 -translate-y-1/2 flex items-center z-10',
        className || 'right-2',
      )}
    >
      <IconAlertCircle size={16} className="text-red-500 cursor-pointer" />
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 max-w-xs w-max bg-red-100 text-red-800 text-xs rounded-md px-2 py-1 shadow-md z-20 break-words whitespace-normal border border-red-200">
        {error}
      </div>
    </div>
  );
};

const FormRefHandler = ({ onValidateRef }: { onValidateRef: any }) => {
  const { validateForm, setTouched, values } = useFormikContext<{ rows: ProductRow[] }>();
  useImperativeHandle(onValidateRef, () => ({
    triggerValidation: async () => {
      const touchedRows = values.rows.map((row) =>
        Object.keys(row).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
      );
      await setTouched({ rows: touchedRows } as any);
      const errors = await validateForm();
      return Object.keys(errors).length === 0;
    },
  }));
  return null;
};

// Main component
export interface EditableProductTableHandle {
  triggerValidation: () => Promise<boolean>;
}

interface EditableProductTableProps {
  rows: ProductRow[];
  setRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
  errors: AllErrors;
  showErrors: boolean;
  setModifiedRowIds: React.Dispatch<React.SetStateAction<Set<number>>>;
  jobId: string | null;
  setJobId: React.Dispatch<React.SetStateAction<string | null>>;
  disabled?: boolean;
}

const EditableProductTable = forwardRef<EditableProductTableHandle, EditableProductTableProps>(
  ({ rows: initialRows, setRows, setModifiedRowIds, jobId, setJobId, disabled = false }, ref) => {
    const baseId = useId();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<any[]>([]); // placeholder for preview images if any

    // create formik
    const formik = useFormik({
      initialValues: {
        rows: initialRows.length
          ? initialRows
          : [
              {
                // ensure at least one empty row
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
      validationSchema: ValidationSchema,
      enableReinitialize: true,
      onSubmit: () => {},
    });

    useEffect(() => {
      setRows(formik.values.rows);
    }, [formik.values.rows, setRows]);

    const handleFileButtonClick = () => {
      fileInputRef.current?.click();
    };

    const handleAddRow = (count: number) => {
      const currentMaxId =
        formik.values.rows.length > 0 ? Math.max(...formik.values.rows.map((r) => r.id)) : 0;
      const newRows: ProductRow[] = Array.from({ length: count }, (_, i) => ({
        id: currentMaxId + i + 1,
        template: '',
        coupon_message1: '',
        coupon_message2: '',
        discount_value: 0,
        discount_unit: '',
        available_condition: '',
        start_date: '',
        end_date: '',
      }));
      formik.setFieldValue('rows', [...formik.values.rows, ...newRows]);
      setModifiedRowIds((prev) => {
        const next = new Set(prev);
        newRows.forEach((r) => next.add(r.id));
        return next;
      });
    };

    const deleteTableRow = (id: number) => {
      if (formik.values.rows.length === 1) {
        // reset to a blank row instead of removing if it's the last
        formik.setFieldValue('rows', [
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
        ]);
        setJobId(null);
        return;
      }
      formik.setFieldValue(
        'rows',
        formik.values.rows.filter((r) => r.id !== id),
      );
    };

    const parseJapaneseDate = (v: string) => {
      if (!v) return '';
      const parts = String(v).split(/[\/\s:]/);
      if (parts.length >= 5) {
        const [y, m, d, h, min] = parts;
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T${h.padStart(2, '0')}:${min.padStart(2, '0')}`;
      }
      return String(v).replace(/\//g, '-').replace(' ', 'T');
    };

    const headerMapping: { [key: string]: keyof ProductRow | string } = {
      テンプレート: 'template',
      クーポン文言１: 'coupon_message1',
      クーポン文言２: 'coupon_message2',
      '割引（値）': 'discount_value',
      '割引（単位）': 'discount_unit',
      使用可能条件: 'available_condition',
      開始日時: 'start_date',
      終了日時: 'end_date',
    };

    const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const fileName = file.name.toLowerCase();
      const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
      const isCSV = fileName.endsWith('.csv');

      if (!isExcel && !isCSV) {
        toast.error('CSV または Excel ファイルを選択してください。');
        e.target.value = '';
        return;
      }

      const onlyOneRow = formik.values.rows.length === 1;
      const firstRowIsEmpty =
        onlyOneRow &&
        Object.values(formik.values.rows[0]).every(
          (v) => v === '' || v === 0 || v === null || v === undefined,
        );

      const newRows: ProductRow[] = [];
      const existingRows = formik.values.rows;
      const currentMaxId =
        existingRows.length > 0 ? Math.max(...existingRows.map((r) => Number(r.id || 0))) : 0;
      let nextId = currentMaxId;

      // === CSV handling ===
      if (isCSV) {
        const text = await file.text();
        const lines = text.split(/\r\n|\n/).filter(Boolean); // remove empty lines
        if (lines.length < 1) {
          toast.error('CSV Header missing or empty');
          e.target.value = '';
          return;
        }

        // take header and drop first column
        const headers = lines[0]
          .split(',')
          .map((h) => h.trim().replace(/"/g, ''))
          .slice(1);

        // for each data row: drop first column as well
        for (let i = 1; i < lines.length; i++) {
          const raw = lines[i];
          if (!raw.trim()) continue;
          const cols = raw
            .split(',')
            .map((c) => c.trim().replace(/"/g, ''))
            .slice(1);
          if (cols.every((c) => c === '')) continue;

          const row: ProductRow = {
            id: ++nextId,
            template: '',
            coupon_message1: '',
            coupon_message2: '',
            discount_value: 0,
            discount_unit: '',
            available_condition: '',
            start_date: '',
            end_date: '',
          };

          headers.forEach((h, idx) => {
            const key = headerMapping[h];
            if (!key) return;
            const v = cols[idx] ?? '';

            if (key === 'start_date' || key === 'end_date') {
              (row as any)[key] = parseJapaneseDate(v);
            } else if (key === 'discount_value') {
              row.discount_value = Number(v || 0);
            } else {
              (row as any)[key] = v;
            }
          });

          newRows.push(row);
        }

        if (newRows.length === 0) {
          toast.error('CSVに有効なデータがありません');
          e.target.value = '';
          return;
        }

        if (firstRowIsEmpty) {
          // replace the empty first row with imported rows
          formik.setFieldValue('rows', newRows);
        } else {
          formik.setFieldValue('rows', [...formik.values.rows, ...newRows]);
        }

        setModifiedRowIds((prev) => {
          const next = new Set(prev);
          newRows.forEach((r) => next.add(r.id));
          return next;
        });

        toast.success(`${newRows.length} 件のCSVをインポートしました`);
        e.target.value = '';
        return;
      }

      // === Excel handling ===
      if (isExcel) {
        const XLSX = await import('xlsx');
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<any>(sheet, { header: 1 }) as (string | number)[][];

        if (!json || json.length < 1) {
          toast.error('Excel にデータがありません');
          e.target.value = '';
          return;
        }

        // header: drop first column
        const headers = (json[0] || []).map((h) => String(h ?? '').trim()).slice(1);

        for (let i = 1; i < json.length; i++) {
          const rowArr = json[i] || [];
          // drop first column
          const cols = rowArr.slice(1);
          if (cols.every((c) => c === undefined || c === null || String(c).trim() === '')) continue;

          const item: ProductRow = {
            id: ++nextId,
            template: '',
            coupon_message1: '',
            coupon_message2: '',
            discount_value: 0,
            discount_unit: '',
            available_condition: '',
            start_date: '',
            end_date: '',
          };

          headers.forEach((h, idx) => {
            const key = headerMapping[h];
            if (!key) return;
            const raw = cols[idx];

            if (key === 'start_date' || key === 'end_date') {
              if (typeof raw === 'number') {
                // Excel serial date
                const date = XLSX.SSF.parse_date_code(raw);
                if (date) {
                  const yyyy = date.y;
                  const mm = String(date.m).padStart(2, '0');
                  const dd = String(date.d).padStart(2, '0');
                  const hh = String(date.H).padStart(2, '0');
                  const mi = String(date.M).padStart(2, '0');
                  (item as any)[key] = `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
                }
              } else {
                (item as any)[key] = parseJapaneseDate(String(raw ?? ''));
              }
            } else if (key === 'discount_value') {
              item.discount_value = Number(raw ?? 0);
            } else {
              (item as any)[key] = raw == null ? '' : String(raw);
            }
          });

          newRows.push(item);
        }

        if (newRows.length === 0) {
          toast.error('Excelに有効なデータがありません');
          e.target.value = '';
          return;
        }

        if (firstRowIsEmpty) {
          formik.setFieldValue('rows', newRows);
        } else {
          formik.setFieldValue('rows', [...formik.values.rows, ...newRows]);
        }

        setModifiedRowIds((prev) => {
          const next = new Set(prev);
          newRows.forEach((r) => next.add(r.id));
          return next;
        });

        toast.success(`${newRows.length} 件のExcelをインポートしました`);
        e.target.value = '';
        return;
      }
    };

    // expose validation trigger if needed
    useImperativeHandle(ref, () => ({
      triggerValidation: async () => {
        const touchedRows = formik.values.rows.map((row) =>
          Object.keys(row).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
        );
        await formik.setTouched({ rows: touchedRows } as any);
        const errors = await formik.validateForm();
        return Object.keys(errors).length === 0;
      },
    }));

    return (
      <>
        <Card className="truncate pb-5">
          <CardHeader title="1.テンプレート種類" />
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
                          {formik.values.rows.map((item, index) => (
                            <Table.Row key={`coupon-${item.id ?? index}`}>
                              <Table.Td>{item.id}</Table.Td>

                              <Table.SelectFormik name={`rows[${index}].template`}>
                                {[...Array(18)].map((_, i) => (
                                  <Table.SelectFormikOption key={i} value={`${i + 1}`}>
                                    テンプレート{i + 1}
                                  </Table.SelectFormikOption>
                                ))}
                              </Table.SelectFormik>

                              <Table.InputCellFormik
                                name={`rows[${index}].coupon_message1`}
                                placeholder="特別クーポン"
                              />

                              <Table.InputCellFormik
                                name={`rows[${index}].coupon_message2`}
                                placeholder="今すぐゲット！"
                              />

                              <Table.InputCellFormik name={`rows[${index}].discount_value`} />

                              <Table.SelectFormik name={`rows[${index}].discount_unit`}>
                                <Table.SelectFormikOption value={'円'}>円</Table.SelectFormikOption>
                                <Table.SelectFormikOption value={'%'}>%</Table.SelectFormikOption>
                              </Table.SelectFormik>

                              <Table.InputCellFormik
                                name={`rows[${index}].available_condition`}
                                value={item.available_condition}
                                placeholder="3000円以上"
                              />

                              <Table.InputCellFormik
                                name={`rows[${index}].start_date`}
                                type="datetime-local"
                              />
                              <Table.InputCellFormik
                                name={`rows[${index}].end_date`}
                                type="datetime-local"
                              />

                              <Table.Button
                                onClick={() => deleteTableRow(item.id)}
                                disabled={formik.values.rows.length === 1}
                                className={
                                  formik.values.rows.length === 1
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
                    {/* <CardFooter className="justify-center">
                      <Button type="submit">プレビュー</Button>
                    </CardFooter> */}
                  </Card>
                </div>
              </div>
            </div>
          </form>
        </FormikProvider>

        {/* <div className="flex flex-wrap gap-4 mt-5">
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
        </div> */}
      </>
    );
  },
);

EditableProductTable.displayName = 'EditableProductTable';

export default EditableProductTable;
