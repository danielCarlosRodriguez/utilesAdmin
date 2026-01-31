/**
 * ProductTable - Tabla de lotes de remate para administración
 *
 * Features:
 * - Muestra lotes de remate en tabla responsiva
 * - Columnas: Imagen, Nombre, Modelo, SKU, Oferta Base, Oferta Actual, Incremento, Ofertas, Fecha Fin, Estado
 * - Botones de editar y eliminar por lote
 * - Paginación
 * - Estados de carga y error
 */

import { useMemo } from 'react';
import { PencilIcon, TrashIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import { sanitizeHTML } from '../../utils/sanitize';
import LazyImage from '../atoms/LazyImage';

export default function ProductTable({
  products,
  loading,
  onEdit,
  onDelete,
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

  // Función para determinar el estado del producto/lote
  const getProductStatus = (product) => {
    // Si tiene fecha de fin de remate, usar esa lógica
    if (product.endDate) {
      const now = new Date();
      const endDate = new Date(product.endDate);

      if (now > endDate) {
        return { label: 'Finalizado', color: 'neutral', icon: CheckCircleIcon };
      } else {
        return { label: 'Activo', color: 'green', icon: ClockIcon };
      }
    }

    // Fallback al estado isActive
    if (product.isActive) {
      return { label: 'Activo', color: 'green', icon: ClockIcon };
    }

    return { label: 'Inactivo', color: 'neutral', icon: null };
  };

  // Memoizar el cálculo de imágenes primarias para evitar recalcular en cada render
  const productsWithPrimaryImages = useMemo(() => {
    if (!products) return [];

    return products.map(product => ({
      ...product,
      primaryImage: product.images?.find(img => img.isPrimary) || product.images?.[0]
    }));
  }, [products]);

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

  if (!products || products.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-12 text-center">
        <p className="text-neutral-600 dark:text-neutral-400">
          No hay lotes de remate para mostrar
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
                Imagen
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Lote
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Oferta Base
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Oferta Actual
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Incremento
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Ofertas
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Fecha Fin
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
            {productsWithPrimaryImages.map((product) => {
              const { primaryImage } = product;
              const status = getProductStatus(product);
              const StatusIcon = status.icon;

              return (
                <tr key={product._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                  {/* Imagen */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {primaryImage ? (
                      <LazyImage
                        src={primaryImage.url}
                        alt={`Imagen de ${sanitizeHTML(product.name)}`}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                        <span className="text-neutral-400 text-xs">Sin imagen</span>
                      </div>
                    )}
                  </td>

                  {/* Nombre y Modelo */}
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {sanitizeHTML(product.name)}
                    </div>
                    {product.modelo && (
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        {sanitizeHTML(product.modelo)}
                      </div>
                    )}
                  </td>

                  {/* SKU */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-900 dark:text-neutral-100 font-mono">
                      {product.sku || '-'}
                    </span>
                  </td>

                  {/* Oferta Base (priceBase o price) */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      ${product.priceBase ? product.priceBase.toFixed(2) : (product.price ? product.price.toFixed(2) : '0.00')}
                    </div>
                  </td>

                  {/* Oferta Actual (priceCurrent) */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-700 dark:text-green-400">
                      {product.priceCurrent ? `$${product.priceCurrent.toFixed(2)}` : '-'}
                    </div>
                  </td>

                  {/* Incremento Mínimo */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-900 dark:text-neutral-100">
                      {product.minIncrement ? `$${product.minIncrement.toFixed(2)}` : '-'}
                    </span>
                  </td>

                  {/* Cantidad de Ofertas */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {product.bidCount ?? 0}
                    </span>
                  </td>

                  {/* Fecha de Fin */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      {formatDate(product.endDate)}
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        status.color === 'green'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-400'
                      }`}
                    >
                      {StatusIcon && <StatusIcon className="w-3 h-3" />}
                      {status.label}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-celeste-50 dark:bg-celeste-900/20 text-celeste-700 dark:text-celeste-400 rounded-md hover:bg-celeste-100 dark:hover:bg-celeste-900/30 transition-colors"
                        title="Editar lote"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        title="Eliminar lote"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards - Mobile & Tablet */}
      <div className="xl:hidden divide-y divide-neutral-200 dark:divide-neutral-700">
        {productsWithPrimaryImages.map((product) => {
          const { primaryImage } = product;
          const status = getProductStatus(product);
          const StatusIcon = status.icon;

          return (
            <div key={product._id} className="p-4">
              <div className="flex gap-4">
                {/* Imagen */}
                {primaryImage ? (
                  <LazyImage
                    src={primaryImage.url}
                    alt={`Imagen de ${sanitizeHTML(product.name)}`}
                    className="h-20 w-20 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center shrink-0">
                    <span className="text-neutral-400 text-xs">Sin imagen</span>
                  </div>
                )}

                {/* Información Principal */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    {sanitizeHTML(product.name)}
                  </h3>

                  {/* Modelo */}
                  {product.modelo && (
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {sanitizeHTML(product.modelo)}
                    </div>
                  )}

                  {/* SKU */}
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-1">
                    SKU: {product.sku || '-'}
                  </div>

                  {/* Precios */}
                  <div className="flex items-center gap-3 mt-2">
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Base</p>
                      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        ${product.priceBase ? product.priceBase.toFixed(2) : (product.price ? product.price.toFixed(2) : '0.00')}
                      </span>
                    </div>

                    {product.priceCurrent && (
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Actual</p>
                        <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                          ${product.priceCurrent.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Estado */}
                    <div className="ml-auto">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          status.color === 'green'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-400'
                        }`}
                      >
                        {StatusIcon && <StatusIcon className="w-3 h-3" />}
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="flex items-center gap-4 mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                    <span>
                      Ofertas: <span className="font-medium text-blue-700 dark:text-blue-400">{product.bidCount ?? 0}</span>
                    </span>
                    {product.minIncrement && (
                      <span>
                        Inc: ${product.minIncrement.toFixed(2)}
                      </span>
                    )}
                    {product.endDate && (
                      <span className="truncate">
                        Fin: {formatDate(product.endDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => onEdit(product)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-celeste-50 dark:bg-celeste-900/20 text-celeste-700 dark:text-celeste-400 rounded-md hover:bg-celeste-100 dark:hover:bg-celeste-900/30 transition-colors text-sm"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => onDelete(product)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm"
                >
                  <TrashIcon className="w-4 h-4" />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

ProductTable.propTypes = {
  products: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
