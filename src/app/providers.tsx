'use client';

import React, { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { SessionProvider } from 'next-auth/react';

interface Props {
  children: ReactNode;
}
const providers = ({ children }: Props) => {
  return (
    <React.Fragment>
      <SessionProvider>{children}</SessionProvider>
      <Toaster position="top-right" richColors={true} closeButton={true} />
    </React.Fragment>
  );
};
export default providers;
