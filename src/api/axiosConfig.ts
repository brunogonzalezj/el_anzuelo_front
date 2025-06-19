// src/api/axiosConfig.ts
import axios from 'axios';
import { useStore } from '../store/useStore';
const token = localStorage.getItem('token');
const api = axios.create({
    baseURL: 'https://d538-189-28-70-112.ngrok-free.app/api', // Cambia esto a tu URL base
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Agrega el token de autorización si está disponible
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