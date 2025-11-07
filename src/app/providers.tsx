'use client';

import React, { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { SessionProvider } from 'next-auth/react';
import { ConfirmProvider } from 'material-ui-confirm';

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
