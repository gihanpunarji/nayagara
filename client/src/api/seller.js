import api from './axios';

export const getSellerCustomers = async () => {
    try {
        const response = await api.get('/seller/customers');
        return response.data;
    } catch (error) {
        console.error('Error fetching seller customers:', error.response?.data || error.message);
        throw error.response?.data || { message: 'An unknown error occurred' };
    }
};

//changes

export const getSellerDashboardData = async () => {
    try {
        const response = await api.get('/seller/dashboard');
        return response.data;
    } catch (error) {
        console.error('Error fetching seller dashboard data:', error.response?.data || error.message);
        throw error.response?.data || { message: 'An unknown error occurred' };
    }
};

export const getSellerAnalytics = async (days = 30) => {
    try {
        const response = await api.get('/seller/analytics', {
            params: { days }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching seller analytics:', error.response?.data || error.message);
        throw error.response?.data || { message: 'An unknown error occurred' };
    }
};
