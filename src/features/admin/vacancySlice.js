import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { institutionService } from '../../services/institutionService';

export const fetchVacancyAssessment = createAsyncThunk(
  'vacancy/fetchAssessment',
  async (params, { rejectWithValue }) => {
    try {
      return await institutionService.getVacancyAssessment(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacancy assessment');
    }
  }
);

const vacancySlice = createSlice({
  name: 'vacancy',
  initialState: {
    assessment: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAssessment: (state) => {
      state.assessment = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVacancyAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVacancyAssessment.fulfilled, (state, action) => {
        state.loading = false;
        state.assessment = action.payload;
      })
      .addCase(fetchVacancyAssessment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAssessment } = vacancySlice.actions;
export default vacancySlice.reducer;
