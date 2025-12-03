'use client';

import { Card, CardContent, CardHeader } from '@/component/common/Card';
import LoadingData from '@/component/common/LoadingData';
import PageTitle from '@/component/common/PageTitle';
import useAccountSubcriptionPlan from '../api/useAccountSubcriptionPlan';

const page = () => {
  const { data, error, isLoading, mutate } = useAccountSubcriptionPlan();

  if (isLoading) {
    return <LoadingData />;
  }

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
            <span className="text-gray-900">{data?.plan_name}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 border-b border-gray-200">
          <div className="md:col-span-1">
            <span className="font-medium text-gray-700">説明</span>
          </div>
          <div className="md:col-span-2 whitespace-pre-line">
            <span className="text-gray-900">{data?.description}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 border-b border-gray-200">
          <div className="md:col-span-1">
            <span className="font-medium text-gray-700">ステータス</span>
          </div>
          <div className="md:col-span-2 whitespace-pre-line">
            <span className="text-gray-900">
              {data?.status == 'active' ? (
                '有効'
              ) : (
                <>
                  有効なサブスクリプションがありません。
                  <br />
                  info@empowerment-town.comまでお問合せください。
                </>
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default page;
