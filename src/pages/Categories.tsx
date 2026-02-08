import { useEffect, useState } from 'react';
import EmptyState from '../components/EmptyState.tsx';
import { useCategories, type Category } from '../hooks/useCategories.ts';
import { useCreateCategory, useDeleteCategory, useUpdateCategory } from '../hooks/useCategoryMutations.ts';

type CategoryFormState = {
  nombre: string;
  slug: string;
  activo: boolean;
  orden: string;
};

const emptyForm: CategoryFormState = {
  nombre: '',
  slug: '',
  activo: true,
  orden: ''
};

const toSlug = (value: string) => value.trim().toLowerCase();

const Categories = () => {
  const { categories, isLoading, error, refetch } = useCategories({ activeOnly: false });
  const { createCategory, isLoading: isCreating, error: createError } = useCreateCategory();
  const { updateCategory, isLoading: isUpdating, error: updateError } = useUpdateCategory();
  const { deleteCategory, isLoading: isDeleting, error: deleteError } = useDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formState, setFormState] = useState<CategoryFormState>(emptyForm);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successTitle, setSuccessTitle] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isSubmitting = isCreating || isUpdating;
  const formError = mode === 'create' ? createError : updateError;

  const openCreateModal = () => {
    const maxOrder = categories.reduce((max, category) => Math.max(max, Number(category.orden) || 0), 0);
    const nextOrder = maxOrder + 1;
    setMode('create');
    setEditingCategory(null);
    setFormState({
      ...emptyForm,
      orden: String(nextOrder)
    });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setMode('edit');
    setEditingCategory(category);
    setFormState({
      nombre: category.nombre || '',
      slug: toSlug(category.nombre || category.slug || ''),
      activo: Boolean(category.activo),
      orden: Number.isFinite(category.orden) ? String(category.orden) : ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  useEffect(() => {
    if (!formError) return;
    setErrorTitle(mode === 'create' ? 'Error al crear categoría' : 'Error al actualizar categoría');
    setErrorMessage(formError);
    setIsErrorModalOpen(true);
  }, [formError, mode]);

  useEffect(() => {
    if (!deleteError) return;
    setErrorTitle('Error al eliminar categoría');
    setErrorMessage(deleteError);
    setIsErrorModalOpen(true);
  }, [deleteError]);

  const handleChange = (field: keyof CategoryFormState, value: string | boolean) => {
    setFormState(prev => {
      if (field === 'nombre') {
        const nameValue = String(value);
        return { ...prev, nombre: nameValue, slug: toSlug(nameValue) };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const computedSlug = toSlug(formState.nombre);
    const payload = {
      nombre: formState.nombre.trim(),
      slug: computedSlug,
      activo: formState.activo,
      orden: Number(formState.orden) || 0
    };

    if (mode === 'create') {
      const created = await createCategory(payload);
      if (created) {
        await refetch();
        closeModal();
        setSuccessTitle('Categoría creada');
        setSuccessMessage('La categoría se creó correctamente.');
        setIsSuccessModalOpen(true);
      }
      return;
    }

    const id = editingCategory?._id || editingCategory?.id;
    if (!id) return;
    const updated = await updateCategory(id, payload);
    if (updated) {
      await refetch();
      closeModal();
      setSuccessTitle('Categoría actualizada');
      setSuccessMessage('La categoría se actualizó correctamente.');
      setIsSuccessModalOpen(true);
    }
  };

  const handleDelete = (category: Category) => {
    setPendingDelete(category);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const id = pendingDelete._id || pendingDelete.id;
    if (!id) return;
    setDeletingId(id);
    const ok = await deleteCategory(id);
    setDeletingId(null);
    if (ok) {
      await refetch();
      closeDeleteModal();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Categorías</h2>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary/90"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Crear Categoría
        </button>
      </div>

      {isLoading && (
        <div className="text-sm text-slate-500">Cargando categorías...</div>
      )}

      {error && !isLoading && (
        <EmptyState
          icon="error"
          title="Error al cargar categorías"
          description={error}
          actionLabel="Reintentar"
          onAction={refetch}
        />
      )}

      {!isLoading && !error && categories.length === 0 && (
        <EmptyState
          icon="category"
          title="Sin categorías"
          description="No hay categorías disponibles para mostrar."
          actionLabel="Recargar"
          onAction={refetch}
        />
      )}

      {!isLoading && !error && categories.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full border-collapse text-sm border border-gray-200">
            <thead className="bg-gray-100 text-slate-600 border-b border-gray-200">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Nombre</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Orden</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Activo</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Editar</th>
                <th className="px-4 py-3 font-semibold">Eliminar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50/70">
                  <td className="px-4 py-3 font-medium text-slate-700 border-r border-gray-200">
                    {category.nombre}
                  </td>
                  <td className="px-4 py-3 text-slate-700 border-r border-gray-200">
                    {category.orden}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        category.activo
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {category.activo ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200">
                    <button
                      type="button"
                      onClick={() => openEditModal(category)}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-slate-600 hover:bg-gray-50 hover:text-primary transition-colors"
                      aria-label="Editar categoría"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(category)}
                      disabled={isDeleting && deletingId === (category._id || category.id)}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                      aria-label="Eliminar categoría"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {mode === 'create' ? 'Crear categoría' : 'Editar categoría'}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-gray-100"
                aria-label="Cerrar"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm text-slate-600 md:col-span-2">
                  Nombre
                  <input
                    type="text"
                    value={formState.nombre}
                    onChange={(event) => handleChange('nombre', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    required
                  />
                </label>
                <label className="text-sm text-slate-600">
                  Slug
                  <input
                    type="text"
                    value={formState.slug}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-500"
                    readOnly
                  />
                </label>
                <label className="text-sm text-slate-600">
                  Orden
                  <input
                    type="number"
                    value={formState.orden}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-500"
                    min="0"
                    readOnly
                  />
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-600">
                  <span>Activo</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formState.activo}
                    onClick={() => handleChange('activo', !formState.activo)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formState.activo ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        formState.activo ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>

              {formError && (
                <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {formError}
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-slate-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-800">Eliminar categoría</h3>
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-gray-100"
                aria-label="Cerrar"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="px-6 py-5 text-sm text-slate-600">
              ¿Seguro que quieres eliminar{' '}
              <span className="font-semibold text-slate-800">
                {pendingDelete?.nombre || pendingDelete?.id}
              </span>
              ?
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-slate-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-800">{successTitle}</h3>
              <button
                type="button"
                onClick={closeSuccessModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-gray-100"
                aria-label="Cerrar"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="px-6 py-5 text-sm text-slate-600">
              {successMessage}
            </div>
            <div className="flex items-center justify-end border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={closeSuccessModal}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {isErrorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-800">{errorTitle}</h3>
              <button
                type="button"
                onClick={closeErrorModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-gray-100"
                aria-label="Cerrar"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="px-6 py-5 text-sm text-slate-600">
              {errorMessage}
            </div>
            <div className="flex items-center justify-end border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={closeErrorModal}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
