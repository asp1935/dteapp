import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  settings: {},
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
});

export const { setProfile, updateSettings } = userSlice.actions;
export default userSlice.reducer;
