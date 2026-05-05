import api from './api';

const principalService = {
  getDashboardData: async () => {
    const response = await api.get('/principal/dashboard');
    return response.data;
  },
};

export default principalService;
