'use client';

import React, { ReactNode } from 'react';

import { ConfirmProvider } from '@/component/common/ConfirmProvider';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

interface Props {
  children: ReactNode;
}
const providers = ({ children }: Props) => {
  return (
    <React.Fragment>
      <ConfirmProvider>
        <SessionProvider>{children}</SessionProvider>
      </ConfirmProvider>
      <Toaster position="top-right" richColors={true} closeButton={true} />
    </React.Fragment>
  );
};
export default providers;
