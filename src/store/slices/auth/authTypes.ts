export type UserRole = 'ADMIN' | 'MANAGER' | 'ENGINEER';

export interface AuthState {
    isAuthenticated: boolean;
    user: {
        username: string;
        role: UserRole;
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    } | null;
    token: string | null;
    refreshToken: string | null;
    isLoading: boolean;
} 