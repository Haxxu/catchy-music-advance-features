import { routes, roles } from '~/config';
// Layouts
import PodcasterDashboardLayout from '~/layouts/PodcasterDashboardLayout';
// Pages
import Dashboard from '~/pages/podcasterdashboard/Dashboard';
import ManageEpisode from '~/pages/podcasterdashboard/ManageEpisode';
import SpecifiedTrack from '~/pages/podcasterdashboard/SpecifiedTrack';
import ManageAlbum from '~/pages/podcasterdashboard/ManageAlbum';
import SpecifiedAlbum from '~/pages/podcasterdashboard/SpecifiedAlbum';

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
        component: ManageEpisode,
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
