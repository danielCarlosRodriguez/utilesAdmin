import React, { useEffect, useMemo, useState } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { getCategoryColorClass } from '../utils/categoryColors.ts';

const Cards = ({ product, onClick, onShare }) => {
  const { items, addItem, updateItem, removeItem } = useCart();
  const { showToast } = useToast();
  const cartItem = useMemo(
    () => items.find((item) => item.id === product.id),
    [items, product.id]
  );
  const [quantity, setQuantity] = useState(cartItem?.quantity ?? 1);
  const categoryColorClass = getCategoryColorClass(product?.category);

  useEffect(() => {
    if (cartItem?.quantity) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem?.quantity]);

  const handleAddOrRemove = () => {
    if (cartItem) {
      removeItem(product.id);
      showToast('Producto quitado del carrito', 'info');
      return;
    }
    addItem({
      id: product.id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      quantity
    });
    showToast('Agregado al carrito', 'success');
  };

  return (
    <div
      className="group flex flex-col gap-4 pb-4 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent cursor-pointer hover:border-gray-200"
      onClick={onClick}
    >
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
        <div
          className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url("${product.image}")` }}
        />
      </div>
      <div className="px-4 pb-2">
        {/* Badge de categoría */}
        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wide mb-2 ${categoryColorClass}`}>
          {product.category}
        </span>
        <div className="flex flex-col mb-4">
          <p className="card-title text-[#111418] text-lg font-bold leading-tight group-hover:text-primary transition-colors">
            {product.title}
          </p>
          <p className="text-[#617589] text-sm font-normal">{product.brand}</p>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <p className="text-primary text-xl font-black">${Math.round(product.price)}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={(event) => {
                event.stopPropagation();
                onShare?.();
              }}
              className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-primary/40 hover:text-primary transition-colors"
              aria-label="Compartir producto"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>
          </div>
        </div>
        <div
          className="mt-3 flex items-center gap-2"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center w-24 border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => {
                setQuantity((prev) => {
                  const next = Math.max(1, prev - 1);
                  if (cartItem) {
                    updateItem(product.id, next);
                  }
                  return next;
                });
              }}
              className="flex-1 py-1 hover:bg-gray-50 text-gray-500 transition-colors"
            >
              -
            </button>
            <span className="flex-1 py-1 text-center font-semibold text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => {
                setQuantity((prev) => {
                  const next = prev + 1;
                  if (cartItem) {
                    updateItem(product.id, next);
                  }
                  return next;
                });
              }}
              className="flex-1 py-1 hover:bg-gray-50 text-gray-500 transition-colors"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={handleAddOrRemove}
            className={`flex-1 flex items-center justify-center gap-1 font-bold py-2 px-3 rounded-lg transition-colors ${
              cartItem
                ? 'bg-white text-primary border border-primary hover:bg-primary/10'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {cartItem ? 'remove_shopping_cart' : 'add_shopping_cart'}
            </span>
            {cartItem ? 'Quitar' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
