import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import EmptyState from '../components/EmptyState.tsx';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateItem, removeItem, clear } = useCart();

  const total = items.reduce((sum, item) => sum + Math.round(item.price) * item.quantity, 0);

  const handleSendOrder = () => {
    navigate('/checkout');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-slate-900">Carrito</h2>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Seguir comprando
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="shopping_cart"
          title="Tu carrito está vacío"
          description="Agrega productos a tu carrito para comenzar tu pedido"
          actionLabel="Ver productos"
          onAction={() => navigate('/')}
        />
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.brand}</p>
                  <p className="text-sm text-slate-500">RefId: {item.id}</p>
                  <p className="text-sm text-primary font-medium">${Math.round(item.price)} c/u</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center w-28 border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                      className="flex-1 py-1 hover:bg-gray-50 text-gray-500 transition-colors"
                    >
                      -
                    </button>
                    <span className="flex-1 py-1 text-center font-semibold text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                      className="flex-1 py-1 hover:bg-gray-50 text-gray-500 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm font-bold text-slate-700 min-w-[60px] text-right">
                    ${Math.round(item.price) * item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Quitar producto"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={clear}
              className="text-sm font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
              Vaciar carrito
            </button>
            <div className="text-xl font-black text-slate-900">Total: ${total}</div>
          </div>

          <button
            type="button"
            onClick={handleSendOrder}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined">shopping_cart_checkout</span>
            Continuar al checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
