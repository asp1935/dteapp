import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import uiReducer from '../features/ui/uiSlice';
import userReducer from '../features/user/userSlice';
import institutionReducer from '../features/admin/institutionSlice';
import facultyReducer from '../features/principal/facultySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    user: userReducer,
    institutions: institutionReducer,
    faculty: facultyReducer,
  },
});

export default store;
