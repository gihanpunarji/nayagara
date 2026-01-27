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

export const getAdminSellers = async ({ page = 1, limit = 25, search = '', status = 'all' } = {}) => {
    try {
        const response = await api.get('/admin/sellers', {
            params: { page, limit, search, status }
        });
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

export const getAdminProducts = async ({ page = 1, limit = 25, search = '', status = 'all', category = 'all', sellerId = null }) => {
    try {
        const response = await api.get('/admin/products', {
            params: { page, limit, search, status, category, sellerId }
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

export const updateProductStatus = async (productId, status) => {
    try {
        const response = await api.patch(`/admin/products/${productId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating product status:', error.response?.data || error.message);
        throw error.response?.data || { message: 'An unknown error occurred' };
    }
};

export const updateUserStatus = async (userId, status) => {
    try {
        const response = await api.patch(`/admin/users/${userId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating user status:', error.response?.data || error.message);
        throw error.response?.data || { message: 'An unknown error occurred' };
    }
};

export const deleteProduct = async (productId) => {
    try {
        const response = await api.delete(`/admin/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error.response?.data || error.message);
        throw error.response?.data || { message: 'An unknown error occurred' };
    }
};
