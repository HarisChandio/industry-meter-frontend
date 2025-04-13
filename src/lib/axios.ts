import axios from 'axios';
import { getCookie, setCookie, removeCookie } from '../utils/cookies';
// Remove direct store import to fix circular dependency
// import { store } from '../store';
// import { logout } from '../store/slices/auth/authSlice';

// Create a configured axios instance with the base URL from environment variables
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to handle auth tokens
apiClient.interceptors.request.use(
    (config) => {
        const token = getCookie('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Store reference for dynamic access (to be set after store creation)
let storeRef: any = null;

export const setStoreRef = (store: any) => {
    storeRef = store;
};

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
// Queue of requests to retry after token refresh
let refreshSubscribers: Array<(token: string) => void> = [];

// Function to add request to queue
const subscribeToTokenRefresh = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

// Function to retry queued requests with new token
const onTokenRefreshed = (newToken: string) => {
    refreshSubscribers.forEach(callback => callback(newToken));
    refreshSubscribers = [];
};

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip auth handling for the login endpoint
        if (originalRequest.url?.includes('/api/auth/login/')) {
            return Promise.reject(error);
        }

        // If 401 error and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            // If refresh token exists and we're not already refreshing
            const refreshToken = getCookie('refreshToken');

            if (refreshToken && !isRefreshing) {
                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    // Try to refresh the token
                    const response = await axios.post(
                        `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh/`,
                        { refresh: refreshToken }
                    );

                    const { access, refresh } = response.data;

                    // Update tokens in cookies
                    setCookie('token', access);
                    setCookie('refreshToken', refresh);

                    // Update token in store
                    if (storeRef) {
                        storeRef.dispatch({
                            type: 'auth/tokenRefreshed',
                            payload: { access, refresh }
                        });
                    }

                    // Update authorization header
                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                    originalRequest.headers['Authorization'] = `Bearer ${access}`;

                    // Retry queued requests
                    onTokenRefreshed(access);
                    isRefreshing = false;

                    // Retry the original request
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    // Refresh failed, logout
                    isRefreshing = false;

                    if (storeRef) {
                        storeRef.dispatch({ type: 'auth/logout' });
                    }

                    removeCookie('token');
                    removeCookie('refreshToken');
                    window.location.href = '/sign-in';

                    return Promise.reject(refreshError);
                }
            }

            // If we're already refreshing, queue this request
            if (isRefreshing) {
                return new Promise(resolve => {
                    subscribeToTokenRefresh(token => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        resolve(apiClient(originalRequest));
                    });
                });
            }

            // No refresh token, logout
            if (storeRef) {
                storeRef.dispatch({ type: 'auth/logout' });
            }

            removeCookie('token');
            removeCookie('refreshToken');
            window.location.href = '/sign-in';
        }

        return Promise.reject(error);
    }
);

export default apiClient; 