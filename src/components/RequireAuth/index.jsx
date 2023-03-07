import { useLocation, Navigate, Outlet } from 'react-router-dom';

import useAuth from '~/hooks/useAuth';

const RequireAuth = ({ allowedRoles }) => {
    const { type: role } = useAuth();
    const location = useLocation();

    let content;
    if (allowedRoles?.includes(role)) {
        content = <Outlet />;
    } else if (role) {
        content = <Navigate to='/unauthorized' state={{ from: location }} replace />;
    } else {
        content = <Navigate to='/login' state={{ from: location }} replace />;
    }

    return content;
};

export default RequireAuth;
