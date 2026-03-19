import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { WebSocketStatusUpdate } from '@/types/reports';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface UseReportWebSocketOptions {
  onStatusUpdate?: (update: WebSocketStatusUpdate) => void;
  onComplete?: (update: WebSocketStatusUpdate) => void;
  onError?: (error: string) => void;
}

interface UseReportWebSocketReturn {
  isConnected: boolean;
  subscribe: (jobId: string) => void;
  unsubscribe: (jobId: string) => void;
  disconnect: () => void;
}

export const useReportWebSocket = (
  options: UseReportWebSocketOptions = {},
): UseReportWebSocketReturn => {
  const { onStatusUpdate, onComplete, onError } = options;
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const subscribedJobsRef = useRef<Set<string>>(new Set());

  const initializeSocket = useCallback(() => {
    if (socketRef.current?.connected) return;

    const socket = io(`${API_URL}/reports`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      subscribedJobsRef.current.forEach((jobId) => {
        socket.emit('subscribe', jobId);
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('status-update', (update: WebSocketStatusUpdate) => {
      onStatusUpdate?.(update);

      if (update.status === 'completed') {
        onComplete?.(update);
      } else if (update.status === 'failed') {
        onError?.(update.error || 'Report generation failed');
      }
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });
  }, [onStatusUpdate, onComplete, onError]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const subscribe = useCallback(
    (jobId: string) => {
      subscribedJobsRef.current.add(jobId);

      if (!socketRef.current) {
        initializeSocket();
      }

      subscribedJobsRef.current.add(jobId);

      if (socketRef.current?.connected) {
        socketRef.current.emit('subscribe', jobId);
      }
    },
    [initializeSocket],
  );

  const unsubscribe = useCallback((jobId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('unsubscribe', jobId);
      subscribedJobsRef.current.delete(jobId);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      subscribedJobsRef.current.clear();
    }
  }, []);

  return {
    isConnected,
    subscribe,
    unsubscribe,
    disconnect,
  };
};
