import axios from 'axios';

const API_URL = 'http://localhost:3000/api/deliverers';

export const getDeliverers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createDeliverer = async (deliverer) => {
    const response = await axios.post(API_URL, deliverer);
    return response.data;
};

export const updateDeliverer = async (id, deliverer) => {
    const response = await axios.put(`${API_URL}/${id}`, deliverer);
    return response.data;
};

export const deleteDeliverer = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

export const getDelivererOrders = async (id) => {
    const response = await axios.get(`${API_URL}/${id}/order-list`);
    return response.data;
};
