'use client';
import { Button } from '@/component/common/Button';
import { IconSmartHome } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-6">
      <h1 className="text-9xl font-extrabold text-gray-800 dark:text-gray-200 tracking-widest">
        404
      </h1>
      <div className="bg-primary text-white px-2 text-sm rounded rotate-12 absolute mt-[-3rem]">
        ページが見つかりません
      </div>

      <p className="mt-6 text-gray-600 dark:text-gray-400 text-center max-w-md">
        申し訳ございません。お探しのページは存在しないか、移動されています。
      </p>
      <Button size="lg" className="mt-6" onClick={() => router.push('/')}>
        <IconSmartHome />
        ホームに戻る
      </Button>
    </div>
  );
};

export default NotFound;
