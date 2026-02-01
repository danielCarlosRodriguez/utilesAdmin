import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Order, OrderStatus } from './useOrdersMutations';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://utilesya-f43ef34adf2b.herokuapp.com';

interface OrderUpdatedEvent {
  orderId: string;
  status: OrderStatus;
  order: Order;
}

interface UseOrderSocketOptions {
  onOrderUpdated?: (event: OrderUpdatedEvent) => void;
}

export function useOrderSocket(options: UseOrderSocketOptions = {}) {
  const { onOrderUpdated } = options;
  const socketRef = useRef<Socket | null>(null);
  const isConnectedRef = useRef(false);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      isConnectedRef.current = true;
      // Join admin room
      socket.emit('join:admin');
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      isConnectedRef.current = false;
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    socketRef.current = socket;
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      isConnectedRef.current = false;
    }
  }, []);

  // Handle order:updated event
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !onOrderUpdated) return;

    const handler = (event: OrderUpdatedEvent) => {
      console.log('Order updated event received:', event);
      onOrderUpdated(event);
    };

    socket.on('order:updated', handler);

    return () => {
      socket.off('order:updated', handler);
    };
  }, [onOrderUpdated]);

  // Auto-connect on mount, disconnect on unmount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected: isConnectedRef.current,
    connect,
    disconnect,
  };
}

export default useOrderSocket;
