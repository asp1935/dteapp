import api from './api';

export const getFacultyList = async (institutionId, courseId, academicYear, skip = 0, limit = 100) => {
  const response = await api.get(`/vacancies/faculty?institution_id=${institutionId}&course_id=${courseId}&academic_year=${academicYear}&skip=${skip}&limit=${limit}`);
  return response.data;
};

export const createFaculty = async (facultyData) => {
  const response = await api.post('/vacancies/faculty', facultyData);
  return response.data;
};

export const updateFaculty = async (id, facultyData) => {
  const response = await api.put(`/vacancies/faculty/${id}`, facultyData);
  return response.data;
};

export const deleteFaculty = async (id, reason) => {
  const response = await api.delete(`/vacancies/faculty/${id}?reason=${reason}`);
  return response.data;
};

export const vacancyService = {
  getFacultyList,
  createFaculty,
  updateFaculty,
  deleteFaculty,
};

export default vacancyService;
