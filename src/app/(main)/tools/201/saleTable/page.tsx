'use client';

import { Card, CardContent, CardHeader } from '@/component/common/Card';
import SelectBox from '@/component/common/SelectBox';
import { Table } from '@/component/common/Table';
import { FormikProvider, useFormik } from 'formik';
import { useEffect } from 'react';

type RowType = {
  id: number;
  productNo: string;
  sku: string;
  originalPrice: number;
  salePrice: number;
  afterSalePrice: number;
  selectBoxValue: string;
};

const initialRows: RowType[] = [
  {
    id: 1,
    productNo: 'P-001',
    sku: 'SKU-001',
    originalPrice: 1000,
    salePrice: 1000,
    afterSalePrice: 1000,
    selectBoxValue: '',
  },
  {
    id: 2,
    productNo: 'P-002',
    sku: 'SKU-002',
    originalPrice: 2000,
    salePrice: 2000,
    afterSalePrice: 2000,
    selectBoxValue: '',
  },
];

const Page = () => {
  const formik = useFormik({
    initialValues: {
      salePercent: 0,
      applyAll: false,
      rows: initialRows,
    },
    onSubmit: (values) => {
      console.log('Submit values:', values);
    },
  });

  const { values, setFieldValue } = formik;

  // Apply All logic
  useEffect(() => {
    if (values.applyAll) {
      const updatedRows = values.rows.map((row) => {
        const newPrice = Math.round(row.originalPrice * (1 - values.salePercent / 100));
        return { ...row, salePrice: newPrice, afterSalePrice: newPrice };
      });
      setFieldValue('rows', updatedRows);
    }
  }, [values.salePercent, values.applyAll]);

  const updateRow = (id: number, key: keyof RowType, value: string | number) => {
    const updatedRows = values.rows.map((row) => (row.id === id ? { ...row, [key]: value } : row));
    setFieldValue('rows', updatedRows);
  };

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <CardHeader title="Product Table" />
          <CardContent>
            <Table.Container className="min-w-[1000px]">
              <Table.Head>
                <Table.Row>
                  <Table.Th rowSpan={2} className="w-8 text-center">
                    #
                  </Table.Th>
                  <Table.Th colSpan={2}>商品番号</Table.Th>
                  <Table.Th colSpan={3}>セール中価格</Table.Th>
                  <Table.Th colSpan={3}>セール後価格</Table.Th>
                </Table.Row>
                <Table.Row>
                  <Table.Th>商品管理番号</Table.Th>
                  <Table.Th>SKU管理番号</Table.Th>
                  <Table.Th className="min-w-[120px] text-center">表示価格文言</Table.Th>
                  <Table.Th>表示価格</Table.Th>
                  <Table.Th>
                    <div className="flex items-center gap-1">
                      <span>販売価格</span>
                      <input
                        type="number"
                        className="w-16 border border-gray-300 rounded px-1 py-0.5 text-right"
                        value={values.salePercent}
                        onChange={(e) => setFieldValue('salePercent', Number(e.target.value))}
                      />
                      <span>%</span>
                      <label className="flex items-center gap-1 ml-2">
                        <input
                          type="checkbox"
                          checked={values.applyAll}
                          onChange={(e) => setFieldValue('applyAll', e.target.checked)}
                        />
                        <span className="text-xs">全て適用</span>
                      </label>
                    </div>
                  </Table.Th>
                  <Table.Th className="min-w-[120px] text-center">表示価格文言</Table.Th>
                  <Table.Th>表示価格</Table.Th>
                  <Table.Th>販売価格</Table.Th>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {values.rows.map((row, index) => (
                  <Table.Row key={row.id}>
                    <Table.Td className="text-center w-8">{index + 1}</Table.Td>

                    <Table.Td>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-1 py-0.5"
                        value={row.productNo}
                        onChange={(e) => updateRow(row.id, 'productNo', e.target.value)}
                      />
                    </Table.Td>

                    <Table.Td>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-1 py-0.5"
                        value={row.sku}
                        onChange={(e) => updateRow(row.id, 'sku', e.target.value)}
                      />
                    </Table.Td>

                    <Table.Td className="min-w-[120px]">
                      <SelectBox
                        id={`select-${row.id}`}
                        name={`rows.${row.id}.selectBoxValue`}
                        value={row.selectBoxValue}
                        options={[
                          { value: '', label: '当店通常価格' },
                          { value: '1', label: '' },
                          { value: '2', label: '' },
                          { value: '3', label: '' },
                        ]}
                        isRequired
                      />
                    </Table.Td>

                    <Table.Td>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded px-1 py-0.5 text-right"
                        value={row.originalPrice}
                        onChange={(e) => updateRow(row.id, 'originalPrice', Number(e.target.value))}
                      />
                    </Table.Td>

                    <Table.Td className="text-black-500 font-semibold">
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded px-1 py-0.5 text-right text-red-500 font-semibold"
                        value={row.salePrice}
                        onChange={(e) => updateRow(row.id, 'salePrice', Number(e.target.value))}
                      />
                    </Table.Td>

                    <Table.Td className="min-w-[120px]">
                      <SelectBox
                        id={`select2-${row.id}`}
                        name={`rows.${row.id}.selectBoxValue`}
                        value={row.selectBoxValue}
                        options={[
                          { value: '', label: '当店通常価格' },
                          { value: 'apple', label: 'apple' },
                          { value: 'banana', label: 'banana' },
                          { value: 'orange', label: 'orange' },
                        ]}
                        isRequired
                      />
                    </Table.Td>

                    <Table.Td>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded px-1 py-0.5 text-right"
                        value={row.afterSalePrice}
                        onChange={(e) =>
                          updateRow(row.id, 'afterSalePrice', Number(e.target.value))
                        }
                      />
                    </Table.Td>

                    <Table.Td>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded px-1 py-0.5 text-right"
                        value={row.afterSalePrice}
                        onChange={(e) =>
                          updateRow(row.id, 'afterSalePrice', Number(e.target.value))
                        }
                      />
                    </Table.Td>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Container>
          </CardContent>
        </Card>
      </form>
    </FormikProvider>
  );
};

export default Page;
