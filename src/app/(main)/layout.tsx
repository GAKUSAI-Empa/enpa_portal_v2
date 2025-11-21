'use client';
import LayoutPortal from '@/layout/LayoutPortal/LayoutPortal';
import React, { ReactNode } from 'react';

interface IToolsLayoutProps {
  children: ReactNode;
}

const ToolsLayout: React.FC<IToolsLayoutProps> = ({ children }) => {
  return <LayoutPortal>{children}</LayoutPortal>;
};

export default ToolsLayout;
