
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cards from '../components/Cards.jsx';
import ProductSkeleton from '../components/ProductSkeleton.tsx';
import EmptyState from '../components/EmptyState.tsx';
import { getProducts, getPriceRange, type Product } from '../services/products.ts';
import { getCategoryColorClass, initCategoryColors } from '../utils/categoryColors.ts';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [filterPrice, setFilterPrice] = useState({ min: 0, max: 1000 });

  const decodedCategory = categoryName ? decodeURIComponent(categoryName) : '';

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const data = await getProducts();
        if (!isMounted) return;
        setProducts(data);

        // Inicializar colores de categorías
        const categories = Array.from(new Set(data.map(p => p.category).filter(Boolean)));
        initCategoryColors(categories);

        const range = await getPriceRange();
        if (!isMounted) return;
        setPriceRange(range);
        setFilterPrice(range);
      } catch (error) {
        if (isMounted) {
          setLoadError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtrar productos por categoría
  const categoryProducts = useMemo(() => {
    if (!decodedCategory) return [];
    return products.filter(
      (product) => product.category?.toLowerCase() === decodedCategory.toLowerCase()
    );
  }, [products, decodedCategory]);

  // Filtrar por precio
  const priceFiltered = useMemo(() => {
    return categoryProducts.filter(
      (product) => product.price >= filterPrice.min && product.price <= filterPrice.max
    );
  }, [categoryProducts, filterPrice]);

  // Ordenar productos
  const sortedProducts = useMemo(() => {
    const sorted = [...priceFiltered];

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
  }, [priceFiltered, sortBy]);

  const handleResetFilters = () => {
    setFilterPrice(priceRange);
    setSortBy('default');
  };

  const categoryColorClass = getCategoryColorClass(decodedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-8 text-sm text-gray-500 font-medium">
        <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">
          Home
        </button>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${categoryColorClass}`}>
          {decodedCategory}
        </span>
      </nav>

      {/* Header de categoría */}
      <section className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <span className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${categoryColorClass}`}>
            <span className="material-symbols-outlined text-2xl">
              {getCategoryIcon(decodedCategory)}
            </span>
          </span>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
              {decodedCategory}
            </h1>
            {!isLoading && !loadError && (
              <p className="text-sm text-slate-500 mt-1">
                {sortedProducts.length} {sortedProducts.length === 1 ? 'producto' : 'productos'}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-600">Precio:</label>
              <input
                type="number"
                min={priceRange.min}
                max={filterPrice.max}
                value={filterPrice.min}
                onChange={(e) => setFilterPrice(prev => ({ ...prev, min: Number(e.target.value) }))}
                className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                min={filterPrice.min}
                max={priceRange.max}
                value={filterPrice.max}
                onChange={(e) => setFilterPrice(prev => ({ ...prev, max: Number(e.target.value) }))}
                className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-600">Ordenar:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-1 border border-gray-200 rounded-lg text-sm bg-white"
              >
                <option value="default">Por defecto</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="name-asc">Nombre: A-Z</option>
                <option value="name-desc">Nombre: Z-A</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleResetFilters}
              className="text-sm font-medium text-primary hover:underline"
            >
              Limpiar filtros
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Ver todos
            </button>
          </div>
        </div>
      </section>

      {/* Grid de productos */}
      <section className="mb-24">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}
        {loadError && !isLoading && (
          <EmptyState
            icon="error"
            title="Error al cargar productos"
            description="No se pudieron cargar los productos. Por favor intenta de nuevo."
            actionLabel="Reintentar"
            onAction={() => window.location.reload()}
          />
        )}
        {!isLoading && !loadError && sortedProducts.length === 0 && (
          <EmptyState
            icon="search_off"
            title="No se encontraron productos"
            description={`No hay productos disponibles en la categoría "${decodedCategory}"`}
            actionLabel="Ver todos los productos"
            onAction={() => navigate('/')}
          />
        )}
        {!isLoading && !loadError && sortedProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {sortedProducts.map((product) => (
              <React.Fragment key={product.id}>
                <Cards
                  product={product}
                  onClick={() => navigate(`/product/${product.id}`)}
                  onShare={() => {
                    const origin = window.location.origin;
                    const linkUrl = `${origin}/product/${product.id}`;
                    const priceLine = Number.isFinite(product.price)
                      ? `$${Math.round(product.price)}`
                      : '';
                    const message = [
                      `Refid: ${product.id}`,
                      product.title,
                      priceLine,
                      linkUrl
                    ]
                      .filter(Boolean)
                      .join('\n');

                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(message)}`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }}
                />
              </React.Fragment>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

function getCategoryIcon(name: string): string {
  const value = name.toLowerCase();
  if (value.includes('cuaderno') || value.includes('cuadernola')) return 'menu_book';
  if (value.includes('lapic') || value.includes('lapiz')) return 'edit';
  if (value.includes('cola')) return 'inventory_2';
  if (value.includes('corrector')) return 'palette';
  return 'grid_view';
}

export default CategoryPage;
