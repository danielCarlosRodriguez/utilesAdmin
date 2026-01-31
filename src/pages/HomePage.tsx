
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cards from '../components/Cards.jsx';
import ProductSkeleton from '../components/ProductSkeleton.tsx';
import EmptyState from '../components/EmptyState.tsx';
import { getProducts, getPriceRange, type Product } from '../services/products.ts';
import { getCategoryColorClass, initCategoryColors } from '../utils/categoryColors.ts';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const HomePage = ({ searchTerm = '' }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [filterPrice, setFilterPrice] = useState({ min: 0, max: 1000 });

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const data = await getProducts();
        if (!isMounted) return;
        setProducts(data);

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

  const categories = React.useMemo(() => {
    const unique = Array.from(
      new Set(products.map((product) => product.category).filter(Boolean))
    );
    return ['All', ...unique];
  }, [products]);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const searchedProducts = normalizedSearch
    ? products.filter((product) => {
        const fields = [
          product.title,
          product.brand,
          product.category,
          product.detail,
          product.id
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return fields.includes(normalizedSearch);
      })
    : products;

  const categoryFiltered = selectedCategory === 'All'
    ? searchedProducts
    : searchedProducts.filter((product) => product.category === selectedCategory);

  const priceFiltered = categoryFiltered.filter(
    (product) => product.price >= filterPrice.min && product.price <= filterPrice.max
  );

  const categoryOrder = React.useMemo(() => {
    const base = categories.filter((name) => name !== 'All');
    const priority = ['Cuadernola', 'Cuaderno'];
    const ordered = [
      ...priority.filter((name) => base.includes(name)),
      ...base.filter((name) => !priority.includes(name))
    ];
    return ordered;
  }, [categories]);

  const sortedProducts = React.useMemo(() => {
    const rank = new Map();
    categoryOrder.forEach((name, index) => {
      rank.set(name, index);
    });

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
        return sorted.sort((a, b) => {
          const aRank = rank.get(a.category) ?? Number.MAX_SAFE_INTEGER;
          const bRank = rank.get(b.category) ?? Number.MAX_SAFE_INTEGER;
          if (aRank !== bRank) return aRank - bRank;
          return String(a.title).localeCompare(String(b.title));
        });
    }
  }, [priceFiltered, categoryOrder, sortBy]);

  const getCategoryIcon = (name: string) => {
    const value = name.toLowerCase();
    if (value.includes('cuaderno') || value.includes('cuadernola')) return 'menu_book';
    if (value.includes('lapic') || value.includes('lapiz')) return 'edit';
    if (value.includes('cola')) return 'inventory_2';
    if (value.includes('corrector')) return 'palette';
    return 'grid_view';
  };

  // Inicializar colores cuando se cargan las categorías
  React.useEffect(() => {
    if (categories.length > 0) {
      initCategoryColors(categories);
    }
  }, [categories]);

  const getCategoryClasses = (name: string, isActive: boolean) => {
    if (isActive) {
      return 'bg-primary text-white';
    }
    return getCategoryColorClass(name);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setFilterPrice(priceRange);
    setSortBy('default');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <section className="mb-8">
        <div className="flex items-center justify-between mb-8 px-2">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Categorías</h3>
        </div>
        <div className="flex gap-3 pb-6 flex-wrap justify-center md:justify-start">
          {categories.map((name) => {
            const isActive = name === selectedCategory;
            return (
              <button
                key={name}
                onClick={() => setSelectedCategory(name)}
                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 cursor-pointer transition-colors ${getCategoryClasses(name, isActive)}`}
              >
                <span className="material-symbols-outlined">{getCategoryIcon(name)}</span>
                {name === 'All' ? 'Todos' : name}
              </button>
            );
          })}
        </div>
      </section>

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
          <button
            onClick={handleResetFilters}
            className="text-sm font-medium text-primary hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      <section className="mb-4">
        {!isLoading && !loadError && (
          <div className="flex items-center justify-between px-2">
            <p className="text-sm text-slate-500">
              {normalizedSearch ? (
                <>
                  <span className="font-semibold text-slate-700">{sortedProducts.length}</span>
                  {sortedProducts.length === 1 ? ' resultado' : ' resultados'} para "{searchTerm}"
                </>
              ) : (
                <>
                  <span className="font-semibold text-slate-700">{sortedProducts.length}</span>
                  {sortedProducts.length === 1 ? ' producto' : ' productos'}
                </>
              )}
            </p>
          </div>
        )}
      </section>

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
            description={
              normalizedSearch
                ? `No hay productos que coincidan con "${searchTerm}"`
                : 'No hay productos en esta categoría o rango de precio'
            }
            actionLabel="Ver todos los productos"
            onAction={handleResetFilters}
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

export default HomePage;
