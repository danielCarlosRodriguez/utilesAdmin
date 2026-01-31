import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const STORAGE_KEY = 'utiles-cart';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'add': {
      const existing = state.items.find((item) => item.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.item.id
              ? { ...item, quantity: item.quantity + action.item.quantity }
              : item
          )
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case 'update': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, quantity: action.quantity } : item
        )
      };
    }
    case 'remove': {
      return { ...state, items: state.items.filter((item) => item.id !== action.id) };
    }
    case 'clear':
      return { ...state, items: [] };
    default:
      return state;
  }
};

const loadInitialState = () => {
  if (typeof window === 'undefined') {
    return { items: [] };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { items: [] };
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.items)) {
      return { items: [] };
    }
    return { items: parsed.items };
  } catch (error) {
    return { items: [] };
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const actions = useMemo(() => ({
    addItem: (item) => dispatch({ type: 'add', item }),
    updateItem: (id, quantity) => dispatch({ type: 'update', id, quantity }),
    removeItem: (id) => dispatch({ type: 'remove', id }),
    clear: () => dispatch({ type: 'clear' })
  }), []);

  const value = useMemo(() => ({
    items: state.items,
    ...actions
  }), [state.items, actions]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};
