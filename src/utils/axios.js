import axios from 'axios';

// Definir la URL base para todas las peticiones
const baseURL = 'http://localhost:8000';
axios.defaults.baseURL = baseURL;

// Interceptor para añadir el token a todas las solicitudes
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axios; 