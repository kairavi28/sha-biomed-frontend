import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://biomedwaste.net/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  create: (product) => api.post('/products', product),
  createMany: (products) => api.post('/products/bulk', { products }),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
};

export const quotesAPI = {
  getAll: () => api.get('/quotes'),
  getById: (id) => api.get(`/quotes/${id}`),
  create: (quoteData) => api.post('/quotes', quoteData),
  updateStatus: (id, status) => api.patch(`/quotes/${id}/status`, { status }),
  delete: (id) => api.delete(`/quotes/${id}`),
};

export const cartAPI = {
  get: (sessionId) => api.get(`/cart/${sessionId}`),
  addItem: (sessionId, product, quantity) => api.post(`/cart/${sessionId}/add`, { product, quantity }),
  updateItem: (sessionId, productId, quantity) => api.put(`/cart/${sessionId}/item/${productId}`, { quantity }),
  removeItem: (sessionId, productId) => api.delete(`/cart/${sessionId}/item/${productId}`),
  clear: (sessionId) => api.delete(`/cart/${sessionId}`),
};

export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
