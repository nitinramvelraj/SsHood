import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserBasicInfo } from '../types/basicTypes';

interface UserState {
  basicInfo: UserBasicInfo | null;
  token: string | null;
}

const initialState: UserState = {
  basicInfo: null,
  token: localStorage.getItem('token'),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserBasicInfo>) => {
      state.basicInfo = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    clearUser: (state) => {
      state.basicInfo = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setUser, setToken, clearUser } = userSlice.actions;
export default userSlice.reducer;