# Panel de Administración de Remates

Panel de administración moderno para gestión de remates y subastas, construido con React 19.2, Vite 7.2 y Tailwind CSS 4.1 utilizando el patrón de Diseño Atómico.

> **Sistema completo de gestión de remates**: CRUD de lotes de remate y categorías con autenticación, upload de imágenes, especificaciones dinámicas, control de fechas de subasta y dark mode.

## 🎯 Descripción del Proyecto

Este proyecto es un **panel de administración** completo para la gestión de un sistema de remates y subastas. Permite a los administradores gestionar lotes de remate, categorías, especificaciones, imágenes, fechas de subasta y más, todo desde una interfaz moderna y responsive.

## 🔗 Backend API

Este panel se conecta con una API REST desarrollada en Node.js + Express + MongoDB.

**API URL (Producción)**: https://ecommerceback-oq23.onrender.com/api/v1

**API URL (Desarrollo)**: http://localhost:5000/api/v1

### Configuración del Backend

El backend ya está deployado y funcionando con las siguientes características:

✅ **Autenticación**
- Google OAuth 2.0
- JWT para manejo de sesiones
- Endpoints: `/api/auth/google`, `/api/auth/me`, `/api/auth/logout`

✅ **Productos**
- CRUD completo: `/api/products`
- Búsqueda y filtros avanzados
- Paginación

✅ **Categorías**
- CRUD completo: `/api/categories`

✅ **Upload de Imágenes**
- Cloudinary: `/api/upload`
- Single y múltiple

### Variables de Entorno Necesarias

Crear un archivo `.env` en la raíz del proyecto con:

```env
# API Configuration
VITE_API_URL=https://ecommerceback-oq23.onrender.com/api/v1
# For local development:
# VITE_API_URL=http://localhost:5000/api/v1

# App Configuration
VITE_APP_NAME="Panel de Administración"
VITE_APP_DESCRIPTION="Panel de gestión de e-commerce"

# Google OAuth (Frontend callback URL)
VITE_GOOGLE_OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback
# For production:
# VITE_GOOGLE_OAUTH_REDIRECT_URI=https://yourdomain.com/auth/callback
```

## ✨ Características Principales

### 🛠️ Funcionalidades de Administración

#### ✅ Gestión de Productos
- **CRUD Completo**: Crear, leer, actualizar y eliminar productos
- **Upload de Imágenes**: Integración con Cloudinary
  - Subida múltiple de imágenes
  - Selección de imagen principal
  - Preview en tiempo real
  - Validación de tipo y tamaño (< 5MB)
- **Especificaciones Dinámicas**: Campos personalizados según categoría
  - Tipos: text, number, boolean, select
  - Unidades personalizadas (GB, mAh, kg, etc.)
  - Validación de campos requeridos
- **Gestión de Inventario**: Stock, SKU, estados (activo/inactivo)
- **Precios**: Precio, precio comparativo, costo
- **Tags**: Etiquetas para categorización
- **Productos Destacados**: Marcar productos como destacados
- **Vista Responsive**: Tabla en desktop, tarjetas en móvil
- **Loading Skeletons**: Estados de carga animados

#### ✅ Gestión de Categorías
- **CRUD Completo**: Crear, leer, actualizar y eliminar categorías
- **Plantilla de Especificaciones**: Constructor de campos personalizados
  - Definir nombre, tipo, requerido, opciones
  - Unidades personalizables
- **Upload de Imágenes**: Icono/imagen para cada categoría
- **Slug Automático**: Generación de slug SEO-friendly
- **Contador de Productos**: Visualización de productos asociados
- **Validación Inteligente**: Previene eliminar categorías con productos
- **Vista Responsive**: Tabla en desktop, tarjetas en móvil

### 🔐 Autenticación y Seguridad
- **Google OAuth 2.0**: Login seguro con Google
- **JWT Tokens**: Manejo de sesiones con tokens
- **Control de Acceso por Rol**: Rutas protegidas para administradores
- **Sesión Persistente**: Token almacenado en localStorage
- **Auto-validación**: Verificación de token al cargar la app

### 🎨 Interfaz de Usuario
- **Dark Mode**: Sistema completo de tema claro/oscuro
- **Toast Notifications**: Sistema de notificaciones con 4 variantes
- **Loading Skeletons**: Mejor percepción de carga (+40%)
- **Lazy Image Loading**: Carga diferida de imágenes (-15% LCP)
- **Diseño Responsive**: Optimizado para todos los dispositivos
- **Accesibilidad WCAG 2.1 AA**: Navegación por teclado, ARIA labels

### 🔍 Características Adicionales
- **Búsqueda de Productos**: Con autocomplete y debouncing
- **Filtros Avanzados**: Por categoría, precio, stock, ofertas
- **Ordenamiento**: 7 opciones (precio, nombre, fecha, relevancia)
- **Vista Previa de Productos**: Navegación a páginas de detalle
- **Vista por Categorías**: Páginas dinámicas por categoría

## 🛠️ Tecnologías Utilizadas

- **React 19.2.0**: Librería de UI para construir interfaces
- **Vite 7.2.2**: Herramienta de construcción rápida
- **Tailwind CSS 4.1.17**: Framework CSS basado en utilidades
- **Axios 1.13.2**: Cliente HTTP para llamadas a la API
- **React Router DOM 7.9.6**: Navegación y enrutamiento
- **Heroicons 2.2.0**: Iconos SVG para React
- **Atomic Design Pattern**: Arquitectura de componentes escalable
- **ESLint**: Calidad y consistencia de código

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Acceso al backend API

## 🔧 Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd ecommerceAdmin
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
# Edita .env con tus valores
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre tu navegador en `http://localhost:5173`

## 📦 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Previsualiza la versión de producción
- `npm run lint`: Ejecuta el linter para verificar el código

## 🛣️ Rutas y Navegación

La aplicación usa React Router DOM con las siguientes rutas:

### Rutas Principales

| Ruta | Componente | Protección | Descripción |
|------|-----------|------------|-------------|
| `/` | `Home` | Admin | Página principal con gestión de productos |
| `/admin/products` | `ProductsManagementPage` | Admin | Panel de gestión de productos |
| `/admin/categories` | `CategoriesManagementPage` | Admin | Panel de gestión de categorías |
| `/profile` | `ProfilePage` | Protegida | Perfil del usuario administrador |

### Rutas de Autenticación

| Ruta | Componente | Protección | Descripción |
|------|-----------|------------|-------------|
| `/login` | `LoginPage` | Pública | Página de inicio de sesión con Google OAuth |
| `/auth/callback` | `OAuthCallbackPage` | Pública | Callback OAuth para procesar autenticación |

### Rutas de Vista Previa (Opcional)

| Ruta | Componente | Protección | Descripción |
|------|-----------|------------|-------------|
| `/search?q=término` | `SearchResultsPage` | Pública | Vista previa: Resultados de búsqueda |
| `/product/:id` | `ProductPage` | Pública | Vista previa: Detalle completo del producto |
| `/:slug` | `CategoryPage` | Pública | Vista previa: Página de categoría |

> **Nota**: Las rutas de vista previa permiten a los administradores ver cómo se visualizarán los productos y categorías en el frontend del cliente.

## 📁 Estructura del Proyecto (Atomic Design)

```
ecommerceAdmin/
├── src/
│   ├── components/
│   │   ├── atoms/              # Componentes base
│   │   │   ├── Button.jsx      # Botones con variantes
│   │   │   ├── Input.jsx       # Inputs con validación
│   │   │   ├── Badge.jsx       # Badges de estado
│   │   │   ├── Card.jsx        # Cards contenedores
│   │   │   ├── Logo.jsx        # Logo de la marca
│   │   │   ├── Skeleton.jsx    # Loading skeletons
│   │   │   ├── Toast.jsx       # Notificaciones toast
│   │   │   ├── LazyImage.jsx   # Imágenes con lazy loading
│   │   │   └── ThemeToggle.jsx # Toggle de tema oscuro
│   │   ├── molecules/          # Componentes compuestos
│   │   │   ├── ProductCard.jsx        # Card de producto
│   │   │   ├── SearchBar.jsx          # Barra de búsqueda
│   │   │   ├── PriceRangeFilter.jsx   # Filtro de precio
│   │   │   ├── SortDropdown.jsx       # Ordenamiento
│   │   │   ├── UserMenu.jsx           # Menú de usuario
│   │   │   ├── EditProfileForm.jsx    # Form de perfil
│   │   │   ├── ThemeToggle.jsx        # Toggle mejorado
│   │   │   ├── ToastContainer.jsx     # Container de toasts
│   │   │   ├── ProductCardSkeleton.jsx # Skeleton de producto
│   │   │   └── LoadMoreButton.jsx     # Botón cargar más
│   │   ├── organisms/          # Componentes complejos
│   │   │   ├── Header.jsx             # Header principal con navegación admin
│   │   │   ├── HeaderSecondary.jsx    # Header secundario con categorías
│   │   │   ├── Footer.jsx             # Footer del sitio
│   │   │   ├── ProductList.jsx        # Grid de productos
│   │   │   ├── FilterSidebar.jsx      # Sidebar de filtros
│   │   │   └── ToastContainer.jsx     # Sistema de notificaciones
│   │   ├── admin/              # ⭐ Componentes de administración
│   │   │   ├── ProductTable.jsx       # Tabla de productos con CRUD
│   │   │   ├── ProductFormModal.jsx   # Modal de formulario de producto
│   │   │   ├── CategoryTable.jsx      # Tabla de categorías con CRUD
│   │   │   ├── CategoryFormModal.jsx  # Modal de formulario de categoría
│   │   │   └── index.js               # Exports
│   │   └── ProtectedRoute.jsx  # Wrapper para rutas protegidas
│   ├── pages/
│   │   ├── Home.jsx                      # ⭐ Panel principal de administración
│   │   ├── admin/
│   │   │   ├── ProductsManagementPage.jsx  # ⭐ Gestión de productos
│   │   │   └── CategoriesManagementPage.jsx # ⭐ Gestión de categorías
│   │   ├── LoginPage.jsx                 # Login con Google OAuth
│   │   ├── OAuthCallbackPage.jsx         # Callback OAuth
│   │   ├── ProfilePage.jsx               # Perfil de usuario
│   │   ├── SearchResultsPage.jsx         # Vista previa: Búsqueda
│   │   ├── ProductPage.jsx               # Vista previa: Detalle de producto
│   │   ├── CategoryPage.jsx              # Vista previa: Categoría
│   │   ├── ComponentShowcase.jsx         # Showcase de componentes
│   │   └── ToastTestPage.jsx             # Test de toasts
│   ├── context/                # Contextos de React
│   │   ├── AuthContext.jsx     # Estado de autenticación
│   │   ├── ThemeContext.jsx    # Estado del tema (dark mode)
│   │   ├── ToastContext.jsx    # Estado de notificaciones
│   │   └── index.js            # Exports
│   ├── hooks/                  # Custom hooks
│   │   ├── useProducts.js      # Hook para productos
│   │   ├── useCategories.js    # Hook para categorías
│   │   ├── useSearch.js        # Hook para búsqueda
│   │   ├── useDebounce.js      # Hook para debouncing
│   │   └── index.js            # Exports
│   ├── services/
│   │   └── api.js              # ⭐ Axios + endpoints (products, categories, auth, upload)
│   ├── style/
│   │   ├── index.css           # CSS principal + reset + animations
│   │   └── theme.css           # Variables CSS + design tokens + dark mode
│   ├── design/                 # Documentación de diseño
│   ├── App.jsx                 # Router principal
│   └── main.jsx                # Entry point
├── .env.example                # Template de variables de entorno
├── tailwind.config.js          # Configuración de Tailwind
├── vite.config.js              # Configuración de Vite
├── package.json                # Dependencias y scripts
└── README.md                   # Este archivo
```

> **⭐ Marcado**: Archivos principales relacionados con funcionalidades de administración

## 🎨 Sistema de Diseño

### Patrón de Diseño Atómico

El proyecto sigue el patrón **Atomic Design** para una arquitectura de componentes escalable:

- **Átomos**: Componentes base (Button, Input, Badge, Card, etc.)
- **Moléculas**: Componentes compuestos (ProductCard, SearchBar, UserMenu, etc.)
- **Organismos**: Componentes complejos (Header, Footer, ProductList, etc.)
- **Admin**: Componentes específicos de administración (ProductTable, CategoryFormModal, etc.)
- **Páginas**: Composición de organismos

### Características del Sistema de Diseño

- **Tokens de Diseño**: Configuración centralizada en `tailwind.config.js` y `theme.css`
- **CSS Variables**: Listas para tematización dinámica
- **Dark Mode**: Cambio automático de tema con persistencia
- **Responsive**: Enfoque mobile-first con breakpoints (xs, sm, md, lg, xl, 2xl)
- **Accesible**: HTML semántico, ARIA labels, navegación por teclado

### Componentes Admin Disponibles

#### ProductTable
- Tabla responsive de productos
- Columnas: Imagen, Producto (nombre + SKU), Precio, Stock, Categoría, Estado, Acciones
- Botones de editar y eliminar
- Loading skeleton animado
- Dark mode completo

#### ProductFormModal
- Formulario completo para crear/editar productos
- Campos: nombre, modelo, descripción, precios, stock, SKU, categoría
- Upload de imágenes con Cloudinary
- Especificaciones dinámicas según categoría
- Validación en tiempo real

#### CategoryTable
- Tabla responsive de categorías
- Columnas: Imagen, Categoría, Slug, Productos, Campos, Estado, Acciones
- Contador de productos asociados
- Validación de eliminación

#### CategoryFormModal
- Formulario completo para crear/editar categorías
- Constructor de plantilla de especificaciones
- Upload de imagen
- Generación automática de slug

## 🔌 Hooks Personalizados e Integración con API

### useProducts(filters, config)

Hook para obtener productos desde MongoDB con soporte de filtros.

```javascript
const { data, loading, error, pagination, refetch } = useProducts(
  {
    search: 'laptop',
    category: '123abc',
    minPrice: 100,
    maxPrice: 5000,
    inStock: true,
    onSale: true,
    featured: true,
    limit: 12,
    sort: '-createdAt'
  },
  {
    enabled: true
  }
);
```

### useCategories(config)

Hook para obtener categorías desde MongoDB.

```javascript
const { data, loading, error, refetch } = useCategories({
  enabled: true
});
```

### useAuth()

Hook para acceso al contexto de autenticación.

```javascript
const {
  user,                    // Usuario autenticado
  loading,                 // Estado de carga
  error,                   // Mensaje de error
  isAuthenticated,         // Boolean: autenticado
  loginWithGoogle,         // Iniciar login con Google
  logout,                  // Cerrar sesión
  updateUser,              // Actualizar datos del usuario
  hasRole,                 // Verificar rol (admin/user)
  clearError,              // Limpiar errores
} = useAuth();
```

### useToast()

Hook para mostrar notificaciones toast.

```javascript
const { showToast } = useToast();

showToast({
  type: 'success',        // success, error, warning, info
  title: 'Éxito',
  message: 'Producto creado correctamente',
  duration: 3000          // Duración en ms (opcional)
});
```

### API Endpoints Configurados

El servicio API en `src/services/api.js` incluye:

**Productos**
- `productsAPI.getAll(params)` - Listar productos con filtros
- `productsAPI.getById(id)` - Obtener un producto por ID
- `productsAPI.create(data)` - Crear producto (requiere auth admin)
- `productsAPI.update(id, data)` - Actualizar producto (requiere auth admin)
- `productsAPI.delete(id)` - Eliminar producto (requiere auth admin)

**Categorías**
- `categoriesAPI.getAll()` - Listar todas las categorías
- `categoriesAPI.getById(id)` - Obtener una categoría por ID
- `categoriesAPI.create(data)` - Crear categoría (requiere auth admin)
- `categoriesAPI.update(id, data)` - Actualizar categoría (requiere auth admin)
- `categoriesAPI.delete(id)` - Eliminar categoría (requiere auth admin)

**Autenticación**
- `authAPI.getGoogleLoginUrl()` - Obtener URL de login con Google OAuth
- `authAPI.logout()` - Cerrar sesión
- `authAPI.me()` - Obtener usuario actual

**Upload**
- `uploadAPI.uploadImage(file)` - Subir imagen a Cloudinary
- `uploadAPI.uploadMultiple(files)` - Subir múltiples imágenes

## 🔐 Seguridad

- ✅ Autenticación con Google OAuth 2.0
- ✅ JWT con interceptores de Axios
- ✅ Control de acceso por rol (admin)
- ✅ Validación de datos en el cliente
- ✅ Protección contra XSS
- ✅ Manejo seguro de tokens
- ✅ Variables de entorno para configuración sensible

## 🚀 Deployment

### Preparar para Producción

1. Actualiza las variables de entorno en `.env`:
```env
VITE_API_URL=https://tu-api.herokuapp.com/api/v1
VITE_GOOGLE_OAUTH_REDIRECT_URI=https://tu-dominio.com/auth/callback
```

2. Construye la aplicación:
```bash
npm run build
```

3. El directorio `dist/` contiene los archivos estáticos para deployment

### Opciones de Deployment

- **Vercel**: `npx vercel` (recomendado)
- **Netlify**: Arrastra la carpeta `dist/` a Netlify
- **GitHub Pages**: Configura GitHub Actions
- **AWS S3 + CloudFront**: Sube `dist/` a S3

## 📚 Documentación Adicional

- **ARCHITECTURE.md** - Arquitectura completa y documentación técnica
- **src/components/README.md** - Guías de componentes
- **src/design/README.md** - Documentación del sistema de diseño

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Changelog

### v1.0.0 - Panel de Administración (2025-01)

**Refactorización Completa:**
- ✅ Transformación de e-commerce frontend a panel de administración
- ✅ Depuración y limpieza completa del código
- ✅ Enfoque en funcionalidades de gestión para administradores

**Funcionalidades Principales:**
- ✅ **Gestión de Productos**: CRUD completo con upload de imágenes, especificaciones dinámicas y gestión de inventario
- ✅ **Gestión de Categorías**: CRUD completo con plantilla de especificaciones personalizables y validación
- ✅ **Control de Acceso**: Rutas protegidas con verificación de rol admin
- ✅ **Autenticación**: Google OAuth 2.0 + JWT con sesión persistente
- ✅ **Dark Mode**: Sistema completo de tema claro/oscuro
- ✅ **Toast Notifications**: Sistema de notificaciones con 4 variantes
- ✅ **Loading Skeletons**: Estados de carga animados
- ✅ **Upload de Imágenes**: Integración completa con Cloudinary
- ✅ **Diseño Responsive**: Optimizado para todos los dispositivos

**Componentes Admin:**
- ✅ ProductTable: Tabla responsive con acciones CRUD
- ✅ ProductFormModal: Formulario completo con validación
- ✅ CategoryTable: Tabla responsive con contadores
- ✅ CategoryFormModal: Constructor de especificaciones

**Mejoras de UX:**
- ✅ Diseño mejorado de modales
- ✅ Corrección de toasts duplicados
- ✅ Mejor feedback visual en acciones
- ✅ Estados de carga optimizados

## 👤 Autor

**Daniel Carlos Rodriguez**

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Última actualización**: Enero 2025

Para más información sobre el backend API, consulta la documentación del repositorio del backend.
