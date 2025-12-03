'use client';

import { Card, CardContent, CardHeader } from '@/component/common/Card';
import PageTitle from '@/component/common/PageTitle';

const page = () => {
  return (
    <Card>
      <CardHeader title="エンパタウン株式会社 様" />
      <CardContent>
        <PageTitle title="登録情報" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 border-b border-gray-200">
          <div className="md:col-span-1">
            <span className="font-medium text-gray-700">プラン名</span>
          </div>
          <div className="md:col-span-2 whitespace-pre-line">
            <span className="text-gray-900">無料プラン</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 border-b border-gray-200">
          <div className="md:col-span-1">
            <span className="font-medium text-gray-700">説明</span>
          </div>
          <div className="md:col-span-2 whitespace-pre-line">
            <span className="text-gray-900">
              コンサルティング契約をしているお客様の無料プランです。
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 border-b border-gray-200">
          <div className="md:col-span-1">
            <span className="font-medium text-gray-700">ステータス</span>
          </div>
          <div className="md:col-span-2 whitespace-pre-line">
            <span className="text-gray-900">有効</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default page;
