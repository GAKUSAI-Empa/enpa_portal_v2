'use client';

import React, { useState } from 'react';
import SuperUserAppHeader from './SuperUserAppHeader';
import SuperUserAppSidebar from './SuperUserAppSidebar';

interface LayoutSuperUserProps {
  children: React.ReactNode;
}
export default function LayoutSuperUser(props: LayoutSuperUserProps) {
  const [isExpandedSideBar, setIsExpandedSideBar] = useState(false);

  const { children } = props;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* --- Sidebar --- */}
      <SuperUserAppSidebar
        isExpandedSideBar={isExpandedSideBar}
        setIsExpandedSideBar={setIsExpandedSideBar}
      />
      {/* --- Main --- */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <SuperUserAppHeader isExpandedSideBar={isExpandedSideBar} />
        <div className="w-full mx-auto p-4 pt-[90px]">{children}</div>
      </main>
    </div>
  );
}
