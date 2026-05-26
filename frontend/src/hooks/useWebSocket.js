import { useEffect, useRef, useState } from 'react';
import { wsService } from '../services/websocketService';

export const useWebSocket = (url, onMessage) => {
  const [isConnected, setIsConnected] = useState(false);
  const messageHandlerRef = useRef(onMessage);

  useEffect(() => {
    messageHandlerRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const handleMessage = (data) => {
      if (messageHandlerRef.current) {
        messageHandlerRef.current(data);
      }
    };

    const handleConnected = () => setIsConnected(true);
    const handleDisconnected = () => setIsConnected(false);

    wsService.on('message', handleMessage);
    wsService.on('connected', handleConnected);
    wsService.on('disconnected', handleDisconnected);

    wsService.connect(url);

    return () => {
      wsService.off('message', handleMessage);
      wsService.off('connected', handleConnected);
      wsService.off('disconnected', handleDisconnected);
      wsService.disconnect();
    };
  }, [url]);

  const sendMessage = (data) => {
    wsService.send(data);
  };

  return { isConnected, sendMessage };
};