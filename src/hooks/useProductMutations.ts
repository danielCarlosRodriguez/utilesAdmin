import { useCallback, useState } from 'react';
import type { Product } from './useProducts.ts';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://confident-selena-proyecto-x-ad9040cc.koyeb.app';
const DATABASE = 'utiles';
const COLLECTION = 'products';

export interface ProductPayload {
  refid: string;
  categoryId?: string;
  descripción: string;
  detalle?: string;
  imagen: string[];
  marca: string;
  precio: number;
  stock: number;
  sku: string;
  activo: boolean;
  destacado: boolean;
  descuento: number | null;
  tags: string[];
}

interface RawMongoProduct {
  _id?: string;
  refid: string;
  categoría?: string;
  categoryId?: string | { $oid?: string };
  descripción: string;
  detalle?: string;
  imagen: string[];
  marca: string;
  precio: number;
  stock: number;
  sku: string;
  activo: boolean;
  destacado: boolean;
  descuento: number | null;
  tags: string[];
}

function normalizeProduct(item: RawMongoProduct): Product {
  const resolvedCategoryId = typeof item.categoryId === 'string'
    ? item.categoryId
    : item.categoryId?.$oid;
  return {
    _id: item._id,
    id: String(item.refid),
    refid: String(item.refid),
    title: item.descripción,
    category: item.categoría,
    categoryId: resolvedCategoryId,
    price: item.precio,
    image: item.imagen?.[0] ? `/imagenes/productos/${item.imagen[0]}` : '',
    images: item.imagen || [],
    brand: item.marca,
    detail: item.detalle || '',
    stock: item.stock,
    sku: item.sku,
    activo: item.activo,
    destacado: item.destacado,
    descuento: item.descuento,
    tags: item.tags || []
  };
}

function getResponseData<T>(result: { data?: T } | T): T {
  return (result as { data?: T }).data ?? (result as T);
}

export function useCreateProduct(): {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
  createProduct: (payload: ProductPayload) => Promise<Product | null>;
} {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = useCallback(async (payload: ProductPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/${DATABASE}/${COLLECTION}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const created = getResponseData<RawMongoProduct>(result);
      const normalized = normalizeProduct(created);
      setProduct(normalized);
      return normalized;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear producto';
      setError(message);
      console.error('useCreateProduct error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { product, isLoading, error, createProduct };
}

export function useUpdateProduct(options?: {
  method?: 'PATCH' | 'PUT';
}): {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
  updateProduct: (id: string, payload: Partial<ProductPayload>) => Promise<Product | null>;
} {
  const method = options?.method || 'PATCH';
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProduct = useCallback(async (id: string, payload: Partial<ProductPayload>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/${DATABASE}/${COLLECTION}/${id}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const updated = getResponseData<RawMongoProduct>(result);
      const normalized = normalizeProduct(updated);
      setProduct(normalized);
      return normalized;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar producto';
      setError(message);
      console.error('useUpdateProduct error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [method]);

  return { product, isLoading, error, updateProduct };
}

export function useDeleteProduct(): {
  isLoading: boolean;
  error: string | null;
  deletedId: string | null;
  deleteProduct: (id: string) => Promise<boolean>;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletedId, setDeletedId] = useState<string | null>(null);

  const deleteProduct = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    setDeletedId(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/${DATABASE}/${COLLECTION}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setDeletedId(id);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar producto';
      setError(message);
      console.error('useDeleteProduct error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, deletedId, deleteProduct };
}
