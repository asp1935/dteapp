import api from './api';

const applicationService = {
  getApplications: async (params) => {
    const response = await api.get('/applications', { params });
    return response.data;
  },

  getApplicationDetails: async (applicationId) => {
    const response = await api.get(`/applications/${applicationId}`);
    return response.data;
  },

  getAISummary: async (applicationId) => {
    const response = await api.get(`/applications/${applicationId}/ai-summary`);
    return response.data;
  }
};

export default applicationService;
