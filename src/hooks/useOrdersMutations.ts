import { useCallback, useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const DATABASE = 'utiles';
const COLLECTION = 'orders';

export type OrderStatus = 'pending' | 'ready' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItemPayload {
  refid: string;
  title: string;
  brand?: string;
  unitPrice: number;
  quantity: number;
  subtotal?: number;
}

export interface OrderTotalsPayload {
  itemsCount: number;
  subtotal: number;
  total: number;
}

export interface OrderPayload {
  orderNumber?: string;
  createdAt?: string;
  status?: OrderStatus;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerNote?: string;
  items: OrderItemPayload[];
  totals: OrderTotalsPayload;
  source?: string;
}

export interface OrderItem {
  refid: string;
  title: string;
  brand?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderTotals {
  itemsCount: number;
  subtotal: number;
  total: number;
}

export interface Order {
  _id?: string;
  id: string;
  orderId?: number;
  orderNumber?: string;
  createdAt?: string;
  status?: OrderStatus;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerNote?: string;
  items: OrderItem[];
  totals: OrderTotals;
  source?: string;
}

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

function getResponseData<T>(result: { data?: T } | T): T {
  return (result as { data?: T }).data ?? (result as T);
}

export function useCreateOrder(): {
  order: Order | null;
  isLoading: boolean;
  error: string | null;
  createOrder: (payload: OrderPayload) => Promise<Order | null>;
} {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(async (payload: OrderPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/${DATABASE}/${COLLECTION}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const created = getResponseData<RawMongoOrder>(result);
      const normalized = normalizeOrder(created);
      setOrder(normalized);
      return normalized;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear pedido';
      setError(message);
      console.error('useCreateOrder error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { order, isLoading, error, createOrder };
}

export function useUpdateOrder(options?: {
  method?: 'PATCH' | 'PUT';
}): {
  order: Order | null;
  isLoading: boolean;
  error: string | null;
  updateOrder: (id: string, payload: Partial<OrderPayload>) => Promise<Order | null>;
} {
  const method = options?.method || 'PATCH';
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateOrder = useCallback(async (id: string, payload: Partial<OrderPayload>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/${DATABASE}/${COLLECTION}/${id}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const updated = getResponseData<RawMongoOrder>(result);
      const normalized = normalizeOrder(updated);
      setOrder(normalized);
      return normalized;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar pedido';
      setError(message);
      console.error('useUpdateOrder error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [method]);

  return { order, isLoading, error, updateOrder };
}

export function useDeleteOrder(): {
  isLoading: boolean;
  error: string | null;
  deletedId: string | null;
  deleteOrder: (id: string) => Promise<boolean>;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletedId, setDeletedId] = useState<string | null>(null);

  const deleteOrder = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    setDeletedId(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/${DATABASE}/${COLLECTION}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setDeletedId(id);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar pedido';
      setError(message);
      console.error('useDeleteOrder error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, deletedId, deleteOrder };
}
