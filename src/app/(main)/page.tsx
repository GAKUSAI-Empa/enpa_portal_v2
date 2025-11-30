'use client';

import { Alert } from '@/component/common/Alert';
import { Card, CardContent, CardHeader } from '@/component/common/Card';

export default function Home() {
  return (
    <>
      <Card>
        <CardHeader title="エンパタウンへようこそ！" />
        <CardContent>
          <Alert>
            まずは以下の手順でログインしてください。
            <ul className="mt-2 ml-4 list-disc text-[13px]">
              <li>右上の「ログイン」ボタンをクリック</li>
              <li>ユーザー名とパスワードを入力</li>
              <li>「ログイン」を押してダッシュボードにアクセス</li>
            </ul>
          </Alert>
        </CardContent>
      </Card>
    </>
  );
}
