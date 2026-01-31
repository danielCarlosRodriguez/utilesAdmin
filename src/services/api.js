/**
 * API Service - Centralized HTTP client for backend communication
 *
 * Features:
 * - Axios wrapper with base URL configuration
 * - JWT token interceptors
 * - Centralized error handling
 * - Request/Response logging
 * - Automatic token refresh
 */

import axios from 'axios';

// Base URL from environment variables
const BASE_URL = import.meta.env.VITE_API_URL || 'https://ecommerceback-oq23.onrender.com/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== REQUEST INTERCEPTOR =====
// Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    // Add token to headers if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// ===== RESPONSE INTERCEPTOR =====
// Handle responses and errors
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    // Return the response data directly
    return response.data;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      // Log error in development
      if (import.meta.env.DEV) {
        console.error(`[API Error] ${status}:`, {
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          message: data?.message || error.message,
          errors: data?.errors,
          requestData: error.config?.data ? JSON.parse(error.config.data) : null
        });
      }

      // Handle specific error codes
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.dispatchEvent(new CustomEvent('auth:logout'));
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.warn('Access forbidden:', data?.message);
          break;

        case 404:
          // Not found
          console.warn('Resource not found:', error.config?.url);
          break;

        case 429:
          // Too many requests - rate limit
          console.warn('Rate limit exceeded. Please try again later.');
          break;

        case 500:
        case 502:
        case 503:
          // Server errors
          console.error('Server error. Please try again later.');
          break;

        default:
          console.error('API error:', data?.message || error.message);
      }

      // Return formatted error
      return Promise.reject({
        status,
        message: data?.message || 'An error occurred',
        errors: data?.errors || [],
        requestId: data?.requestId,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('[API Network Error] No response received:', error.message);
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        errors: [],
      });
    } else {
      // Error in request configuration
      console.error('[API Configuration Error]', error.message);
      return Promise.reject({
        status: 0,
        message: error.message,
        errors: [],
      });
    }
  }
);


// ===== API ENDPOINTS =====

/**
 * Authentication endpoints
 */
export const authAPI = {
  // Get current user
  me: () => api.get('/auth/me'),

  // Logout
  logout: () => api.post('/auth/logout'),

  // Google OAuth login URL
  getGoogleLoginUrl: () => `${BASE_URL}/auth/google`,
};

/**
 * Products endpoints
 */
export const productsAPI = {
  // Get all products with filters
  getAll: (params) => api.get('/products', { params }),

  // Get single product by ID or slug
  getById: (id) => api.get(`/products/${id}`),

  // Create product (admin only)
  create: (data) => api.post('/products', data),

  // Update product (admin only)
  update: (id, data) => api.put(`/products/${id}`, data),

  // Delete product (admin only)
  delete: (id) => api.delete(`/products/${id}`),
};

/**
 * Categories endpoints
 */
export const categoriesAPI = {
  // Get all categories
  getAll: () => api.get('/categories'),

  // Create category (admin only)
  create: (data) => api.post('/categories', data),

  // Update category (admin only)
  update: (id, data) => api.put(`/categories/${id}`, data),

  // Delete category (admin only)
  delete: (id) => api.delete(`/categories/${id}`),
};

/**
 * Cart endpoints
 */
export const cartAPI = {
  // Get cart
  get: () => api.get('/cart'),

  // Add item to cart
  addItem: (productId, quantity) =>
    api.post('/cart/items', { productId, quantity }),

  // Update item quantity
  updateItem: (productId, quantity) =>
    api.put(`/cart/items/${productId}`, { quantity }),

  // Remove item from cart
  removeItem: (productId) => api.delete(`/cart/items/${productId}`),

  // Clear cart
  clear: () => api.delete('/cart'),
};

/**
 * Orders endpoints
 */
export const ordersAPI = {
  // Get all user orders
  getAll: (params) => api.get('/orders', { params }),

  // Get single order
  getById: (id) => api.get(`/orders/${id}`),

  // Create order
  create: (data) => api.post('/orders', data),

  // Cancel order
  cancel: (id) => api.put(`/orders/${id}/cancel`),

  // Admin: Get all orders
  getAllAdmin: (params) => api.get('/orders/admin/all', { params }),

  // Admin: Update order status
  updateStatus: (id, status, trackingNumber) =>
    api.put(`/orders/${id}/status`, { status, trackingNumber }),
};

/**
 * Users endpoints
 */
export const usersAPI = {
  // Get all users
  getAll: () => api.get('/users'),

  // Get single user
  getById: (id) => api.get(`/users/${id}`),

  // Create user (admin only)
  create: (data) => api.post('/users', data),

  // Update user (admin only)
  update: (id, data) => api.put(`/users/${id}`, data),

  // Delete user (soft delete - admin only)
  delete: (id) => api.delete(`/users/${id}`),

  // Reactivate user (admin only)
  reactivate: (id) => api.put(`/users/${id}/reactivate`),

  // Admin: Get user bids
  getUserBids: (userId, params) => api.get(`/auctions/admin/user/${userId}/bids`, { params }),

  // Admin: Get user orders
  getUserOrders: (userId, params) => api.get(`/orders/admin/user/${userId}`, { params }),
};

/**
 * Upload endpoints
 */
export const uploadAPI = {
  // Upload single image
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Upload multiple images
  uploadImages: (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    return api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete image
  deleteImage: (publicId) =>
    api.delete(`/upload/image/${encodeURIComponent(publicId)}`),
};

/**
 * AI endpoints (Hugging Face)
 */
export const aiAPI = {
  // Generate product description
  generateDescription: (productName, category) =>
    api.post('/ai/generate-description', { productName, category }),

  // Generate SEO keywords
  generateKeywords: (productName, category) =>
    api.post('/ai/generate-keywords', { productName, category }),

  // Generate both description and keywords
  generateAll: (productName, category) =>
    api.post('/ai/generate-all', { productName, category }),
};

/**
 * Health check
 */
export const healthAPI = {
  check: () => axios.get(`${BASE_URL.replace('/api/v1', '')}/health`),
};


// ===== HELPER FUNCTIONS =====

/**
 * Set authentication token
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Get authentication token
 * @returns {string|null} JWT token
 */
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Clear authentication
 */
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete api.defaults.headers.common['Authorization'];
};


// Default export
export default api;
