/**
 * UserDetailModal - Modal para ver detalles de usuario y su actividad
 *
 * Features:
 * - Información del usuario
 * - Tabs: Ofertas realizadas, Remates ganados, Actividad reciente
 * - Estadísticas rápidas
 * - Dark mode support
 */

import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  XMarkIcon,
  UserCircleIcon,
  BanknotesIcon,
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { usersAPI } from '../../services/api';
import { useFocusTrap } from '../../hooks';
import LazyImage from '../atoms/LazyImage';
import Badge from '../atoms/Badge';

export default function UserDetailModal({
  isOpen,
  onClose,
  user = null,
}) {
  const modalRef = useRef(null);
  useFocusTrap(modalRef, isOpen, onClose);

  const [activeTab, setActiveTab] = useState('bids'); // 'bids' | 'won' | 'orders'
  const [bidsData, setBidsData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data when modal opens and tab changes
  useEffect(() => {
    if (!isOpen || !user) {
      setBidsData([]);
      setOrdersData([]);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (activeTab === 'bids' || activeTab === 'won') {
          console.log('🔍 [UserDetailModal] Fetching bids for user:', user._id);
          const response = await usersAPI.getUserBids(user._id, { limit: 100 });
          console.log('📦 [UserDetailModal] Bids response:', response);
          console.log('📊 [UserDetailModal] Bids data:', response.data?.bids);

          // Log detallado de cada bid
          if (response.data?.bids) {
            response.data.bids.forEach((bid, index) => {
              console.log(`📝 [Bid ${index + 1}]:`, {
                id: bid._id,
                amount: bid.amount,
                product: {
                  name: bid.product?.name,
                  images: bid.product?.images,
                  imageExists: !!bid.product?.images?.[0],
                  firstImage: bid.product?.images?.[0]
                }
              });
            });
          }

          setBidsData(response.data?.bids || []);
        }

        if (activeTab === 'orders') {
          console.log('🔍 [UserDetailModal] Fetching orders for user:', user._id);
          const response = await usersAPI.getUserOrders(user._id, { limit: 50 });
          console.log('📦 [UserDetailModal] Orders response:', response);
          setOrdersData(response.data?.orders || []);
        }
      } catch (err) {
        console.error('❌ [UserDetailModal] Error fetching user data:', err);
        setError(err.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, user, activeTab]);

  // Calcular estadísticas
  const stats = {
    totalBids: bidsData.length,
    wonAuctions: bidsData.filter(bid => bid.product?.userStatus === 'winner').length,
    totalOrders: ordersData.length,
    totalSpent: ordersData.reduce((sum, order) => sum + (order.total || 0), 0),
  };

  // Filtrar ofertas según el tab activo
  const displayedBids = activeTab === 'won'
    ? bidsData.filter(bid => bid.product?.userStatus === 'winner')
    : bidsData;

  // Formatear fecha
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-UY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU'
    }).format(price || 0);
  };

  // Get status badge for bid
  const getBidStatusBadge = (userStatus) => {
    const statusMap = {
      winner: { variant: 'success', label: 'Ganador', icon: TrophyIcon },
      winning: { variant: 'info', label: 'Ganando', icon: CheckCircleIcon },
      outbid: { variant: 'warning', label: 'Superado', icon: XCircleIcon },
      lost: { variant: 'danger', label: 'Perdido', icon: XCircleIcon },
    };

    const config = statusMap[userStatus] || { variant: 'default', label: userStatus, icon: null };
    return (
      <Badge variant={config.variant}>
        {config.icon && <config.icon className="w-3 h-3 inline mr-1" />}
        {config.label}
      </Badge>
    );
  };

  // Get status badge for order
  const getOrderStatusBadge = (status) => {
    const statusMap = {
      pending: { variant: 'warning', label: 'Pendiente' },
      processing: { variant: 'info', label: 'Procesando' },
      confirmed: { variant: 'success', label: 'Pago Confirmado' },
      shipped: { variant: 'info', label: 'Enviado' },
      delivered: { variant: 'success', label: 'Entregado' },
      cancelled: { variant: 'danger', label: 'Cancelado' },
    };

    const config = statusMap[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative w-full max-w-4xl bg-white dark:bg-neutral-800 rounded-lg shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="h-16 w-16 shrink-0">
                {user?.picture ? (
                  <LazyImage
                    src={user.picture}
                    alt={`Avatar de ${user.name}`}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <UserCircleIcon className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {user?.name}
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {user?.email}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={user?.role === 'admin' ? 'info' : 'default'}>
                    {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                  </Badge>
                  <Badge variant={user?.isActive ? 'success' : 'danger'}>
                    {user?.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-neutral-50 dark:bg-neutral-900">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-1">
                <BanknotesIcon className="w-4 h-4" />
                <span>Ofertas</span>
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {stats.totalBids}
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-1">
                <TrophyIcon className="w-4 h-4" />
                <span>Ganados</span>
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {stats.wonAuctions}
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-1">
                <ClockIcon className="w-4 h-4" />
                <span>Órdenes</span>
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {stats.totalOrders}
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-1">
                <BanknotesIcon className="w-4 h-4" />
                <span>Gastado</span>
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {formatPrice(stats.totalSpent)}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-neutral-200 dark:border-neutral-700">
            <nav className="flex px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('bids')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'bids'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:border-neutral-300'
                }`}
              >
                Ofertas Realizadas ({stats.totalBids})
              </button>
              <button
                onClick={() => setActiveTab('won')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'won'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:border-neutral-300'
                }`}
              >
                Remates Ganados ({stats.wonAuctions})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:border-neutral-300'
                }`}
              >
                Órdenes ({stats.totalOrders})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="mt-4 text-neutral-600 dark:text-neutral-400">Cargando...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : (
              <>
                {/* Bids Tab */}
                {(activeTab === 'bids' || activeTab === 'won') && (
                  <div>
                    {displayedBids.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-neutral-600 dark:text-neutral-400">
                          {activeTab === 'won' ? 'No ha ganado ningún remate aún' : 'No ha realizado ofertas aún'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {displayedBids.map((bid, idx) => {
                          console.log(`🖼️ [Render Bid ${idx + 1}] Image check:`, {
                            hasProduct: !!bid.product,
                            hasImages: !!bid.product?.images,
                            imagesLength: bid.product?.images?.length,
                            firstImage: bid.product?.images?.[0],
                            willShowImage: !!bid.product?.images?.[0]
                          });

                          return (
                            <div
                              key={bid._id}
                              className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700"
                            >
                              {/* Product Image */}
                              <div className="h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                                {bid.product?.images?.[0] ? (
                                  <>
                                    {console.log(`✅ Rendering LazyImage for bid ${idx + 1}:`, bid.product.images[0].url || bid.product.images[0])}
                                    <LazyImage
                                      src={bid.product.images[0].url || bid.product.images[0]}
                                      alt={bid.product.name || 'Producto'}
                                      className="h-full w-full object-cover"
                                    />
                                  </>
                                ) : (
                                  <>
                                    {console.log(`❌ No image for bid ${idx + 1}, showing PhotoIcon`)}
                                    <div className="h-full w-full flex items-center justify-center">
                                      <PhotoIcon className="w-8 h-8 text-neutral-400" />
                                    </div>
                                  </>
                                )}
                              </div>

                            {/* Bid Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                                {bid.product?.name || 'Producto sin nombre'}
                              </h4>
                              <div className="flex items-center gap-3 mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                                <span>Oferta: {formatPrice(bid.amount)}</span>
                                <span>•</span>
                                <span>{formatDate(bid.createdAt)}</span>
                              </div>
                            </div>

                            {/* Status */}
                            <div className="shrink-0">
                              {getBidStatusBadge(bid.product?.userStatus)}
                            </div>
                          </div>
                        );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div>
                    {ordersData.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-neutral-600 dark:text-neutral-400">
                          No tiene órdenes registradas
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {ordersData.map((order) => (
                          <div
                            key={order._id}
                            className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                  {order.orderNumber}
                                </h4>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                                  {formatDate(order.createdAt)}
                                </p>
                              </div>
                              {getOrderStatusBadge(order.status)}
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                {order.items?.length} producto(s)
                              </span>
                              <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                {formatPrice(order.total)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

UserDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object,
};
