import { Navigate } from 'react-router-dom';
import type {JSX} from "react";

interface ProtectedRouteProps {
    isAuthenticated: boolean;
    children: JSX.Element;
}

function ProtectedRoute({ isAuthenticated, children }: ProtectedRouteProps) {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
