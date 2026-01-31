/**
 * ProfilePage - User profile management
 *
 * Features:
 * - Display user information
 * - Edit profile (future)
 * - View account details
 * - Security settings (future)
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context';
import { Card, Badge } from '../components/atoms';
import EditProfileForm from '../components/molecules/EditProfileForm';
import {
  UserCircleIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link to="/" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">
            Inicio
          </Link>
          <span className="mx-2 text-neutral-400 dark:text-neutral-500">/</span>
          <span className="text-neutral-900 dark:text-neutral-100 font-medium">Mi Perfil</span>
        </nav>

        {/* Page title */}
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">Mi Perfil</h1>

        {/* Profile content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Profile info */}
          <div className="lg:col-span-2 space-y-6">
            {/* User info card */}
            <Card padding="lg" className="bg-white dark:bg-neutral-800">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Información Personal
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Editar
                  </button>
                )}
              </div>

              {isEditing ? (
                <EditProfileForm
                  onCancel={() => setIsEditing(false)}
                  onSave={() => setIsEditing(false)}
                />
              ) : (
                <div className="space-y-4">
                {/* Avatar and name */}
                <div className="flex items-center gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                  {user?.picture || user?.avatar ? (
                    <img
                      src={user.picture || user.avatar}
                      alt={user.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-neutral-200 dark:border-neutral-700"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary-500 text-white flex items-center justify-center text-2xl font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      {user?.name || 'Usuario'}
                    </h3>
                    <Badge
                      variant={user?.role === 'admin' ? 'warning' : 'default'}
                    >
                      {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </Badge>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Email</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {user?.email || 'No especificado'}
                    </p>
                  </div>
                </div>

                {/* Account created */}
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Miembro desde</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {formatDate(user?.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Account type */}
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Método de acceso</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      Google OAuth
                    </p>
                  </div>
                </div>
              </div>
              )}
            </Card>

            {/* Security card (placeholder) */}
            <Card padding="lg" className="bg-white dark:bg-neutral-800">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Seguridad
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      Autenticación de dos factores
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Añade una capa extra de seguridad a tu cuenta
                    </p>
                  </div>
                  <Badge variant="default">Próximamente</Badge>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      Cambiar contraseña
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Actualiza tu contraseña regularmente
                    </p>
                  </div>
                  <Badge variant="default">Próximamente</Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Right column - Quick links */}
          <div className="space-y-6">
            {/* Quick links card */}
            <Card padding="lg" className="bg-white dark:bg-neutral-800">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Accesos Rápidos
              </h2>
              <div className="space-y-2">
                <Link
                  to="/orders"
                  className="block p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Mis Órdenes
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Ver historial de compras
                  </p>
                </Link>

                <Link
                  to="/cart"
                  className="block p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Mi Carrito
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Ver productos guardados
                  </p>
                </Link>

                <div className="block p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 cursor-not-allowed opacity-50">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Lista de Deseos
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Próximamente
                  </p>
                </div>
              </div>
            </Card>

            {/* Account stats card */}
            <Card padding="lg" className="bg-white dark:bg-neutral-800">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Resumen de Cuenta
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Total de órdenes</span>
                  <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Puntos</span>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">0</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
