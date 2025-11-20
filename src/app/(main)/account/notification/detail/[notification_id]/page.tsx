'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/component/common/Card';
import { cn } from '@/lib/utils';
import {
  IconAlertTriangle,
  IconBell,
  IconChevronLeft,
  IconPackage,
  IconUser,
} from '@tabler/icons-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useNotificationDetailAPI from './api/useNotificationDetailAPI';

interface NotificationDetailPageProps {
  params: { notification_id: string };
}
const NotificationDetailPage = ({ params }: NotificationDetailPageProps) => {
  const { notification_id } = params;
  const router = useRouter();
  const {
    data: notification,
    error,
    isLoading,
    mutate,
  } = useNotificationDetailAPI(notification_id);

  const getIcon = (type: string) => {
    switch (type) {
      case 'USER_REGISTER':
        return <IconUser size={36} className="text-blue-500" />;
      case 'ORDER_CREATED':
        return <IconPackage size={36} className="text-green-600" />;
      case 'SYSTEM_ALERT':
        return <IconAlertTriangle size={36} className="text-red-500" />;
      default:
        return <IconBell size={36} className="text-gray-500" />;
    }
  };

  const formatTime = (isoString: string) => {
    const date = parseISO(isoString);
    return formatDistanceToNow(date, { locale: ja, addSuffix: true });
  };

  useEffect(() => {
    if (!error) return;

    if (error.status === 400 || error.status === 404) {
      router.replace('/404');
    }
  }, [error]);

  return (
    <>
      <Card>
        <CardHeader title="通知の詳細" />
        <CardContent>
          {!isLoading && (
            <div className="max-w-3xl mx-auto px-6 py-6">
              {/* Header */}
              <div className="flex items-center gap-4 border-b pb-4">
                {getIcon(notification?.noti_type)}

                <div className="flex flex-col">
                  <h1
                    className={cn(
                      'text-lg',
                      !notification?.is_read ? 'font-bold text-black' : 'text-gray-800',
                    )}
                  >
                    {notification?.title}
                  </h1>

                  <span className="text-sm text-gray-500">
                    {notification?.create_datetime
                      ? formatTime(notification?.create_datetime)
                      : '今'}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">送信者</h3>
                  <p className="text-gray-800 mt-1">
                    {notification?.sender_username === 'system'
                      ? 'システム'
                      : notification?.sender_username}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700">内容</h3>
                  <div
                    className="prose prose-sm text-gray-700 mt-2"
                    dangerouslySetInnerHTML={{ __html: notification?.content }}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            size="sm"
            prefixIcon={IconChevronLeft}
            onClick={() => router.push('/account/notification')}
          >
            戻る
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default NotificationDetailPage;
