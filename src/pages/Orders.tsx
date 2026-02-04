import { useEffect, useState, useCallback, useRef } from 'react';
import EmptyState from '../components/EmptyState.tsx';
import { useOrders } from '../hooks/useOrders.ts';
import { useDeleteOrder, useUpdateOrder, type Order, type OrderStatus } from '../hooks/useOrdersMutations.ts';
import { useOrderSocket } from '../hooks/useOrderSocket.ts';
import OrderDetailModal from '../components/OrderDetailModal.tsx';
import ShippingLabelModal from '../components/ShippingLabelModal.tsx';

type StatusDropdownProps = {
  currentStatus: OrderStatus;
  onChange: (status: OrderStatus) => void;
  disabled?: boolean;
};

const statusConfig: Record<OrderStatus, { label: string; bgClass: string; textClass: string }> = {
  pending: { label: 'Pedido Recibido', bgClass: 'bg-blue-100', textClass: 'text-blue-700' },
  ready: { label: 'Preparado', bgClass: 'bg-amber-100', textClass: 'text-amber-600' },
  shipped: { label: 'En Camino', bgClass: 'bg-purple-100', textClass: 'text-purple-700' },
  delivered: { label: 'Entregado', bgClass: 'bg-emerald-100', textClass: 'text-emerald-700' },
  cancelled: { label: 'Cancelado', bgClass: 'bg-red-100', textClass: 'text-red-700' },
};

const allStatusKeys: OrderStatus[] = ['pending', 'ready', 'shipped', 'delivered', 'cancelled'];

const StatusDropdown = ({ currentStatus, onChange, disabled }: StatusDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const current = statusConfig[currentStatus] || statusConfig.pending;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${current.bgClass} ${current.textClass} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
      >
        {current.label}
        <span className="material-symbols-outlined text-sm">expand_more</span>
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-44 rounded-xl bg-white shadow-lg border border-gray-200 py-1 left-1/2 -translate-x-1/2">
          {allStatusKeys.map((status) => {
            const config = statusConfig[status];
            const isSelected = status === currentStatus;
            return (
              <button
                key={status}
                type="button"
                onClick={() => {
                  onChange(status);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center gap-2 hover:bg-gray-50 ${isSelected ? 'bg-gray-50' : ''}`}
              >
                <span className={`inline-block w-3 h-3 rounded-full ${config.bgClass} border ${config.textClass.replace('text-', 'border-')}`} />
                <span className={config.textClass}>{config.label}</span>
                {isSelected && (
                  <span className="material-symbols-outlined text-sm ml-auto text-primary">check</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Orders = () => {
  const { orders, isLoading, error, refetch } = useOrders();
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  const { updateOrder, isLoading: isUpdating, error: updateError } = useUpdateOrder();
  const { deleteOrder, isLoading: isDeleting, error: deleteError } = useDeleteOrder();

  // Handle real-time order updates via Socket.io
  const handleOrderUpdated = useCallback((event: { orderId: string; status: OrderStatus; order: Order }) => {
    setLocalOrders((prev: Order[]) =>
      prev.map((entry: Order) =>
        (entry._id === event.orderId || entry.id === event.orderId)
          ? { ...entry, status: event.status }
          : entry
      )
    );
  }, []);

  useOrderSocket({ onOrderUpdated: handleOrderUpdated });
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Order | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [packageCounts, setPackageCounts] = useState<Record<string, number>>({});
  const [printOrder, setPrintOrder] = useState<Order | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  const openDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedOrder(null);
  };

  const handlePackageCountChange = (orderId: string, value: string) => {
    const num = parseInt(value, 10);
    setPackageCounts((prev) => ({
      ...prev,
      [orderId]: Number.isNaN(num) || num < 1 ? 1 : num
    }));
  };

  const openPrintModal = (order: Order) => {
    setPrintOrder(order);
    setIsPrintModalOpen(true);
  };

  const closePrintModal = () => {
    setIsPrintModalOpen(false);
    setPrintOrder(null);
  };

  useEffect(() => {
    if (!updateError) return;
    setErrorTitle('Error al actualizar estado');
    setErrorMessage(updateError);
    setIsErrorModalOpen(true);
  }, [updateError]);

  useEffect(() => {
    if (!deleteError) return;
    setErrorTitle('Error al eliminar orden');
    setErrorMessage(deleteError);
    setIsErrorModalOpen(true);
  }, [deleteError]);

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  const formatDate = (value?: string) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  };

  const statusLabel = (status?: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'Pedido Recibido';
      case 'ready':
        return 'Preparado';
      case 'shipped':
        return 'En Camino';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Pedido Recibido';
    }
  };

  const statusBadgeClass = (status?: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-700';
      case 'ready':
        return 'bg-amber-100 text-amber-600';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const allStatuses: OrderStatus[] = ['pending', 'ready', 'shipped', 'delivered', 'cancelled'];

  const handleStatusChange = async (order: Order, newStatus: OrderStatus) => {
    if (order.status === newStatus) return;
    const id = order._id || order.id;
    if (!id) return;
    const previousStatus = order.status;
    setLocalOrders((prev) =>
      prev.map((entry) => (entry.id === order.id ? { ...entry, status: newStatus } : entry))
    );
    setUpdatingId(id);
    const updated = await updateOrder(id, { status: newStatus });
    setUpdatingId(null);
    if (!updated) {
      setLocalOrders((prev) =>
        prev.map((entry) => (entry.id === order.id ? { ...entry, status: previousStatus } : entry))
      );
    }
  };

  const handleDelete = (order: Order) => {
    setPendingDelete(order);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const id = pendingDelete._id || pendingDelete.id;
    if (!id) return;
    setDeletingId(id);
    const ok = await deleteOrder(id);
    setDeletingId(null);
    if (ok) {
      await refetch();
      closeDeleteModal();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Órdenes</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-gray-50"
        >
          <span className="material-symbols-outlined text-sm">print</span>
          Imprimir
        </button>
      </div>

      {isLoading && (
        <div className="text-sm text-slate-500">Cargando órdenes...</div>
      )}

      {error && !isLoading && (
        <EmptyState
          icon="error"
          title="Error al cargar órdenes"
          description={error}
          actionLabel="Reintentar"
          onAction={refetch}
        />
      )}

      {!isLoading && !error && orders.length === 0 && (
        <EmptyState
          icon="receipt_long"
          title="Sin órdenes"
          description="No hay órdenes disponibles para mostrar."
          actionLabel="Recargar"
          onAction={refetch}
        />
      )}

      {!isLoading && !error && localOrders.length > 0 && (
        <div className="rounded-2xl border border-gray-200 shadow-sm overflow-visible">
          <table className="w-full border-collapse text-sm border border-gray-200 overflow-visible">
            <thead className="bg-gray-100 text-slate-600 border-b border-gray-200">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold border-r border-gray-200 text-center">OrderId</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Fecha</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Nombre</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Dirección / Observaciones</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200 text-center">Cantidad productos</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200 text-center">Total (compra)</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200 text-center">Estado</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200 text-center">Detalle</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Imprimir Etiqueta</th>
                <th className="px-4 py-3 font-semibold text-center">Eliminar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 overflow-visible">
              {localOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/70">
                  <td className="px-4 py-3 text-slate-700 border-r border-gray-200 text-center">
                    {order.orderId !== undefined ? String(order.orderId) : (order.orderNumber || order.id)}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 border-r border-gray-200">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-slate-700 border-r border-gray-200">
                    {order.customerName || '-'}
                  </td>
                  <td className="px-4 py-3 text-slate-700 border-r border-gray-200 whitespace-normal break-words min-w-[260px]">
                    <div className="text-sm text-slate-700">{order.customerAddress || '-'}</div>
                    <div className="text-xs text-slate-500">{order.customerNote || '-'}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700 border-r border-gray-200 text-center">
                    {order.totals?.itemsCount ?? order.items.length}
                  </td>
                  <td className="px-4 py-3 text-slate-700 border-r border-gray-200 text-center">
                    {Number.isFinite(order.totals?.total) ? `$ ${order.totals.total}` : '-'}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200 text-center align-middle overflow-visible">
                    <StatusDropdown
                      currentStatus={order.status || 'pending'}
                      onChange={(newStatus) => handleStatusChange(order, newStatus)}
                      disabled={isUpdating && updatingId === (order._id || order.id)}
                    />
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200 text-center">
                    <button
                      type="button"
                      onClick={() => openDetail(order)}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-slate-600 hover:bg-gray-50 hover:text-primary transition-colors"
                      aria-label="Ver detalle"
                    >
                      <span className="material-symbols-outlined text-base">visibility</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={packageCounts[order.id] || 1}
                        onChange={(e) => handlePackageCountChange(order.id, e.target.value)}
                        className="w-14 rounded-lg border border-gray-200 px-2 py-1.5 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        aria-label="Cantidad de paquetes"
                      />
                      <button
                        type="button"
                        onClick={() => openPrintModal(order)}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-slate-600 hover:bg-gray-50 hover:text-primary transition-colors"
                        aria-label="Imprimir orden"
                      >
                        <span className="material-symbols-outlined text-base">print</span>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleDelete(order)}
                      disabled={isDeleting && deletingId === (order._id || order.id)}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                      aria-label="Eliminar orden"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <OrderDetailModal
        isOpen={isDetailOpen}
        order={selectedOrder}
        onClose={closeDetail}
        statusLabel={statusLabel}
        statusBadgeClass={statusBadgeClass}
      />

      <ShippingLabelModal
        isOpen={isPrintModalOpen}
        order={printOrder}
        packageCount={printOrder ? (packageCounts[printOrder.id] || 1) : 1}
        onClose={closePrintModal}
      />

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-800">Eliminar orden</h3>
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-gray-100"
                aria-label="Cerrar"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="px-6 py-5 text-sm text-slate-600">
              ¿Seguro que quieres eliminar la orden{' '}
              <span className="font-semibold text-slate-800">
                {pendingDelete?.orderId !== undefined
                  ? `#${pendingDelete.orderId}`
                  : (pendingDelete?.orderNumber || pendingDelete?.id)}
              </span>
              ?
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-slate-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}



      {isErrorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-800">{errorTitle}</h3>
              <button
                type="button"
                onClick={closeErrorModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-gray-100"
                aria-label="Cerrar"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="px-6 py-5 text-sm text-slate-600">
              {errorMessage}
            </div>
            <div className="flex items-center justify-end border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={closeErrorModal}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
