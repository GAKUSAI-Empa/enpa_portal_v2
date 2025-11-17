'use client';

import { useEffect, useState } from 'react';

interface Props {
  params: { user_id: string };
}

export default function NotificationPage({ params }: Props) {
  const { user_id } = params;

  const [messages, setMessages] = useState<string[]>([]);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    let ws: WebSocket;

    const connectWS = () => {
      ws = new WebSocket(`ws://localhost:8000/test/ws/${user_id}`);

      ws.onopen = () => {
        console.log('WS Connected');
        setConnected(true);
      };

      ws.onmessage = (event) => {
        console.log('WS Data:', event.data);
        setMessages((prev) => [event.data, ...prev]); // prepend message
      };

      ws.onclose = () => {
        console.log('WS Closed – reconnecting in 1s...');
        setConnected(false);
        setTimeout(connectWS, 1000); // Auto reconnect
      };

      ws.onerror = () => {
        console.log('WS Error');
        ws.close();
      };
    };

    connectWS();
    return () => ws?.close();
  }, [user_id]);

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
          width: 400,
        }}
      >
        <h3>Messages</h3>

        {messages.length === 0 && <p>No messages yet...</p>}

        <ul>
          {messages.map((msg, i) => (
            <li
              key={i}
              style={{
                padding: '8px 12px',
                marginBottom: 8,
                background: '#f5f5f5',
                borderRadius: 6,
              }}
            >
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
