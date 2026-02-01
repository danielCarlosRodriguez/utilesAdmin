// Tipos para productos
export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
  images: string[];
  brand: string;
  detail: string;
  stock: number;
  sku: string;
  activo: boolean;
  destacado: boolean;
  descuento: number | null;
  tags: string[];
}

interface RawProduct {
  _id?: string;
  refid: string;
  categoría: string;
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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const DATABASE = 'utiles';
const COLLECTION = 'products';

// Normaliza un producto del backend al formato interno
function normalizeProduct(item: RawProduct): Product {
  return {
    id: String(item.refid),
    title: item.descripción,
    category: item.categoría,
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

// Obtiene productos del backend MongoDB
async function fetchFromBackend(queryParams = ''): Promise<RawProduct[]> {
  const url = `${BACKEND_URL}/api/${DATABASE}/${COLLECTION}${queryParams}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Backend returned non-JSON response');
  }

  const result = await response.json();
  return result.data || result;
}

// Obtiene todos los productos (activos y con stock)
export async function getProducts(): Promise<Product[]> {
  const data = await fetchFromBackend();
  return data
    .filter(item => item.activo && item.stock > 0)
    .map(normalizeProduct);
}

// Obtiene todos los productos incluyendo los sin stock (para admin o verificación)
export async function getAllProducts(includeOutOfStock = false): Promise<Product[]> {
  const data = await fetchFromBackend();

  if (includeOutOfStock) {
    return data.filter(item => item.activo).map(normalizeProduct);
  }
  return data
    .filter(item => item.activo && item.stock > 0)
    .map(normalizeProduct);
}

// Obtiene un producto por ID
export async function getProduct(id: string): Promise<Product | null> {
  try {
    const data = await fetchFromBackend(`?refid=${id}`);
    if (data.length > 0) {
      return normalizeProduct(data[0]);
    }
  } catch (error) {
    console.error('Error fetching product:', error);
  }
  return null;
}

// Obtiene productos por categoría
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getProducts();
  if (category === 'All') return products;
  return products.filter(p => p.category === category);
}

// Obtiene categorías únicas
export async function getCategories(): Promise<string[]> {
  const products = await getProducts();
  const unique = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  return ['All', ...unique];
}

// Busca productos por término
export async function searchProducts(term: string): Promise<Product[]> {
  const products = await getProducts();
  const normalized = term.trim().toLowerCase();
  if (!normalized) return products;

  return products.filter(product => {
    const fields = [
      product.title,
      product.brand,
      product.category,
      product.detail,
      product.id
    ].filter(Boolean).join(' ').toLowerCase();
    return fields.includes(normalized);
  });
}

// Obtiene productos destacados
export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter(p => p.destacado);
}

// Obtiene rango de precios
export async function getPriceRange(): Promise<{ min: number; max: number }> {
  const products = await getProducts();
  if (products.length === 0) {
    return { min: 0, max: 1000 };
  }
  const prices = products.map(p => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}
