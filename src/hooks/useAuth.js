import { useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';

import { selectCurrentToken } from '~/redux/authSlice';

const useAuth = () => {
    const token = useSelector(selectCurrentToken);
    let isAdmin = false;
    let isArtist = false;
    let isPodcaster = false;
    let status = 'User';

    if (token) {
        const decoded = jwtDecode(token);
        const { name, type, email, _id } = decoded;

        isAdmin = type === 'admin';
        isArtist = type === 'artist';
        isPodcaster = type === 'podcaster';

        if (isAdmin) status = 'Admin';
        if (isArtist) status = 'Artist';
        if (isPodcaster) status = 'Podcaster';

        return { name, type, status, isAdmin, isArtist, isPodcaster, email, userId: _id };
    } else {
        return {};
    }
};

export default useAuth;
