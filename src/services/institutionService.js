import api from './api';

export const getInstitutions = async (page = 1, limit = 10) => {
  const response = await api.get(`/requirements/institutions?page=${page}&limit=${limit}`);
  return response.data;
};

export const createInstitution = async (institutionData) => {
  const response = await api.post('/requirements/institutions', institutionData);
  return response.data;
};

export const updateInstitution = async (id, institutionData) => {
  const response = await api.patch(`/requirements/institutions/${id}`, institutionData);
  return response.data;
};

export const deleteInstitution = async (id) => {
  const response = await api.delete(`/requirements/institutions/${id}`);
  return response.data;
};

export const createIntake = async (intakeData) => {
  const response = await api.post('/requirements/intake', intakeData);
  return response.data;
};

export const institutionService = {
  getInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
  createIntake,
};
