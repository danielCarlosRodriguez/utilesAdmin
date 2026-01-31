import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, ThemeProvider, ToastProvider } from './context';
import { ToastContainer } from './components/organisms';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loading de páginas para Code Splitting
const Home = lazy(() => import('./pages/Home'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const OAuthCallbackPage = lazy(() => import('./pages/OAuthCallbackPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ToastTestPage = lazy(() => import('./pages/ToastTestPage'));
const ProductsManagementPage = lazy(() => import('./pages/admin/ProductsManagementPage'));

const CategoriesManagementPage = lazy(() => import('./pages/admin/CategoriesManagementPage'));
const UsersManagementPage = lazy(() => import('./pages/admin/UsersManagementPage'));
const OrdersManagementPage = lazy(() => import('./pages/admin/OrdersManagementPage'));
const OrderDetailPage = lazy(() => import('./pages/admin/OrderDetailPage'));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/auth/callback" element={<OAuthCallbackPage />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="/toast-test" element={<ToastTestPage />} />

                  {/* Protected routes */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin routes */}
                  <Route
                    path="/admin/products"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <ProductsManagementPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/categories"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <CategoriesManagementPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <UsersManagementPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <OrdersManagementPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/orders/:id"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <OrderDetailPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Category page (catch-all) */}
                  <Route path="/:slug" element={<CategoryPage />} />
                </Routes>
              </Suspense>
              <ToastContainer position="top-right" maxToasts={5} />
            </Router>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
