'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent } from '@/component/common/Card';

const Page = () => {
  return (
    <Card className="max-w-[600px] mx-auto mt-[80px]">
      <CardContent className="pt-6 leading-[2rem]">
        <p className="mb-4 text-center">
          データが保存されました。ダウンロードしてからデータチェック画面を遷移してください！
        </p>
        <div className="flex justify-center gap-4">
          <Button type="button" onClick={() => console.log('NO action')}>
            データをダウンロード
          </Button>
          <Button type="button" onClick={() => console.log('YES action')}>
            チェック画面遷移
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;
