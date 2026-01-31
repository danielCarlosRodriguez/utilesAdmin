import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Logo from '../atoms/Logo';
import ThemeToggle from '../atoms/ThemeToggle';
import { UserMenu } from '../molecules';
import HeaderSecondary from './HeaderSecondary';
import { useAuth } from '../../context';

/**
 * Header Organism - Main Navigation Header
 *
 * Features:
 * - Sticky header with logo, navigation, search bar
 * - User and cart icons
 * - Responsive hamburger menu for mobile
 * - Accessible keyboard navigation
 *
 * @example
 * <Header />
 */
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  // Navigation links
  const navLinks = [
    { name: 'Productos', href: '/admin/products' },
    { name: 'Categorías', href: '/admin/categories' },
    { name: 'Usuarios', href: '/admin/users' },
    { name: 'Órdenes', href: '/admin/orders' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 shadow-md dark:shadow-neutral-800 transition-colors duration-200">
      {/* Main header container */}
      <div className="container mx-auto px-4">
        {/* Primera fila: Logo + Navigation + Icons */}
        <div className="flex items-center justify-between h-16 lg:h-14">
          {/* Logo - Left side */}
          <div className="shrink-0">
            <Link to="/" aria-label="Marca - Inicio">
              <Logo size="md" showText />
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <nav
            className="hidden md:flex items-center space-x-8"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors duration-200 focus:outline-none focus:text-primary-500 focus:underline"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side - Theme, User & Cart Icons */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* User menu or login button */}
            {!loading &&
              (isAuthenticated ? (
                <UserMenu />
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Iniciar sesión"
                >
                  <UserIcon className="w-6 h-6" />
                </Link>
              ))}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Header Secondary - Categories Menu */}
      <div className="container mx-auto px-4">
        <HeaderSecondary />
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav
          className="md:hidden border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
          aria-label="Mobile navigation"
        >
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block py-3 px-4 text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-neutral-800 hover:text-primary-500 dark:hover:text-primary-400 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:bg-primary-50 focus:text-primary-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
