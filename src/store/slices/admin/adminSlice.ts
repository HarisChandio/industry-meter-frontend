import { createSlice } from '@reduxjs/toolkit';
import { fetchMeters, addDevice, deleteDevice, fetchManagers, fetchEngineers, assignMeterToManager, assignEngineerToManager, fetchManagerDetails, fetchDeviceData, generateMeterReport, generateAlarmMeterReport } from './adminThunks';
import { AdminState } from './adminTypes';
import { toast } from 'sonner';

const initialState: AdminState = {
    get_meters: [],
    managers: [],
    engineers: [],
    meterAssignments: [],
    engineerAssignments: [],
    managerDetail: null,
    currentDeviceData: null,
    reportData: null,
    isLoading: false,
    error: null
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Meters
        builder.addCase(fetchMeters.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchMeters.fulfilled, (state, action) => {
            state.get_meters = action.payload;
            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(fetchMeters.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string || 'Failed to fetch meters';
            toast.error('Failed to load meters');
        });

        // Add Device
        builder.addCase(addDevice.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(addDevice.fulfilled, (state, action) => {
            state.get_meters.push(action.payload);
            state.isLoading = false;
            state.error = null;
            toast.success("Device added successfully");
        });
        builder.addCase(addDevice.rejected, (state, action) => {
            state.isLoading = false;
            state.error = typeof action.payload === 'object' ? JSON.stringify(action.payload) : (action.payload as string || 'Failed to add device');
            console.log("Error:", action.payload);
            if (typeof action.payload === 'object' && action.payload !== null) {
                console.log("Device ID:", (action.payload as any).device_id);
                if ((action.payload as any).device_id) {
                    toast.error(`${(action.payload as any).device_id}`);
                    toast.error(`${(action.payload as any).location}`);
                }
            } else {
                toast.error(action.payload as string || 'Failed to add device');
            }
        });

        // Delete Device
        builder.addCase(deleteDevice.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(deleteDevice.fulfilled, (state, action) => {
            state.get_meters = state.get_meters.filter(meter => meter.id !== action.payload.id);
            state.isLoading = false;
            state.error = null;
            toast.success("Device deleted successfully");
        });
        builder.addCase(deleteDevice.rejected, (state, action) => {
            state.isLoading = false;
            state.error = typeof action.payload === 'object' ? JSON.stringify(action.payload) : (action.payload as string || 'Failed to add device');
            console.log("Error:", action.payload);
            if (typeof action.payload === 'object' && action.payload !== null) {
                console.log("Device ID:", (action.payload as any).device_id);
                if ((action.payload as any).device_id) {
                    toast.error(`${(action.payload as any).device_id}`);
                    toast.error(`${(action.payload as any).location}`);
                }
            } else {
                toast.error(action.payload as string || 'Failed to add device');
            }
        });

        // Fetch Managers
        builder.addCase(fetchManagers.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchManagers.fulfilled, (state, action) => {
            state.managers = action.payload;
            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(fetchManagers.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string || 'Failed to fetch managers';
            toast.error('Failed to load managers');
        });

        // Fetch Engineers
        builder.addCase(fetchEngineers.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchEngineers.fulfilled, (state, action) => {
            state.engineers = action.payload;
            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(fetchEngineers.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string || 'Failed to fetch engineers';
            toast.error('Failed to load engineers');
        });

        // Assign Meter to Manager
        builder.addCase(assignMeterToManager.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(assignMeterToManager.fulfilled, (state, action) => {
            state.meterAssignments.push(action.payload);
            state.isLoading = false;
            state.error = null;
            toast.success("Meter assigned to manager successfully");
        });
        builder.addCase(assignMeterToManager.rejected, (state, action) => {
            state.isLoading = false;
            state.error = typeof action.payload === 'object' ? JSON.stringify(action.payload) : (action.payload as string || 'Failed to assign meter');
            toast.error(action.payload as string || 'Failed to assign meter to manager');
        });

        // Assign Engineer to Manager
        builder.addCase(assignEngineerToManager.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(assignEngineerToManager.fulfilled, (state, action) => {
            state.engineerAssignments.push(action.payload);
            state.isLoading = false;
            state.error = null;
            toast.success("Engineer assigned to manager successfully");
        });
        builder.addCase(assignEngineerToManager.rejected, (state, action) => {
            state.isLoading = false;
            state.error = typeof action.payload === 'object' ? JSON.stringify(action.payload) : (action.payload as string || 'Failed to assign engineer');
            toast.error(action.payload as string || 'Failed to assign engineer to manager');
        });

        // Fetch Manager Details
        builder.addCase(fetchManagerDetails.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchManagerDetails.fulfilled, (state, action) => {
            state.managerDetail = action.payload;
            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(fetchManagerDetails.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string || 'Failed to fetch manager details';
            toast.error('Failed to load manager details');
        });

        // Fetch Device Data
        builder.addCase(fetchDeviceData.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchDeviceData.fulfilled, (state, action) => {
            state.currentDeviceData = action.payload;
            console.log("Device Data:", action.payload);
            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(fetchDeviceData.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string || 'Failed to fetch device data';
            toast.error('Failed to load device data');
        });

        // Generate Meter Report
        builder.addCase(generateMeterReport.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(generateMeterReport.fulfilled, (state, action) => {
            state.reportData = action.payload;
            state.isLoading = false;
            state.error = null;
            toast.success('Report generated successfully');
        });
        builder.addCase(generateMeterReport.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string || 'Failed to generate report';
            toast.error('Failed to generate meter report');
        })

        builder.addCase(generateAlarmMeterReport.pending
, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(generateAlarmMeterReport.fulfilled, (state, action) => {
            state.reportData = action.payload;
            state.isLoading = false;
            state.error = null;
            toast.success('Alarm report generated successfully');
        });
        builder.addCase(generateAlarmMeterReport.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string || 'Failed to generate alarm report';
            toast.error('Failed to generate alarm meter report');
        });

    },
});

export const { clearErrors } = adminSlice.actions;
export default adminSlice.reducer;