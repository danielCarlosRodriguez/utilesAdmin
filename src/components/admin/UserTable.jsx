/**
 * UserTable - Tabla de usuarios para administración
 *
 * Features:
 * - Muestra usuarios en tabla responsiva
 * - Columnas: Usuario (Avatar + Nombre + Email), Rol, Estado, Último Acceso, Fecha Registro
 * - Estilos consistentes con ProductTable
 */

import { useMemo } from 'react';
import { ClockIcon, CheckCircleIcon, XCircleIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import LazyImage from '../atoms/LazyImage';

export default function UserTable({
  users,
  loading,
  onEdit,
  onDelete,
  onView,
}) {
  // Función para formatear fechas
  const formatDate = (date) => {
    if (!date) return '-';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-12 text-center">
        <p className="text-neutral-600 dark:text-neutral-400">
          No hay usuarios para mostrar
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      {/* Table - Desktop */}
      <div className="hidden xl:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Último Acceso
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Fecha Registro
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                {/* Usuario (Avatar + Nombre + Email) */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 shrink-0">
                      {user.picture ? (
                        <LazyImage
                          src={user.picture}
                          alt={`Avatar de ${user.name}`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {user.name}
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Rol */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                      : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-400'
                  }`}>
                    {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                  </span>
                </td>

                {/* Estado */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {user.isActive ? (
                      <>
                        <CheckCircleIcon className="w-3 h-3" />
                        Activo
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="w-3 h-3" />
                        Inactivo
                      </>
                    )}
                  </span>
                </td>

                {/* Último Acceso */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    {formatDate(user.lastLogin)}
                  </div>
                </td>

                {/* Fecha Registro */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    {formatDate(user.createdAt)}
                  </div>
                </td>

                {/* Acciones */}
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(user)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                      title="Ver detalles del usuario"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(user)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-celeste-50 dark:bg-celeste-900/20 text-celeste-700 dark:text-celeste-400 rounded-md hover:bg-celeste-100 dark:hover:bg-celeste-900/30 transition-colors"
                      title="Editar usuario"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards - Mobile & Tablet */}
      <div className="xl:hidden divide-y divide-neutral-200 dark:divide-neutral-700">
        {users.map((user) => (
          <div key={user._id} className="p-4">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="shrink-0">
                {user.picture ? (
                  <LazyImage
                    src={user.picture}
                    alt={`Avatar de ${user.name}`}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Información Principal */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                      {user.name}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                      : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-400'
                  }`}>
                    {user.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>

                {/* Detalles adicionales */}
                <div className="mt-3 flex flex-wrap gap-y-2 gap-x-4 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </div>
                  <div>
                    <span className="font-medium">Último acceso:</span> {formatDate(user.lastLogin)}
                  </div>
                  <div>
                    <span className="font-medium">Registro:</span> {formatDate(user.createdAt)}
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => onView(user)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors text-sm"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>Ver</span>
                  </button>
                  <button
                    onClick={() => onEdit(user)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-celeste-50 dark:bg-celeste-900/20 text-celeste-700 dark:text-celeste-400 rounded-md hover:bg-celeste-100 dark:hover:bg-celeste-900/30 transition-colors text-sm"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm"
                  >

                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
};
