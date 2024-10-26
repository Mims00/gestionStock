import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users';

// Configurer un intercepteur d'erreur global
axios.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response ? error.response.data : error.message);
        return Promise.reject(error);
    }
);

// Ajouter un utilisateur
export const addUser = async (userData) => {
    try {
        const response = await axios.post(API_URL, userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message);
    }
};

// Ajouter des informations d'identification
export const addCredentials = async (credentials) => {
    try {
        const response = await axios.put(`${API_URL}/credentials`, credentials);
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message);
    }
};

export const updateUser = async (userId, updatedUser) => {
    const response = await axios.put(`http://localhost:3000/api/users/${userId}`, updatedUser);
    return response.data; // Assurez-vous que vous retournez les données mises à jour
};



// Supprimer un utilisateur
export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${API_URL}/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message);
    }
};

// Obtenir tous les utilisateurs
export const getUsers = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message);
    }
};

// Obtenir un utilisateur par ID
export const getUserById = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message);
    }
};
