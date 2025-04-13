import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserRole } from "@/store/slices/auth/authTypes";

export const useAuth = () => {
    const { user, isAuthenticated, token, isLoading } = useSelector(
        (state: RootState) => state.auth
    );

    const isAdmin = !!user && user.role === "ADMIN";
    const isManager = !!user && user.role === "MANAGER";
    const isEngineer = !!user && user.role === "ENGINEER";

    const hasRole = (roles: UserRole[]) => {
        return !!user && roles.includes(user.role);
    };

    return {
        user,
        isAuthenticated,
        token,
        isLoading,
        isAdmin,
        isManager,
        isEngineer,
        hasRole
    };
}; 