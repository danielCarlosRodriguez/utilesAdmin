/**
 * OrdersManagementPage - Página de gestión de órdenes (Admin)
 *
 * Features:
 * - Listado de todas las órdenes de todos los usuarios
 * - Filtrado por estado
 * - Estadísticas de órdenes
 * - Visualización de información del usuario
 * - Badges de estado con iconos
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Header, Footer } from '../../components/organisms';
import OrderTable from '../../components/admin/OrderTable';
import { ordersAPI } from '../../services/api';
import { useToast } from '../../context';
import {
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

export default function OrdersManagementPage() {
  const { showToast } = useToast();
  const [allOrders, setAllOrders] = useState([]); // Todas las órdenes cargadas
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, processing, shipped, delivered, cancelled

  // Cargar todas las órdenes una sola vez al montar el componente
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Siempre cargar todas las órdenes sin filtro
      const response = await ordersAPI.getAllAdmin();

      // Manejar diferentes formatos de respuesta
      let ordersArray = [];
      if (Array.isArray(response)) {
        ordersArray = response;
      } else if (response && response.success) {
        if (Array.isArray(response.data)) {
          ordersArray = response.data;
        } else if (response.data && Array.isArray(response.data.orders)) {
          ordersArray = response.data.orders;
        }
      } else if (response && Array.isArray(response.data)) {
        ordersArray = response.data;
      }

      setAllOrders(ordersArray);
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      setError(err.message || 'Error al cargar las órdenes');
      showToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudieron cargar las órdenes'
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Filtrar órdenes localmente según el filtro seleccionado
  const filteredOrders = useMemo(() => {
    if (filter === 'all') {
      return allOrders;
    }
    return allOrders.filter(order => order.status === filter);
  }, [allOrders, filter]);

  // Calcular estadísticas sobre todas las órdenes (no solo las filtradas)
  const stats = useMemo(() => ({
    total: allOrders.length,
    pending: allOrders.filter(o => o.status === 'pending').length,
    processing: allOrders.filter(o => o.status === 'processing').length,
    confirmed: allOrders.filter(o => o.status === 'confirmed').length,
    shipped: allOrders.filter(o => o.status === 'shipped').length,
    delivered: allOrders.filter(o => o.status === 'delivered').length,
    cancelled: allOrders.filter(o => o.status === 'cancelled').length,
    totalRevenue: allOrders
      .filter(o => o.isPaid && o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0),
  }), [allOrders]);

  // Get filter label in Spanish
  const getFilterLabel = (filterValue) => {
    const filterLabels = {
      all: 'todas',
      pending: 'pendientes',
      processing: 'en procesamiento',
      confirmed: 'pago confirmado',
      shipped: 'enviadas',
      delivered: 'entregadas',
      cancelled: 'canceladas',
    };
    return filterLabels[filterValue] || filterValue;
  };

  // Get filter button colors matching badge colors
  const getFilterColors = (filterValue, isActive) => {
    const colors = {
      all: isActive 
        ? 'bg-neutral-200 text-neutral-800 border-2 border-neutral-400 dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-500'
        : 'bg-white text-neutral-700 border-2 border-neutral-400 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-500',
      pending: isActive
        ? 'bg-amber-200 text-amber-900 border-2 border-amber-500 dark:bg-amber-900/50 dark:text-amber-200 dark:border-amber-500'
        : 'bg-amber-100 text-amber-800 border-2 border-amber-500 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-500',
      processing: isActive
        ? 'bg-primary-200 text-primary-900 border-2 border-primary-500 dark:bg-primary-900/50 dark:text-primary-200 dark:border-primary-500'
        : 'bg-primary-100 text-primary-700 border-2 border-primary-500 dark:bg-primary-900/40 dark:text-primary-200 dark:border-primary-500',
      confirmed: isActive
        ? 'bg-green-200 text-green-900 border-2 border-green-500 dark:bg-green-900/50 dark:text-green-200 dark:border-green-500'
        : 'bg-green-100 text-green-800 border-2 border-green-500 dark:bg-green-900/40 dark:text-green-200 dark:border-green-500',
      shipped: isActive
        ? 'bg-indigo-200 text-indigo-900 border-2 border-indigo-500 dark:bg-indigo-900/50 dark:text-indigo-200 dark:border-indigo-500'
        : 'bg-indigo-100 text-indigo-800 border-2 border-indigo-500 dark:bg-indigo-900/40 dark:text-indigo-200 dark:border-indigo-500',
      delivered: isActive
        ? 'bg-green-200 text-green-900 border-2 border-green-500 dark:bg-green-900/50 dark:text-green-200 dark:border-green-500'
        : 'bg-green-100 text-green-800 border-2 border-green-500 dark:bg-green-900/40 dark:text-green-200 dark:border-green-500',
      cancelled: isActive
        ? 'bg-red-200 text-red-900 border-2 border-red-500 dark:bg-red-900/50 dark:text-red-200 dark:border-red-500'
        : 'bg-red-100 text-red-800 border-2 border-red-500 dark:bg-red-900/40 dark:text-red-200 dark:border-red-500',
    };
    return colors[filterValue] || colors.all;
  };

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
      <Header />

      <main className="grow">
        {/* Hero Section */}
        <section className="bg-linear-to-br from-primary-500 to-primary-700 dark:from-primary-700 dark:to-primary-900 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-1 text-white">
                  Gestión de Órdenes
                </h1>
                <p className="text-sm text-primary-100">
                  {loading
                    ? "Cargando..."
                    : `${stats.total} órdenes en total`}
                </p>
              </div>

              {/* Filter buttons */}
              <div className="flex gap-2 overflow-x-auto pb-2 -mb-2">
                {[
                  { value: 'all', label: 'Todas' },
                  { value: 'pending', label: 'Pendiente de pago' },
                  { value: 'processing', label: 'Procesando Pago' },
                  { value: 'confirmed', label: 'Pago Confirmado' },
                  { value: 'shipped', label: 'Viajando a destino' },
                  { value: 'delivered', label: 'Entregado' },
                  { value: 'cancelled', label: 'Canceladas' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setFilter(value)}
                    type="button"
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 relative z-10 shrink-0 shadow-sm hover:shadow-md ${
                      getFilterColors(value, filter === value)
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 space-y-8">
            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-5 shadow-sm">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Total de órdenes
                </p>
                <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {loading ? '—' : stats.total}
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-5 shadow-sm">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Pendientes de pago
                </p>
                <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {loading ? '—' : stats.pending}
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-5 shadow-sm">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  En proceso
                </p>
                <p className="mt-2 text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {loading ? '—' : stats.processing}
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-5 shadow-sm">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Pago Confirmado
                </p>
                <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                  {loading ? '—' : stats.confirmed}
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-5 shadow-sm">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Ingresos totales
                </p>
                <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                  {loading ? '—' : formatPrice(stats.totalRevenue)}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Orders Table */}
            <OrderTable
              orders={filteredOrders}
              loading={loading}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

