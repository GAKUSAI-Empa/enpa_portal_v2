'use client';
import { cn } from '@/lib/utils';
import { IconAlertTriangle, IconBell, IconPackage, IconUser } from '@tabler/icons-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import useNotificationCountAPI from './api/useNotificationCountAPI';
import useNotificationListAPI from './api/useNotificationListAPI';
import useNotificationMainteAPI from './api/useNotificationMainteAPI';

interface NotificationMessage {
  id: string;
  receiver_username: string;
  sender_username: string;
  noti_type: string;
  title: string;
  content: string;
  target_id: string;
  target_type: string;
  is_read: boolean;
  read_at: string;
  create_datetime: string;
}
const AppNotification = () => {
  const { data: session, update, status } = useSession();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: notificationHistoryList, error, isLoading, mutate } = useNotificationListAPI(1, 5);
  const {
    readCount,
    unreadCount,
    mutate: mutateCount,
    isLoading: isLoadingCount,
    error: errorCount,
  } = useNotificationCountAPI();
  const [liveNoti, setliveNoti] = useState<NotificationMessage[]>([]);
  const { markAsRead } = useNotificationMainteAPI();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!session?.user?.username) return;

    let ws: WebSocket;

    const connectWS = () => {
      ws = new WebSocket(
        `${process.env.NEXT_PUBLIC_WEBSOCKET_DOMAIN}/api-be/notification/ws/${session.user.username}`,
      );

      ws.onopen = () => {
        console.log('WS Connected');
      };

      ws.onmessage = (event) => {
        try {
          // Parse JSON gửi từ server FastAPI
          const data: NotificationMessage = JSON.parse(event.data);

          // Lưu vào danh sách messages
          setliveNoti((prev) => [data, ...prev]);
          // 🔥 Khi nhận noti mới, revalidate count
          mutateCount();
        } catch (e) {
          console.error('JSON parse error:', e);
        }
      };

      ws.onclose = () => {
        console.log('WS Closed – reconnecting in 1s...');
        setTimeout(connectWS, 1000);
      };

      ws.onerror = () => {
        console.log('WS Error');
        ws.close();
      };
    };

    connectWS();
    return () => ws?.close();
  }, [session?.user?.username]);

  const formatTimeAgo = (isoString: string) => {
    const date = parseISO(isoString);
    return formatDistanceToNow(date, { locale: ja, addSuffix: true });
  };

  const toDetail = async (id: string, is_read: boolean) => {
    setOpen(false);
    if (!is_read) {
      await markAsRead(id);

      // update liveNoti
      setliveNoti((prev) =>
        prev.map((noti) => (noti.id === id ? { ...noti, is_read: true } : noti)),
      );

      // update SWR list
      mutate(
        (currentData: any) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            list: currentData?.list?.map((noti: any) =>
              noti.id === id ? { ...noti, is_read: true } : noti,
            ),
          };
        },
        { revalidate: false },
      );

      mutateCount();
    }
    router.push(`/account/notification/detail/${id}`);
  };

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
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative flex items-center justify-center w-10 h-10
                   rounded-full hover:bg-gray-200 transition"
        onClick={() => setOpen(!open)}
      >
        <IconBell size={22} />
        {unreadCount > 0 && (
          <span
            className="absolute px-1.5 -top-0.5 -right-0.5 bg-red-600 text-white text-xs
               w-5 h-5 flex items-center justify-center rounded-full shadow-md"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-xl border
            animate-fadeIn overflow-hidden
          "
        >
          <div className="px-4 py-3 font-semibold text-gray-700 bg-gray-100 border-b">通知</div>

          <div className="max-h-80 overflow-y-auto py-2">
            {liveNoti.length === 0 && notificationHistoryList.length === 0 && (
              <div className="flex flex-col items-center justify-center w-full">
                <img
                  src="\img\notification\noti-empty.jpg"
                  alt="No notifications"
                  className="w-32 h-32 object-contain opacity-50"
                />
                <p className="mt-4 text-gray-500 text-md">通知はありません</p>
              </div>
            )}
            {/* live web socket notification list */}
            {liveNoti?.map((noti: any, index: number) => (
              <div
                onClick={() => toDetail(noti.id, noti.is_read)}
                key={noti.id}
                className={cn(
                  `flex items-center gap-3 px-4 py-3 cursor-pointer`,
                  `${!noti.is_read ? 'bg-blue-50' : 'hover:bg-gray-50'}`,
                )}
              >
                <div className="text-2xl">{getIcon(noti.noti_type)}</div>
                <div className="flex-1">
                  <p
                    className={`text-sm flex flex-col ${!noti.is_read ? 'font-bold text-black' : 'text-gray-800'}`}
                  >
                    <span>{noti.sender_username}</span>
                    <span className="line-clamp-1">{noti.title}</span>
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {noti.create_datetime ? formatTimeAgo(noti.create_datetime) : '今'}
                  </p>
                </div>

                {!noti.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
              </div>
            ))}
            {/* history  */}
            {notificationHistoryList?.map((noti: any, index: number) => (
              <div
                onClick={() => toDetail(noti.id, noti.is_read)}
                key={noti.id}
                className={cn(
                  `flex items-center gap-3 px-4 py-3 cursor-pointer`,
                  `${!noti.is_read ? 'bg-blue-50' : 'hover:bg-gray-50'}`,
                )}
              >
                <div className="text-2xl">{getIcon(noti.noti_type)}</div>
                <div className="flex-1">
                  <p
                    className={`text-sm flex flex-col ${!noti.is_read ? 'font-bold text-black' : 'text-gray-800'}`}
                  >
                    <span>{noti.sender_username}</span>
                    <span className="line-clamp-1">{noti.title}</span>
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {noti.create_datetime ? formatTimeAgo(noti.create_datetime) : '今'}
                  </p>
                </div>

                {!noti.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
              </div>
            ))}
          </div>

          {/* Footer */}
          {liveNoti.length + notificationHistoryList.length >= 5 && (
            <Link href={'/account/notification'}>
              <div className="px-4 py-2 text-sm text-blue-600 text-center border-t hover:bg-gray-50 cursor-pointer">
                全て見る
              </div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default AppNotification;
