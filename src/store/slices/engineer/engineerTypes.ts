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
    meters?: {
        id: number;
        device_id: string;
        location: string;
        created_at: string;
        updated_at: string;
    }[];
}

export interface AddDeviceFormValues {
    device_id: number;
    location: string;
}

export interface AssignMeterPayload {
    meter_id: number;
    engineer_id: number;
}

// export interface AssignEngineerPayload {
//     meter_id: number;
//     engineer_id: number;
// }

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

// export interface ManagerDetail {
//     manager: Manager;
//     assignments: MeterAssignment[];
//     engineer_assignments: EngineerAssignment[];
// }

export interface EngineerState {
    get_meters: GetMeters[];
    meterAssignments: MeterAssignment[];
    isLoading: boolean;
    error: string | null;
}

export interface GenerateReportPayload {
    meter_id: string;
    time_range: 'last_24' | 'last_week' | 'last_month' | 'custom';
    start_date?: string; // Optional for custom time range
    end_date?: string;   // Optional for custom time range
}

export interface ReportResponse {
    message: string;
    filename: string;
    download_url: string;
}

export interface DeviceData {
    id: number;
    meter: number;
    timestamp: string;
    engine_hours: number;
    frequency_hz: number;
    power_percentage: number;
    phase_a_voltage_v: number;
    phase_a_current_a: number;
    phase_b_voltage_v: number;
    phase_b_current_a: number;
    phase_c_voltage_v: number;
    phase_c_current_a: number;
    coolant_temp_c: number;
    oil_pressure_kpa: number;
    battery_voltage_v: number;
    fuel_level_percent: number;
    rpm: number;
    oil_temp_c: number;
    boost_pressure_kpa: number;
    intake_air_temp_c: number;
    fuel_rate_lph: number;
    instantaneous_power_kw: number;
    alarm_emergency_stop: boolean;
    alarm_low_oil_pressure: boolean;
    alarm_high_coolant_temp: boolean;
    alarm_low_coolant_level: boolean;
    alarm_crank_failure: boolean;
}