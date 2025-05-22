import {Navigate} from 'react-router-dom';
import {useStore} from '../store/useStore';
import type {Role} from '../types';
import React from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: Role[];
}

export function ProtectedRoute({children, allowedRoles}: ProtectedRouteProps) {
    const user = useStore((state) => state.user);
    const hasAccess = useStore((state) => state.hasAccess);

    if (!user) {
        return <Navigate to="/login" replace/>;
    }

    if (!hasAccess(allowedRoles)) {
        // Redirigir a la página principal según el rol del usuario
        switch (user.rol) {
            case 'ENCARGADO':
                return <Navigate to="/menu" replace/>;
            case 'CAJERO':
            case 'CHEF':
            case 'MESERO':
                return <Navigate to="/orders" replace/>;
            default:
                return <Navigate to="/login" replace/>;
        }
    }

    return <>{children}</>;
}