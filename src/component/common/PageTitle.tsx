'use client';

import { cn } from '@/lib/utils';

interface PageTitleProps {
  className?: string;
  title: string;
}
const PageTitle = ({ className = '', title }: PageTitleProps) => {
  return (
    <>
      <h1 className={cn('text-xl font-bold text-gray-800 mb-2', className)}>{title}</h1>
    </>
  );
};

export default PageTitle;
