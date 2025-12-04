'use client';

import React, { useState } from 'react';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';

interface LayoutPortalProps {
  children: React.ReactNode;
}
export default function LayoutPortal(props: LayoutPortalProps) {
  const [isExpandedSideBar, setIsExpandedSideBar] = useState(false);

  const { children } = props;

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        {/* --- Sidebar --- */}
        <AppSidebar
          isExpandedSideBar={isExpandedSideBar}
          setIsExpandedSideBar={setIsExpandedSideBar}
        />
        {/* --- Main --- */}
        <main className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto min-h-screen">
          <AppHeader isExpandedSideBar={isExpandedSideBar} />
          <div className="flex-1 w-full mx-auto p-4 pt-[90px]">{children}</div>
          <AppFooter />
        </main>
      </div>
    </>
  );
}
