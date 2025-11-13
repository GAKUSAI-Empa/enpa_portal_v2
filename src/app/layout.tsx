// src/app/layout.tsx

import type { Metadata } from 'next';
// !!! XÓA import { Noto_Sans_JP } từ google font
import './globals.css';
import Providers from './providers';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// !!! XÓA toàn bộ code liên quan đến Noto_Sans_JP({...})

export const metadata: Metadata = {
  title: 'EmpaPortal V2',
  description: 'EmpaTools Next.js Version',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/* Áp dụng phông chữ mới và xóa các class/biến font cũ */}
      <body
        className={`font-sans bg-background-subtle`}
        // Thêm style trực tiếp để sử dụng phông chữ bạn vừa định nghĩa
        style={{ fontFamily: 'Noto Sans JP Custom, sans-serif' }}
        suppressHydrationWarning={true}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
