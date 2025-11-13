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

export const getAdminDashboardData = async () => {
    try {
        const response = await api.get('/admin/dashboard');
        return response.data;
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error.response?.data || error.message);
        throw error.response?.data || { message: 'An unknown error occurred' };
    }
};
