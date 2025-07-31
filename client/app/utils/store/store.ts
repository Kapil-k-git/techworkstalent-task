
import { configureStore } from '@reduxjs/toolkit';

import { useDispatch } from 'react-redux';
import { authSlice } from '../slices/dataSlice';
import movieReducer from "../slices/movieSlice";


export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    movies:movieReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;