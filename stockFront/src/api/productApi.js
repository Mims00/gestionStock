import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/products';

export const getProducts = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch products');
    }
};

export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        console.log('Fetched Products:', response.data); 
        return response.data;
        
    } catch (error) {
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to create product:', error);
        throw error;
    }
};
export const updateProduct = async (id, productData) => {
    try {
        await axios.put(`${API_BASE_URL}/${id}`, productData);
    } catch (error) {
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
        throw error;
    }
};
export const getProductTrends = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/trends`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product trends:', error);
        throw error;
    }
};