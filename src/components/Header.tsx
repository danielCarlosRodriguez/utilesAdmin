
import React from 'react';

const Header = ({ onNavigate, onOpenCart, cartCount, searchValue, onSearchChange }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div 
            className="flex items-center gap-2 text-primary cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-primary text-white p-1 rounded-lg">
              <span className="material-symbols-outlined block">school</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">ÚtilesYa</h1>
          </div>

{/* 
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Categories</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Deals</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">New Arrivals</a>
          </nav> */}


        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center bg-gray-100 rounded-xl px-4 py-2 w-80 border border-transparent focus-within:border-primary/20 transition-all">
            <span className="material-symbols-outlined text-gray-400 text-lg">search</span>
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-gray-400 ml-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNavigate}
              className="p-2.5 rounded-xl hover:bg-gray-100 text-slate-700 transition-colors"
              aria-label="Ir al inicio"
            >
              <span className="material-symbols-outlined">home</span>
            </button>
            <button
              type="button"
              onClick={onOpenCart}
              className="p-2.5 rounded-xl hover:bg-gray-100 text-slate-700 transition-colors relative"
              aria-label="Ver carrito"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* <button className="p-2.5 rounded-xl hover:bg-gray-100 text-slate-700 relative transition-colors">
              <span className="material-symbols-outlined">shopping_cart</span>
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-[10px] text-white flex items-center justify-center rounded-full font-bold">2</span>
            </button>
            <button className="p-2.5 rounded-xl hover:bg-gray-100 text-slate-700 transition-colors">
              <span className="material-symbols-outlined">person</span>
            </button> */}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
