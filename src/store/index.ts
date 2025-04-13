import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/auth/authSlice';
import adminSlice from './slices/admin/adminSlice';
import { setStoreRef } from '../lib/axios';

// Create the store
export const store = configureStore({
    reducer: {
        auth: authSlice,
        admin: adminSlice,
    },
});

// Set the store reference in axios to break circular dependency
setStoreRef(store);

// Export types after store creation
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 