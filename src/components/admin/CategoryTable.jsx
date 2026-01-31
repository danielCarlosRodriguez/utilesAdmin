/**
 * CategoryTable - Tabla de categorías para administración
 *
 * Features:
 * - Muestra categorías en tabla responsiva
 * - Botones de editar y eliminar por categoría
 * - Estados de carga y error
 */

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

export default function CategoryTable({
  categories,
  loading,
  onEdit,
  onDelete,
}) {
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

  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-12 text-center">
        <p className="text-neutral-600 dark:text-neutral-400">
          No hay categorías para mostrar
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      {/* Table - Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Imagen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Productos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Campos Spec
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
            {categories.map((category) => (
              <tr key={category._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                      <span className="text-neutral-400 text-xs">Sin imagen</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {category.name}
                  </div>
                  {category.description && (
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-xs">
                      {category.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-neutral-900 dark:text-neutral-100 font-mono">
                    {category.slug}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-celeste-100 text-celeste-800 dark:bg-celeste-900/30 dark:text-celeste-400">
                    {category.productCount || 0} productos
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-neutral-900 dark:text-neutral-100">
                    {category.specificationTemplate?.length || 0} campos
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {category.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Activa
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-400">
                      Inactiva
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(category)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-celeste-50 dark:bg-celeste-900/20 text-celeste-700 dark:text-celeste-400 rounded-md hover:bg-celeste-100 dark:hover:bg-celeste-900/30 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => onDelete(category)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards - Mobile */}
      <div className="lg:hidden divide-y divide-neutral-200 dark:divide-neutral-700">
        {categories.map((category) => (
          <div key={category._id} className="p-4">
            <div className="flex gap-4">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-20 w-20 rounded-lg object-cover shrink-0 "
                />
              ) : (
                <div className="h-20 w-20 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center shrink-0 ">
                  <span className="text-neutral-400 text-xs">Sin imagen</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                  {category.name}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Slug: {category.slug}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {category.productCount || 0} productos
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {category.specificationTemplate?.length || 0} campos
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => onEdit(category)}
                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-celeste-50 dark:bg-celeste-900/20 text-celeste-700 dark:text-celeste-400 rounded-md hover:bg-celeste-100 dark:hover:bg-celeste-900/30 transition-colors text-sm"
              >
                <PencilIcon className="w-4 h-4" />
                <span>Editar</span>
              </button>
              <button
                onClick={() => onDelete(category)}
                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm"
              >
                <TrashIcon className="w-4 h-4" />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

CategoryTable.propTypes = {
  categories: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
