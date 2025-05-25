// src/api/axiosConfig.ts
import axios from 'axios';
import { useStore } from '../store/useStore';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Cambia esto a tu URL base
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Verifica si el error es 401 (No autorizado) o 403 (Prohibido)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Obtén la función logout del store
            const logout = useStore.getState().logout;

            // Cierra la sesión del usuario
            logout();

            // Redirige al login (necesitarás configurar esto)
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;