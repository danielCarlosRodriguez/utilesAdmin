import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Order, OrderStatus } from './useOrdersMutations.ts';
import type { Product } from './useProducts.ts';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const DATABASE = 'utiles';

// --- Types ---

export type TimePeriod = 'week' | 'month' | 'year';

export interface KpiData {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  averageOrderValue: number;
  activeProducts: number;
  lowStockProducts: number;
}

export interface StatusCount {
  status: OrderStatus;
  label: string;
  count: number;
  color: string;
}

export interface PeriodRevenue {
  label: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  title: string;
  refid: string;
  quantitySold: number;
  revenue: number;
}

export interface DashboardData {
  kpis: KpiData;
  ordersByStatus: StatusCount[];
  revenueByPeriod: PeriodRevenue[];
  topProducts: TopProduct[];
  recentOrders: Order[];
}

interface UseDashboardReturn {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  period: TimePeriod;
  setPeriod: (p: TimePeriod) => void;
  refetch: () => Promise<void>;
}

// --- Constants ---

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pedido Recibido',
  ready: 'Preparado',
  shipped: 'En Camino',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const STATUS_CHART_COLORS: Record<OrderStatus, string> = {
  pending: '#1D4ED8',
  ready: '#D97706',
  shipped: '#7C3AED',
  delivered: '#047857',
  cancelled: '#B91C1C',
};

const ALL_STATUSES: OrderStatus[] = ['pending', 'ready', 'shipped', 'delivered', 'cancelled'];

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// --- Aggregation helpers ---

function computeKpis(orders: Order[], products: Product[]): KpiData {
  const delivered = orders.filter(o => o.status === 'delivered');
  const totalRevenue = delivered.reduce((sum, o) => sum + o.totals.total, 0);
  const deliveredCount = delivered.length;

  return {
    totalRevenue,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    averageOrderValue: deliveredCount > 0 ? Math.round(totalRevenue / deliveredCount) : 0,
    activeProducts: products.filter(p => p.activo).length,
    lowStockProducts: products.filter(p => p.stock <= 5 && p.activo).length,
  };
}

function computeOrdersByStatus(orders: Order[]): StatusCount[] {
  const counts: Record<string, number> = {};
  for (const o of orders) {
    const s = o.status || 'pending';
    counts[s] = (counts[s] || 0) + 1;
  }
  return ALL_STATUSES.map(status => ({
    status,
    label: STATUS_LABELS[status],
    count: counts[status] || 0,
    color: STATUS_CHART_COLORS[status],
  }));
}

function computeRevenueByPeriod(orders: Order[], period: TimePeriod): PeriodRevenue[] {
  const now = new Date();
  // Only non-cancelled orders contribute to revenue
  const validOrders = orders.filter(o => o.status !== 'cancelled');

  if (period === 'week') {
    // Last 7 days
    const days: PeriodRevenue[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      days.push({ label: DAY_NAMES[d.getDay()], revenue: 0, orders: 0 });

      for (const o of validOrders) {
        if (!o.createdAt) continue;
        const od = new Date(o.createdAt);
        const odStr = `${od.getFullYear()}-${od.getMonth()}-${od.getDate()}`;
        if (odStr === dayStr) {
          days[days.length - 1].revenue += o.totals.total;
          days[days.length - 1].orders += 1;
        }
      }
    }
    return days;
  }

  if (period === 'month') {
    // Last 4 weeks
    const weeks: PeriodRevenue[] = [];
    for (let w = 3; w >= 0; w--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (w * 7 + 6));
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - w * 7);

      const bucket: PeriodRevenue = { label: `Sem ${4 - w}`, revenue: 0, orders: 0 };

      for (const o of validOrders) {
        if (!o.createdAt) continue;
        const od = new Date(o.createdAt);
        if (od >= weekStart && od <= weekEnd) {
          bucket.revenue += o.totals.total;
          bucket.orders += 1;
        }
      }
      weeks.push(bucket);
    }
    return weeks;
  }

  // year: last 12 months
  const months: PeriodRevenue[] = [];
  for (let m = 11; m >= 0; m--) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const bucket: PeriodRevenue = { label: MONTH_NAMES[d.getMonth()], revenue: 0, orders: 0 };

    for (const o of validOrders) {
      if (!o.createdAt) continue;
      const od = new Date(o.createdAt);
      if (od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth()) {
        bucket.revenue += o.totals.total;
        bucket.orders += 1;
      }
    }
    months.push(bucket);
  }
  return months;
}

function computeTopProducts(orders: Order[], products: Product[]): TopProduct[] {
  const nonCancelled = orders.filter(o => o.status !== 'cancelled');
  const agg: Record<string, { quantity: number; revenue: number }> = {};

  for (const o of nonCancelled) {
    for (const item of o.items) {
      if (!agg[item.refid]) agg[item.refid] = { quantity: 0, revenue: 0 };
      agg[item.refid].quantity += item.quantity;
      agg[item.refid].revenue += item.subtotal;
    }
  }

  const productMap = new Map(products.map(p => [p.refid, p]));

  return Object.entries(agg)
    .map(([refid, data]) => ({
      title: productMap.get(refid)?.title || refid,
      refid,
      quantitySold: data.quantity,
      revenue: data.revenue,
    }))
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, 5);
}

// --- Normalization (reuse pattern from useOrders/useProducts) ---

function getId(value?: string | { $oid?: string }): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  return value.$oid;
}

function normalizeOrder(item: any): Order {
  const resolvedId = getId(item._id);
  const items = (item.items || []).map((entry: any) => {
    const unitPrice = Number(entry.unitPrice ?? entry.price ?? 0);
    const quantity = Number(entry.quantity ?? 0);
    const subtotal = Number(entry.subtotal ?? unitPrice * quantity);
    return { refid: String(entry.refid ?? ''), title: entry.title ?? '', brand: entry.brand, unitPrice, quantity, subtotal };
  });
  const totals = {
    itemsCount: Number(item.totals?.itemsCount ?? items.reduce((s: number, e: any) => s + e.quantity, 0)),
    subtotal: Number(item.totals?.subtotal ?? items.reduce((s: number, e: any) => s + e.subtotal, 0)),
    total: Number(item.totals?.total ?? items.reduce((s: number, e: any) => s + e.subtotal, 0)),
  };
  return {
    _id: resolvedId, id: resolvedId || item.orderNumber || '',
    orderId: item.orderId !== undefined ? Number(item.orderId) : undefined,
    orderNumber: item.orderNumber, createdAt: item.createdAt, status: item.status,
    customerName: item.customerName, customerPhone: item.customerPhone,
    customerAddress: item.customerAddress, customerNote: item.customerNote,
    items, totals, source: item.source,
  };
}

function normalizeProduct(item: any): Product {
  const resolvedCategoryId = typeof item.categoryId === 'string' ? item.categoryId : item.categoryId?.$oid;
  return {
    _id: item._id, id: String(item.refid), refid: String(item.refid),
    title: item.descripción, category: item.categoría, categoryId: resolvedCategoryId,
    price: item.precio,
    image: item.imagenCloudinary?.[0] || (item.imagen?.[0] ? `/imagenes/productos/${item.imagen[0]}` : ''),
    images: item.imagen || [], imagenCloudinary: item.imagenCloudinary || [],
    brand: item.marca, detail: item.detalle || '', stock: item.stock, sku: item.sku,
    activo: item.activo, destacado: item.destacado, descuento: item.descuento, tags: item.tags || [],
  };
}

// --- Hook ---

export function useDashboard(): UseDashboardReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<TimePeriod>('month');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/${DATABASE}/orders`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } }),
        fetch(`${BACKEND_URL}/api/${DATABASE}/products`),
      ]);

      if (!ordersRes.ok) throw new Error(`Error cargando órdenes: ${ordersRes.status}`);
      if (!productsRes.ok) throw new Error(`Error cargando productos: ${productsRes.status}`);

      const ordersResult = await ordersRes.json();
      const productsResult = await productsRes.json();

      const rawOrders: any[] = ordersResult.data || ordersResult;
      const rawProducts: any[] = productsResult.data || productsResult;

      setOrders(rawOrders.map(normalizeOrder));
      setProducts(rawProducts.map(normalizeProduct));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar datos';
      setError(message);
      console.error('useDashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const data = useMemo<DashboardData | null>(() => {
    if (orders.length === 0 && products.length === 0 && isLoading) return null;

    const sorted = [...orders].sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });

    return {
      kpis: computeKpis(orders, products),
      ordersByStatus: computeOrdersByStatus(orders),
      revenueByPeriod: computeRevenueByPeriod(orders, period),
      topProducts: computeTopProducts(orders, products),
      recentOrders: sorted.slice(0, 5),
    };
  }, [orders, products, period, isLoading]);

  return { data, isLoading, error, period, setPeriod, refetch: fetchData };
}

export default useDashboard;
