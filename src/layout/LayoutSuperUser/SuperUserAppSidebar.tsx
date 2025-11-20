'use client';

import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import SuperUserNavItem from './SuperUserNavItem';
import superUserNavItemList from './SuperUserNavItemList';

interface SuperUserAppSidebarProps {
  isExpandedSideBar: boolean;
  setIsExpandedSideBar: (value: boolean) => void;
}
const SuperUserAppSidebar = ({
  isExpandedSideBar,
  setIsExpandedSideBar,
}: SuperUserAppSidebarProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { data: session } = useSession();
  const toggleMenu = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <>
      <aside
        className={cn(
          'bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden',
          isExpandedSideBar ? 'w-64' : 'w-16',
        )}
        onMouseEnter={() => setIsExpandedSideBar(true)}
        onMouseLeave={() => setIsExpandedSideBar(false)}
      >
        {/* --- Logo --- */}
        <Link href="/" className="block">
          <div className="relative h-20 px-4 border-b border-gray-200 flex items-center space-x-3">
            <Image
              src="/img/logo/emportal_logo.png"
              alt="EmpaPortal icon"
              width={40}
              height={40}
              className="object-contain"
            />

            <div
              className={cn(
                'overflow-hidden transition-all duration-300',
                isExpandedSideBar ? 'opacity-100 w-[150px]' : 'opacity-0 w-0',
              )}
            >
              <p className="text-gray-800 font-bold text-lg truncate">エンパタウン管理</p>
            </div>
          </div>
        </Link>
        {/* --- Nav --- */}
        <nav className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2 py-3 text-sm space-y-1">
          {session?.user &&
            superUserNavItemList.map((item) => (
              <SuperUserNavItem
                key={item.label}
                item={item}
                isExpandedSideBar={isExpandedSideBar}
                openDropdown={openDropdown}
                toggleMenu={toggleMenu}
              />
            ))}
        </nav>
      </aside>
    </>
  );
};

export default SuperUserAppSidebar;
