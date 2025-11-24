'use client';
import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import LoadingData from '@/component/common/LoadingData';
import { cn } from '@/lib/utils';
import {
  IconAlertTriangle,
  IconBell,
  IconCheckbox,
  IconPackage,
  IconUser,
} from '@tabler/icons-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useNotificationListAPI from './api/useNotificationListAPI';
import useNotificationMainteAPI from './api/useNotificationMainteAPI';

export default function NotificationsPage() {
  const router = useRouter();
  const { data: notificationHistoryList, error, isLoading, mutate } = useNotificationListAPI(1, 99);
  const { markAsRead, markAllAsRead } = useNotificationMainteAPI();

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

  const formatTimeAgo = (isoString: string) => {
    const date = parseISO(isoString);
    return formatDistanceToNow(date, { locale: ja, addSuffix: true });
  };

  const toDetail = async (id: string, is_read: boolean) => {
    if (!is_read) {
      await markAsRead(id);
    }
    router.push(`/account/notification/detail/${id}`);
  };

  const handleClickMarkAllRead = async () => {
    try {
      const resData = await markAllAsRead();
      toast.success(resData.detail);
      mutate();
    } catch (e: any) {
      const backendMessage =
        e?.response?.data?.detail || 'エラーが発生しました。もう一度お試しください。';
      toast.error(backendMessage);
    }
  };

  if (isLoading) {
    return <LoadingData />;
  }

  return (
    <Card>
      <CardHeader
        title="通知"
        buttonGroup={
          <Button size="sm" prefixIcon={IconCheckbox} onClick={() => handleClickMarkAllRead()}>
            すべて既読にする
          </Button>
        }
      />
      <CardContent>
        <div className="flex min-h-screen p-6">
          {/* Main content */}
          <main className="flex-1 ml-8">
            {/* Notifications list */}
            <div className="bg-white shadow-md rounded-lg divide-y">
              {notificationHistoryList?.map((notif: any) => (
                <div
                  onClick={() => toDetail(notif.id, notif.is_read)}
                  key={notif.id}
                  className={cn(
                    `relative flex gap-4 p-4 cursor-pointer`,
                    !notif.is_read ? 'bg-blue-50' : '',
                  )}
                >
                  <div className="text-2xl">{getIcon(notif.noti_type)}</div>
                  <div className="flex-1">
                    <p
                      className={cn(
                        `text-sm`,
                        !notif.is_read ? 'font-bold text-gray-900' : 'text-gray-700',
                      )}
                    >
                      {notif.title}
                    </p>

                    <div
                      className={cn(
                        `text-sm space-y-1 mt-1`,
                        notif.is_read ? 'text-gray-500' : 'text-gray-800',
                      )}
                      dangerouslySetInnerHTML={{ __html: notif.content }}
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">
                        {notif.create_datetime ? formatTimeAgo(notif.create_datetime) : '今'}
                      </span>

                      {!notif.is_read && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                    </div>
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
