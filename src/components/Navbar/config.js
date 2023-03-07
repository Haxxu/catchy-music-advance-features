import { routes } from '~/config';
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';

export const menuOptions = [
    {
        title: 'Home',
        path: routes.home,
        icon: <HomeIcon fontSize='large' />,
        roles: ['admin', 'artist', 'user'],
    },
    {
        title: 'Profile',
        path: routes.profile,
        icon: <AccountBoxIcon fontSize='large' />,
        roles: ['admin', 'artist', 'user'],
    },
    {
        title: 'Dashboard',
        path: routes.admin_dashboard,
        icon: <AdminPanelSettingsIcon fontSize='large' />,
        roles: ['admin'],
    },
    {
        title: 'Dashboard',
        path: routes.artist_dashboard,
        icon: <DashboardCustomizeOutlinedIcon fontSize='large' />,
        roles: ['artist'],
    },
    {
        title: 'Settings',
        path: routes.settings,
        icon: <SettingsIcon fontSize='large' />,
        roles: ['admin', 'artist', 'user'],
    },
];
