import { useEffect, useMemo, useState, useCallback, type FormEvent } from 'react';
import EmptyState from '../components/EmptyState.tsx';
import ImageUploader from '../components/ImageUploader.tsx';
import CopyTableButton from '../components/CopyTableButton.tsx';
import { useProducts, type Product } from '../hooks/useProducts.ts';
import { useCategories } from '../hooks/useCategories.ts';
import { useCreateProduct, useDeleteProduct, useUpdateProduct } from '../hooks/useProductMutations.ts';

type ProductFormState = {
  refid: string;
  categoryId: string;
  descripción: string;
  detalle: string;
  imagen: string;
  imagenCloudinary: string[];
  marca: string;
  precio: string;
  stock: string;
  activo: boolean;
  destacado: boolean;
  descuento: string;
  tags: string;
};

const emptyForm: ProductFormState = {
  refid: '',
  categoryId: '',
  descripción: '',
  detalle: '',
  imagen: '',
  imagenCloudinary: [],
  marca: '',
  precio: '',
  stock: '',
  activo: false,
  destacado: false,
  descuento: '',
  tags: ''
};

const Products = () => {
  const { products, isLoading, error, refetch } = useProducts({
    activeOnly: false,
    inStockOnly: false
  });
  const {
    categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
    refetch: refetchCategories
  } = useCategories({ activeOnly: true });
  const { createProduct, isLoading: isCreating, error: createError } = useCreateProduct();
  const { updateProduct, isLoading: isUpdating, error: updateError } = useUpdateProduct();
  const { deleteProduct, isLoading: isDeleting, error: deleteError } = useDeleteProduct();
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formState, setFormState] = useState<ProductFormState>(emptyForm);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isSubmitting = isCreating || isUpdating;
  const formError = mode === 'create' ? createError : updateError;
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  const getNextRefId = (): string => {
    if (products.length === 0) return '1';
    const maxRefId = products.reduce((max, product) => {
      const refidNum = Number(product.refid ?? product.id);
      return Number.isFinite(refidNum) && refidNum > max ? refidNum : max;
    }, 0);
    return String(maxRefId + 1);
  };

  const buildDefaultImages = (refid: string) => {
    const value = String(refid).padStart(3, '0');
    return `${value}-01.png, ${value}-02.png`;
  };

  const openCreateModal = () => {
    setMode('create');
    setEditingProduct(null);
    const nextRefId = getNextRefId();
    setFormState({
      ...emptyForm,
      refid: nextRefId,
      imagen: buildDefaultImages(nextRefId),
      imagenCloudinary: []
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    const matchedCategoryId = categories.find((category) => category.nombre === product.category)?.id || '';
    setMode('edit');
    setEditingProduct(product);
    setFormState({
      refid: product.refid || product.id,
      categoryId: product.categoryId || matchedCategoryId,
      descripción: product.title || '',
      detalle: product.detail || '',
      imagen: (product.images || []).join(', '),
      imagenCloudinary: product.imagenCloudinary || [],
      marca: product.brand || '',
      precio: Number.isFinite(product.price) ? String(product.price) : '',
      stock: Number.isFinite(product.stock) ? String(product.stock) : '',
      activo: Boolean(product.activo),
      destacado: Boolean(product.destacado),
      descuento: product.descuento === null || product.descuento === undefined
        ? ''
        : String(product.descuento),
      tags: (product.tags || []).join(', ')
    });
    setIsModalOpen(true);
  };

  const openDuplicateModal = (product: Product) => {
    const matchedCategoryId = categories.find((category) => category.nombre === product.category)?.id || '';
    const nextRefId = getNextRefId();
    setMode('create');
    setEditingProduct(null);
    setFormState({
      refid: nextRefId,
      categoryId: product.categoryId || matchedCategoryId,
      descripción: product.title || '',
      detalle: product.detail || '',
      imagen: buildDefaultImages(nextRefId),
      imagenCloudinary: [],
      marca: product.brand || '',
      precio: Number.isFinite(product.price) ? String(product.price) : '',
      stock: Number.isFinite(product.stock) ? String(product.stock) : '',
      activo: Boolean(product.activo),
      destacado: Boolean(product.destacado),
      descuento: product.descuento === null || product.descuento === undefined
        ? ''
        : String(product.descuento),
      tags: (product.tags || []).join(', ')
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  const handleToggleActivo = async (product: Product) => {
    const id = product._id || product.id;
    if (!id) return;
    const previousValue = product.activo;
    const nextValue = !previousValue;
    setLocalProducts((prev) =>
      prev.map((entry) => (entry.id === product.id ? { ...entry, activo: nextValue } : entry))
    );
    setTogglingId(id);
    const updated = await updateProduct(id, { activo: nextValue });
    setTogglingId(null);
    if (!updated) {
      setLocalProducts((prev) =>
        prev.map((entry) => (entry.id === product.id ? { ...entry, activo: previousValue } : entry))
      );
    }
  };

  const handleToggleDestacado = async (product: Product) => {
    const id = product._id || product.id;
    if (!id) return;
    const previousValue = product.destacado;
    const nextValue = !previousValue;
    setLocalProducts((prev) =>
      prev.map((entry) => (entry.id === product.id ? { ...entry, destacado: nextValue } : entry))
    );
    setTogglingId(id);
    const updated = await updateProduct(id, { destacado: nextValue });
    setTogglingId(null);
    if (!updated) {
      setLocalProducts((prev) =>
        prev.map((entry) => (entry.id === product.id ? { ...entry, destacado: previousValue } : entry))
      );
    }
  };

  useEffect(() => {
    if (!formError) return;
    setErrorTitle(mode === 'create' ? 'Error al crear producto' : 'Error al actualizar producto');
    setErrorMessage(formError);
    setIsErrorModalOpen(true);
  }, [formError, mode]);

  useEffect(() => {
    if (!deleteError) return;
    setErrorTitle('Error al eliminar producto');
    setErrorMessage(deleteError);
    setIsErrorModalOpen(true);
  }, [deleteError]);

  const handleChange = (field: keyof ProductFormState, value: string | boolean) => {
    setFormState((prev) => {
      if (field === 'refid') {
        const refValue = String(value);
        return { ...prev, refid: refValue, imagen: buildDefaultImages(refValue) };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const payload = {
      refid: formState.refid.trim(),
      categoryId: formState.categoryId || undefined,
      descripción: formState.descripción.trim(),
      detalle: formState.detalle.trim(),
      imagen: formState.imagen
        .split(',')
        .map(item => item.trim())
        .filter(Boolean),
      imagenCloudinary: formState.imagenCloudinary,
      marca: formState.marca.trim(),
      precio: Number(formState.precio) || 0,
      stock: Number(formState.stock) || 0,
      sku: formState.refid.trim(),
      activo: formState.activo,
      destacado: formState.destacado,
      descuento: formState.descuento === '' ? null : Number(formState.descuento),
      tags: formState.tags
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
    };

    if (mode === 'create') {
      const created = await createProduct(payload);
      if (created) {
        await refetch();
        closeModal();
      }
      return;
    }

    const id = editingProduct?._id || editingProduct?.id;
    if (!id) return;
    const updated = await updateProduct(id, payload);
    if (updated) {
      await refetch();
      closeModal();
    }
  };

  const handleDelete = (product: Product) => {
    setPendingDelete(product);
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
    const ok = await deleteProduct(id);
    setDeletingId(null);
    if (ok) {
      await refetch();
      closeDeleteModal();
    }
  };

  const sortedProducts = useMemo(() => (
    [...localProducts].sort((a, b) => {
      const aValue = Number(a.refid ?? a.id);
      const bValue = Number(b.refid ?? b.id);
      if (Number.isFinite(aValue) && Number.isFinite(bValue)) {
        return aValue - bValue;
      }
      return String(a.refid ?? a.id).localeCompare(String(b.refid ?? b.id));
    })
  ), [localProducts]);

  const copyHeaders = [
    'Imagen',
    'Ref',
    'Categoría',
    'Descripción',
    'Marca',
    'Stock',
    'Precio',
    'Activo',
    'Destacado',
    'Descuento'
  ];

  const copyRows = sortedProducts.map((product) => [
    product.image,
    product.refid || product.id,
    categories.find((category) => category.id === product.categoryId)?.nombre || product.category || '',
    product.title,
    product.brand,
    product.stock,
    Number.isFinite(product.price) ? product.price : '',
    product.activo ? 'Sí' : 'No',
    product.destacado ? 'Sí' : 'No',
    product.descuento ?? ''
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Productos</h2>
        <div className="flex items-center gap-2">
          <CopyTableButton headers={copyHeaders} rows={copyRows} />
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Crear Productos
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="text-sm text-slate-500">Cargando productos...</div>
      )}

      {error && !isLoading && (
        <EmptyState
          icon="error"
          title="Error al cargar productos"
          description={error}
          actionLabel="Reintentar"
          onAction={refetch}
        />
      )}

      {!isLoading && !error && products.length === 0 && (
        <EmptyState
          icon="inventory_2"
          title="Sin productos"
          description="No hay productos disponibles para mostrar."
          actionLabel="Recargar"
          onAction={refetch}
        />
      )}

      {!isLoading && !error && localProducts.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full border-collapse text-sm border border-gray-200">
            <thead className="bg-gray-100 text-slate-600 border-b border-gray-200">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Imagen</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Ref</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Categoría</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Descripción</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Stock</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Precio</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Activo</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Destacado</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Descuento</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Editar</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Duplicar</th>
                <th className="px-4 py-3 font-semibold">Eliminar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/70">
                  <td className="px-4 py-3 border-r border-gray-200">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-12 w-12 rounded-lg object-cover border border-gray-100"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-100 border border-gray-100" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700 border-r border-gray-200">{product.refid || product.id}</td>
                  <td className="px-4 py-3 text-slate-600 border-r border-gray-200">
                    {categories.find((category) => category.id === product.categoryId)?.nombre || product.category}
                  </td>
                  <td className="px-4 py-3 text-slate-800 border-r border-gray-200">
                    <div className="font-medium text-slate-800">{product.title}</div>
                    <div className="text-xs font-normal text-slate-500">{product.brand}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700 border-r border-gray-200">{product.stock}</td>
                  <td className="px-4 py-3 text-slate-700 border-r border-gray-200">
                    {Number.isFinite(product.price) ? `$${product.price}` : '-'}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200 text-center align-middle">
                    <div className="flex h-full min-h-[32px] items-center justify-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        product.activo ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {product.activo ? 'Sí' : 'No'}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={product.activo}
                        onClick={() => handleToggleActivo(product)}
                        disabled={togglingId === (product._id || product.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          product.activo ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            product.activo ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200 text-center align-middle">
                    <div className="flex h-full min-h-[32px] items-center justify-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        product.destacado ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {product.destacado ? 'Sí' : 'No'}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={product.destacado}
                        onClick={() => handleToggleDestacado(product)}
                        disabled={togglingId === (product._id || product.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          product.destacado ? 'bg-amber-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            product.destacado ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700 border-r border-gray-200">
                    {product.descuento ?? '-'}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200">
                    <button
                      type="button"
                      onClick={() => openEditModal(product)}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-slate-600 hover:bg-gray-50 hover:text-primary transition-colors"
                      aria-label="Editar producto"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200">
                    <button
                      type="button"
                      onClick={() => openDuplicateModal(product)}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      aria-label="Duplicar producto"
                    >
                      <span className="material-symbols-outlined text-base">content_copy</span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      disabled={isDeleting && deletingId === (product._id || product.id)}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                      aria-label="Eliminar producto"
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

      {deleteError && (
        <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {deleteError}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {mode === 'create' ? 'Crear producto' : 'Editar producto'}
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
            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
            <div className="overflow-y-auto px-6 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm text-slate-600">
                  RefId
                  <input
                    type="text"
                    value={formState.refid}
                    onChange={(event) => handleChange('refid', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    required
                  />
                </label>
                <label className="text-sm text-slate-600">
                  SKU
                  <input
                    type="text"
                    value={formState.refid}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-500"
                    readOnly
                  />
                </label>
                <label className="text-sm text-slate-600 md:col-span-2">
                  Descripción
                  <input
                    type="text"
                    value={formState.descripción}
                    onChange={(event) => handleChange('descripción', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    required
                  />
                </label>
                <label className="text-sm text-slate-600 md:col-span-2">
                  Detalle
                  <input
                    type="text"
                    value={formState.detalle}
                    onChange={(event) => handleChange('detalle', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
                <label className="text-sm text-slate-600">
                  Categoría
                  <select
                    value={formState.categoryId}
                    onChange={(event) => handleChange('categoryId', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    required
                    disabled={isLoadingCategories}
                  >
                    <option value="">
                      {isLoadingCategories ? 'Cargando...' : 'Selecciona una categoría'}
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nombre}
                      </option>
                    ))}
                  </select>
                  {categoriesError && (
                    <div className="mt-1 flex items-center gap-2 text-xs text-red-600">
                      <span>{categoriesError}</span>
                      <button
                        type="button"
                        onClick={refetchCategories}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Reintentar
                      </button>
                    </div>
                  )}
                </label>
                <label className="text-sm text-slate-600">
                  Marca
                  <input
                    type="text"
                    value={formState.marca}
                    onChange={(event) => handleChange('marca', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    required
                  />
                </label>
                <label className="text-sm text-slate-600">
                  Precio
                  <input
                    type="number"
                    value={formState.precio}
                    onChange={(event) => handleChange('precio', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    min="0"
                  />
                </label>
                <label className="text-sm text-slate-600">
                  Stock
                  <input
                    type="number"
                    value={formState.stock}
                    onChange={(event) => handleChange('stock', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    min="0"
                  />
                </label>
                <label className="text-sm text-slate-600">
                  Descuento
                  <input
                    type="number"
                    value={formState.descuento}
                    onChange={(event) => handleChange('descuento', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    min="0"
                  />
                </label>
                <div className="text-sm text-slate-600 md:col-span-2">
                  <p className="mb-2 font-medium">Imágenes (Cloudinary)</p>

                  {/* Lista de imágenes de Cloudinary */}
                  {formState.imagenCloudinary.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {formState.imagenCloudinary.map((url, idx) => {
                        const displayName = url.split('/').pop();
                        return (
                          <div key={idx} className="group relative">
                            <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs">
                              <img src={url} alt={displayName} className="h-8 w-8 rounded object-cover" />
                              <span className="max-w-[120px] truncate">{displayName}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...formState.imagenCloudinary];
                                  updated.splice(idx, 1);
                                  setFormState(prev => ({ ...prev, imagenCloudinary: updated }));
                                }}
                                className="ml-1 text-gray-400 hover:text-red-500"
                              >
                                <span className="material-symbols-outlined text-[14px]">close</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Uploader */}
                  <ImageUploader
                    onUpload={(url) => {
                      setFormState(prev => ({
                        ...prev,
                        imagenCloudinary: [...prev.imagenCloudinary, url]
                      }));
                    }}
                  />
                </div>
                <label className="text-sm text-slate-600 md:col-span-2">
                  Tags (separadas por coma)
                  <input
                    type="text"
                    value={formState.tags}
                    onChange={(event) => handleChange('tags', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
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
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={formState.destacado}
                    onChange={(event) => handleChange('destacado', event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Destacado
                </label>
              </div>
            </div>

              {formError && (
                <div className="mx-6 mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
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
              <h3 className="text-lg font-semibold text-slate-800">Eliminar producto</h3>
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
                {pendingDelete?.title || pendingDelete?.id}
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

export default Products;
