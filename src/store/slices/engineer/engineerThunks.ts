import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from '../../../lib/axios';
import { DeviceData, GenerateReportPayload, GetMeters, MeterAssignment, ReportResponse } from "./engineerTypes";
import { getCookie } from "../../../utils/cookies";

export const fetchMeters = createAsyncThunk(
    'engineer/fetchMeters',
    async (_, { rejectWithValue }) => {
        try {
            const token = getCookie('token');

            if (!token) {
                return rejectWithValue('Authentication token not found');
            }

            const response = await apiClient.get('/api/engineer/meters/');

            // Return both assignments and meters data
            return {
                assignments: response.data.details.data.assignments as MeterAssignment[],
                meters: response.data.details.data.meters as GetMeters[]
            };
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.details);
            }
            return rejectWithValue({ message: error.message || 'Failed to fetch meters' });
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
