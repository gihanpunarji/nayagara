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
