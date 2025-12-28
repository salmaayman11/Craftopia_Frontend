/**
 * Centralized API helper for making HTTP requests
 * 
 * Uses VITE_API_URL environment variable for base URL
 * Automatically attaches Authorization token from localStorage
 * Handles JSON headers and error responses
 */

const getBaseURL = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:3000';
};

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const getHeaders = (customHeaders = {}, isFormData = false) => {
  const headers = { ...customHeaders };
  
  // Don't set Content-Type for FormData - browser will set it with boundary
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  // Attach Authorization token if it exists
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

const handleResponse = async (response) => {
  // Check if response is ok
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  
  // Handle empty responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
};

/**
 * Make a GET request
 * @param {string} endpoint - Relative endpoint (e.g., '/product/get')
 * @param {object} options - Additional fetch options
 * @returns {Promise} Response data
 */
export const apiGet = async (endpoint, options = {}) => {
  const url = `${getBaseURL()}${endpoint}`;
  const headers = getHeaders(options.headers || {});
  
  const response = await fetch(url, {
    method: 'GET',
    headers,
    credentials: 'include',
    ...options,
  });
  
  return handleResponse(response);
};

/**
 * Make a POST request
 * @param {string} endpoint - Relative endpoint (e.g., '/auth/login')
 * @param {object|FormData} data - Request body (object for JSON, FormData for file uploads)
 * @param {object} options - Additional fetch options
 * @returns {Promise} Response data
 */
export const apiPost = async (endpoint, data = null, options = {}) => {
  const url = `${getBaseURL()}${endpoint}`;
  const isFormData = data instanceof FormData;
  const headers = getHeaders(options.headers || {}, isFormData);
  
  const body = isFormData ? data : (data ? JSON.stringify(data) : null);
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
    ...options,
  });
  
  return handleResponse(response);
};

/**
 * Make a PUT request
 * @param {string} endpoint - Relative endpoint
 * @param {object} data - Request body
 * @param {object} options - Additional fetch options
 * @returns {Promise} Response data
 */
export const apiPut = async (endpoint, data = null, options = {}) => {
  const url = `${getBaseURL()}${endpoint}`;
  const headers = getHeaders(options.headers || {});
  
  const body = data ? JSON.stringify(data) : null;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body,
    ...options,
  });
  
  return handleResponse(response);
};

/**
 * Make a DELETE request
 * @param {string} endpoint - Relative endpoint
 * @param {object} options - Additional fetch options
 * @returns {Promise} Response data
 */
export const apiDelete = async (endpoint, options = {}) => {
  const url = `${getBaseURL()}${endpoint}`;
  const headers = getHeaders(options.headers || {});
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers,
    ...options,
  });
  
  return handleResponse(response);
};

/**
 * Axios-compatible API object for easier migration
 * Provides similar API to axios for drop-in replacement
 */
export const api = {
  get: (endpoint, config = {}) => {
    return apiGet(endpoint, config);
  },
  post: (endpoint, data, config = {}) => {
    return apiPost(endpoint, data, config).then(response => ({ data: response }));
  },
  put: (endpoint, data, config = {}) => {
    return apiPut(endpoint, data, config).then(response => ({ data: response }));
  },
  delete: (endpoint, config = {}) => {
    return apiDelete(endpoint, config).then(response => ({ data: response }));
  },
};

export default api;

