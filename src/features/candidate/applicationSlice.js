import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applicationService } from '../../services/applicationService';

export const createApplication = createAsyncThunk(
  'application/create',
  async (data, { rejectWithValue }) => {
    try {
      return await applicationService.createApplication(data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create application');
    }
  }
);

export const uploadDocuments = createAsyncThunk(
  'application/uploadDocuments',
  async ({ applicationId, formData }, { rejectWithValue }) => {
    try {
      return await applicationService.uploadDocuments(applicationId, formData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload documents');
    }
  }
);

export const submitApplication = createAsyncThunk(
  'application/submit',
  async ({ applicationId, submissionData }, { rejectWithValue }) => {
    try {
      return await applicationService.submitApplication(applicationId, submissionData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit application');
    }
  }
);

const applicationSlice = createSlice({
  name: 'application',
  initialState: {
    currentApplication: null,
    loading: false,
    error: null,
    success: false,
    step: 1, // 1: Initial, 2: Documents, 3: Review/Submit
  },
  reducers: {
    resetApplicationState: (state) => {
      state.currentApplication = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.step = 1;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Application
      .addCase(createApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload.data;
        state.step = 2;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload Documents
      .addCase(uploadDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadDocuments.fulfilled, (state) => {
        state.loading = false;
        state.step = 3;
      })
      .addCase(uploadDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit Application
      .addCase(submitApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitApplication.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetApplicationState, setStep } = applicationSlice.actions;
export default applicationSlice.reducer;
