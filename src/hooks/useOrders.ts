import { useCallback, useEffect, useState } from 'react';
import type { Order, OrderStatus } from './useOrdersMutations.ts';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const DATABASE = 'utiles';
const COLLECTION = 'orders';

interface RawMongoOrder {
  _id?: string | { $oid?: string };
  orderId?: number | string;
  orderNumber?: string;
  createdAt?: string;
  status?: OrderStatus;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerNote?: string;
  items?: Array<{
    refid?: string;
    title?: string;
    brand?: string;
    unitPrice?: number;
    price?: number;
    quantity?: number;
    subtotal?: number;
  }>;
  totals?: {
    itemsCount?: number;
    subtotal?: number;
    total?: number;
  };
  source?: string;
}

interface UseOrdersReturn {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function getId(value?: string | { $oid?: string }): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  return value.$oid;
}

function normalizeOrder(item: RawMongoOrder): Order {
  const resolvedId = getId(item._id);
  const items = (item.items || []).map((entry) => {
    const unitPrice = Number(entry.unitPrice ?? entry.price ?? 0);
    const quantity = Number(entry.quantity ?? 0);
    const subtotal = Number(entry.subtotal ?? unitPrice * quantity);
    return {
      refid: String(entry.refid ?? ''),
      title: entry.title ?? '',
      brand: entry.brand,
      unitPrice,
      quantity,
      subtotal
    };
  });
  const totals = {
    itemsCount: Number(item.totals?.itemsCount ?? items.reduce((sum, entry) => sum + entry.quantity, 0)),
    subtotal: Number(item.totals?.subtotal ?? items.reduce((sum, entry) => sum + entry.subtotal, 0)),
    total: Number(item.totals?.total ?? items.reduce((sum, entry) => sum + entry.subtotal, 0))
  };

  return {
    _id: resolvedId,
    id: resolvedId || item.orderNumber || '',
    orderId: item.orderId !== undefined ? Number(item.orderId) : undefined,
    orderNumber: item.orderNumber,
    createdAt: item.createdAt,
    status: item.status,
    customerName: item.customerName,
    customerPhone: item.customerPhone,
    customerAddress: item.customerAddress,
    customerNote: item.customerNote,
    items,
    totals,
    source: item.source
  };
}

export function useOrders(options?: {
  status?: OrderStatus;
  source?: string;
}): UseOrdersReturn {
  const { status, source } = options || {};
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (source) params.append('source', source);

      const url = `${BACKEND_URL}/api/${DATABASE}/${COLLECTION}?${params.toString()}`;
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const data: RawMongoOrder[] = result.data || result;
      setOrders(data.map(normalizeOrder));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar pedidos';
      setError(message);
      console.error('useOrders error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [status, source]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, isLoading, error, refetch: fetchOrders };
}

export default useOrders;
