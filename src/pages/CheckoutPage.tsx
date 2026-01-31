import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import EmptyState from '../components/EmptyState.tsx';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, clear } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNote, setCustomerNote] = useState('');

  const total = items.reduce((sum, item) => sum + Math.round(item.price) * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSendOrder = () => {
    const lines = [
      'Pedido ÚtilesYa:',
      customerName ? `Cliente: ${customerName}` : null,
      customerAddress ? `Dirección: ${customerAddress}` : null,
      '',
      ...items.map((item) => {
        const unit = Math.round(item.price);
        const subtotal = unit * item.quantity;
        return `- ${item.id} - ${item.title} (${item.brand}) - $${unit} - x${item.quantity} = $${subtotal}`;
      }),
      '',
      `Total: $${total}`,
      customerNote ? `Nota: ${customerNote}` : null
    ];

    const message = lines.filter(Boolean).join('\n');
    const url = `https://wa.me/59897098751?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <EmptyState
          icon="shopping_cart"
          title="No hay productos en tu carrito"
          description="Agrega productos antes de continuar al checkout"
          actionLabel="Ver productos"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
      <button
        type="button"
        onClick={() => navigate('/cart')}
        className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700 mb-6"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Volver al carrito
      </button>

      <h2 className="text-3xl font-black text-slate-900 mb-8">Checkout</h2>

      <div className="space-y-6">
        {/* Resumen del pedido */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">receipt_long</span>
            Resumen del pedido
          </h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-start text-sm">
                <div>
                  <p className="font-medium text-slate-700">{item.title}</p>
                  <p className="text-slate-500">{item.brand} - x{item.quantity}</p>
                </div>
                <p className="font-semibold text-slate-700">${Math.round(item.price) * item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4">
            <div className="flex justify-between items-center">
              <p className="text-slate-600">{itemCount} {itemCount === 1 ? 'producto' : 'productos'}</p>
              <p className="text-2xl font-black text-slate-900">Total: ${total}</p>
            </div>
          </div>
        </div>

        {/* Datos opcionales */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person</span>
            Datos (opcional)
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">
                Tu nombre
              </label>
              <input
                id="name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ej: Juan"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-600 mb-1">
                Dirección
              </label>
              <input
                id="address"
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Ej: Av. 18 de Julio 1234"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="note" className="block text-sm font-medium text-slate-600 mb-1">
                Nota adicional
              </label>
              <textarea
                id="note"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="Ej: Necesito que sea antes del viernes"
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
              />
            </div>
          </div>
        </div>

        {/* Info WhatsApp */}
        <div className="rounded-2xl bg-green-50 border border-green-100 p-6">
          <div className="flex items-start gap-3">
            <i className="bi bi-whatsapp text-2xl text-green-600" />
            <div>
              <h4 className="font-bold text-green-800 mb-1">Pedido por WhatsApp</h4>
              <p className="text-sm text-green-700">
                Al hacer clic en "Enviar pedido" se abrirá WhatsApp con tu pedido listo para enviar.
                Coordinaremos entrega y pago por ese medio.
              </p>
            </div>
          </div>
        </div>

        {/* Botón enviar */}
        <button
          type="button"
          onClick={handleSendOrder}
          className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg"
        >
          <i className="bi bi-whatsapp text-xl" />
          Enviar pedido por WhatsApp
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
