import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './searchSlice';
import categorySlice from './categorySlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    category: categorySlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;