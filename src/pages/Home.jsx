import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header, Footer } from '../components/organisms';
import useProducts from '../hooks/useProducts';
import { categoriesAPI, usersAPI, ordersAPI } from '../services/api';

/**
 * Home Page - Admin Panel
 *
 * Muestra la tabla de productos para gestión de administrador
 *
 * @example
 * <Home />
 */
const Home = () => {
  const {
    data: products,
    loading,
  } = useProducts({
    page: 1,
    limit: 50,
    sort: '-createdAt',
  });

  const [categoryCount, setCategoryCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const extractArray = (response, nestedKey) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;

    if (Array.isArray(response?.data)) return response.data;
    if (nestedKey && Array.isArray(response?.data?.[nestedKey])) {
      return response.data[nestedKey];
    }

    if (nestedKey && Array.isArray(response?.[nestedKey])) {
      return response[nestedKey];
    }

    return [];
  };

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const [categoriesResponse, usersResponse, ordersResponse] = await Promise.all([
          categoriesAPI.getAll(),
          usersAPI.getAll(),
          ordersAPI.getAllAdmin(),
        ]);

        if (!isMounted) return;

        const categoriesData = extractArray(categoriesResponse, 'categories');
        const usersData = extractArray(usersResponse, 'users');
        const ordersData = extractArray(ordersResponse, 'orders');

        setCategoryCount(Array.isArray(categoriesData) ? categoriesData.length : 0);
        setUserCount(Array.isArray(usersData) ? usersData.length : 0);
        setOrderCount(Array.isArray(ordersData) ? ordersData.length : 0);
        setStatsError(null);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error al cargar estadísticas:', err);
        setStatsError(err.message || 'No se pudieron cargar las estadísticas');
      } finally {
        if (isMounted) {
          setStatsLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const cards = [
    {
      title: 'Productos',
      value: products?.length || 0,
      description: 'Administra publicaciones, stock y estados.',
      href: '/admin/products',
      actionLabel: 'Ir a productos',
      loading: loading,
    },
    {
      title: 'Categorías',
      value: categoryCount,
      description: 'Organiza las categorías disponibles en la tienda.',
      href: '/admin/categories',
      actionLabel: 'Ir a categorías',
      loading: statsLoading,
    },
    {
      title: 'Usuarios',
      value: userCount,
      description: 'Gestiona permisos, roles y accesos.',
      href: '/admin/users',
      actionLabel: 'Ir a usuarios',
      loading: statsLoading,
    },
    {
      title: 'Órdenes',
      value: orderCount,
      description: 'Visualiza y gestiona todas las órdenes de compra.',
      href: '/admin/orders',
      actionLabel: 'Ir a órdenes',
      loading: statsLoading,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-900 transition-colors duration-200">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="grow">
        {/* Hero Section */}
        <section className="bg-linear-to-br from-primary-500 to-primary-700 dark:from-primary-700 dark:to-primary-900 py-8">
          <div className="container mx-auto px-4">
            <div>
              <h1 className="text-3xl font-bold mb-1 text-white">
                Panel de Administración
              </h1>
              <p className="text-sm text-primary-100">
                {loading ? 'Cargando...' : `${products?.length || 0} productos en total`}
              </p>
            </div>
          </div>
        </section>

        {/* Resumen de gestión */}
        <section className="py-12 bg-neutral-50 dark:bg-neutral-900">
          <div className="container mx-auto px-4">
            {statsError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-300 text-sm">
                  {statsError}
                </p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-4 shadow-sm flex flex-col justify-between gap-3"
                >
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {card.title}
                    </p>
                    <p className="mt-1 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
                      {card.loading ? '—' : card.value}
                    </p>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                      {card.description}
                    </p>
                  </div>

                  <Link
                    to={card.href}
                    className="inline-flex items-center justify-center rounded-lg bg-primary-600 text-white font-medium px-3 py-1.5 text-xs hover:bg-primary-700 transition-colors"
                  >
                    {card.actionLabel}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Home;
