import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/orders';

export const getOrders = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch orders');
    }
};


export const createOrder = async (orderData) => {
    try {
        const response = await axios.post(API_BASE_URL, orderData);
        return response.data;
    } catch (error) {
        console.error('Failed to create order:', error);
        throw error;
    }
};

export const updateOrder = async (orderId, orderData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${orderId}`, orderData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const cancelOrder = async (orderId) => {
    try {
      const response=  await axios.patch(`${API_BASE_URL}/${orderId}/cancel`);
        return response.data
    } catch (error) {
        throw error;
    }
};

export const validateOrder = async (orderId) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/${orderId}/validate`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const deleteOrder = async (orderId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${orderId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const getOrdersByCustomer = async (customerId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/customer/${customerId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch orders for customer:', error);
        throw error;
    }
};
export const getOrderMetrics = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/metrics`); // Appel de la route metrics
        return response.data;
    } catch (error) {
        console.error('Failed to fetch order metrics:', error);
        throw error;
    }
};