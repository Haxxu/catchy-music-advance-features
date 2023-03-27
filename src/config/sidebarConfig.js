import { routes } from '~/config';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SpatialAudioOffIcon from '@mui/icons-material/SpatialAudioOff';
import AlbumIcon from '@mui/icons-material/Album';
import ListIcon from '@mui/icons-material/List';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import RadioIcon from '@mui/icons-material/Radio';

const adminSidebarConfig = [
    {
        title: 'Dashboard',
        path: routes.admin_dashboard,
        icon: <DashboardIcon fontSize='large' />,
    },
    {
        title: 'User',
        path: routes.admin_manageUser,
        icon: <PersonIcon fontSize='large' />,
    },
    {
        title: 'Artist',
        path: routes.admin_manageArtist,
        icon: <SpatialAudioOffIcon fontSize='large' />,
    },
    {
        title: 'Track',
        path: routes.admin_manageTrack,
        icon: <MusicNoteIcon fontSize='large' />,
    },
    {
        title: 'Album',
        path: routes.admin_manageAlbum,
        icon: <AlbumIcon fontSize='large' />,
    },
    {
        title: 'Playlist',
        path: routes.admin_managePlaylist,
        icon: <ListIcon fontSize='large' />,
    },
    {
        title: 'Genre',
        path: routes.admin_manageGenre,
        icon: <CategoryOutlinedIcon fontSize='large' />,
    },
];

const artistSidebarConfig = [
    {
        title: 'Dashboard',
        path: routes.artist_dashboard,
        icon: <DashboardIcon fontSize='large' />,
    },
    {
        title: 'Track',
        path: routes.artist_manageTrack,
        icon: <MusicNoteIcon fontSize='large' />,
    },
    {
        title: 'Album',
        path: routes.artist_manageAlbum,
        icon: <AlbumIcon fontSize='large' />,
    },
];

const podcasterSidebarConfig = [
    {
        title: 'Dashboard',
        path: routes.podcaster_dashboard,
        icon: <DashboardIcon fontSize='large' />,
    },
    {
        title: 'Episode',
        path: routes.podcaster_manageEpisode,
        icon: <PodcastsIcon fontSize='large' />,
    },
    {
        title: 'Podcast',
        path: routes.podcaster_managePodcast,
        icon: <RadioIcon fontSize='large' />,
    },
];

export { adminSidebarConfig, artistSidebarConfig, podcasterSidebarConfig };
