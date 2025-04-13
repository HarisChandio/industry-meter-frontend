export interface GetMeters {
    id: number;
    device_id: number;
    location: string;
    created_at: string;
    updated_at: string;
}

export interface Manager {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
}

export interface Engineer {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
}

export interface AddDeviceFormValues {
    device_id: number;
    location: string;
}

export interface AssignMeterPayload {
    meter: number;
    manager: number;
}

export interface AssignEngineerPayload {
    manager_id: number;
    engineer_id: number;
}

export interface EngineerAssignment {
    id: number;
    manager: number;
    engineer: number;
    manager_username: string;
    engineer_username: string;
    assigned_at: string;
}

export interface MeterAssignment {
    id: number;
    meter: number;
    engineer: number | null;
    manager: number;
    status: string;
    location: string;
    assigned_at: string;
    previous_assignment: number | null;
}

export interface ManagerDetail {
    manager: Manager;
    assignments: MeterAssignment[];
    engineer_assignments: EngineerAssignment[];
}

export interface AdminState {
    get_meters: GetMeters[];
    managers: Manager[];
    engineers: Engineer[];
    meterAssignments: MeterAssignment[];
    engineerAssignments: EngineerAssignment[];
    managerDetail: ManagerDetail | null;
    isLoading: boolean;
    error: string | null;
} 