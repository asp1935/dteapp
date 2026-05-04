import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import attendanceService from '../../services/attendanceService';
import { toast } from 'react-hot-toast';

export const fetchTimetable = createAsyncThunk(
  'attendance/fetchTimetable',
  async ({ facultyCredentialId, academicYear }, { rejectWithValue }) => {
    try {
      return await attendanceService.getTimetable(facultyCredentialId, academicYear);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchLogs = createAsyncThunk(
  'attendance/fetchLogs',
  async (params, { rejectWithValue }) => {
    try {
      return await attendanceService.getLogs(params);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createLog = createAsyncThunk(
  'attendance/createLog',
  async (logData, { rejectWithValue }) => {
    try {
      const response = await attendanceService.createLog(logData);
      toast.success('Lecture log created');
      return response;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create log');
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const submitLog = createAsyncThunk(
  'attendance/submitLog',
  async (logId, { rejectWithValue }) => {
    try {
      const response = await attendanceService.submitLog(logId);
      toast.success('Log submitted for verification');
      return { logId, ...response };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const bulkSubmit = createAsyncThunk(
  'attendance/bulkSubmit',
  async (logIds, { rejectWithValue }) => {
    try {
      const response = await attendanceService.bulkSubmit(logIds);
      toast.success(`Successfully submitted ${response.success_count} logs`);
      return response;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bulk submission failed');
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const verifyLog = createAsyncThunk(
  'attendance/verifyLog',
  async ({ logId, action, remarks }, { rejectWithValue }) => {
    try {
      const response = await attendanceService.verifyLog(logId, action, remarks);
      toast.success(`Log ${action.toLowerCase()} successfully`);
      return { logId, ...response };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const upsertCalendar = createAsyncThunk(
  'attendance/upsertCalendar',
  async ({ institutionId, academicYear, entries }, { rejectWithValue }) => {
    try {
      const response = await attendanceService.upsertCalendar(institutionId, academicYear, entries);
      toast.success('Calendar updated successfully');
      return response;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update calendar');
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchCalendar = createAsyncThunk(
  'attendance/fetchCalendar',
  async ({ institutionId, academicYear, month }, { rejectWithValue }) => {
    try {
      return await attendanceService.getCalendar(institutionId, academicYear, month);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchAnomalies = createAsyncThunk(
  'attendance/fetchAnomalies',
  async (params, { rejectWithValue }) => {
    try {
      return await attendanceService.getAnomalies(params);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const acknowledgeAnomaly = createAsyncThunk(
  'attendance/acknowledgeAnomaly',
  async ({ anomalyId, remarks }, { rejectWithValue }) => {
    try {
      const response = await attendanceService.acknowledgeAnomaly(anomalyId, remarks);
      toast.success('Anomaly acknowledged');
      return { anomalyId, ...response };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Acknowledgement failed');
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchMonthlySummary = createAsyncThunk(
  'attendance/fetchMonthlySummary',
  async ({ facultyCredentialId, academicYear, month }, { rejectWithValue }) => {
    try {
      return await attendanceService.getMonthlySummary(facultyCredentialId, academicYear, month);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    timetable: [],
    logs: [],
    calendar: [],
    anomalies: [],
    summary: null,
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {
    clearAttendanceState: (state) => {
      state.timetable = [];
      state.logs = [];
      state.calendar = [];
      state.anomalies = [];
      state.summary = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimetable.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTimetable.fulfilled, (state, action) => {
        state.loading = false;
        state.timetable = action.payload.data || action.payload;
      })
      .addCase(fetchTimetable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCalendar.fulfilled, (state, action) => {
        state.calendar = action.payload.data || action.payload;
      })
      .addCase(fetchAnomalies.fulfilled, (state, action) => {
        state.anomalies = action.payload.data || action.payload;
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.logs = action.payload.data || action.payload;
      })
      .addCase(fetchMonthlySummary.fulfilled, (state, action) => {
        state.summary = action.payload.data || action.payload;
      })
      .addCase(createLog.pending, (state) => {
        state.submitting = true;
      })
      .addCase(createLog.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(createLog.rejected, (state) => {
        state.submitting = false;
      });
  }
});

export const { clearAttendanceState } = attendanceSlice.actions;
export default attendanceSlice.reducer;
