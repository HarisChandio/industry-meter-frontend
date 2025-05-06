import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from '../../../lib/axios';
import { AddDeviceFormValues, GetMeters, Manager, Engineer, AssignMeterPayload, MeterAssignment, AssignEngineerPayload, EngineerAssignment, ManagerDetail, DeviceData, GenerateReportPayload, ReportResponse } from "./adminTypes";
import { getCookie } from "../../../utils/cookies";

let base_url = "/api/admin";

const role = localStorage.getItem('role') ;

if (role !== "ADMIN" ) {
    base_url = "api/meter"
}

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
                return rejectWithValue(error.response.data.details);
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

            return response.data.details.data as GetMeters;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.details);
            }
            return rejectWithValue({ message: error.message || 'Failed to add device' });
        }
    }
);


export const deleteDevice = createAsyncThunk(
    'admin/deleteDevice',
    async (device_id: any, { rejectWithValue }) => {
        try {
            const token = getCookie('token');

            if (!token) {
                return rejectWithValue('Authentication token not found');
            }

            const response = await apiClient.delete(`/api/admin/meters/${device_id}/`);

            return response.data as GetMeters;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.details);
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

            return response.data.details.data as Manager[];
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.details);
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

            return response.data.details.data as Engineer[];
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.details);
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
                return rejectWithValue(error.response.data.details.manager);
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
                return rejectWithValue(error.response.data.details);
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
                return rejectWithValue(error.response.data.details);
            }
            return rejectWithValue({ message: error.message || 'Failed to fetch manager details' });
        }
    }
);

export const fetchDeviceData = createAsyncThunk(
    'admin/fetchDeviceData',
    async (device_id: number, { rejectWithValue }) => {
        try {
            const token = getCookie('token');

            if (!token) {
                return rejectWithValue('Authentication token not found');
            }

            const response = await apiClient.get(`${base_url}/meter-data/${device_id}/`);

            // Extract the device data from the response
            if (response.data && response.data.details && response.data.details.data) {
                return response.data.details.data as DeviceData;
            }

            return rejectWithValue('Invalid response format');
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.details);
            }
            return rejectWithValue({ message: error.message || 'Failed to fetch device data' });
        }
    }
);

export const generateMeterReport = createAsyncThunk(
    'admin/generateMeterReport',
    async (payload: GenerateReportPayload, { rejectWithValue }) => {
        try {
            const token = getCookie('token');

            if (!token) {
                return rejectWithValue('Authentication token not found');
            }

            const response = await apiClient.post(`${base_url}/meter-report/`, payload);

            if (response.data && response.data.details) {
                const reportData = response.data.details as ReportResponse;

                // Open the download URL in a new tab
                window.open(reportData.download_url, '_blank');

                return reportData;
            }

            return rejectWithValue('Invalid response format');
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.details);
            }
            return rejectWithValue({ message: error.message || 'Failed to generate meter report' });
        }
    }
);


export const generateAlarmMeterReport = createAsyncThunk(
    'admin/generateAlarmMeterReport',
    async (payload: GenerateReportPayload, { rejectWithValue }) => {
        try {
            const token = getCookie('token');

            if (!token) {
                return rejectWithValue('Authentication token not found');
            }

            const response = await apiClient.post(`${base_url}/meter-alarm-report/`, payload);

            if (response.data && response.data.details) {
                const reportData = response.data.details as ReportResponse;

                // Open the download URL in a new tab
                window.open(reportData.download_url, '_blank');

                return reportData;
            }

            return rejectWithValue('Invalid response format');
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.details);
            }
            return rejectWithValue({ message: error.message || 'Failed to generate alarm meter report' });
        }
    }
);
