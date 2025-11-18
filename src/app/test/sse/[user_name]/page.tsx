'use client';

import { useEffect, useState } from 'react';

interface Props {
  params: { user_name: string };
}

interface NotificationMessage {
  noti_type: string;
  title: string;
  content: string;
  create_datetime: string;
  message?: string;
}

export default function NotificationPage({ params }: Props) {
  const { user_name } = params;

  const [messages, setMessages] = useState<NotificationMessage[]>([]);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    console.log(user_name);
    let ws: WebSocket;

    const connectWS = () => {
      ws = new WebSocket(`ws://localhost:8001/notification/ws/${user_name}`);

      ws.onopen = () => {
        console.log('WS Connected');
        setConnected(true);
      };

      ws.onmessage = (event) => {
        console.log('WS Raw:', event.data);

        try {
          // Parse JSON gửi từ server FastAPI
          const data: NotificationMessage = JSON.parse(event.data);

          // Lưu vào danh sách messages
          setMessages((prev) => [data, ...prev]);
        } catch (e) {
          console.error('JSON parse error:', e);
        }
      };

      ws.onclose = () => {
        console.log('WS Closed – reconnecting in 1s...');
        setConnected(false);
        setTimeout(connectWS, 1000);
      };

      ws.onerror = () => {
        console.log('WS Error');
        ws.close();
      };
    };

    connectWS();
    return () => ws?.close();
  }, [user_name]);

  return (
    <div style={{ padding: 20 }}>
      <h2>🔔 Realtime Notifications</h2>

      <p>
        Status:
        {connected ? (
          <span style={{ color: 'green' }}> Connected</span>
        ) : (
          <span style={{ color: 'red' }}> Disconnected</span>
        )}
      </p>

      <div
        style={{
          marginTop: 20,
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: 16,
          width: 500,
        }}
      >
        <h3>Latest Messages</h3>

        {messages.length === 0 && <p>No messages yet...</p>}

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {messages.map((msg, i) => (
            <li
              key={i}
              style={{
                padding: '12px 16px',
                marginBottom: 12,
                background: '#fafafa',
                borderRadius: 8,
                border: '1px solid #ddd',
              }}
            >
              <div>
                <b>{msg.title}</b>
              </div>
              <div style={{ marginTop: 4 }}>{msg.content}</div>
              <div style={{ fontSize: 12, marginTop: 6, color: '#666' }}>
                ⏱ {msg.create_datetime}
              </div>
              <div style={{ fontSize: 12, marginTop: 6, color: '#999' }}>Type: {msg.noti_type}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
