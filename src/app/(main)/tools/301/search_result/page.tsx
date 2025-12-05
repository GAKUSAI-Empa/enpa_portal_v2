'use client';

import { useState } from 'react';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import { Table } from '@/component/common/Table';
import { TextBox } from '@/component/common/TextBox';
import ProductDetailPopup from '../component/ProductDetailPopup';

const data = [
  {
    name: 'カレーライス',
    price: '1,200円',
    review: 234,
    shop: '東京カレー本店',
  },
  {
    name: 'ビーフカレー',
    price: '1,500円',
    review: 182,
    shop: '大阪フード',
  },
  {
    name: 'チキンカレー',
    price: '980円',
    review: 95,
    shop: '名古屋グルメ',
  },
];

const Page = () => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleOpen = (item: any) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      <Card>
        <CardHeader
          isSticky={true}
          title="検索結果"
          buttonGroup={
            <>
              <Button color="secondary" size="sm">
                検索に戻る
              </Button>
              <Button color="secondary" size="sm">
                Excelにダウンロード
              </Button>
            </>
          }
        />

        <CardContent>
          <TextBox
            id="textboxValue"
            name="textboxValue"
            label={'キーワード「カレー」の結果を表示しています。'}
            placeholder="結果をフィルター..."
            direction="vertical"
            width="full"
          />
        </CardContent>

        <CardContent>
          <Table.Container>
            <Table.Head>
              <Table.Row>
                <Table.Th width="w-16">順位</Table.Th>
                <Table.Th width="w-24">商品画像</Table.Th>
                <Table.Th>商品名</Table.Th>
                <Table.Th width="w-32">価格</Table.Th>
                <Table.Th width="w-32">レビュー数</Table.Th>
                <Table.Th>店舗名</Table.Th>
                <Table.Th width="w-24">詳細</Table.Th>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              {data.map((item, index) => (
                <Table.Row key={index}>
                  {/* 順位 */}
                  <Table.Td>{index + 1}</Table.Td>

                  {/* 商品画像 */}
                  <Table.ImageCell
                    src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
                    alt="product"
                  />

                  {/* 商品名 */}
                  <Table.Td>{item.name}</Table.Td>

                  {/* 価格 */}
                  <Table.Td>{item.price}</Table.Td>

                  {/* レビュー数 */}
                  <Table.Td>{item.review}</Table.Td>

                  {/* 店舗名 */}
                  <Table.Td>{item.shop}</Table.Td>

                  {/* 詳細 */}
                  <Table.Td>
                    <Button color="primary" size="sm" onClick={() => handleOpen(item)}>
                      詳細
                    </Button>
                  </Table.Td>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Container>
        </CardContent>
      </Card>

      {/* ✅ Popup component */}
      <ProductDetailPopup open={open} item={selectedItem} onClose={handleClose} />
    </>
  );
};

export default Page;
