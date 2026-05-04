import api from './api';

const attendanceService = {
  /**
   * Fetch timetable for a faculty
   */
  getTimetable: async (facultyCredentialId, academicYear) => {
    const response = await api.get(`/attendance/timetable/${facultyCredentialId}`, {
      params: { academic_year: academicYear }
    });
    return response.data;
  },

  /**
   * Fetch attendance logs
   */
  getLogs: async (params) => {
    const response = await api.get('/attendance/logs', { params });
    return response.data;
  },

  /**
   * Create a single lecture log
   */
  createLog: async (logData) => {
    const response = await api.post('/attendance/logs', logData);
    return response.data;
  },

  /**
   * Update an existing log
   */
  updateLog: async (logId, logData) => {
    const response = await api.put(`/attendance/logs/${logId}`, logData);
    return response.data;
  },

  /**
   * Submit a log for verification
   */
  submitLog: async (logId) => {
    const response = await api.post(`/attendance/logs/${logId}/submit`);
    return response.data;
  },

  /**
   * Verify or reject a log (Principal only)
   */
  verifyLog: async (logId, action, remarks) => {
    const response = await api.post(`/attendance/logs/${logId}/verify`, {
      action,
      remarks
    });
    return response.data;
  },

  /**
   * Bulk submit logs for verification
   */
  bulkSubmit: async (logIds) => {
    const response = await api.post('/attendance/logs/bulk-submit', {
      log_ids: logIds
    });
    return response.data;
  },

  /**
   * Upsert calendar entries (Admin/Principal)
   */
  upsertCalendar: async (institutionId, academicYear, entries) => {
    const response = await api.post('/attendance/calendar', {
      institution_id: institutionId,
      academic_year: academicYear,
      entries: entries // Array of { calendar_date, day_type, description }
    });
    return response.data;
  },

  /**
   * Fetch calendar entries
   */
  getCalendar: async (institutionId, academicYear, month) => {
    const response = await api.get('/attendance/calendar', {
      params: { institution_id: institutionId, academic_year: academicYear, month }
    });
    return response.data;
  },

  /**
   * Fetch attendance anomalies (Admin/Principal)
   */
  getAnomalies: async (params) => {
    const response = await api.get('/attendance/anomalies', { params });
    return response.data;
  },

  /**
   * Acknowledge an attendance anomaly (Principal only)
   */
  acknowledgeAnomaly: async (anomalyId, remarks) => {
    const response = await api.post(`/attendance/anomalies/${anomalyId}/acknowledge`, {
      remarks
    });
    return response.data;
  },

  /**
   * Get monthly summary for dashboard
   */
  getMonthlySummary: async (facultyCredentialId, academicYear, month) => {
    const response = await api.get('/attendance/logs/summary', {
      params: { faculty_credential_id: facultyCredentialId, academic_year: academicYear, month }
    });
    return response.data;
  }
};

export default attendanceService;
