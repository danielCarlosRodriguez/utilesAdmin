import { useEffect, useState, useCallback } from 'react';
import EmptyState from '../components/EmptyState.tsx';
import { useOrders } from '../hooks/useOrders.ts';
import { useUpdateOrder, type Order, type OrderStatus } from '../hooks/useOrdersMutations.ts';
import { useOrderSocket } from '../hooks/useOrderSocket.ts';
import OrderDetailModal from '../components/OrderDetailModal.tsx';
import ShippingLabelModal from '../components/ShippingLabelModal.tsx';

const Orders = () => {
  const { orders, isLoading, error, refetch } = useOrders();
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  const { updateOrder, isLoading: isUpdating, error: updateError } = useUpdateOrder();

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
      case 'cancelled':
        return 'Cancelado';
      case 'confirmed':
      case 'shipped':
        return 'Entregado';
      default:
        return 'Pendiente';
    }
  };

  const statusBadgeClass = (status?: OrderStatus) => {
    if (status === 'cancelled') return 'bg-red-100 text-red-700';
    if (status === 'confirmed' || status === 'shipped') return 'bg-emerald-100 text-emerald-700';
    return 'bg-blue-100 text-blue-700';
  };

  const isDelivered = (status?: OrderStatus) => status === 'confirmed' || status === 'shipped';

  const handleToggleStatus = async (order: Order) => {
    if (order.status === 'cancelled') return;
    const nextStatus: OrderStatus = isDelivered(order.status) ? 'pending' : 'confirmed';
    const id = order._id || order.id;
    if (!id) return;
    const previousStatus = order.status;
    setLocalOrders((prev) =>
      prev.map((entry) => (entry.id === order.id ? { ...entry, status: nextStatus } : entry))
    );
    setUpdatingId(id);
    const updated = await updateOrder(id, { status: nextStatus });
    setUpdatingId(null);
    if (!updated) {
      setLocalOrders((prev) =>
        prev.map((entry) => (entry.id === order.id ? { ...entry, status: previousStatus } : entry))
      );
      return;
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
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full border-collapse text-sm border border-gray-200">
            <thead className="bg-gray-100 text-slate-600 border-b border-gray-200">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold border-r border-gray-200">OrderId</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Fecha</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Nombre</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Dirección / Observaciones</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Cantidad productos</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Total (compra)</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Estado</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Detalle</th>
                <th className="px-4 py-3 font-semibold">Imprimir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {localOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/70">
                  <td className="px-4 py-3 text-slate-700 border-r border-gray-200">
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
                  <td className="px-4 py-3 text-slate-700 border-r border-gray-200">
                    {order.totals?.itemsCount ?? order.items.length}
                  </td>
                  <td className="px-4 py-3 text-slate-700 border-r border-gray-200 text-center">
                    {Number.isFinite(order.totals?.total) ? `$ ${order.totals.total}` : '-'}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200 text-center align-middle">
                    <div className="flex h-full min-h-[32px] items-center justify-center gap-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(order.status)}`}>
                        {statusLabel(order.status)}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isDelivered(order.status)}
                        onClick={() => handleToggleStatus(order)}
                        disabled={isUpdating && updatingId === (order._id || order.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isDelivered(order.status) ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            isDelivered(order.status) ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200">
                    <button
                      type="button"
                      onClick={() => openDetail(order)}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-slate-600 hover:bg-gray-50 hover:text-primary transition-colors"
                      aria-label="Ver detalle"
                    >
                      <span className="material-symbols-outlined text-base">visibility</span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
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
