'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent } from '@/component/common/Card';

const Page = () => {
  return (
    <Card className="max-w-[600px] mx-auto mt-[80px]">
      <CardContent className="pt-6 leading-[2rem]">
        <p className="mb-4 text-center">セール更新エクセル予約ファイルを持っていますか？</p>
        <div className="flex justify-center gap-4">
          <Button type="button" onClick={() => console.log('NO action')}>
            いいえ
          </Button>
          <Button type="button" onClick={() => console.log('YES action')}>
            はい
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;
