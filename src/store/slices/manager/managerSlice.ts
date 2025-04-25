import { createSlice } from '@reduxjs/toolkit';
import { fetchMeters, fetchEngineers, assignMeterToEngineer, unassignMeterFromEngineer } from './managerThunks';
import { ManagerState } from './managerTypes';
import { toast } from 'sonner';

const initialState: ManagerState = {
    get_meters: [],
    engineers: [],
    meterAssignments: [],
    isLoading: false,
    error: null
};

const managerSlice = createSlice({
    name: 'manager',
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
            toast.error('Failed to load meters');
        });

        // Fetch Engineers
        builder.addCase(fetchEngineers.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchEngineers.fulfilled, (state, action) => {
            state.engineers = Array.isArray(action.payload.engineers)
                ? action.payload.engineers
                : Array.isArray(action.payload)
                    ? action.payload
                    : [];

            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(fetchEngineers.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string || 'Failed to fetch engineers';
            toast.error('Failed to load engineers');
        });

        // Assign Meter to Engineer
        builder.addCase(assignMeterToEngineer.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(assignMeterToEngineer.fulfilled, (state, action) => {
            state.meterAssignments = [...state.meterAssignments, action.payload];
            state.isLoading = false;
            state.error = null;
            toast.success('Meter successfully assigned to engineer');
        });
        builder.addCase(assignMeterToEngineer.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string || 'Failed to assign meter to engineer';
            toast.error('Failed to assign meter to engineer');
        });

        // Unassign Meter from Engineer
        builder.addCase(unassignMeterFromEngineer.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(unassignMeterFromEngineer.fulfilled, (state, action) => {
            // Update meterAssignments with the updated assignment
            state.meterAssignments = state.meterAssignments.map(assignment =>
                assignment.id === action.payload.id ? action.payload : assignment
            );
            state.isLoading = false;
            state.error = null;
            toast.success('Meter successfully unassigned from engineer');
        });
        builder.addCase(unassignMeterFromEngineer.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string || 'Failed to unassign meter from engineer';
            toast.error('Failed to unassign meter from engineer');
        })

    },
});

export const { clearErrors } = managerSlice.actions;

export default managerSlice.reducer;