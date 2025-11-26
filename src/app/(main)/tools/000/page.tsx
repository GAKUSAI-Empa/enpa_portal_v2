'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import SelectBox from '@/component/common/SelectBox';
import { Table } from '@/component/common/Table';
import { Tabs, TabsContent } from '@/component/common/Tabs';
import { TextBox } from '@/component/common/TextBox';
import { IconTrash } from '@tabler/icons-react';
import { FormikProvider, useFormik } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import * as Yup from 'yup';
import SliderImage from './components/SliderImage';

type TableItem = {
  id: number;
  couponImageURL: string;
  couponURL: string;
  commonSetting: boolean;
  startDate1: string;
  endDate1: string;
};

type Table2Item = {
  id: number;
  textNavi: string;
  textSesson: string;
  textURL: string;
};

type ProductRow = {
  id: number;
  section: string;
  imageSize: string;
  productNameDisplay: string;
  productNameSEO: string;
  description: string;
  normalPrice: string;
  salePrice: string;
  productURL: string;
  imageURL: string;
};

const Page = () => {
  // ---------- Formik for サムネイル作成 ----------
  const pageFormik = useFormik({
    initialValues: {
      eventName: '', // select (SelectBox uses FormikContext)
      logoURL: '',
      saleStartDate: '',
      saleEndDate: '',
      startDate: '',
      endDate: '',
      imageURL: '',
    },
    validationSchema: Yup.object({
      eventName: Yup.string().trim().required('作成ファイル名を入力してください'),
      logoURL: Yup.string().trim().required('店舗ロゴ画像URLを入力してください'),
      saleStartDate: Yup.string().trim().required('セール開始日時を入力してください'),
      saleEndDate: Yup.string().trim().required('修了日時を入力してください'),
      startDate: Yup.string().trim().required('開始日時を入力してください'),
      endDate: Yup.string().trim().required('修了日時を入力してください'),
    }),
    onSubmit: (values) => {
      // formik submit if needed, but we will handle preview via button handler
      console.log('Formik submit', values);
    },
  });

  // ---------- Table (クーポン) ----------
  const [TableList, setTableList] = useState<TableItem[]>([
    {
      id: 1,
      couponImageURL: '',
      couponURL: '',
      commonSetting: true,
      startDate1: '',
      endDate1: '',
    },
  ]);

  const addTableRow = useCallback((numberRow: number = 1) => {
    setTableList((prev) => {
      const newRows: TableItem[] = [];
      for (let i = 0; i < numberRow; i++) {
        newRows.push({
          id: prev.length + i + 1,
          couponImageURL: '',
          couponURL: '',
          commonSetting: true,
          startDate1: '',
          endDate1: '',
        });
      }
      return [...prev, ...newRows];
    });
  }, []);

  const deleteTableRow = useCallback((id: number) => {
    setTableList((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return filtered.map((r, index) => ({ ...r, id: index + 1 }));
    });
  }, []);

  const updateTableCell = useCallback((id: number, key: keyof TableItem, value: any) => {
    setTableList((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  }, []);

  // ---------- Section ----------
  const [sectionList, setSectionList] = useState<Table2Item[]>([
    { id: 1, textNavi: '', textSesson: '', textURL: '' },
  ]);

  const addSectionRow = useCallback((numberRow: number = 1) => {
    setSectionList((prev) => {
      const newRows: Table2Item[] = [];
      for (let i = 0; i < numberRow; i++) {
        newRows.push({
          id: prev.length + i + 1,
          textNavi: '',
          textSesson: '',
          textURL: '',
        });
      }
      return [...prev, ...newRows];
    });
  }, []);

  const deleteSectionRow = useCallback((id: number) => {
    setSectionList((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return filtered.map((r, index) => ({ ...r, id: index + 1 }));
    });
  }, []);

  const updateSectionCell = useCallback((id: number, key: keyof Table2Item, value: any) => {
    setSectionList((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  }, []);

  // ---------- Product ----------
  const [productList, setProductList] = useState<ProductRow[]>([
    {
      id: 1,
      section: '',
      imageSize: 'large', // default
      productNameDisplay: '',
      productNameSEO: '',
      description: '',
      normalPrice: '',
      salePrice: '',
      productURL: '',
      imageURL: '',
    },
  ]);

  const addProductRow = useCallback((numberRow: number = 1) => {
    setProductList((prev) => {
      const newRows: ProductRow[] = [];
      for (let i = 0; i < numberRow; i++) {
        newRows.push({
          id: prev.length + i + 1,
          section: '',
          imageSize: 'large',
          productNameDisplay: '',
          productNameSEO: '',
          description: '',
          normalPrice: '',
          salePrice: '',
          productURL: '',
          imageURL: '',
        });
      }
      return [...prev, ...newRows];
    });
  }, []);

  const deleteProductRow = useCallback((id: number) => {
    setProductList((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return filtered.map((r, index) => ({ ...r, id: index + 1 }));
    });
  }, []);

  const updateProductCell = useCallback((id: number, key: keyof ProductRow, value: any) => {
    setProductList((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  }, []);

  // Memoize section options for product select
  const sectionOptions = useMemo(
    () =>
      sectionList.map((s) => ({
        value: s.textNavi || `section-${s.id}`,
        label: s.textNavi || `セクション ${s.id}`,
      })),
    [sectionList],
  );

  // ---------- Preview handler ----------
  const handlePreview = async () => {
    // Validate form trước
    const errors = await pageFormik.validateForm();
    if (Object.keys(errors).length > 0) {
      // Nếu có lỗi, hiển thị alert hoặc highlight form
      alert('入力にエラーがあります。すべての必須項目を入力してください。');
      pageFormik.setTouched(
        Object.keys(pageFormik.initialValues).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
      );
      return;
    }

    // Lấy tất cả dữ liệu form + table + section + product
    const allData = {
      ...pageFormik.values,
      coupons: TableList,
      sections: sectionList,
      products: productList,
    };

    try {
      localStorage.setItem('previewData', JSON.stringify(allData));
      // Mở trang preview
      window.open('/000/preview', '_blank');
    } catch (e) {
      console.error('Failed to save preview data', e);
      alert('プレビュー用のデータ保存に失敗しました。');
    }
  };

  return (
    <Tabs defaultTab="tab1">
      <TabsContent value="tab1">
        <FormikProvider value={pageFormik}>
          <form onSubmit={pageFormik.handleSubmit}>
            <Card>
              <CardHeader title="1.テンプレート選択" />
              <CardContent>
                <SliderImage
                  value={pageFormik.values.imageURL}
                  onChange={(val: string) => pageFormik.setFieldValue('imageURL', val)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="2.イベント情報" />
              <CardContent>
                {/* SelectBox is Formik-aware: just give name/id */}
                <SelectBox
                  id="eventName"
                  label="イベント名"
                  name="eventName"
                  width="full"
                  options={[
                    { value: '', label: '選択してください' },
                    { value: 'お買い物マラソン', label: 'お買い物マラソン' },
                    { value: '楽天スーパーSALE', label: '楽天スーパーSALE' },
                    { value: 'その他', label: 'その他' },
                  ]}
                  isRequired={true}
                />

                {/* TextBox is Formik-aware */}
                <TextBox
                  id="logoURL"
                  name="logoURL"
                  isRequired={true}
                  label={'店舗ロゴ画像URL'}
                  placeholder="https://image.rakuten.co.jp/shop/cabinet/logo.jpg"
                  direction="vertical"
                />

                <div className="flex flex-col">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextBox
                      id="saleStartDate"
                      name="saleStartDate"
                      type="datetime-local"
                      direction="vertical"
                      label="セール開始日時"
                    />
                    <TextBox
                      id="saleEndDate"
                      name="saleEndDate"
                      type="datetime-local"
                      direction="vertical"
                      label="修了日時（共通）"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="3.クーポン設定" />
              <CardContent>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    共通のクーポン期間
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextBox
                      id="startDate"
                      name="startDate"
                      type="datetime-local"
                      direction="vertical"
                      label="開始日時（共通）"
                    />
                    <TextBox
                      id="endDate"
                      name="endDate"
                      type="datetime-local"
                      direction="vertical"
                      label="修了日時（共通）"
                    />
                  </div>
                  <label className="text-sm text-gray-500 mt-2">
                    ここに日時を設定すると、下の各クーポンで、「共通設定を使用する」がチェックされているものに適用されます。
                  </label>
                </div>

                <div className="flex gap-3 mt-3 mb-3">
                  <Button color="secondary" size="sm" onClick={() => addTableRow(1)}>
                    行を追加
                  </Button>
                  <Button color="secondary" size="sm" onClick={() => addTableRow(5)}>
                    5行追加
                  </Button>
                  <Button color="grey">CSVで一括取込</Button>
                </div>

                <div className="m-4">
                  <Table.Container>
                    <Table.Head>
                      <Table.Row>
                        <Table.Th width="w-20">#</Table.Th>
                        <Table.Th>クーポン画像URL</Table.Th>
                        <Table.Th>クーポン取得URL</Table.Th>
                        <Table.Th width="w-24">共通設定</Table.Th>
                        <Table.Th>開始日時（個別）</Table.Th>
                        <Table.Th>修了日時（個別）</Table.Th>
                        <Table.Th width="w-24">削除</Table.Th>
                      </Table.Row>
                    </Table.Head>

                    <Table.Body>
                      {TableList.map((item) => (
                        <Table.Row key={`coupon-${item.id}`}>
                          <Table.Td>{item.id}</Table.Td>

                          <Table.InputCell
                            name={`couponImageURL-${item.id}`}
                            value={item.couponImageURL}
                            placeholder="https://image.rakuten.co.jp/..."
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateTableCell(item.id, 'couponImageURL', e.target.value)
                            }
                          />

                          <Table.InputCell
                            name={`couponURL-${item.id}`}
                            value={item.couponURL}
                            placeholder="https://coupon.rakuten.co.jp/..."
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateTableCell(item.id, 'couponURL', e.target.value)
                            }
                          />

                          <Table.Td>
                            <div className="flex items-center justify-center h-full">
                              <input
                                type="checkbox"
                                checked={!!item.commonSetting}
                                onChange={(e) =>
                                  updateTableCell(item.id, 'commonSetting', e.target.checked)
                                }
                                className="h-4 w-4"
                              />
                            </div>
                          </Table.Td>

                          <Table.InputCell
                            type="datetime-local"
                            value={item.startDate1}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateTableCell(item.id, 'startDate1', e.target.value)
                            }
                          />

                          <Table.InputCell
                            type="datetime-local"
                            value={item.endDate1}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateTableCell(item.id, 'endDate1', e.target.value)
                            }
                          />

                          <Table.Button onClick={() => deleteTableRow(item.id)}>
                            <IconTrash />
                          </Table.Button>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Container>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <CardHeader title="4.セクション設定" />
                <div className="mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    セクション（ナビテキスト／セクション見出し／URL）
                  </label>
                </div>

                <div className="flex gap-3 mb-3">
                  <Button color="secondary" size="sm" onClick={() => addSectionRow(1)}>
                    行を追加
                  </Button>
                  <Button color="secondary" size="sm" onClick={() => addSectionRow(5)}>
                    5行追加
                  </Button>
                  <Button color="grey">CSVで一括取込</Button>
                </div>

                <div className="m-4">
                  <Table.Container>
                    <Table.Head>
                      <Table.Row>
                        <Table.Th width="w-20">#</Table.Th>
                        <Table.Th>テキスト（ナビ）</Table.Th>
                        <Table.Th>テキスト（セクション）</Table.Th>
                        <Table.Th>セクションURL（任意）</Table.Th>
                        <Table.Th width="w-24">削除</Table.Th>
                      </Table.Row>
                    </Table.Head>

                    <Table.Body>
                      {sectionList.map((item) => (
                        <Table.Row key={`section-${item.id}`}>
                          <Table.Td>{item.id}</Table.Td>

                          <Table.InputCell
                            value={item.textNavi}
                            placeholder="例：おすすめギフト"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateSectionCell(item.id, 'textNavi', e.target.value)
                            }
                          />

                          <Table.InputCell
                            value={item.textSesson}
                            placeholder="例：キャンペーン期間限定！"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateSectionCell(item.id, 'textSesson', e.target.value)
                            }
                          />

                          <Table.InputCell
                            value={item.textURL}
                            placeholder="https://example.com/..."
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateSectionCell(item.id, 'textURL', e.target.value)
                            }
                          />

                          <Table.Button onClick={() => deleteSectionRow(item.id)}>
                            <IconTrash />
                          </Table.Button>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Container>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <CardHeader title="5.商品リスト設定" />

                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  各セクションに表示する商品を登録・編集します。「セクション」は、上記で設定した「テキスト（ナビ）」と連動します。
                </label>

                <div className="flex gap-3 mb-3 mt-2">
                  <Button color="secondary" size="sm" onClick={() => addProductRow(1)}>
                    行を追加
                  </Button>
                  <Button color="secondary" size="sm" onClick={() => addProductRow(5)}>
                    5行追加
                  </Button>
                  <Button color="grey">CSVで一括取込</Button>
                </div>

                <div className="m-4 overflow-auto">
                  <Table.Container>
                    <Table.Head>
                      <Table.Row>
                        <Table.Th width="w-20">#</Table.Th>
                        <Table.Th>セクション</Table.Th>
                        <Table.Th>画像サイズ</Table.Th>
                        <Table.Th>商品名（表示用）</Table.Th>
                        <Table.Th>商品名（SEO用）</Table.Th>
                        <Table.Th>商品説明</Table.Th>
                        <Table.Th>通常価格</Table.Th>
                        <Table.Th>SALE価格</Table.Th>
                        <Table.Th>商品URL</Table.Th>
                        <Table.Th>画像URL</Table.Th>
                        <Table.Th width="w-24">削除</Table.Th>
                      </Table.Row>
                    </Table.Head>

                    <Table.Body>
                      {productList.map((item) => (
                        <Table.Row key={`product-${item.id}`}>
                          <Table.Td>{item.id}</Table.Td>

                          <Table.InputCell
                            value={item.section}
                            placeholder="例：おすすめ"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateProductCell(item.id, 'section', e.target.value)
                            }
                          />

                          {/* imageSize select: use Table.SelectBox to keep layout */}
                          <Table.SelectBox
                            value={item.imageSize}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                              updateProductCell(item.id, 'imageSize', e.target.value)
                            }
                          >
                            <Table.Option value="large">大</Table.Option>
                            <Table.Option value="small">小</Table.Option>
                          </Table.SelectBox>

                          <Table.InputCell
                            value={item.productNameDisplay}
                            placeholder="例：ギフトセット"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateProductCell(item.id, 'productNameDisplay', e.target.value)
                            }
                          />

                          <Table.InputCell
                            value={item.productNameSEO}
                            placeholder="例：SEOキーワードを含む商品名"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateProductCell(item.id, 'productNameSEO', e.target.value)
                            }
                          />

                          <Table.InputCell
                            value={item.description}
                            placeholder="商品の説明文"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateProductCell(item.id, 'description', e.target.value)
                            }
                          />

                          <Table.InputCell
                            value={item.normalPrice}
                            placeholder="例：2000"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateProductCell(item.id, 'normalPrice', e.target.value)
                            }
                          />

                          <Table.InputCell
                            value={item.salePrice}
                            placeholder="例：1500"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateProductCell(item.id, 'salePrice', e.target.value)
                            }
                          />

                          <Table.InputCell
                            value={item.productURL}
                            placeholder="https://example.com/product"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateProductCell(item.id, 'productURL', e.target.value)
                            }
                          />

                          <Table.InputCell
                            value={item.imageURL}
                            placeholder="https://image/...jpg"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateProductCell(item.id, 'imageURL', e.target.value)
                            }
                          />

                          <Table.Button onClick={() => deleteProductRow(item.id)}>
                            <IconTrash />
                          </Table.Button>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Container>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center my-6">
              <Button
                size="lg"
                type="button"
                onClick={() => {
                  handlePreview();
                }}
              >
                プレビュー
              </Button>
            </div>
          </form>
        </FormikProvider>
      </TabsContent>
    </Tabs>
  );
};

export default Page;
