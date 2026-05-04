import api from './api';

export const createApplication = async (applicationData) => {
  const response = await api.post('/applications', applicationData);
  return response.data;
};

export const uploadDocuments = async (applicationId, formData) => {
  const response = await api.post(`/applications/${applicationId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const submitApplication = async (applicationId, submissionData) => {
  const response = await api.post(`/applications/${applicationId}/submit`, submissionData);
  return response.data;
};

export const getApplications = async (params) => {
  const response = await api.get('/applications', { params });
  return response.data;
};

export const applicationService = {
  createApplication,
  uploadDocuments,
  submitApplication,
  getApplications,
};

export default applicationService;
