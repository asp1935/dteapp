import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import uiReducer from '../features/ui/uiSlice';
import userReducer from '../features/user/userSlice';
import institutionReducer from '../features/admin/institutionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    user: userReducer,
    institutions: institutionReducer,
  },
});

export default store;
