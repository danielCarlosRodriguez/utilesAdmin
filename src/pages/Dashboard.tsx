import { useDashboard, type TimePeriod, type StatusCount } from '../hooks/useDashboard.ts';
import type { Order, OrderStatus } from '../hooks/useOrdersMutations.ts';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// --- Status config (consistent with Orders.tsx) ---

const STATUS_BADGE: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Pedido Recibido' },
  ready: { bg: 'bg-amber-100', text: 'text-amber-600', label: 'Preparado' },
  shipped: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'En Camino' },
  delivered: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Entregado' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelado' },
};

// --- Helpers ---

function formatCurrency(value: number): string {
  return `$ ${value.toLocaleString('es-UY')}`;
}

function formatDate(value?: string): string {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}

// --- KPI Card ---

interface KpiCardProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  subtitle: string;
}

function KpiCard({ icon, iconBg, iconColor, label, value, subtitle }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          <span className={`material-symbols-outlined ${iconColor} text-xl`}>{icon}</span>
        </div>
        <span className="text-sm font-medium text-slate-500">{label}</span>
      </div>
      <div className="text-2xl font-black text-slate-800">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{subtitle}</div>
    </div>
  );
}

// --- Period Selector ---

function PeriodSelector({ period, onChange }: { period: TimePeriod; onChange: (p: TimePeriod) => void }) {
  const options: { value: TimePeriod; label: string }[] = [
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mes' },
    { value: 'year', label: 'Año' },
  ];
  return (
    <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-white">
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            period === o.value
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-600 hover:text-primary'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// --- Custom Tooltip ---

function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg text-sm">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      <p className="text-slate-600">{formatCurrency(payload[0].value)}</p>
      {payload[0].payload.orders !== undefined && (
        <p className="text-slate-400 text-xs">{payload[0].payload.orders} pedidos</p>
      )}
    </div>
  );
}

// --- Status Card ---

const STATUS_CARD_CONFIG: Record<OrderStatus, { icon: string; bg: string; iconBg: string; iconColor: string }> = {
  pending: { icon: 'hourglass_top', bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-700' },
  ready: { icon: 'inventory', bg: 'bg-amber-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  shipped: { icon: 'local_shipping', bg: 'bg-purple-50', iconBg: 'bg-purple-100', iconColor: 'text-purple-700' },
  delivered: { icon: 'check_circle', bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
  cancelled: { icon: 'cancel', bg: 'bg-red-50', iconBg: 'bg-red-100', iconColor: 'text-red-700' },
};

function StatusCard({ status, label, count, color }: StatusCount) {
  const config = STATUS_CARD_CONFIG[status];
  return (
    <div className={`rounded-2xl border border-gray-200 ${config.bg} p-4 shadow-sm`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg ${config.iconBg} flex items-center justify-center`}>
          <span className={`material-symbols-outlined ${config.iconColor} text-lg`}>{config.icon}</span>
        </div>
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
      <div className="text-2xl font-black" style={{ color }}>{count}</div>
    </div>
  );
}

// --- Bar Label ---

function BarLabel({ x, y, width, value }: any) {
  return (
    <text x={x + width + 6} y={y + 14} fill="#64748b" fontSize={12} fontWeight={600}>
      {value}
    </text>
  );
}

// --- Skeletons ---

function KpiSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gray-200" />
        <div className="h-4 w-24 rounded bg-gray-200" />
      </div>
      <div className="h-7 w-20 rounded bg-gray-200 mb-1" />
      <div className="h-3 w-28 rounded bg-gray-100" />
    </div>
  );
}

function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse">
      <div className="h-5 w-40 rounded bg-gray-200 mb-4" />
      <div className="rounded bg-gray-100" style={{ height }} />
    </div>
  );
}

// --- Recent Orders Mini Table ---

function RecentOrdersTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return <p className="text-sm text-slate-400 text-center py-8">Sin órdenes recientes</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-2 px-2 font-semibold text-slate-500 text-xs">#</th>
            <th className="text-left py-2 px-2 font-semibold text-slate-500 text-xs">Cliente</th>
            <th className="text-right py-2 px-2 font-semibold text-slate-500 text-xs">Total</th>
            <th className="text-center py-2 px-2 font-semibold text-slate-500 text-xs">Estado</th>
            <th className="text-right py-2 px-2 font-semibold text-slate-500 text-xs">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => {
            const status = o.status || 'pending';
            const badge = STATUS_BADGE[status];
            return (
              <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-2.5 px-2 font-semibold text-slate-700">{o.orderId || o.orderNumber}</td>
                <td className="py-2.5 px-2 text-slate-600 truncate max-w-[120px]">{o.customerName || '-'}</td>
                <td className="py-2.5 px-2 text-right font-medium text-slate-700">{formatCurrency(o.totals.total)}</td>
                <td className="py-2.5 px-2 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                    {badge.label}
                  </span>
                </td>
                <td className="py-2.5 px-2 text-right text-slate-400">{formatDate(o.createdAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ============ MAIN COMPONENT ============

export default function Dashboard() {
  const { data, isLoading, error, period, setPeriod, refetch } = useDashboard();

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-5xl text-red-300 mb-4 block">error</span>
          <p className="text-lg font-semibold text-slate-700 mb-2">Error al cargar datos</p>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-40 rounded bg-gray-200 animate-pulse" />
          <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Array.from({ length: 5 }).map((_, i) => <KpiSkeleton key={i} />)}
        </div>
        <div className="mb-4">
          <ChartSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  const { kpis, ordersByStatus, revenueByPeriod, topProducts, recentOrders } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Dashboard</h2>
        <PeriodSelector period={period} onChange={setPeriod} />
      </div>

      {/* KPI Cards - Row 1: Métricas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <KpiCard
          icon="payments"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          label="Ingresos"
          value={formatCurrency(kpis.totalRevenue)}
          subtitle="Pedidos entregados"
        />
        <KpiCard
          icon="receipt_long"
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          label="Total Pedidos"
          value={String(kpis.totalOrders)}
          subtitle="Todas las órdenes"
        />
        <KpiCard
          icon="avg_pace"
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          label="Ticket Promedio"
          value={formatCurrency(kpis.averageOrderValue)}
          subtitle="Por pedido entregado"
        />
        <KpiCard
          icon="visibility"
          iconBg="bg-cyan-50"
          iconColor="text-cyan-600"
          label="Visitas"
          value="—"
          subtitle="Próximamente"
        />
      </div>

      {/* KPI Cards - Row 2: Estados de órdenes */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {ordersByStatus.map(s => (
          <StatusCard key={s.status} {...s} />
        ))}
      </div>

      {/* Revenue Chart (full width) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-4">
        <h3 className="text-base font-bold text-slate-800 mb-4">
          Ingresos por {period === 'week' ? 'día' : period === 'month' ? 'semana' : 'mes'}
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={revenueByPeriod}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v: number) => `$${v}`} />
            <Tooltip content={<RevenueTooltip />} />
            <Bar dataKey="revenue" fill="#2b8cee" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Row 2: Top Products + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Products */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4">Productos Más Vendidos</h3>
          {topProducts.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Sin datos de ventas</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart layout="vertical" data={topProducts} margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis
                  dataKey="title"
                  type="category"
                  width={130}
                  tick={{ fontSize: 11 }}
                  stroke="#94a3b8"
                />
                <Tooltip
                  formatter={(value: number) => [`${value} uds`, 'Vendidos']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                />
                <Bar dataKey="quantitySold" fill="#2b8cee" radius={[0, 6, 6, 0]} label={<BarLabel />} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4">Órdenes Recientes</h3>
          <RecentOrdersTable orders={recentOrders} />
        </div>
      </div>
    </div>
  );
}
