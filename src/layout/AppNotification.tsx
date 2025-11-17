'use client';
import { IconBell } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

const AppNotification = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Nút chuông + Badge */}
      <button
        className="relative flex items-center justify-center w-10 h-10
                   rounded-full hover:bg-gray-200 transition"
        onClick={() => setOpen(!open)}
      >
        <IconBell size={22} />
        <span
          className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-xs
                     w-5 h-5 flex items-center justify-center rounded-full shadow-md"
        >
          5
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border
            animate-fadeIn overflow-hidden
          "
        >
          {/* Header */}
          <div className="px-4 py-3 font-semibold text-gray-700 bg-gray-100 border-b">お知らせ</div>

          {/* Items */}
          <div className="max-h-80 overflow-y-auto">
            {[1, 2, 3, 4, 5].map((_, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
              >
                <img
                  src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAACUCAMAAADF0xngAAAAMFBMVEXFxcX////CwsL7+/vKysrZ2dni4uLQ0ND19fX4+Pjc3Nzw8PDp6enf39/T09Ps7Oyn78KlAAADlUlEQVR4nO2b2ZKrIBCGpQF3x/d/25F4Ui5jUvZKcorvaiZXfwG9t1VVKBQKhUKhUCgUCoX/C4Ddn7t/PodFU4hxGofOe98Nc93H5vHrBwHQ1EPrjvhhjB+kE0LduWv8GHKrewDQjy8krgxTyH6gEN5rTLQ/mWXe0PjQ2WTUCPFsMa/wdT7PdO8gV4Ymi0wIM0Lkcpwxg0xo7t52Rpnw45EiF/pvEOlcbXuaQNG4YGpCYSCq9JYOHuOCjnRmcR16ssjFb1odZsMQ6dxkpBLnzc90JjEdIkukc6PJnWNjzh8M7BwmrkgTA3pVPHzSYbJfZWJUFsk18BWvbeYNKcs4M+leOdQSIt2gKrICappxxOtG8yAi0jnVtB14IXxjVlVJT9mOdKoq2dHxqVJRpJxK3fAjEB5XFD0myPj0hGI1CT9SIl2tJpJX8BSV36hSIrnUV0nrDl2qVPSXQUylZoYJYl6911QpFSG9ZvMNJKqeRKuaE/GLcQOVYrm6chdGyHx0e8LfUZ1VMtFHu+0WRHyR9uRHpD5rtZvrIBEklRswCb79qDezRKoKkwka92Wqv8oEu5DUTId2MnnBfLbQmOAYkIHprLC8kYEXesqMZJk2I6l/UJ/mYLqqRUzavaXGBMVrmnhKrkztrPIKtNs0c5RHmbiuUa4dR2juV0E+5tGYZFb1Tcc559lye+ps7hjRkO8gHyKr18u2O8aQceMaQpzv3bifY6a1W6h6TD3Z9ln2rSO2zdFZv06AmlKXt6Z7t9BQO4SGHunmYvU1RiEIGl5FbrHGDOQEeGPStnbsYvU1s67zxC9WX9OqNv/FplKKm7eCY0jFDoekSLXldZm1rA2NganYqGdDoc0hN3TekE4/BCfjB5mipyk4GD8g6pAEN3TOMiXdu8zE7Aq5TUyxHbwrpFqFoiHnLzJBSO9Rrsg8TfK3PHeR6LwK7Su/gz+lAqntgnfwk2Lt+06w3ZGufT/hZnFiK7ZvaVkaDUxnhWNAJqazwjEgq6PkJO7aUWcPPQKpZhlnyFmH4VHSJ9JmBr5CNPMgthJ6C9oXvEoF2WtopZpFBN9DiuamtpOg2I+x7SQo9mOTZ+wh5BxSX5hhQF95hgsnXLnct1sIsJvXWo2h92DbRgrdyjtgO5qW6dAG8pNtmSVlNMiFoyzPMj1MjEjzTOMJKuMQ+/YEC+orY8hz4cuVo1RmEukcRqVdHX4GYeTZjOeV+fwCWMExTqQ7micAAAAASUVORK5CYII=`}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm text-gray-800">
                    <b>User {idx + 1}</b> đã gửi thông báo mới cho bạn.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">5 phút trước</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 text-sm text-blue-600 text-center border-t hover:bg-gray-50 cursor-pointer">
            Xem tất cả
          </div>
        </div>
      )}
    </div>
  );
};

export default AppNotification;
