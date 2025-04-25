import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from '../../../lib/axios';
import { GetMeters, AssignMeterPayload, MeterAssignment, GenerateReportPayload, ReportResponse, DeviceData } from "./managerTypes";
import { getCookie } from "../../../utils/cookies";

export const fetchMeters = createAsyncThunk(
    'manager/fetchMeters',
    async (_, { rejectWithValue }) => {
        try {
            const token = getCookie('token');

            if (!token) {
                return rejectWithValue('Authentication token not found');
            }

            const response = await apiClient.get('/api/manager/meters/');

            // Return both assignments and meters data
            return {
                assignments: response.data.details.data.assignments as MeterAssignment[],
                meters: response.data.details.data.meters as GetMeters[]
            };
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: error.message || 'Failed to fetch meters' });
        }
    }
);

export const fetchEngineers = createAsyncThunk(
    'manager/fetchEngineers',
    async (_, { rejectWithValue }) => {
        try {
            const token = getCookie('token');

            if (!token) {
                return rejectWithValue('Authentication token not found');
            }

            const response = await apiClient.get('/api/manager/engineers/');

            return {
                engineers: response.data.details.data // Direct array of engineers from API
            };
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: error.message || 'Failed to fetch engineers' });
        }
    }
);

export const assignMeterToEngineer = createAsyncThunk(
    'manager/assignMeterToEngineer',
    async (payload: AssignMeterPayload, { rejectWithValue }) => {
        try {
            const token = getCookie('token');

            if (!token) {
                return rejectWithValue('Authentication token not found');
            }

            const response = await apiClient.post('/api/manager/assign-meter/', payload);

            // Safely handle the response structure, accounting for different formats
            if (response.data?.details?.data) {
                return response.data.details.data as MeterAssignment;
            } else if (response.data) {
                return response.data as MeterAssignment;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: error.message || 'Failed to assign meter to manager' });
        }
    }
);

export const unassignMeterFromEngineer = createAsyncThunk(
    'manager/unassignMeterFromEngineer',
    async (payload: AssignMeterPayload, { rejectWithValue }) => {
        try {
            const token = getCookie('token');

            if (!token) {
                return rejectWithValue('Authentication token not found');
            }

            // Using the same endpoint but setting engineer_id to null would unassign
            const response = await apiClient.delete('/api/manager/assign-meter/', {
                data: {
                    meter_id: payload.meter_id,
                    engineer_id: payload.engineer_id // Set to null to unassign
                }
            });

            // Safely handle the response structure, accounting for different formats
            if (response.data?.details?.data) {
                return response.data.details.data as MeterAssignment;
            } else if (response.data) {
                return response.data as MeterAssignment;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: error.message || 'Failed to unassign meter from engineer' });
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

            const response = await apiClient.get(`/api/admin/meter-data/${device_id}`);

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

            const response = await apiClient.post('/api/admin/meter-report/', payload);

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

            const response = await apiClient.post('/api/admin/meter-alarm-report/', payload);

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
