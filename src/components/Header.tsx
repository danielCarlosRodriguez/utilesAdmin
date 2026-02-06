
import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = ({ onNavigate }) => {
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

          <nav className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-slate-600 hover:text-primary'}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-slate-600 hover:text-primary'}`
              }
            >
              Productos
            </NavLink>
            <NavLink
              to="/category"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-slate-600 hover:text-primary'}`
              }
            >
              Categorías
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-slate-600 hover:text-primary'}`
              }
            >
              Ordenes
            </NavLink>
            <NavLink
              to="/usuarios"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-slate-600 hover:text-primary'}`
              }
            >
              Usuarios
            </NavLink>
          </nav>

        </div>
        <div className="flex items-center gap-4" />
      </div>
    </header>
  );
};

export default Header;
