import { useCallback, useState } from 'react';
import type { Category } from './useCategories.ts';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const DATABASE = 'utiles';
const COLLECTION = 'categories';

export interface CategoryPayload {
  nombre: string;
  slug: string;
  activo: boolean;
  orden: number;
}

interface RawMongoCategory {
  _id?: string | { $oid?: string };
  nombre: string;
  slug: string;
  activo: boolean;
  orden: number;
}

function getId(value?: string | { $oid?: string }): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  return value.$oid;
}

function normalizeCategory(item: RawMongoCategory): Category {
  const resolvedId = getId(item._id);
  return {
    _id: resolvedId,
    id: resolvedId || item.slug || item.nombre,
    nombre: item.nombre,
    slug: item.slug,
    activo: Boolean(item.activo),
    orden: Number(item.orden) || 0
  };
}

function getResponseData<T>(result: { data?: T } | T): T {
  return (result as { data?: T }).data ?? (result as T);
}

export function useCreateCategory(): {
  category: Category | null;
  isLoading: boolean;
  error: string | null;
  createCategory: (payload: CategoryPayload) => Promise<Category | null>;
} {
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = useCallback(async (payload: CategoryPayload) => {
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
      const created = getResponseData<RawMongoCategory>(result);
      const normalized = normalizeCategory(created);
      setCategory(normalized);
      return normalized;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear categoría';
      setError(message);
      console.error('useCreateCategory error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { category, isLoading, error, createCategory };
}

export function useUpdateCategory(options?: {
  method?: 'PATCH' | 'PUT';
}): {
  category: Category | null;
  isLoading: boolean;
  error: string | null;
  updateCategory: (id: string, payload: Partial<CategoryPayload>) => Promise<Category | null>;
} {
  const method = options?.method || 'PATCH';
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCategory = useCallback(async (id: string, payload: Partial<CategoryPayload>) => {
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
      const updated = getResponseData<RawMongoCategory>(result);
      const normalized = normalizeCategory(updated);
      setCategory(normalized);
      return normalized;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar categoría';
      setError(message);
      console.error('useUpdateCategory error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [method]);

  return { category, isLoading, error, updateCategory };
}

export function useDeleteCategory(): {
  isLoading: boolean;
  error: string | null;
  deletedId: string | null;
  deleteCategory: (id: string) => Promise<boolean>;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletedId, setDeletedId] = useState<string | null>(null);

  const deleteCategory = useCallback(async (id: string) => {
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
      const message = err instanceof Error ? err.message : 'Error al eliminar categoría';
      setError(message);
      console.error('useDeleteCategory error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, deletedId, deleteCategory };
}
