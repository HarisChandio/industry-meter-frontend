import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from '../../../lib/axios';
import { UserRole } from "./authTypes";

// Define a type for our signup credentials
interface SignUpCredentials {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
    role: UserRole;
}

export const signUp = createAsyncThunk(
    'auth/signUp',
    async (credentials: SignUpCredentials, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/api/users/', credentials);
            return response.data.details.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.details);
            }
            return rejectWithValue({ message: error.message || 'Sign up failed' });
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/api/auth/login/', credentials);
            return response.data.details.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.details);
            }
            return rejectWithValue({ message: error.message || 'Login failed' });
        }
    }
);

export const fetchUserData = createAsyncThunk(
    'auth/fetchUserData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/api/users/me/');
            return response.data.details.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: error.message || 'Failed to fetch user data' });
        }
    }
);

