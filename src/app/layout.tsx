// src/app/layout.tsx

import type { Metadata } from 'next';
// !!! XÓA import { Noto_Sans_JP } từ google font
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './globals.css';
import Providers from './providers';

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
      <body
        className={`font-sans bg-background-subtle`}
        style={{ fontFamily: 'Noto Sans JP Custom, sans-serif' }}
        suppressHydrationWarning={true}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
