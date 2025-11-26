'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import SelectBox from '@/component/common/SelectBox';
import { Table } from '@/component/common/Table';
import { TextBox } from '@/component/common/TextBox';
import { cn } from '@/lib/utils';
import { IconAlertCircle, IconLoader2, IconTrash } from '@tabler/icons-react';
import { FieldArray, Form, Formik, useFormikContext } from 'formik';
import React, { forwardRef, useEffect, useId, useImperativeHandle, useRef } from 'react';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { templates } from '../constants';
import { calculateDiscountDisplay, createNewProductRow, parseJapaneseDate } from '../lib/utils';
import type { AllErrors, ProductRow } from '../types';

// --- 1. VALIDATION SCHEMA ---
const ValidationSchema = Yup.object().shape({
  rows: Yup.array().of(
    Yup.object().shape({
      productCode: Yup.string()
        .required('必須項目です。')
        .test('unique', '番号が重複しています。', function (value) {
          if (!value) return true;
          const { rows } = this.from![1].value as { rows: ProductRow[] };
          const count = rows.filter((r) => r.productCode === value).length;
          return count <= 1;
        }),
      template: Yup.string().required('必須項目です。'),
      startDate: Yup.string().required('必須項目です。'),
      endDate: Yup.string().required('必須項目です。'),
      priceType: Yup.string().required('必須項目です。'),
      regularPrice: Yup.string()
        .required('必須項目です。')
        .matches(/^[0-9]+$/, '数字のみで入力してください。'),
      salePrice: Yup.string()
        .required('必須項目です。')
        .matches(/^[0-9]+$/, '数字のみで入力してください。')
        .test('price-compare', '通常価格より低く設定してください。', function (value) {
          const regular = this.parent.regularPrice;
          if (!value || !regular) return true;
          const regNum = Number(regular);
          const saleNum = Number(value);
          if (!isNaN(regNum) && !isNaN(saleNum)) {
            return saleNum < regNum;
          }
          return true;
        }),
      discountType: Yup.string().required('必須項目です。'),
      saleText: Yup.string().required('必須項目です。').max(12, '12文字以内で入力してください。'),
    }),
  ),
});

// --- 2. HELPER COMPONENTS ---
const FormObserver = ({
  setRows,
  setModifiedRowIds,
}: {
  setRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
  setModifiedRowIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}) => {
  const { values } = useFormikContext<{ rows: ProductRow[] }>();
  const prevRowsRef = useRef<string>(JSON.stringify(values.rows));

  useEffect(() => {
    const currentRowsStr = JSON.stringify(values.rows);
    if (currentRowsStr !== prevRowsRef.current) {
      setRows(values.rows);
      prevRowsRef.current = currentRowsStr;
    }
  }, [values.rows, setRows]);

  return null;
};

// Component hiển thị lỗi với khả năng tùy chỉnh vị trí (className)
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
      const touchedRows = values.rows.map((row) => {
        return Object.keys(row).reduce((acc, key) => ({ ...acc, [key]: true }), {});
      });
      await setTouched({ rows: touchedRows } as any);

      const errors = await validateForm();
      const isValid = Object.keys(errors).length === 0;
      return isValid;
    },
  }));
  return null;
};

// --- 3. MAIN COMPONENT ---
export interface EditableProductTableHandle {
  triggerValidation: () => Promise<boolean>;
}

interface EditableProductTableProps {
  rows: ProductRow[];
  setRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
  errors: AllErrors;
  showErrors: boolean;
  setModifiedRowIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  jobId: string | null;
  setJobId: React.Dispatch<React.SetStateAction<string | null>>;
  disabled?: boolean;
}

const EditableProductTable = forwardRef<EditableProductTableHandle, EditableProductTableProps>(
  ({ rows, setRows, setModifiedRowIds, jobId, setJobId, disabled = false }, ref) => {
    const baseId = useId();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const inputCellStyle = 'text-sm text-center truncate';
    const selectCellStyle =
      'text-sm text-left truncate !border-0 !shadow-none !ring-0 focus:!ring-1 focus:!ring-inset focus:!ring-primary';
    const tieredContainerStyle = 'flex flex-col h-full';
    const tieredInputWrapperStyle = 'relative border-b border-gray-300 last:border-b-0 flex-1';
    const tieredTextBoxClass =
      'w-full h-full min-h-[32px] px-2 py-1 text-sm border-0 rounded-none focus:ring-1 focus:ring-inset focus:ring-primary';

    const handleImportCSV = (currentRows: ProductRow[], setFieldValue: any) => {
      fileInputRef.current?.click();
      fileInputRef.current!.onchange = (event: any) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          if (!text) return;
          try {
            const lines = text.trim().split(/\r\n|\n/);
            if (lines.length < 2) {
              toast.error('CSV Header missing or empty');
              return;
            }
            const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
            const headerMapping: { [key: string]: keyof ProductRow | string } = {
              商品管理番号: 'productCode',
              テンプレート: 'template',
              開始日時: 'startDate',
              終了日時: 'endDate',
              二重価格: 'priceType',
              価格: 'regularPrice',
              セール価格: 'salePrice',
              セール文言: 'saleText',
              割引表示: 'discountType',
              楽天モバイル開始日時: 'mobileStartDate',
              楽天モバイル終了日時: 'mobileEndDate',
            };
            const standardPriceTypes = [
              '当店通常価格',
              'メーカー希望小売価格',
              'クーポン利用で',
              '単品合計価格',
            ];
            const newRows: ProductRow[] = [];
            lines.slice(1).forEach((line, lineIndex) => {
              if (!line.trim()) return;
              const values = line.split(',').map((v) => v.trim().replace(/"/g, ''));
              const rowData = createNewProductRow(`${baseId}-csv-${Date.now()}-${lineIndex}`);
              headers.forEach((header, index) => {
                const key = headerMapping[header];
                const value = values[index];
                if (!key || value === undefined) return;
                if (key === 'priceType')
                  rowData.priceType = standardPriceTypes.includes(value) ? value : '当店通常価格';
                else if (['startDate', 'endDate', 'mobileStartDate', 'mobileEndDate'].includes(key))
                  (rowData as any)[key] = parseJapaneseDate(value);
                else if (key === 'discountType')
                  rowData.discountType = value === '円' ? 'yen' : 'percent';
                else (rowData as any)[key] = value;
              });
              rowData.discount = calculateDiscountDisplay(
                rowData.regularPrice,
                rowData.salePrice,
                rowData.discountType,
              );
              if (rowData.productCode) newRows.push(rowData);
            });
            if (newRows.length > 0) {
              const isTableEmpty = currentRows.length === 1 && !currentRows[0].productCode;
              const finalRows = isTableEmpty ? newRows : [...currentRows, ...newRows];
              setFieldValue('rows', finalRows);
              setModifiedRowIds((prev) => {
                const next = new Set(prev);
                finalRows.forEach((r) => next.add(r.id));
                return next;
              });
              toast.success(`${newRows.length} 件インポートしました`);
            }
          } catch (error) {
            console.error(error);
            toast.error('CSV Parse Error');
          } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
          }
        };
        reader.readAsText(file, 'Shift_JIS');
      };
    };

    return (
      <Formik
        initialValues={{ rows: rows }}
        validationSchema={ValidationSchema}
        enableReinitialize={true}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form>
            <FormObserver setRows={setRows} setModifiedRowIds={setModifiedRowIds} />
            <FormRefHandler onValidateRef={ref} />

            <div className="relative">
              {disabled && (
                <div className="absolute inset-0 bg-gray-100 bg-opacity-80 flex flex-col items-center justify-center z-10 rounded-lg">
                  <IconLoader2 size={32} className="animate-spin text-primary mb-2" />
                  <p className="text-sm font-semibold text-gray-700">画像生成中...</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} accept=".csv" style={{ display: 'none' }} />

              <Card>
                <CardHeader
                  title="1. 商品情報入力"
                  description="は必須項目です。"
                  isSticky={true}
                  showDescAsterisk
                  buttonGroup={
                    <FieldArray name="rows">
                      {({ push }) => (
                        <>
                          <Button
                            color="secondary"
                            type="button"
                            onClick={() => push(createNewProductRow(`${baseId}-${Date.now()}`))}
                          >
                            行を追加
                          </Button>
                          <Button
                            color="secondary"
                            type="button"
                            onClick={() => {
                              for (let i = 0; i < 5; i++)
                                push(createNewProductRow(`${baseId}-${Date.now()}-${i}`));
                            }}
                          >
                            5行を追加
                          </Button>
                          <Button
                            color="grey"
                            type="button"
                            onClick={() => handleImportCSV(values.rows, setFieldValue)}
                          >
                            CSVで一括取り込む
                          </Button>
                        </>
                      )}
                    </FieldArray>
                  }
                />
                <CardContent className="pb-8">
                  <Table.Root className="w-full table-fixed">
                    <Table.Head>
                      <Table.Row>
                        <Table.Th width="w-[4%]" center>
                          ID
                        </Table.Th>
                        <Table.Th width="w-[9%]">
                          商品管理番号<span className="text-red-500">*</span>
                        </Table.Th>
                        <Table.Th width="w-[8%]">
                          テンプレート<span className="text-red-500">*</span>
                        </Table.Th>
                        <Table.Th width="w-[15%]">
                          開始 / 終了日時<span className="text-red-500">*</span>
                        </Table.Th>
                        <Table.Th width="w-[15%]">
                          二重価格<span className="text-red-500">*</span>
                        </Table.Th>
                        <Table.Th width="w-[7%]">
                          価格<span className="text-red-500">*</span>
                        </Table.Th>
                        <Table.Th width="w-[9%]">
                          セール価格<span className="text-red-500">*</span>
                        </Table.Th>
                        <Table.Th width="w-[8%]">
                          割引表示<span className="text-red-500">*</span>
                        </Table.Th>
                        <Table.Th width="w-[10%]">
                          セール文言<span className="text-red-500">*</span>
                        </Table.Th>
                        <Table.Th width="w-[13%]">
                          楽天モバイル
                          <br />
                          開始 / 終了日時
                        </Table.Th>
                        <Table.Th width="w-[4%]" center>
                          削除
                        </Table.Th>
                      </Table.Row>
                    </Table.Head>

                    <FieldArray name="rows">
                      {({ remove }) => (
                        <Table.Body>
                          {values.rows.map((row, index) => {
                            const getError = (field: keyof ProductRow) => {
                              const rowErrors = errors.rows?.[index] as unknown as
                                | Record<string, string>
                                | undefined;
                              const rowTouched = touched.rows?.[index] as unknown as
                                | Record<string, boolean>
                                | undefined;

                              if (rowTouched?.[field] && rowErrors?.[field])
                                return rowErrors[field];
                              return undefined;
                            };

                            const handleChange = (field: keyof ProductRow, val: any) => {
                              setFieldValue(`rows[${index}].${field}`, val);
                              setModifiedRowIds((prev) => new Set(prev).add(row.id));
                            };

                            const handlePriceChange = (
                              field: 'regularPrice' | 'salePrice' | 'discountType',
                              val: any,
                            ) => {
                              let newReg = row.regularPrice;
                              let newSale = row.salePrice;
                              let newType = row.discountType;

                              if (field === 'regularPrice') newReg = val;
                              if (field === 'salePrice') newSale = val;
                              if (field === 'discountType') newType = val;

                              setFieldValue(`rows[${index}].${field}`, val);
                              setModifiedRowIds((prev) => new Set(prev).add(row.id));

                              const newDiscount = calculateDiscountDisplay(
                                newReg,
                                newSale,
                                newType as any,
                              );
                              if (newDiscount !== row.discount) {
                                setFieldValue(`rows[${index}].discount`, newDiscount);
                              }
                            };

                            return (
                              <Table.Row key={row.id}>
                                <Table.Td center className="p-2 align-middle">
                                  {index + 1}
                                </Table.Td>

                                <Table.InputCell
                                  id={`productCode-${row.id}`}
                                  className={inputCellStyle}
                                  value={row.productCode}
                                  onChange={(e) => handleChange('productCode', e.target.value)}
                                  errorMsg={getError('productCode')}
                                />

                                <Table.SelectBox
                                  id={`template-${row.id}`}
                                  value={row.template}
                                  onChange={(e) => handleChange('template', e.target.value)}
                                  className={selectCellStyle}
                                >
                                  {templates.map((t) => (
                                    <Table.Option key={t.id} value={t.name}>
                                      {t.label}
                                    </Table.Option>
                                  ))}
                                </Table.SelectBox>

                                {/* Date Range */}
                                <Table.Td className="p-0 align-top">
                                  <div className={tieredContainerStyle}>
                                    <div className={tieredInputWrapperStyle}>
                                      <TextBox
                                        id={`startDate-${row.id}`}
                                        name={`dummy_startDate_${row.id}`}
                                        type="datetime-local"
                                        label=""
                                        showLabel={false}
                                        className={cn(
                                          tieredTextBoxClass,
                                          getError('startDate') &&
                                            '!ring-1 !ring-red-500 !ring-inset',
                                        )}
                                        value={row.startDate}
                                        onChange={(e) => handleChange('startDate', e.target.value)}
                                      />

                                      <ErrorTooltip
                                        error={getError('startDate')}
                                        className="right-8"
                                      />
                                    </div>
                                    <div className={tieredInputWrapperStyle}>
                                      <TextBox
                                        id={`endDate-${row.id}`}
                                        name={`dummy_endDate_${row.id}`}
                                        type="datetime-local"
                                        label=""
                                        showLabel={false}
                                        className={cn(
                                          tieredTextBoxClass,
                                          getError('endDate') &&
                                            '!ring-1 !ring-red-500 !ring-inset',
                                        )}
                                        value={row.endDate}
                                        onChange={(e) => handleChange('endDate', e.target.value)}
                                      />
                                      <ErrorTooltip
                                        error={getError('endDate')}
                                        className="right-8"
                                      />
                                    </div>
                                  </div>
                                </Table.Td>

                                <Table.SelectBox
                                  id={`priceType-${row.id}`}
                                  value={row.priceType}
                                  onChange={(e) => handleChange('priceType', e.target.value)}
                                  className={selectCellStyle}
                                >
                                  <Table.Option value="当店通常価格">当店通常価格</Table.Option>
                                  <Table.Option value="メーカー希望小売価格">
                                    メーカー希望小売価格
                                  </Table.Option>
                                  <Table.Option value="クーポン利用で">クーポン利用で</Table.Option>
                                  <Table.Option value="単品合計価格">単品合計価格</Table.Option>
                                </Table.SelectBox>

                                <Table.InputCell
                                  type="text"
                                  inputMode="numeric"
                                  id={`regularPrice-${row.id}`}
                                  className={inputCellStyle}
                                  value={row.regularPrice}
                                  onChange={(e) =>
                                    handlePriceChange(
                                      'regularPrice',
                                      e.target.value.replace(/[^0-9]/g, ''),
                                    )
                                  }
                                  errorMsg={getError('regularPrice')}
                                />

                                <Table.InputCell
                                  type="text"
                                  inputMode="numeric"
                                  id={`salePrice-${row.id}`}
                                  className={inputCellStyle}
                                  value={row.salePrice}
                                  onChange={(e) =>
                                    handlePriceChange(
                                      'salePrice',
                                      e.target.value.replace(/[^0-9]/g, ''),
                                    )
                                  }
                                  errorMsg={getError('salePrice')}
                                />

                                {/* Discount Type */}
                                <Table.Td className="p-0 align-top">
                                  <div className={tieredContainerStyle}>
                                    <div className={tieredInputWrapperStyle}>
                                      <SelectBox
                                        id={`discountType-${row.id}`}
                                        name={`rows[${index}].discountType`}
                                        classNameSelect={cn(
                                          tieredTextBoxClass,
                                          'text-center truncate !border-0',
                                        )}
                                        options={[
                                          { value: 'percent', label: '%' },
                                          { value: 'yen', label: '円' },
                                        ]}
                                        value={row.discountType}
                                        onChange={(e) =>
                                          handlePriceChange('discountType', e.target.value)
                                        }
                                        classNameParent="!mb-0 h-full"
                                      />
                                    </div>
                                    <div className="flex-1 w-full h-full min-h-[32px] px-2 py-1 text-sm border-0 rounded-none bg-gray-100 flex items-center justify-center">
                                      {row.discount || '-'}
                                    </div>
                                  </div>
                                </Table.Td>

                                <Table.InputCell
                                  id={`saleText-${row.id}`}
                                  placeholder="文言を入力"
                                  className={inputCellStyle}
                                  value={row.saleText}
                                  onChange={(e) => handleChange('saleText', e.target.value)}
                                  errorMsg={getError('saleText')}
                                />

                                {/* Mobile Dates */}
                                <Table.Td className="p-0 align-top">
                                  <div className={tieredContainerStyle}>
                                    <div className={tieredInputWrapperStyle}>
                                      <TextBox
                                        id={`mobileStartDate-${row.id}`}
                                        name={`dummy_mobileStartDate_${row.id}`}
                                        type="datetime-local"
                                        label=""
                                        showLabel={false}
                                        className={tieredTextBoxClass}
                                        value={row.mobileStartDate}
                                        onChange={(e) =>
                                          handleChange('mobileStartDate', e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className={tieredInputWrapperStyle}>
                                      <TextBox
                                        id={`mobileEndDate-${row.id}`}
                                        name={`dummy_mobileEndDate_${row.id}`}
                                        type="datetime-local"
                                        label=""
                                        showLabel={false}
                                        className={tieredTextBoxClass}
                                        value={row.mobileEndDate}
                                        onChange={(e) =>
                                          handleChange('mobileEndDate', e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                </Table.Td>

                                <Table.Button
                                  onClick={() => {
                                    if (values.rows.length > 1) remove(index);
                                    else {
                                      setFieldValue(
                                        `rows[0]`,
                                        createNewProductRow(`reset-${Date.now()}`),
                                      );
                                      setJobId(null);
                                    }
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-600 disabled:text-gray-200 disabled:cursor-not-allowed"
                                  disabled={values.rows.length <= 1 && !!jobId}
                                >
                                  <IconTrash size={20} />
                                </Table.Button>
                              </Table.Row>
                            );
                          })}
                        </Table.Body>
                      )}
                    </FieldArray>
                  </Table.Root>
                </CardContent>
              </Card>
            </div>
          </Form>
        )}
      </Formik>
    );
  },
);

EditableProductTable.displayName = 'EditableProductTable';

export default EditableProductTable;
