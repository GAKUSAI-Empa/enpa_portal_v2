'use client';
import AppFooter from '@/layout/LayoutPortal/AppFooter';
import { ReactNode } from 'react';

interface IAuthLayoutProps {
  children: ReactNode;
}
const AuthLayout: React.FC<IAuthLayoutProps> = ({ children }) => {
  return (
    <>
      {children}
      <AppFooter />
    </>
  );
};

export default AuthLayout;
