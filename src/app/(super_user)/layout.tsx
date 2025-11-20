'use client';
import LayoutSuperUser from '@/layout/LayoutSuperUser/LayoutSuperUser';
import React, { ReactNode } from 'react';

interface IToolsLayoutProps {
  children: ReactNode;
}

const ToolsLayout: React.FC<IToolsLayoutProps> = ({ children }) => {
  return <LayoutSuperUser>{children}</LayoutSuperUser>;
};

export default ToolsLayout;
