import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Order, OrderStatus } from './useOrdersMutations';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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
  const onOrderUpdatedRef = useRef(onOrderUpdated);

  // Keep ref updated
  useEffect(() => {
    onOrderUpdatedRef.current = onOrderUpdated;
  }, [onOrderUpdated]);

  // Connect and setup all listeners
  useEffect(() => {
    if (!BACKEND_URL) {
      console.error('Socket: BACKEND_URL not defined');
      return;
    }

    console.log('Socket: Connecting to', BACKEND_URL);

    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('join:admin');
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    socket.on('order:updated', (event: OrderUpdatedEvent) => {
      console.log('Order updated event received:', event);
      if (onOrderUpdatedRef.current) {
        onOrderUpdatedRef.current(event);
      }
    });

    socketRef.current = socket;

    return () => {
      console.log('Socket: Disconnecting');
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return {
    socket: socketRef.current,
  };
}

export default useOrderSocket;
