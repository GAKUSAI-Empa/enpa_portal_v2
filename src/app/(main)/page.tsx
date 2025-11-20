'use client';

import { Alert } from '@/component/common/Alert';

export default function Home() {
  return (
    <>
      <Alert>
        EnpaPortalへようこそ！まずは以下の手順でログインしてください。
        <ul className="mt-2 ml-4 list-disc text-[13px]">
          <li>右上の「ログイン」ボタンをクリック</li>
          <li>社員番号とパスワードを入力</li>
          <li>「サインイン」を押してダッシュボードにアクセス</li>
        </ul>
      </Alert>
    </>
  );
}
