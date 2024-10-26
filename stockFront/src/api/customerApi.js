import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/customers';

export const getCustomers = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createCustomer = async (customer) => {
    try {
        const response = await axios.post(API_BASE_URL, customer);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCustomer = async (id, customer) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${id}`, customer);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteCustomer = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
        throw error;
    }
};
