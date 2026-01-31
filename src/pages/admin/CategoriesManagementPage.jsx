/**
 * CategoriesManagementPage - Página de gestión de categorías (Admin)
 *
 * Features:
 * - CRUD completo de categorías
 * - Tabla con listado de categorías
 * - Modal para crear/editar categorías
 * - Confirmación para eliminar categorías
 */

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Header, Footer } from '../../components/organisms';
import CategoryTable from '../../components/admin/CategoryTable';
import CategoryFormModal from '../../components/admin/CategoryFormModal';
import Button from '../../components/atoms/Button';
import { useCategories } from '../../hooks';
import { categoriesAPI } from '../../services/api';
import { useToast } from '../../context';

export default function CategoriesManagementPage() {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Obtener categorías
  const {
    data: categories,
    loading,
    error,
    refetch,
  } = useCategories();

  const handleCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);

    try {
      let response;
      if (editingCategory) {
        // Actualizar categoría existente
        console.log('🔄 Actualizando categoría:', editingCategory._id);
        console.log('📋 SpecificationTemplate a enviar:', formData.specificationTemplate);
        response = await categoriesAPI.update(editingCategory._id, formData);
        console.log('✅ Respuesta del backend (update):', response);
        console.log('📋 SpecificationTemplate en respuesta:', response.data?.specificationTemplate);
        showToast({ type: 'success', title: 'Éxito', message: 'Categoría actualizada correctamente' });
      } else {
        // Crear nueva categoría
        console.log('➕ Creando nueva categoría');
        console.log('📋 SpecificationTemplate a enviar:', formData.specificationTemplate);
        response = await categoriesAPI.create(formData);
        console.log('✅ Respuesta del backend (create):', response);
        console.log('📋 SpecificationTemplate en respuesta:', response.data?.specificationTemplate);
        showToast({ type: 'success', title: 'Éxito', message: 'Categoría creada correctamente' });
      }

      handleCloseModal();
      refetch(true); // Force refresh
    } catch (err) {
      console.error('❌ Error al guardar categoría:', err);
      showToast({
        type: 'error',
        title: 'Error',
        message: err.message || 'Error al guardar la categoría'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category) => {
    if (category.productCount > 0) {
      showToast({
        type: 'error',
        title: 'No se puede eliminar',
        message: `La categoría "${category.name}" tiene ${category.productCount} productos asociados`
      });
      return;
    }

    if (!window.confirm(`¿Estás seguro de que deseas eliminar la categoría "${category.name}"?`)) {
      return;
    }

    try {
      await categoriesAPI.delete(category._id);
      showToast({ type: 'success', title: 'Éxito', message: 'Categoría eliminada correctamente' });
      refetch(true); // Force refresh
    } catch (err) {
      console.error('Error al eliminar categoría:', err);
      showToast({
        type: 'error',
        title: 'Error',
        message: err.message || 'Error al eliminar la categoría'
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
                  Gestión de Categorías
                </h1>
                <p className="text-sm text-primary-100">
                  {loading
                    ? "Cargando..."
                    : `${categories?.length || 0} categorías en total`}
                </p>
              </div>

              <button
                onClick={handleCreate}
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-white text-primary-600 hover:bg-primary-50 font-medium rounded-md transition-colors text-sm"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Crear Categoría</span>
              </button>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Mobile Create Button */}
            <div className="md:hidden mb-6">
              <Button
                variant="primary"
                size="md"
                onClick={handleCreate}
                className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap bg-celeste-600 text-white hover:bg-celeste-700 dark:bg-celeste-500 dark:hover:bg-celeste-600"
              >
                <PlusIcon className="w-5 h-5 shrink-0 " />
                <span className="whitespace-nowrap">Crear Categoría</span>
              </Button>
            </div>

            {/* Stats */}
            {categories && (
              <div className="mb-6 p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Total de categorías
                    </p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {categories.length}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Categorías activas
                    </p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {categories.filter((c) => c.isActive).length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-400">
                  Error al cargar categorías: {error.message || error}
                </p>
              </div>
            )}

            {/* Category Table */}
            <CategoryTable
              categories={categories || []}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </section>
      </main>

      <Footer />

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        category={editingCategory}
        loading={submitting}
      />
    </div>
  );
}
