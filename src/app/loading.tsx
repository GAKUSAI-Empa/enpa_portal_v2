import Image from 'next/image';
import React from 'react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <img src="/img/logo/emportal_logo.png" alt="Loading logo" className="w-24 h-24" />
        <p className="mt-4 text-gray-600 text-lg">読み込み中...</p>
      </div>
    </div>
  );
}
