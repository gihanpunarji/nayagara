import api from './axios';

export const getAdminCustomers = async () => {
    try {
        const response = await api.get('/admin/customers');
        return response.data;
    } catch (error) {
        console.error('Error fetching admin customers:', error.response?.data || error.message);
        throw error.response?.data || { message: 'An unknown error occurred' };
    }
};

export const getAdminSellers = async () => {
    try {
        const response = await api.get('/admin/sellers');
        return response.data;
    } catch (error) {
        console.error('Error fetching admin sellers:', error.response?.data || error.message);
        throw error.response?.data || { message: 'An unknown error occurred' };
    }
};

export const getAdminDashboardData = async () => {
    try {
        const response = await api.get('/admin/dashboard');
        return response.data;
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error.response?.data || error.message);
        throw error.response?.data || { message: 'An unknown error occurred' };
    }
};

export const getAdminProducts = async ({ page = 1, limit = 25 }) => {
    try {
        const response = await api.get('/products/public', {
            params: { page, limit }
        });
        // The API returns an object with 'data' (the products) and 'pagination'
        return response.data;
    } catch (error) {
        console.error('Error fetching admin products:', error.response?.data || error.message);
        throw error.response?.data || { message: 'An unknown error occurred' };
    }
};

export const getAdminOrders = async ({ page = 1, limit = 25 }) => {
    try {
        const response = await api.get('/admin/orders', {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching admin orders:', error.response?.data || error.message);
        throw error.response?.data || { message: 'An unknown error occurred' };
    }
};

export const getAdminCategories = async () => {
    try {
        const response = await api.get('/admin/categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching admin categories:', error.response?.data || error.message);
        throw error.response?.data || { message: 'An unknown error occurred' };
    }
};
