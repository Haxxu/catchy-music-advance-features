import { routes, roles } from '~/config';
// Layouts
import AdminDashboardLayout from '~/layouts/AdminDashboardLayout';
// Pages
import Dashboard from '~/pages/admindashboard/Dashboard';
import ManageUser from '~/pages/admindashboard/ManageUser';
import ManageArtist from '~/pages/admindashboard/ManageArtist';
import ManagePodcaster from '~/pages/admindashboard/ManagePodcaster';
import ManageTrack from '~/pages/admindashboard/ManageTrack';
import ManageAlbum from '~/pages/admindashboard/ManageAlbum';
import ManagePodcast from '~/pages/admindashboard/ManagePodcast';
import ManagePlaylist from '~/pages/admindashboard/ManagePlaylist';
import ManageGenre from '~/pages/admindashboard/ManageGenre';
import GenreForm from '~/components/Forms/GenreForm';
import Profile from '~/pages/Profile';

const adminRoutes = [
    {
        path: routes.admin_profile,
        component: Profile,
        layout: AdminDashboardLayout,
        roles: [roles.admin],
    },
    // dashboard
    {
        path: routes.admin_dashboard,
        component: Dashboard,
        layout: AdminDashboardLayout,
        roles: [roles.admin],
    },
    {
        path: routes.admin_manageUser,
        component: ManageUser,
        layout: AdminDashboardLayout,
        roles: [roles.admin],
    },
    {
        path: routes.admin_manageArtist,
        component: ManageArtist,
        layout: AdminDashboardLayout,
        roles: [roles.admin],
    },
    {
        path: routes.admin_managePodcaster,
        component: ManagePodcaster,
        layout: AdminDashboardLayout,
        roles: [roles.admin],
    },
    {
        path: routes.admin_manageTrack,
        component: ManageTrack,
        layout: AdminDashboardLayout,
        roles: [roles.admin],
    },
    {
        path: routes.admin_manageAlbum,
        component: ManageAlbum,
        layout: AdminDashboardLayout,
        roles: [roles.admin],
    },
    {
        path: routes.admin_managePodcast,
        component: ManagePodcast,
        layout: AdminDashboardLayout,
        roles: [roles.admin],
    },
    {
        path: routes.admin_managePlaylist,
        component: ManagePlaylist,
        layout: AdminDashboardLayout,
        roles: [roles.admin],
    },
    {
        path: routes.admin_manageGenre,
        component: ManageGenre,
        layout: AdminDashboardLayout,
        roles: [roles.admin],
    },
    {
        path: routes.admin_manageGenre_genreForm,
        component: GenreForm,
        layout: AdminDashboardLayout,
        roles: [roles.admin],
    },
];

export default adminRoutes;
