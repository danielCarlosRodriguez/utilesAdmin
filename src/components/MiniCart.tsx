import React from 'react';
import { useCart } from '../context/CartContext.tsx';

const MiniCart = ({ isOpen, onClose, onGoToCart }) => {
  const { items, updateItem, removeItem } = useCart();

  const total = items.reduce((sum, item) => sum + Math.round(item.price) * item.quantity, 0);

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-black text-slate-900">Carrito</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-slate-500 hover:text-slate-700"
          >
            Cerrar
          </button>
        </div>

        <div className="p-6 overflow-y-auto h-[calc(100%-164px)]">
          {items.length === 0 ? (
            <div className="text-sm text-slate-500">No hay productos en el carrito.</div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.brand}</p>
                    <p className="text-xs text-slate-500">RefId: {item.id}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center w-24 border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                        className="flex-1 py-1 hover:bg-gray-50 text-gray-500 transition-colors"
                      >
                        -
                      </button>
                      <span className="flex-1 py-1 text-center font-semibold text-xs">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        className="flex-1 py-1 hover:bg-gray-50 text-gray-500 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      ${Math.round(item.price) * item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-700 mb-4">
            <span>Total</span>
            <span>${total}</span>
          </div>
          <button
            type="button"
            onClick={onGoToCart}
            className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            Ver carrito
          </button>
        </div>
      </aside>
    </div>
  );
};

export default MiniCart;
