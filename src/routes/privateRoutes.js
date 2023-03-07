import { routes, roles } from '~/config';
// Layouts
import MainLayout from '~/layouts/MainLayout';
// Pages
import Home from '~/pages/Home';
import Search from '~/pages/Search';
import Library from '~/pages/Library';
import LikedTracks from '~/pages/LikedTracks';
import Playlist from '~/pages/Playlist';
import Album from '~/pages/Album';
import Artist from '~/pages/Artist';
import Settings from '~/pages/Settings';
import Profile from '~/pages/Profile';
import Lyrics from '~/pages/Lyrics';
import Queue from '~/pages/Queue';
import Track from '~/pages/Track';
import User from '~/pages/User';
import Genre from '~/pages/Genre';

const privateRoutes = [
    // Home
    {
        path: routes.home,
        component: Home,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist],
    },
    // Search
    {
        path: routes.search,
        component: Search,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist],
    },
    // Library
    {
        path: routes.library,
        component: Library,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist],
    },
    // Liked Tracks
    {
        path: routes.likedTracks,
        component: LikedTracks,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist],
    },
    // Playlist
    {
        path: routes.playlist,
        component: Playlist,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist],
    },
    // Album
    {
        path: routes.album,
        component: Album,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist],
    },
    // Artist
    {
        path: routes.artist,
        component: Artist,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist],
    },
    // User
    {
        path: routes.user,
        component: User,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist],
    },
    // Genre
    {
        path: routes.genre,
        component: Genre,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist],
    },
    // Track
    {
        path: routes.track,
        component: Track,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist],
    },
    // Settings
    {
        path: routes.settings,
        component: Settings,
        layout: MainLayout,
        roles: [roles.admin, roles.artist, roles.user],
    },
    // Profile
    {
        path: routes.profile,
        component: Profile,
        layout: MainLayout,
        roles: [roles.admin, roles.artist, roles.user],
    },
    // Lyric
    {
        path: routes.lyrics,
        component: Lyrics,
        layout: MainLayout,
        roles: [roles.admin, roles.artist, roles.user],
    },
    // Queue
    {
        path: routes.queue,
        component: Queue,
        layout: MainLayout,
        roles: [roles.admin, roles.artist, roles.user],
    },
];

export default privateRoutes;
