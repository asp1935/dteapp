import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import principalService from '../../services/principalService';

export const fetchDashboardData = createAsyncThunk(
  'principal/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      return await principalService.getDashboardData();
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const setInstituteLocation = createAsyncThunk(
  'principal/setLocation',
  async ({ latitude, longitude }, { rejectWithValue }) => {
    try {
      return await principalService.setInstituteLocation(latitude, longitude);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const principalSlice = createSlice({
  name: 'principal',
  initialState: {
    dashboardData: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(setInstituteLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(setInstituteLocation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(setInstituteLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default principalSlice.reducer;
