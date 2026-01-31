/**
 * UserMenu - User dropdown menu with profile and logout
 *
 * Features:
 * - User avatar and name
 * - Dropdown with menu items
 * - Profile link
 * - Orders link
 * - Logout button
 * - Click outside to close
 */

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  ShoppingBagIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/login');
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  // Get user avatar
  const avatar = user?.picture || user?.avatar;

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 p-1 pr-3 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        {avatar ? (
          <img
            src={avatar}
            alt={user?.name || 'User'}
            className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-neutral-600"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-celeste-500 text-white flex items-center justify-center text-sm font-medium">
            {getInitials()}
          </div>
        )}

        {/* Name (desktop only) */}
        <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-neutral-200">
          {user?.name?.split(' ')[0] || 'Usuario'}
        </span>

        {/* Chevron */}
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-500 dark:text-neutral-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 py-1 z-50 animate-fadeIn">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-neutral-700">
            <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">
              {user?.name || 'Usuario'}
            </p>
            <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">
              {user?.email || ''}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <UserCircleIcon className="w-5 h-5 text-gray-400 dark:text-neutral-400" />
              Mi Perfil
            </Link>

            <Link
              to="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <ShoppingBagIcon className="w-5 h-5 text-gray-400 dark:text-neutral-400" />
              Mis Órdenes
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 dark:border-neutral-700 py-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
