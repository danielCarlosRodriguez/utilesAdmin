import type { Order, OrderStatus } from '../hooks/useOrdersMutations.ts';

type OrderDetailModalProps = {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  statusLabel: (status?: OrderStatus) => string;
  statusBadgeClass: (status?: OrderStatus) => string;
};

const OrderDetailModal = ({
  isOpen,
  order,
  onClose,
  statusLabel,
  statusBadgeClass
}: OrderDetailModalProps) => {
  if (!isOpen || !order) return null;

  const itemsCount = order.totals?.itemsCount ?? order.items.length;
  const total = order.totals?.total ?? order.items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Detalle de orden</h3>
            <p className="text-xs text-slate-500">
              {order.orderId !== undefined ? `OrderId ${order.orderId}` : order.orderNumber || order.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <div className="px-6 py-5">
          <table className="w-full text-sm text-slate-700">
            <tbody>
              <tr className="align-top">
                <td className="pr-6">
                  <div className="text-xs uppercase tracking-wide text-slate-400">Cliente</div>
                  <div className="mt-1 font-semibold text-slate-800">{order.customerName || '-'}</div>
                  <div className="text-slate-600">{order.customerAddress || '-'}</div>
                  <div className="text-xs text-slate-500">{order.customerNote || '-'}</div>
                </td>
                <td className="pr-6 text-center">
                  <div className="text-xs uppercase tracking-wide text-slate-400">Estado</div>
                  <div className="mt-1">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(order.status)}`}>
                      {statusLabel(order.status)}
                    </span>
                  </div>
                </td>
                <td className="pr-6 text-center">
                  <div className="text-xs uppercase tracking-wide text-slate-400">Cantidad de productos</div>
                  <div className="mt-1 font-semibold text-slate-800">{itemsCount}</div>
                </td>
                <td />
              </tr>
            </tbody>
          </table>

          <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 text-slate-600 border-b border-gray-200">
                <tr className="text-left">
                  <th className="px-4 py-2 font-semibold border-r border-gray-200">Ref</th>
                  <th className="px-4 py-2 font-semibold border-r border-gray-200">Descripción</th>
                  <th className="px-4 py-2 font-semibold border-r border-gray-200">Marca</th>
                  <th className="px-4 py-2 font-semibold border-r border-gray-200 text-right">Precio</th>
                  <th className="px-4 py-2 font-semibold border-r border-gray-200 text-right">Cantidad</th>
                  <th className="px-4 py-2 font-semibold text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <tr key={`${item.refid}-${index}`}>
                    <td className="px-4 py-2 border-r border-gray-200">{item.refid}</td>
                    <td className="px-4 py-2 border-r border-gray-200">{item.title}</td>
                    <td className="px-4 py-2 border-r border-gray-200">{item.brand || '-'}</td>
                    <td className="px-4 py-2 border-r border-gray-200 text-right">$ {item.unitPrice}</td>
                    <td className="px-4 py-2 border-r border-gray-200 text-right">{item.quantity}</td>
                    <td className="px-4 py-2 text-right">$ {item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end text-sm text-slate-600">
            <span className="font-semibold text-slate-800">Total: $ {total}</span>
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-slate-600 hover:bg-gray-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
