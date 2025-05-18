import axios from "axios";

// Usar la variable de entorno para la URL base
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
// Usar la variable de entorno para el timeout
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

const api = axios.create({
  baseURL: API_BASE,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token incluido en solicitud:", config.url); // Debug log
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores comunes de respuesta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el token expiró, redirigir al login
    if (error.response && error.response.status === 401) {
      console.log("Sesión expirada, redirigiendo a login...");
      // Limpiar el almacenamiento
      localStorage.removeItem("token");

      // Redirigir solo si no estamos ya en la página de login/register
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
