import { createSlice } from '@reduxjs/toolkit';
import { login, signUp, fetchUserData } from './authThunks';
import { toast } from 'sonner';
import { AuthState } from './authTypes';
import { getCookie, setCookie, removeCookie } from '../../../utils/cookies';

// Get initial values from cookies
const token = getCookie('token');
const refreshToken = getCookie('refreshToken');
const storedUser = getCookie('user');
const user = storedUser ? JSON.parse(storedUser) : null;

const initialState: AuthState = {
    isAuthenticated: !!token, // Convert token to boolean
    user: user,
    token: token,
    refreshToken: refreshToken,
    isLoading: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isLoading = false;
            removeCookie('token');
            removeCookie('refreshToken');
            removeCookie('user');
            toast.success('Logged out successfully');
        },
        tokenRefreshed: (state, action) => {
            // Update tokens in state when refreshed
            state.token = action.payload.access;
            state.refreshToken = action.payload.refresh;
        },
    },
    extraReducers: (builder) => {
        // Sign Up
        builder.addCase(signUp.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(signUp.fulfilled, (state, action) => {
            state.isAuthenticated = false;
            state.user = action.payload;
            state.isLoading = false;
            setCookie('user', JSON.stringify(action.payload));
        });
        builder.addCase(signUp.rejected, (state) => {
            if (state.isAuthenticated) {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.refreshToken = null;
            }
            state.isLoading = false;
        });

        // Login
        builder.addCase(login.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.isAuthenticated = true;
            state.user = {
                id: action.payload.user.id,
                username: action.payload.user.username,
                email: action.payload.user.email,
                first_name: action.payload.user.first_name,
                last_name: action.payload.user.last_name,
                role: action.payload.user.role
            };
            state.token = action.payload.tokens.access;
            state.refreshToken = action.payload.tokens.refresh;
            state.isLoading = false;

            // Store user data and tokens in cookies
            setCookie('user', JSON.stringify(action.payload.user));
            setCookie('token', action.payload.tokens.access);
            setCookie('refreshToken', action.payload.tokens.refresh);

            toast.success('Logged in successfully');
        });
        builder.addCase(login.rejected, (state) => {
            // Only update state if we're currently authenticated
            // This prevents unnecessary state changes that trigger redirects
            if (state.isAuthenticated) {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.refreshToken = null;
            }
            // Always set loading to false
            state.isLoading = false;
        });

        // Fetch User Data
        builder.addCase(fetchUserData.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchUserData.fulfilled, (state, action) => {
            state.isAuthenticated = true;
            state.user = {
                id: action.payload.id,
                username: action.payload.username,
                email: action.payload.email,
                first_name: action.payload.first_name,
                last_name: action.payload.last_name,
                role: action.payload.role
            };
            state.isLoading = false;

            // Update user data in cookies
            setCookie('user', JSON.stringify(action.payload));
        });
        builder.addCase(fetchUserData.rejected, (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isLoading = false;
            removeCookie('token');
            removeCookie('refreshToken');
            removeCookie('user');
        });
    },
});

export const { logout, tokenRefreshed } = authSlice.actions;
export default authSlice.reducer;