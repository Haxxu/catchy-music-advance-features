import { routes, roles } from '~/config';
// Layouts
import PodcasterDashboardLayout from '~/layouts/PodcasterDashboardLayout';
// Pages
import Dashboard from '~/pages/artistdashboard/Dashboard';
import ManageTrack from '~/pages/artistdashboard/ManageTrack';
import SpecifiedTrack from '~/pages/artistdashboard/SpecifiedTrack';
import ManageAlbum from '~/pages/artistdashboard/ManageAlbum';
import SpecifiedAlbum from '~/pages/artistdashboard/SpecifiedAlbum';

const podcasterRoutes = [
    // dashboard
    {
        path: routes.podcaster_dashboard,
        component: Dashboard,
        layout: PodcasterDashboardLayout,
        roles: [roles.podcaster],
    },
    {
        path: routes.podcaster_manageEpisode,
        component: ManageTrack,
        layout: PodcasterDashboardLayout,
        roles: [roles.podcaster],
    },
    {
        path: routes.podcaster_manageEpisode_specifiedEpisode,
        component: SpecifiedTrack,
        layout: PodcasterDashboardLayout,
        roles: [roles.podcaster],
    },
    {
        path: routes.podcaster_managePodcast,
        component: ManageAlbum,
        layout: PodcasterDashboardLayout,
        roles: [roles.podcaster],
    },
    {
        path: routes.podcaster_managePodcast_specifiedPodcast,
        component: SpecifiedAlbum,
        layout: PodcasterDashboardLayout,
        roles: [roles.podcaster],
    },
];

export default podcasterRoutes;
