'use client';

import { Button } from '@/component/common/Button';
import { cn } from '@/lib/utils';
import { IconLogout, IconUser } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import AppNotification from './AppNotification/AppNotification';

interface AppHeaderProps {
  isExpandedSideBar: boolean;
}
const AppHeader = ({ isExpandedSideBar }: AppHeaderProps) => {
  const { data: session, update, status } = useSession();
  const [openUserDropdown, setOpenUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenUserDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogOut = async () => {
    router.push('/login');
    await signOut({ redirect: false });
  };

  return (
    <>
      <div
        className={cn(
          'fixed top-0 right-0 z-50 transition-all duration-300 bg-white h-20 border-b border-gray-200 px-4 sm:px-8',
        )}
        style={{
          left: isExpandedSideBar ? '256px' : '64px',
        }}
      >
        <div className="flex items-center aligns justify-end gap-2">
          {session?.user ? (
            <>
              {session.user.role_name !== 'ROLE_STAFF' && (
                <>
                  <Button onClick={() => router.push('/manage/staff')}>スタッフ管理</Button>
                  <Button>店舗管理</Button>
                </>
              )}
              <AppNotification />
              <div
                className="relative h-20 flex items-center aligns justify-center"
                ref={dropdownRef}
              >
                {/* avatar */}
                <button
                  onClick={() => setOpenUserDropdown(!openUserDropdown)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <Image
                    src={
                      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAACUCAMAAADF0xngAAAAMFBMVEXFxcX////CwsL7+/vKysrZ2dni4uLQ0ND19fX4+Pjc3Nzw8PDp6enf39/T09Ps7Oyn78KlAAADlUlEQVR4nO2b2ZKrIBCGpQF3x/d/25F4Ui5jUvZKcorvaiZXfwG9t1VVKBQKhUKhUCgUCoX/C4Ddn7t/PodFU4hxGofOe98Nc93H5vHrBwHQ1EPrjvhhjB+kE0LduWv8GHKrewDQjy8krgxTyH6gEN5rTLQ/mWXe0PjQ2WTUCPFsMa/wdT7PdO8gV4Ymi0wIM0Lkcpwxg0xo7t52Rpnw45EiF/pvEOlcbXuaQNG4YGpCYSCq9JYOHuOCjnRmcR16ssjFb1odZsMQ6dxkpBLnzc90JjEdIkukc6PJnWNjzh8M7BwmrkgTA3pVPHzSYbJfZWJUFsk18BWvbeYNKcs4M+leOdQSIt2gKrICappxxOtG8yAi0jnVtB14IXxjVlVJT9mOdKoq2dHxqVJRpJxK3fAjEB5XFD0myPj0hGI1CT9SIl2tJpJX8BSV36hSIrnUV0nrDl2qVPSXQUylZoYJYl6911QpFSG9ZvMNJKqeRKuaE/GLcQOVYrm6chdGyHx0e8LfUZ1VMtFHu+0WRHyR9uRHpD5rtZvrIBEklRswCb79qDezRKoKkwka92Wqv8oEu5DUTId2MnnBfLbQmOAYkIHprLC8kYEXesqMZJk2I6l/UJ/mYLqqRUzavaXGBMVrmnhKrkztrPIKtNs0c5RHmbiuUa4dR2juV0E+5tGYZFb1Tcc559lye+ps7hjRkO8gHyKr18u2O8aQceMaQpzv3bifY6a1W6h6TD3Z9ln2rSO2zdFZv06AmlKXt6Z7t9BQO4SGHunmYvU1RiEIGl5FbrHGDOQEeGPStnbsYvU1s67zxC9WX9OqNv/FplKKm7eCY0jFDoekSLXldZm1rA2NganYqGdDoc0hN3TekE4/BCfjB5mipyk4GD8g6pAEN3TOMiXdu8zE7Aq5TUyxHbwrpFqFoiHnLzJBSO9Rrsg8TfK3PHeR6LwK7Su/gz+lAqntgnfwk2Lt+06w3ZGufT/hZnFiK7ZvaVkaDUxnhWNAJqazwjEgq6PkJO7aUWcPPQKpZhlnyFmH4VHSJ9JmBr5CNPMgthJ6C9oXvEoF2WtopZpFBN9DiuamtpOg2I+x7SQo9mOTZ+wh5BxSX5hhQF95hgsnXLnct1sIsJvXWo2h92DbRgrdyjtgO5qW6dAG8pNtmSVlNMiFoyzPMj1MjEjzTOMJKuMQ+/YEC+orY8hz4cuVo1RmEukcRqVdHX4GYeTZjOeV+fwCWMExTqQ7micAAAAASUVORK5CYII='
                    }
                    alt="User avatar"
                    width={40}
                    height={40}
                    className="rounded-full border border-gray-300"
                  />
                  <p>{session.user.username}</p>
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                      openUserDropdown ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Menu xổ xuống */}
                <div
                  className={`absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-md transition-all duration-200 origin-top-right ${
                    openUserDropdown
                      ? 'opacity-100 scale-100 translate-y-[70px]'
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}
                >
                  <div className="py-2 text-sm text-gray-700">
                    <Link
                      href="/account"
                      className="block px-4 py-2 hover:bg-gray-100 flex gap-2"
                      onClick={() => setOpenUserDropdown(false)}
                    >
                      <IconUser />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setOpenUserDropdown(false);
                        handleLogOut();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-2"
                    >
                      <IconLogout />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-20 flex items-center aligns justify-center">
              <Button onClick={() => router.push('/login')}>ログインへ</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AppHeader;
