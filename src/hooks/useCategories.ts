import { useCallback, useEffect, useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://confident-selena-proyecto-x-ad9040cc.koyeb.app';
const DATABASE = 'utiles';
const COLLECTIONS = ['categories'];

export interface Category {
  _id?: string;
  id: string;
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

interface UseCategoriesReturn {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
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

export function useCategories(options?: { activeOnly?: boolean }): UseCategoriesReturn {
  const { activeOnly = false } = options || {};
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      let lastError: Error | null = null;

      for (const collection of COLLECTIONS) {
        try {
          const url = `${BACKEND_URL}/api/${DATABASE}/${collection}?${params.toString()}`;
          console.log('useCategories: fetching', url);
          const response = await fetch(url);

          if (!response.ok) {
            console.warn('useCategories: response not ok', response.status, response.statusText);
            lastError = new Error(`Error ${response.status}: ${response.statusText}`);
            continue;
          }

          const result = await response.json();
          const data: RawMongoCategory[] = result.data || result;
          const normalized = data.map(normalizeCategory);
          const filtered = activeOnly
            ? normalized.filter(category => category.activo)
            : normalized;
          console.log('useCategories: loaded', filtered.length, 'categorias from', collection);
          setCategories(filtered);
          return;
        } catch (err) {
          console.error('useCategories: fetch error', err);
          lastError = err instanceof Error ? err : new Error('Error al cargar categorías');
        }
      }

      throw lastError || new Error('Error al cargar categorías');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar categorías';
      setError(message);
      console.error('useCategories error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, isLoading, error, refetch: fetchCategories };
}

export default useCategories;
