import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Real API login
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password, role }, { rejectWithValue }) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const data = response.data;

      // The API response user object structure: { access_token, user: { role, ... } }
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('user_role', data.user.role);
      localStorage.setItem('user_data', JSON.stringify(data.user));

      return { user: data.user, token: data.access_token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Fetch current user profile
export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      const data = response.data;

      localStorage.setItem('user_role', data.role);
      localStorage.setItem('user_data', JSON.stringify(data));

      return data;
    } catch (error) {
      // 401 is handled by axios interceptor (clears localStorage and redirects)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('user_data')) || null,
  token: localStorage.getItem('auth_token') || null,
  role: localStorage.getItem('user_role') || null,
  isAuthenticated: !!localStorage.getItem('auth_token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_data');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.role = action.payload.role;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.role = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
