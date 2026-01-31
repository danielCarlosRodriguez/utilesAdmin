/**
 * AuctionLotTable - Tabla de lotes de remate para administración
 *
 * Features:
 * - Muestra lotes de remate en tabla responsiva
 * - Botones de editar y eliminar por lote
 * - Estados del remate (próximo, activo, finalizado)
 * - Información de precios y fechas de remate
 * - Paginación
 * - Estados de carga y error
 */

import { useMemo } from 'react';
import { PencilIcon, TrashIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import { sanitizeHTML } from '../../utils/sanitize';
import LazyImage from '../atoms/LazyImage';

export default function AuctionLotTable({
  lots,
  loading,
  onEdit,
  onDelete,
}) {
  // Memoizar el cálculo de imágenes primarias para evitar recalcular en cada render
  const lotsWithPrimaryImages = useMemo(() => {
    if (!lots) return [];

    return lots.map(lot => ({
      ...lot,
      primaryImage: lot.images?.find(img => img.isPrimary) || lot.images?.[0]
    }));
  }, [lots]);

  // Función para determinar el estado del remate
  const getAuctionStatus = (lot) => {
    if (!lot.auctionStartDate || !lot.auctionEndDate) {
      return { label: 'Sin fecha', color: 'neutral' };
    }

    const now = new Date();
    const startDate = new Date(lot.auctionStartDate);
    const endDate = new Date(lot.auctionEndDate);

    if (now < startDate) {
      return { label: 'Próximo', color: 'blue' };
    } else if (now >= startDate && now <= endDate) {
      return { label: 'Activo', color: 'green' };
    } else {
      return { label: 'Finalizado', color: 'neutral' };
    }
  };

  // Función para formatear fechas
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-AR', {
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

  if (!lots || lots.length === 0) {
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
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Imagen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Lote
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Precio Base
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Estado Remate
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
            {lotsWithPrimaryImages.map((lot) => {
              const { primaryImage } = lot;
              const auctionStatus = getAuctionStatus(lot);

              return (
                <tr key={lot._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {primaryImage ? (
                      <LazyImage
                        src={primaryImage.url}
                        alt={`Imagen principal de ${sanitizeHTML(lot.name)}`}
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
                      {sanitizeHTML(lot.name)}
                    </div>
                    {lot.modelo && (
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {sanitizeHTML(lot.modelo)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-900 dark:text-neutral-100 font-mono">
                      {lot.sku}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      ${lot.price ? lot.price.toFixed(2) : '0.00'}
                    </div>
                    {lot.compareAtPrice && (
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        Actual: ${lot.compareAtPrice.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-900 dark:text-neutral-100">
                      {lot.stock ?? 1} {lot.stock > 1 ? 'items' : 'item'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-900 dark:text-neutral-100">
                      {sanitizeHTML(lot.category?.name || 'Sin categoría')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        auctionStatus.color === 'green'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : auctionStatus.color === 'blue'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-400'
                      }`}
                    >
                      {auctionStatus.color === 'green' && <ClockIcon className="w-3 h-3 mr-1" />}
                      {auctionStatus.color === 'neutral' && <CheckCircleIcon className="w-3 h-3 mr-1" />}
                      {auctionStatus.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lot.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-400">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(lot)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-celeste-50 dark:bg-celeste-900/20 text-celeste-700 dark:text-celeste-400 rounded-md hover:bg-celeste-100 dark:hover:bg-celeste-900/30 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => onDelete(lot)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards - Mobile */}
      <div className="lg:hidden divide-y divide-neutral-200 dark:divide-neutral-700">
        {lotsWithPrimaryImages.map((lot) => {
          const { primaryImage } = lot;
          const auctionStatus = getAuctionStatus(lot);

          return (
            <div key={lot._id} className="p-4">
              <div className="flex gap-4">
                {primaryImage ? (
                  <LazyImage
                    src={primaryImage.url}
                    alt={`Imagen principal de ${sanitizeHTML(lot.name)}`}
                    className="h-20 w-20 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center shrink-0">
                    <span className="text-neutral-400 text-xs">Sin imagen</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    {sanitizeHTML(lot.name)}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    SKU: {sanitizeHTML(lot.sku)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      ${lot.price ? lot.price.toFixed(2) : '0.00'}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        auctionStatus.color === 'green'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : auctionStatus.color === 'blue'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-400'
                      }`}
                    >
                      {auctionStatus.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => onEdit(lot)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-celeste-50 dark:bg-celeste-900/20 text-celeste-700 dark:text-celeste-400 rounded-md hover:bg-celeste-100 dark:hover:bg-celeste-900/30 transition-colors text-sm"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => onDelete(lot)}
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

AuctionLotTable.propTypes = {
  lots: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
