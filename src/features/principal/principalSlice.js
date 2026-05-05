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
      });
  },
});

export default principalSlice.reducer;
