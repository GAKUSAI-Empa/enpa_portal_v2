'use client';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import { IconAlertTriangle, IconBell, IconCheck, IconPackage, IconUser } from '@tabler/icons-react';

export default function NotificationsPage() {
  const fakeNotifications = [
    {
      id: '1',
      title: 'User registered',
      content: 'New user: Nguyen Van A',
      noti_type: 'USER_REGISTER',
      is_read: false,
      create_datetime: '2025-01-10 09:30',
    },
    {
      id: '2',
      title: 'Order created',
      content: 'Order #1234 created successfully.',
      noti_type: 'ORDER_CREATED',
      is_read: true,
      create_datetime: '2025-01-09 14:20',
    },
    {
      id: '3',
      title: 'System Alert',
      content: 'Server CPU usage is high!',
      noti_type: 'SYSTEM_ALERT',
      is_read: false,
      create_datetime: '2025-01-08 10:00',
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'USER_REGISTER':
        return <IconUser size={28} className="text-blue-500" />;
      case 'ORDER_CREATED':
        return <IconPackage size={28} className="text-green-600" />;
      case 'SYSTEM_ALERT':
        return <IconAlertTriangle size={28} className="text-red-500" />;
      default:
        return <IconBell size={28} className="text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader title="Notification" />
      <CardContent>
        <div className="flex min-h-screen p-6">
          {/* Sidebar */}
          <aside className="w-60 bg-white shadow-md rounded-lg p-4 h-fit">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            <button className="w-full text-left px-3 py-2 rounded-md mb-2 bg-primary text-white">
              All
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md mb-2 hover:bg-gray-200">
              User Register
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md mb-2 hover:bg-gray-200">
              Order
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-200">
              System Alert
            </button>
          </aside>

          {/* Main content */}
          <main className="flex-1 ml-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Notifications</h1>

              <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                <IconCheck size={20} />
                Mark all as read
              </button>
            </div>

            {/* Notifications list */}
            <div className="bg-white shadow-md rounded-lg divide-y">
              {fakeNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex gap-4 p-4 cursor-pointer hover:bg-gray-100 ${
                    !notif.is_read ? 'bg-blue-50' : ''
                  }`}
                >
                  {/* Icon */}
                  <div className="text-2xl">{getIcon(notif.noti_type)}</div>

                  {/* Content */}
                  <div>
                    <p className="font-semibold">{notif.title}</p>
                    <p className="text-gray-600 text-sm">{notif.content}</p>
                    <span className="text-xs text-gray-400">{notif.create_datetime}</span>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </CardContent>
    </Card>
  );
}
