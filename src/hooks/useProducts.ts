import { useState, useEffect, useCallback } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const DATABASE = 'utiles';
const COLLECTION = 'products';

export interface Product {
  _id?: string;
  id: string;
  refid: string;
  title: string;
  category?: string;
  categoryId?: string;
  price: number;
  image: string;
  images: string[];
  imagenCloudinary: string[];
  brand: string;
  detail: string;
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
  imagenCloudinary?: string[];
  marca: string;
  precio: number;
  stock: number;
  sku: string;
  activo: boolean;
  destacado: boolean;
  descuento: number | null;
  tags: string[];
}

interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseProductReturn {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Normaliza producto de MongoDB al formato interno
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
    image: item.imagenCloudinary?.[0] || (item.imagen?.[0] ? `/imagenes/productos/${item.imagen[0]}` : ''),
    images: item.imagen || [],
    imagenCloudinary: item.imagenCloudinary || [],
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

/**
 * Hook para obtener todos los productos desde MongoDB
 */
export function useProducts(options?: {
  activeOnly?: boolean;
  inStockOnly?: boolean;
}): UseProductsReturn {
  const { activeOnly = true, inStockOnly = true } = options || {};
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Construir query params para filtrar
      const params = new URLSearchParams();
      if (activeOnly) params.append('activo', 'true');
      if (inStockOnly) params.append('stock', 'gte:1');

      const url = `${BACKEND_URL}/api/${DATABASE}/${COLLECTION}?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const data: RawMongoProduct[] = result.data || result;

      const normalized = data.map(normalizeProduct);
      setProducts(normalized);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar productos';
      setError(message);
      console.error('useProducts error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeOnly, inStockOnly]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, error, refetch: fetchProducts };
}

/**
 * Hook para obtener un producto por ID desde MongoDB
 */
export function useProduct(refid: string | undefined): UseProductReturn {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!refid) {
      setProduct(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Buscar por refid
      const url = `${BACKEND_URL}/api/${DATABASE}/${COLLECTION}?refid=${refid}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const data: RawMongoProduct[] = result.data || result;

      if (data.length > 0) {
        setProduct(normalizeProduct(data[0]));
      } else {
        setProduct(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar producto';
      setError(message);
      console.error('useProduct error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [refid]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, isLoading, error, refetch: fetchProduct };
}

/**
 * Hook para obtener categorías únicas
 */
export function useCategories(): { categories: string[]; isLoading: boolean } {
  const { products, isLoading } = useProducts();

  const categories = ['All', ...Array.from(
    new Set(products.map(p => p.category).filter(Boolean))
  )];

  return { categories, isLoading };
}

/**
 * Hook para obtener rango de precios
 */
export function usePriceRange(): { min: number; max: number; isLoading: boolean } {
  const { products, isLoading } = useProducts();

  if (products.length === 0) {
    return { min: 0, max: 1000, isLoading };
  }

  const prices = products.map(p => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    isLoading
  };
}

export default useProducts;
