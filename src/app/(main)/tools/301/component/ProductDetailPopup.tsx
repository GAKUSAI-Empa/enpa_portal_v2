'use client';

import { Button } from '@/component/common/Button';

type Product = {
  name: string;
  price: string;
  reviewCount: string;
  reviewAvg: string;
  maker: string;
  content: string;
  productUrl: string;
  shopUrl: string;
  shop: string;
};

type Props = {
  open: boolean;
  item: Product | null;
  onClose: () => void;
};

const ProductDetailPopup = ({ open, item, onClose }: Props) => {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[600px] rounded-xl shadow-xl overflow-hidden">
        {/* ===== Header ===== */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h2 className="font-bold text-lg">商品詳細</h2>

          <button className="text-gray-500 hover:text-black text-xl" onClick={onClose}>
            ×
          </button>
        </div>

        {/* ===== Content ===== */}
        <div className="p-5 space-y-5 text-sm">
          {/* 商品名 + 価格 */}
          <div>
            <p className="text-xs text-gray-500">店舗: {item.shop}</p>
            <h3 className="text-base font-bold mt-1 mb-2">{item.name}</h3>
            <p className="text-blue-600 font-bold text-lg">{item.price}</p>
          </div>

          {/* レビュー */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t">
            <div>
              <p className="text-gray-500 text-xs">レビュー数</p>
              <p className="font-semibold">{item.reviewCount}</p>
            </div>

            <div>
              <p className="text-gray-500 text-xs">レビュー平均</p>
              <p className="font-semibold">{item.reviewAvg}</p>
            </div>
          </div>

          {/* その他情報 */}
          <div className="space-y-2 pt-3 border-t">
            <p>
              <span className="text-gray-500 text-xs block">製造メーカー名</span>
              {item.maker}
            </p>

            <p>
              <span className="text-gray-500 text-xs block">内容量</span>
              {item.content}
            </p>
          </div>

          {/* URL */}
          <div className="space-y-3 pt-3 border-t break-all">
            <div>
              <p className="text-gray-500 text-xs">商品URL</p>
              <a
                href={item.productUrl}
                target="_blank"
                className="text-blue-600 hover:underline text-xs"
              >
                {item.productUrl}
              </a>
            </div>

            <div>
              <p className="text-gray-500 text-xs">店舗URL</p>
              <a
                href={item.shopUrl}
                target="_blank"
                className="text-blue-600 hover:underline text-xs"
              >
                {item.shopUrl}
              </a>
            </div>
          </div>
        </div>

        {/* ===== Footer ===== */}
        <div className="px-5 py-4 border-t flex justify-end">
          <Button color="secondary" onClick={onClose}>
            閉じる
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPopup;
