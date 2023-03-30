import { routes, roles } from '~/config';
// Layouts
import MainLayout from '~/layouts/MainLayout';
// Pages
import Home from '~/pages/Home';
import Search from '~/pages/Search';
import Library from '~/pages/Library';
import LikedTracks from '~/pages/LikedTracks';
import LikedEpisodes from '~/pages/LikedEpisodes';
import Playlist from '~/pages/Playlist';
import Album from '~/pages/Album';
import Podcast from '~/pages/Podcast';
import Artist from '~/pages/Artist';
import Podcaster from '~/pages/Podcaster';
import Settings from '~/pages/Settings';
import Profile from '~/pages/Profile';
import Lyrics from '~/pages/Lyrics';
import Queue from '~/pages/Queue';
import Track from '~/pages/Track';
import User from '~/pages/User';
import Genre from '~/pages/Genre';
import Episode from '~/pages/Episode';

const privateRoutes = [
    // Home
    {
        path: routes.home,
        component: Home,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist, roles.podcaster],
    },
    // Search
    {
        path: routes.search,
        component: Search,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist, roles.podcaster],
    },
    // Library
    {
        path: routes.library,
        component: Library,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist, roles.podcaster],
    },
    // Liked Tracks
    {
        path: routes.likedTracks,
        component: LikedTracks,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist, roles.podcaster],
    },
    // Liked Episodes
    {
        path: routes.likedEpisodes,
        component: LikedEpisodes,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist, roles.podcaster],
    },
    // Playlist
    {
        path: routes.playlist,
        component: Playlist,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist, roles.podcaster],
    },
    // Album
    {
        path: routes.album,
        component: Album,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist, roles.podcaster],
    },
    // Podcast
    {
        path: routes.podcast,
        component: Podcast,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist, roles.podcaster],
    },
    // Artist
    {
        path: routes.artist,
        component: Artist,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist, roles.podcaster],
    },
    // Podcaster
    {
        path: routes.podcaster,
        component: Podcaster,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist, roles.podcaster],
    },
    // User
    {
        path: routes.user,
        component: User,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist, roles.podcaster],
    },
    // Genre
    {
        path: routes.genre,
        component: Genre,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist, roles.podcaster],
    },
    // Track
    {
        path: routes.track,
        component: Track,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist, roles.podcaster],
    },
    // Episode
    {
        path: routes.episode,
        component: Episode,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist, roles.podcaster],
    },
    // Settings
    {
        path: routes.settings,
        component: Settings,
        layout: MainLayout,
        roles: [roles.admin, roles.artist, roles.user, roles.podcaster],
    },
    // Profile
    {
        path: routes.profile,
        component: Profile,
        layout: MainLayout,
        roles: [roles.admin, roles.artist, roles.user, roles.podcaster],
    },
    // Lyric
    {
        path: routes.lyrics,
        component: Lyrics,
        layout: MainLayout,
        roles: [roles.admin, roles.artist, roles.user, roles.podcaster],
    },
    // Queue
    {
        path: routes.queue,
        component: Queue,
        layout: MainLayout,
        roles: [roles.admin, roles.artist, roles.user, roles.podcaster],
    },
];

export default privateRoutes;
