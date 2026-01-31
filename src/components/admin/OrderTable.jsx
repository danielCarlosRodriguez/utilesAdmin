/**
 * OrderTable - Tabla de órdenes para administración
 *
 * Features:
 * - Muestra órdenes en tabla responsiva
 * - Columnas: Orden, Usuario, Productos, Total, Estado, Fecha, Pagado
 * - Badges de estado con iconos (similar al frontend)
 * - Estilos consistentes con ProductTable y UserTable
 */

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Badge from '../atoms/Badge';
import {
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

export default function OrderTable({
  orders,
  loading,
}) {
  const navigate = useNavigate();

  const handleOrderClick = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };
  // Función para formatear fechas
  const formatDate = (date) => {
    if (!date) return '-';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para formatear precios
  const formatPrice = (price) => {
    if (!price) return '$0.00';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  // Get status badge config (similar al frontend)
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        variant: 'warning', 
        label: 'Pendiente de pago', 
        Icon: ClockIcon 
      },
      processing: { 
        variant: 'primary', 
        label: 'Procesando Pago', 
        Icon: ShoppingBagIcon 
      },
      confirmed: { 
        variant: 'success', 
        label: 'Pago Confirmado', 
        Icon: CheckCircleIcon 
      },
      shipped: { 
        variant: 'info', 
        label: 'Viajando a destino', 
        Icon: TruckIcon 
      },
      delivered: { 
        variant: 'success', 
        label: 'Entregado', 
        Icon: CheckCircleIcon 
      },
      cancelled: { 
        variant: 'error', 
        label: 'Cancelado', 
        Icon: XCircleIcon 
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.Icon;

    return {
      variant: config.variant,
      label: config.label,
      icon: <Icon className="w-3 h-3" />,
    };
  };

  // Memoizar órdenes con información de usuario procesada
  const ordersWithUserInfo = useMemo(() => {
    if (!orders) return [];
    return orders.map(order => ({
      ...order,
      userName: order.user?.name || order.user?.email || 'Usuario desconocido',
      userEmail: order.user?.email || '-',
      itemsCount: order.items?.length || 0,
    }));
  }, [orders]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-12 text-center">
        <p className="text-neutral-600 dark:text-neutral-400">
          No hay órdenes para mostrar
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      {/* Table - Desktop */}
      <div className="hidden xl:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Orden
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Productos
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Pagado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
            {ordersWithUserInfo.map((order) => {
              const statusBadge = getStatusBadge(order.status);

              return (
                <tr 
                  key={order._id} 
                  onClick={() => handleOrderClick(order._id)}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer"
                >
                  {/* Orden */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {order.orderNumber || `#${order._id.slice(-8)}`}
                    </div>
                  </td>

                  {/* Usuario */}
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {order.userName}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {order.userEmail}
                    </div>
                  </td>

                  {/* Productos */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {order.itemsCount} producto{order.itemsCount !== 1 ? 's' : ''}
                    </span>
                  </td>

                  {/* Total */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {formatPrice(order.total)}
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge 
                      variant={statusBadge.variant} 
                      icon={statusBadge.icon}
                      size="sm"
                    >
                      {statusBadge.label}
                    </Badge>
                  </td>

                  {/* Pagado */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.isPaid
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {order.isPaid ? (
                        <>
                          <CheckCircleIcon className="w-3 h-3" />
                          Sí
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="w-3 h-3" />
                          No
                        </>
                      )}
                    </span>
                  </td>

                  {/* Fecha */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      {formatDate(order.createdAt)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards - Mobile & Tablet */}
      <div className="xl:hidden divide-y divide-neutral-200 dark:divide-neutral-700">
        {ordersWithUserInfo.map((order) => {
          const statusBadge = getStatusBadge(order.status);

          return (
            <div 
              key={order._id} 
              onClick={() => handleOrderClick(order._id)}
              className="p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
            >
              <div className="flex flex-col gap-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {order.orderNumber || `Orden #${order._id.slice(-8)}`}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge 
                    variant={statusBadge.variant} 
                    icon={statusBadge.icon}
                    size="sm"
                  >
                    {statusBadge.label}
                  </Badge>
                </div>

                {/* Usuario */}
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Usuario</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {order.userName}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {order.userEmail}
                  </p>
                </div>

                {/* Información de la orden */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Productos</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mt-1">
                      {order.itemsCount} producto{order.itemsCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Total</p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>

                {/* Estado de pago */}
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Estado de pago</p>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.isPaid
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {order.isPaid ? (
                      <>
                        <CheckCircleIcon className="w-3 h-3" />
                        Pagado
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="w-3 h-3" />
                        Pendiente
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

OrderTable.propTypes = {
  orders: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

