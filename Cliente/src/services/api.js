import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:3000/api', // Asegurando protocolo HTTPS
});

// Interceptor para agregar el token JWT en cada petición protegida
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
