// src/app/tools/tool10/components/EditableProductTable.tsx
'use client';

import React, { useId, useRef } from 'react';
import { toast } from 'sonner';
// Thay đổi import component theo path của bạn
import { Table } from '../../../../component/common/Table';
import { TextBox } from '../../../../component/common/TextBox';
import SelectBox from '../../../../component/common/SelectBox';
import { Button } from '../../../../component/common/Button';
import { Card, CardHeader, CardContent } from '../../../../component/common/Card';
import { IconAlertCircle, IconTrash } from '@tabler/icons-react';
import { cn } from '../../../../lib/utils';

// Thay đổi import types và logic
import type { ProductRow, AllErrors, RowErrors } from '../types';
import { templates } from '../constants';
import { createNewProductRow, parseJapaneseDate } from '../lib/utils';

// --- Component hiển thị lỗi (Được trích xuất từ code gốc của bạn) ---
const ErrorDisplay = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="group relative flex items-center pr-2">
      <IconAlertCircle size={16} className="text-red-500 cursor-pointer" />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {message}
      </div>
    </div>
  );
};

// --- Component Bảng Nhập Liệu ---
interface EditableProductTableProps {
  rows: ProductRow[];
  setRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
  errors: AllErrors;
  showErrors: boolean;
  // Thêm prop isProcessing để vô hiệu hóa khi job đang chạy (Chức năng mới)
  isProcessing: boolean;
}

function EditableProductTable({
  rows,
  setRows,
  errors,
  showErrors,
  isProcessing,
}: EditableProductTableProps) {
  const baseId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (id: string, field: keyof ProductRow, value: string) => {
    let processedValue: string | number = value;
    if (field === 'discount') {
      // Cho phép chỉ số và một dấu chấm duy nhất (logic từ code gốc của bạn)
      processedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    }

    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const updatedRow = { ...row, [field]: processedValue };
        return updatedRow;
      }),
    );
  };

  const addRow = () => {
    setRows((prev) => [...prev, createNewProductRow(baseId)]);
  };
  const addMultipleRows = (count: number) => {
    const newRows = Array.from({ length: count }, (_, i) => createNewProductRow(`${baseId}-${i}`));
    setRows((prev) => [...prev, ...newRows]);
  };

  const deleteRow = (id: string) => {
    setRows((prev) => {
      // Vô hiệu hóa xóa nếu job đang chạy
      if (isProcessing) {
        toast.error('処理中は行を削除できません。');
        return prev;
      }
      if (prev.length > 1) {
        return prev.filter((row) => row.id !== id);
      }
      return prev;
    });
  };

  const handleImportCSV = () => {
    if (isProcessing) {
      toast.error('処理中はCSVを取り込めません。');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;
      const lines = text.trim().split(/\r\n|\n/);
      const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
      // Mapping cột CSV sang ProductRow (Logic từ code gốc của bạn)
      const headerMapping: { [key: string]: keyof ProductRow | string } = {
        テンプレート: 'template',
        クーポン文言１: 'couponText1',
        クーポン文言２: 'couponText2',
        '割引(値)': 'discount',
        '割引(単位)': 'discountType',
        使用可能条件: 'conditions',
        開始日時: 'startDate',
        終了日時: 'endDate',
      };

      const newRows: ProductRow[] = lines
        .slice(1)
        .map((line, lineIndex) => {
          const values = line.split(',').map((v) => v.trim().replace(/"/g, ''));
          const rowData = createNewProductRow(`${baseId}-csv-${lineIndex}`);
          headers.forEach((header, index) => {
            const key = headerMapping[header];
            const value = values[index];
            if (!key || value === undefined) return;
            if (['startDate', 'endDate'].includes(key as string)) {
              (rowData as any)[key] = parseJapaneseDate(value);
            } else if (key === 'discountType') {
              rowData.discountType = value === '円' ? 'yen' : 'percent';
            } else {
              (rowData as any)[key] = value;
            }
          });
          return rowData;
        })
        .filter((row) => row.template); // Chỉ giữ lại các dòng có Template

      if (newRows.length > 0) {
        setRows((prev) => [...prev, ...newRows]);
      } else toast.error('CSVファイルの読み込みに失敗したか、内容が空です。');

      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.onerror = () => {
      toast.error('ファイルの読み込み中にエラーが発生しました。');
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file, 'Shift_JIS');
  };

  if (rows.length === 0) return null;

  // ClassName cho input (từ code gốc của bạn)
  const singleInputStyle =
    'w-full h-full !p-2 !border-0 !rounded-none focus:!ring-1 focus:!ring-inset focus:!ring-primary';
  const tieredInputStyle =
    'w-full h-8 !p-1 !border-0 !rounded-none focus:!ring-1 focus:!ring-inset focus:!ring-primary';

  return (
    <Card>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        style={{ display: 'none' }}
      />
      <CardHeader
        title="2. 商品情報入力"
        description="は必須項目です。"
        buttonGroup={
          <>
            <Button color="secondary" onClick={() => addRow()} disabled={isProcessing}>
              行を追加
            </Button>
            <Button color="secondary" onClick={() => addMultipleRows(5)} disabled={isProcessing}>
              5行を追加
            </Button>
            <Button color="grey" onClick={() => handleImportCSV()} disabled={isProcessing}>
              CSVで一括取り込む
            </Button>
          </>
        }
      />
      <CardContent className="pb-8">
        <Table.Root className="w-full table-fixed">
          <Table.Head>
            <Table.Row>
              <Table.Th width="w-[3%]" center>
                #
              </Table.Th>
              <Table.Th width="w-[12%]">テンプレート</Table.Th>
              <Table.Th width="w-[20%]">クーポン文言１</Table.Th>
              <Table.Th width="w-[20%]">クーポン文言2</Table.Th>
              <Table.Th width="w-[7%]">
                割引 <br />
                （値）<span className="text-red-500">*</span>
              </Table.Th>
              <Table.Th width="w-[3%]">
                割引 <br />
                （単位）<span className="text-red-500">*</span>
              </Table.Th>
              <Table.Th width="w-[15%]">
                使用可能条件<span className="text-red-500">*</span>
              </Table.Th>
              <Table.Th width="w-[10%]">開始日時</Table.Th>
              <Table.Th width="w-[10%]">終了日時</Table.Th>
              <Table.Th width="w-[3%]" center>
                削除
              </Table.Th>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {rows.map((row, index) => {
              const rowErrors = errors[row.id] || {};
              const hasError = (fieldName: keyof RowErrors) => showErrors && rowErrors[fieldName];
              return (
                <Table.Row key={row.id}>
                  <Table.Td center className="p-2 align-middle">
                    {index + 1}
                  </Table.Td>
                  {/* Template */}
                  <Table.Td className="p-0 align-middle">
                    <SelectBox
                      label=""
                      id={`template-${row.id}`}
                      className={cn(singleInputStyle, 'truncate')}
                      style={{ margin: '0 8px' }}
                      options={templates.map((t) => ({
                        value: t.name,
                        label: t.name,
                      }))}
                      value={row.template ?? templates[0].name}
                      onChange={(e) => handleInputChange(row.id, 'template', e.target.value)}
                      disabled={isProcessing}
                    />
                  </Table.Td>

                  {/* Coupon Text 1 */}
                  <Table.Td className="p-0 align-middle">
                    <div
                      className={cn(
                        'flex items-center w-full h-full',
                        hasError('couponText1') && 'border border-red-500',
                      )}
                    >
                      <TextBox
                        label=""
                        id={`couponText1-${row.id}`}
                        name={`couponText1-${row.id}`}
                        placeholder="文言を入力"
                        className={cn(singleInputStyle, 'text-center truncate')}
                        value={row.couponText1 ?? ''}
                        onChange={(e) => handleInputChange(row.id, 'couponText1', e.target.value)}
                        disabled={isProcessing}
                      />
                      {hasError('couponText1') && <ErrorDisplay message={rowErrors.couponText1} />}
                    </div>
                  </Table.Td>

                  {/* Coupon Text 2 */}
                  <Table.Td className="p-0 align-middle">
                    <div
                      className={cn(
                        'flex items-center w-full h-full',
                        hasError('couponText2') && 'border border-red-500',
                      )}
                    >
                      <TextBox
                        label=""
                        id={`couponText2-${row.id}`}
                        name={`couponText2-${row.id}`}
                        placeholder="文言を入力"
                        className={cn(singleInputStyle, 'text-center truncate')}
                        value={row.couponText2}
                        onChange={(e) => handleInputChange(row.id, 'couponText2', e.target.value)}
                        disabled={isProcessing}
                      />
                      {hasError('couponText2') && <ErrorDisplay message={rowErrors.couponText2} />}
                    </div>
                  </Table.Td>

                  {/* Discount Value */}
                  <Table.Td>
                    <div
                      className={cn(
                        'flex items-center w-full h-full',
                        hasError('discount') && 'border border-red-500',
                      )}
                    >
                      <TextBox
                        label=""
                        id={`discount-${row.id}`}
                        name={`discount-${row.id}`}
                        className={cn(tieredInputStyle, 'text-center bg-gray-100 truncate w-full')}
                        value={row.discount}
                        onChange={(e) => handleInputChange(row.id, 'discount', e.target.value)}
                        disabled={isProcessing}
                      />
                      {hasError('discount') && <ErrorDisplay message={rowErrors.discount} />}
                    </div>
                  </Table.Td>

                  {/* Discount Type */}
                  <Table.Td>
                    <SelectBox
                      label=""
                      id={`discountType-${row.id}`}
                      className={cn(
                        tieredInputStyle,
                        'text-center truncate border-b border-gray-300',
                      )}
                      style={{ width: '5rem' }}
                      options={[
                        { value: 'percent', label: '%' },
                        { value: 'yen', label: '円' },
                      ]}
                      value={row.discountType}
                      onChange={(e) => handleInputChange(row.id, 'discountType', e.target.value)}
                      disabled={isProcessing}
                    />
                  </Table.Td>

                  {/* Conditions */}
                  <Table.Td className="p-0 align-middle">
                    <div
                      className={cn(
                        'flex items-center w-full h-full',
                        hasError('conditions') && 'border border-red-500',
                      )}
                    >
                      <TextBox
                        label=""
                        id={`conditions-${row.id}`}
                        name={`conditions-${row.id}`}
                        placeholder="文言を入力"
                        className={cn(singleInputStyle, 'text-center truncate')}
                        value={row.conditions}
                        onChange={(e) => handleInputChange(row.id, 'conditions', e.target.value)}
                        disabled={isProcessing}
                      />
                      {hasError('conditions') && <ErrorDisplay message={rowErrors.conditions} />}
                    </div>
                  </Table.Td>

                  {/* Start Date */}
                  <Table.Td>
                    <div className="w-full">
                      <TextBox
                        type="datetime-local"
                        label=""
                        id={`startDate-${row.id}`}
                        name={`startDate-${row.id}`}
                        className={cn(
                          tieredInputStyle,
                          'truncate w-full',
                          hasError('startDate') && 'border border-red-500',
                        )}
                        value={row.startDate}
                        onChange={(e) => handleInputChange(row.id, 'startDate', e.target.value)}
                        disabled={isProcessing}
                      />
                      {hasError('startDate') && <ErrorDisplay message={rowErrors.startDate} />}
                    </div>
                  </Table.Td>

                  {/* End Date */}
                  <Table.Td>
                    <div className="w-full">
                      <TextBox
                        type="datetime-local"
                        label=""
                        id={`endDate-${row.id}`}
                        name={`endDate-${row.id}`}
                        className={cn(
                          tieredInputStyle,
                          'truncate w-full',
                          hasError('endDate') && 'border border-red-500',
                        )}
                        value={row.endDate}
                        onChange={(e) => handleInputChange(row.id, 'endDate', e.target.value)}
                        disabled={isProcessing}
                      />
                      {hasError('endDate') && <ErrorDisplay message={rowErrors.endDate} />}
                    </div>
                  </Table.Td>

                  {/* Delete Button */}
                  <Table.Td center className="p-1 align-middle">
                    <button
                      onClick={() => deleteRow(row.id)}
                      className={`p-1 ${
                        rows.length > 1 && !isProcessing
                          ? 'text-gray-400 hover:text-red-600'
                          : 'text-gray-200 cursor-not-allowed'
                      }`}
                      disabled={rows.length <= 1 || isProcessing}
                    >
                      <IconTrash size={20} />
                    </button>
                  </Table.Td>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </CardContent>
    </Card>
  );
}

export default EditableProductTable;
