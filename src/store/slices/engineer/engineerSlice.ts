import { createSlice } from '@reduxjs/toolkit';
import { fetchMeters } from './engineerThunks';
import { EngineerState } from './engineerTypes';
import { toast } from 'sonner';

const initialState: EngineerState = {
    get_meters: [],
    meterAssignments: [],
    isLoading: false,
    error: null
};

const engineerSlice = createSlice({
    name: 'engineer',
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
            state.get_meters = action.payload.meters;
            state.meterAssignments = action.payload.assignments;
            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(fetchMeters.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string || 'Failed to fetch meters';
            toast.error(state.error);
        });
    },
});

export const { clearErrors } = engineerSlice.actions;

export default engineerSlice.reducer;