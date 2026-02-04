import { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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

  const statusTextClass = (status?: OrderStatus) => {
    if (status === 'cancelled') return 'text-red-700';
    if (status === 'confirmed' || status === 'shipped') return 'text-emerald-700';
    return 'text-blue-700';
  };

  const itemsCount = order.totals?.itemsCount ?? order.items.length;
  const total = order.totals?.total ?? order.items.reduce((sum, item) => sum + item.subtotal, 0);
  const pdfContentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrintOrder = async () => {
    const content = pdfContentRef.current;
    if (!content || isGenerating) return;

    setIsGenerating(true);

    try {
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const widthRatio = pageWidth / imgProps.width;
      const heightRatio = pageHeight / imgProps.height;
      const scale = Math.min(widthRatio, heightRatio);
      const imgWidth = imgProps.width * scale;
      const imgHeight = imgProps.height * scale;
      const x = (pageWidth - imgWidth) / 2;
      const y = 0;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error('Error generating order PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintOrder}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-gray-50 disabled:opacity-60"
              disabled={isGenerating}
            >
              <span className="material-symbols-outlined text-sm">print</span>
              {isGenerating ? 'Generando...' : 'Imprimir'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:bg-gray-100"
              aria-label="Cerrar"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        <div ref={pdfContentRef} className="px-6 pt-2 pb-4">
          <div className="text-xs uppercase tracking-wide text-slate-400">OrderId</div>
          <div className="mt-1 text-sm font-semibold text-slate-800">
            {order.orderId !== undefined ? `#${order.orderId}` : (order.orderNumber || order.id)}
          </div>

          <table className="mt-3 w-full text-sm text-slate-700">
            <tbody>
              <tr className="align-top">
                <td className="pr-6">
                  <div className="text-xs uppercase tracking-wide text-slate-400">Cliente</div>
                  <div className="mt-1 font-semibold text-slate-800">{order.customerName || '-'}</div>
                  <div className="text-slate-600">{order.customerAddress || '-'}</div>
                  <div className="text-slate-600">{order.customerPhone || '-'}</div>
                  <div className="text-xs text-slate-500">{order.customerNote || '-'}</div>
                </td>
                <td className="pr-6 text-center">
                  <div className="text-xs uppercase tracking-wide text-slate-400">Estado</div>
                  <div className={`mt-1 text-xs font-semibold ${statusTextClass(order.status)}`}>
                    {statusLabel(order.status)}
                  </div>
                </td>
                <td className="pr-6 text-center">
                  <div className="text-xs uppercase tracking-wide text-slate-400">Total de items</div>
                  <div className="mt-1 font-semibold text-slate-800">{order.items.length}</div>
                </td>
                <td className="text-center">
                  <div className="text-xs uppercase tracking-wide text-slate-400">Total Productos</div>
                  <div className="mt-1 font-semibold text-slate-800">{itemsCount}</div>
                </td>
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

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={handlePrintOrder}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-slate-600 hover:bg-gray-50 disabled:opacity-60"
            disabled={isGenerating}
          >
            <span className="material-symbols-outlined text-base">print</span>
            {isGenerating ? 'Generando...' : 'Imprimir'}
          </button>
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
