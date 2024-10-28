import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

// Configurer un intercepteur d'erreur global
axios.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response ? error.response.data : error.message);
        return Promise.reject(error);
    }
);

// Fonction de connexion (login)
export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}`, credentials);
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Erreur de connexion');
    }
};

// Fonction d'inscription (register) - si nécessaire
export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Erreur d\'inscription');
    }
};

// Fonction de déconnexion (si nécessaire)
export const logout = async () => {
    try {
        const response = await axios.post(`${API_URL}/logout`);
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Erreur de déconnexion');
    }
};
