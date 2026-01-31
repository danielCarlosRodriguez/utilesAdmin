/**
 * OrderDetailPage - Página de detalle de orden (Admin)
 *
 * Features:
 * - Información completa de la orden
 * - Timeline visual del estado de la orden
 * - Lista detallada de productos
 * - Dirección de envío
 * - Resumen de costos (subtotal, envío, total)
 * - Método de pago
 * - Información del usuario
 * - Número de seguimiento (si está enviada)
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header, Footer } from '../../components/organisms';
import Badge from '../../components/atoms/Badge';
import Button from '../../components/atoms/Button';
import Card from '../../components/atoms/Card';
import LazyImage from '../../components/atoms/LazyImage';
import { ordersAPI } from '../../services/api';
import { useToast } from '../../context';
import {
  ArrowLeftIcon,
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ordersAPI.getById(id);

        // Manejar diferentes formatos de respuesta
        let orderData = null;
        if (response && response.success) {
          orderData = response.data?.order || response.data;
        } else if (response && !response.success) {
          orderData = response;
        } else {
          orderData = response;
        }

        setOrder(orderData);
      } catch (err) {
        console.error('Error al cargar orden:', err);
        setError(err.message || 'Error al cargar la orden');
        showToast({
          type: 'error',
          title: 'Error',
          message: 'No se pudo cargar la orden'
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetail();
    }
  }, [id, showToast]);

  // Función para formatear fechas
  const formatDate = (date) => {
    if (!date) return '-';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
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

  // Get status badge config
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

  // Timeline de estado
  const getTimeline = () => {
    if (!order) return [];

    const timeline = [
      {
        status: 'pending',
        label: 'Pendiente de pago',
        completed: ['pending', 'processing', 'confirmed', 'shipped', 'delivered'].includes(order.status),
        active: order.status === 'pending',
      },
      {
        status: 'processing',
        label: 'Procesando Pago',
        completed: ['processing', 'confirmed', 'shipped', 'delivered'].includes(order.status),
        active: order.status === 'processing',
      },
      {
        status: 'confirmed',
        label: 'Pago Confirmado',
        completed: ['confirmed', 'shipped', 'delivered'].includes(order.status),
        active: order.status === 'confirmed',
      },
      {
        status: 'shipped',
        label: 'Viajando a destino',
        completed: ['shipped', 'delivered'].includes(order.status),
        active: order.status === 'shipped',
      },
      {
        status: 'delivered',
        label: 'Entregado',
        completed: order.status === 'delivered',
        active: order.status === 'delivered',
      },
    ];

    return timeline;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
        <Header />
        <main className="grow py-12">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4"></div>
              <div className="h-64 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
        <Header />
        <main className="grow py-12">
          <div className="container mx-auto px-4">
            <Card padding="lg" className="text-center">
              <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                Error al cargar la orden
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                {error || 'No se encontró la orden'}
              </p>
              <Button onClick={() => navigate('/admin/orders')} variant="outline">
                Volver a Órdenes
              </Button>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statusBadge = getStatusBadge(order.status);
  const timeline = getTimeline();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
      <Header />

      <main className="grow py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb y botón volver */}
          <div className="mb-6 flex items-center justify-between">
            <nav className="text-sm">
              <Link 
                to="/admin/orders" 
                className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                Órdenes
              </Link>
              <span className="mx-2 text-neutral-400 dark:text-neutral-500">/</span>
              <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                {order.orderNumber || `Orden #${order._id.slice(-8)}`}
              </span>
            </nav>
            <Button
              onClick={() => navigate('/admin/orders')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Volver
            </Button>
          </div>

          {/* Header de la orden */}
          <Card padding="lg" className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  {order.orderNumber || `Orden #${order._id.slice(-8)}`}
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Creada el {formatDate(order.createdAt)}
                </p>
              </div>
              <Badge 
                variant={statusBadge.variant} 
                icon={statusBadge.icon}
                size="md"
              >
                {statusBadge.label}
              </Badge>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna izquierda (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Timeline */}
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Estado de la Orden
                </h2>
                <div className="space-y-4">
                  {timeline.map((step, index) => (
                    <div key={step.status} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed
                              ? 'bg-green-500 text-white'
                              : step.active
                              ? 'bg-primary-500 text-white ring-2 ring-primary-200'
                              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircleIcon className="w-5 h-5" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-current" />
                          )}
                        </div>
                        {index < timeline.length - 1 && (
                          <div
                            className={`w-0.5 h-12 ${
                              step.completed
                                ? 'bg-green-500'
                                : 'bg-neutral-200 dark:bg-neutral-700'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p
                          className={`font-medium ${
                            step.active
                              ? 'text-primary-600 dark:text-primary-400'
                              : step.completed
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-neutral-500 dark:text-neutral-400'
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Productos */}
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Productos ({order.items?.length || 0})
                </h2>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700 last:border-0 last:pb-0"
                    >
                      {item.image && (
                        <LazyImage
                          src={item.image}
                          alt={item.name || 'Producto'}
                          className="w-20 h-20 rounded-lg object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                          {item.name || 'Producto sin nombre'}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          Cantidad: {item.quantity || 1}
                        </p>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-2">
                          {formatPrice(item.price)} c/u
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {formatPrice((item.price || 0) * (item.quantity || 1))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Columna derecha (1/3) */}
            <div className="space-y-6">
              {/* Resumen */}
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Resumen
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">Subtotal</span>
                    <span className="text-neutral-900 dark:text-neutral-100">
                      {formatPrice(order.subtotal || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">Envío</span>
                    <span className="text-neutral-900 dark:text-neutral-100">
                      {formatPrice(order.shippingCost || 0)}
                    </span>
                  </div>
                  {order.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">Impuestos</span>
                      <span className="text-neutral-900 dark:text-neutral-100">
                        {formatPrice(order.tax)}
                      </span>
                    </div>
                  )}
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Descuento</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 flex justify-between font-semibold">
                    <span className="text-neutral-900 dark:text-neutral-100">Total</span>
                    <span className="text-primary-600 dark:text-primary-400 text-lg">
                      {formatPrice(order.total || 0)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center gap-2">
                      {order.isPaid ? (
                        <>
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                            Pagado
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="w-5 h-5 text-red-500" />
                          <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                            Pendiente de pago
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Usuario */}
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Cliente
                </h2>
                <div className="space-y-3">
                  {order.user?.picture && (
                    <div className="mb-3">
                      <LazyImage
                        src={order.user.picture}
                        alt={order.user.name || 'Usuario'}
                        className="w-16 h-16 rounded-full object-cover mx-auto"
                      />
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <UserIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Nombre</p>
                      <p className="text-neutral-900 dark:text-neutral-100 font-medium">
                        {order.user?.name || order.shippingAddress?.fullName || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <EnvelopeIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Email</p>
                      <p className="text-neutral-900 dark:text-neutral-100 font-medium">
                        {order.user?.email || order.shippingAddress?.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Dirección de envío */}
              {order.shippingAddress && (
                <Card padding="lg">
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    Dirección de Envío
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPinIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-400 shrink-0 mt-0.5" />
                      <div className="text-sm text-neutral-900 dark:text-neutral-100">
                        <p className="font-medium">{order.shippingAddress.fullName}</p>
                        <p className="mt-1">{order.shippingAddress.street || order.shippingAddress.address}</p>
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                          {order.shippingAddress.zipCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                        {order.shippingAddress.phone && (
                          <div className="flex items-center gap-1 mt-2">
                            <PhoneIcon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                            <span>{order.shippingAddress.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Método de pago */}
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Método de Pago
                </h2>
                <div className="space-y-2">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {order.paymentMethod === 'mercadopago' ? 'Mercado Pago' : order.paymentMethod || 'N/A'}
                  </p>
                  {order.paymentInfo?.mercadopagoPaymentId && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      ID de pago: {order.paymentInfo.mercadopagoPaymentId}
                    </p>
                  )}
                  {order.paymentInfo?.paidAt && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Pagado el: {formatDate(order.paymentInfo.paidAt)}
                    </p>
                  )}
                </div>
              </Card>

              {/* Número de seguimiento */}
              {order.trackingNumber && (
                <Card padding="lg">
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    Seguimiento
                  </h2>
                  <p className="text-sm font-mono text-primary-600 dark:text-primary-400">
                    {order.trackingNumber}
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

