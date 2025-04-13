import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from '../../../lib/axios';
import { AddDeviceFormValues, GetMeters, Manager, Engineer, AssignMeterPayload, MeterAssignment, AssignEngineerPayload, EngineerAssignment, ManagerDetail } from "./adminTypes";
import { getCookie } from "../../../utils/cookies";

export const fetchMeters = createAsyncThunk(
    'admin/fetchMeters',
    async (_, { rejectWithValue }) => {
        try {
            const token = getCookie('token');

            if (!token) {
                return rejectWithValue('Authentication token not found');
            }

            const response = await apiClient.get('/api/admin/meters/');

            return response.data as GetMeters[];
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: error.message || 'Failed to fetch meters' });
        }
    }
);

export const addDevice = createAsyncThunk(
    'admin/addDevice',
    async (device: AddDeviceFormValues, { rejectWithValue }) => {
        try {
            const token = getCookie('token');

            if (!token) {
                return rejectWithValue('Authentication token not found');
            }

            const response = await apiClient.post('/api/admin/meters/', device);

            return response.data as GetMeters;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: error.message || 'Failed to add device' });
        }
    }
);


export const deleteDevice = createAsyncThunk(
    'admin/deleteDevice',
    async (device_id: number, { rejectWithValue }) => {
        try {
            const token = getCookie('token');

            if (!token) {
                return rejectWithValue('Authentication token not found');
            }

            const response = await apiClient.delete(`/api/admin/meters/${device_id}`);

            return response.data as GetMeters;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: error.message || 'Failed to delete device' });
        }
    }
);

export const fetchManagers = createAsyncThunk(
    'admin/fetchManagers',
    async (_, { rejectWithValue }) => {
        try {
            const token = getCookie('token');

            if (!token) {
                return rejectWithValue('Authentication token not found');
            }

            const response = await apiClient.get('/api/admin/managers/');

            return response.data as Manager[];
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: error.message || 'Failed to fetch managers' });
        }
    }
);

export const fetchEngineers = createAsyncThunk(
    'admin/fetchEngineers',
    async (_, { rejectWithValue }) => {
        try {
            const token = getCookie('token');

            if (!token) {
                return rejectWithValue('Authentication token not found');
            }

            const response = await apiClient.get('/api/admin/engineers/');

            return response.data as Engineer[];
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: error.message || 'Failed to fetch engineers' });
        }
    }
);

export const assignMeterToManager = createAsyncThunk(
    'admin/assignMeterToManager',
    async (payload: AssignMeterPayload, { rejectWithValue }) => {
        try {
            const token = getCookie('token');

            if (!token) {
                return rejectWithValue('Authentication token not found');
            }

            const response = await apiClient.post('/api/admin/meter-assignments/', payload);

            return response.data.details.data as MeterAssignment;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: error.message || 'Failed to assign meter to manager' });
        }
    }
);

export const assignEngineerToManager = createAsyncThunk(
    'admin/assignEngineerToManager',
    async (payload: AssignEngineerPayload, { rejectWithValue }) => {
        try {
            const token = getCookie('token');

            if (!token) {
                return rejectWithValue('Authentication token not found');
            }

            const response = await apiClient.post('/api/admin/assignments/', payload);

            return response.data.assignment as EngineerAssignment;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: error.message || 'Failed to assign engineer to manager' });
        }
    }
);

export const fetchManagerDetails = createAsyncThunk(
    'admin/fetchManagerDetails',
    async (managerId: number, { rejectWithValue }) => {
        try {
            const token = getCookie('token');

            if (!token) {
                return rejectWithValue('Authentication token not found');
            }

            const response = await apiClient.get(`/api/admin/managers/${managerId}/`);

            if (response.data && response.data.details && response.data.details.data) {
                return response.data.details.data as ManagerDetail;
            }

            return rejectWithValue('Invalid response format');
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: error.message || 'Failed to fetch manager details' });
        }
    }
);