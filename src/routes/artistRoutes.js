import { routes, roles } from '~/config';
// Layouts
import ArtistDashboardLayout from '~/layouts/ArtistDashboardLayout';
// Pages
import Dashboard from '~/pages/artistdashboard/Dashboard';
import ManageTrack from '~/pages/artistdashboard/ManageTrack';
import SpecifiedTrack from '~/pages/artistdashboard/SpecifiedTrack';
import ManageAlbum from '~/pages/artistdashboard/ManageAlbum';
import SpecifiedAlbum from '~/pages/artistdashboard/SpecifiedAlbum';

const artistRoutes = [
    // dashboard
    {
        path: routes.artist_dashboard,
        component: Dashboard,
        layout: ArtistDashboardLayout,
        roles: [roles.artist],
    },
    {
        path: routes.artist_manageTrack,
        component: ManageTrack,
        layout: ArtistDashboardLayout,
        roles: [roles.artist],
    },
    {
        path: routes.artist_manageTrack_specifiedTrack,
        component: SpecifiedTrack,
        layout: ArtistDashboardLayout,
        roles: [roles.artist],
    },
    {
        path: routes.artist_manageAlbum,
        component: ManageAlbum,
        layout: ArtistDashboardLayout,
        roles: [roles.artist],
    },
    {
        path: routes.artist_manageAlbum_specifiedAlbum,
        component: SpecifiedAlbum,
        layout: ArtistDashboardLayout,
        roles: [roles.artist],
    },
];

export default artistRoutes;
