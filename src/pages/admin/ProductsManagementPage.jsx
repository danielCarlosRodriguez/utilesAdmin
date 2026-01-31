/**
 * ProductsManagementPage - Página de gestión de lotes de remate (Admin)
 *
 * Features:
 * - CRUD completo de lotes de remate
 * - Tabla con listado de lotes
 * - Modal para crear/editar lotes
 * - Confirmación para eliminar lotes
 * - Paginación
 * - Búsqueda y filtros
 * - Estados de remate (próximo, activo, finalizado)
 */

import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Header, Footer } from '../../components/organisms';
import ProductTable from '../../components/admin/ProductTable';
import ProductFormModal from '../../components/admin/ProductFormModal';
import Button from '../../components/atoms/Button';
import useProducts from '../../hooks/useProducts';
import { productsAPI } from '../../services/api';
import cacheManager from '../../utils/cacheManager';
import { useToast } from '../../context';

export default function ProductsManagementPage() {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Obtener productos
  const {
    data: products,
    loading,
    error,
    pagination,
    refetch,
  } = useProducts({
    page,
    limit: 20,
    sort: '-createdAt',
  });

  // Refrescar cuando cambia el trigger
  useEffect(() => {
    if (refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);

    try {
      if (editingProduct) {
        // Actualizar lote existente
        await productsAPI.update(editingProduct._id, formData);
        showToast({ type: 'success', title: 'Éxito', message: 'Lote actualizado correctamente' });
      } else {
        // Crear nuevo lote
        await productsAPI.create(formData);
        showToast({ type: 'success', title: 'Éxito', message: 'Lote creado correctamente' });
      }

      // Invalidar caché de productos para forzar recarga
      cacheManager.invalidateProducts();

      handleCloseModal();
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error al guardar producto:', err);
      showToast({
        type: 'error',
        title: 'Error',
        message: err.message || 'Error al guardar el lote'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar "${product.name}"?`)) {
      return;
    }

    try {
      await productsAPI.delete(product._id);

      // Invalidar caché de productos para forzar recarga
      cacheManager.invalidateProducts();

      showToast({ type: 'success', title: 'Éxito', message: 'Lote eliminado correctamente' });
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      showToast({
        type: 'error',
        title: 'Error',
        message: err.message || 'Error al eliminar el lote'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
      <Header />

      <main className="grow">
        {/* Hero Section */}
        <section className="bg-linear-to-br from-primary-500 to-primary-700 dark:from-primary-700 dark:to-primary-900 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-1 text-white">
                  Gestión de Productos
                </h1>
                <p className="text-sm text-primary-100">
                  {loading
                    ? "Cargando..."
                    : `${products?.length || 0} lotes en total`}
                </p>
              </div>

              <button
                onClick={handleCreate}
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-white text-primary-600 hover:bg-primary-50 font-medium rounded-md transition-colors text-sm"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Crear Producto</span>
              </button>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Mobile Create Button */}
            <div className="md:hidden mb-6">
              <button
                onClick={handleCreate}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-celeste-600 hover:bg-celeste-700 dark:bg-celeste-600 dark:hover:bg-celeste-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
              >
                <PlusIcon className="w-5 h-5 shrink-0 " />
                <span className="whitespace-nowrap">Crear Producto</span>
              </button>
            </div>

            {/* Stats */}
            {pagination && (
              <div className="mb-6 p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Total de lotes
                    </p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {pagination.total}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Página {pagination.page} de {pagination.pages}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-400">
                  Error al cargar lotes: {error.message || error}
                </p>
              </div>
            )}

            {/* Product Table */}
            <ProductTable
              products={products}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={!pagination.hasPrevPage || loading}
                >
                  Anterior
                </Button>

                <span className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400">
                  Página {page} de {pagination.pages}
                </span>

                <Button
                  variant="outline"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!pagination.hasNextPage || loading}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        product={editingProduct}
        loading={submitting}
      />
    </div>
  );
}
