const routes = {
    // public routes
    signup: '/signup',
    login: '/login',
    unAuthorized: '/unauthorized',
    notFound: '/not-found',
    active: '/active/:active_token',

    // private routes
    home: '/',
    search: '/search',
    library: '/library/*',
    library_home: '/library/playlists',
    library_albums_route: '/library/albums',
    library_artists_route: '/library/artists',
    library_playlists: 'playlists',
    library_albums: 'albums',
    library_artists: 'artists',
    likedTracks: '/library/tracks',
    playlist: '/playlist/:id',
    artist: '/artist/:id',
    user: '/user/:id',
    profile: '/profile',
    settings: '/settings',
    lyrics: '/lyrics',
    queue: '/queue',
    album: '/album/:id',
    track: '/track/:id/album/:albumId',
    genre: '/genre/:id',

    // admin routes
    admin_dashboard: '/admin-dashboard/home',

    admin_manageUser: '/admin-dashboard/users',
    admin_manageArtist: '/admin-dashboard/artists',
    admin_manageTrack: '/admin-dashboard/tracks',
    admin_manageAlbum: '/admin-dashboard/albums',
    admin_managePlaylist: '/admin-dashboard/playlists',
    admin_manageGenre: '/admin-dashboard/genres',
    admin_manageGenre_genreForm: '/admin-dashboard/genres/:id',

    // artist routes
    artist_dashboard: '/artist-dashboard/home',

    artist_manageTrack: '/artist-dashboard/tracks',
    artist_manageTrack_newTrack: '/artist-dashboard/tracks/new-track',
    artist_manageTrack_specifiedTrack: '/artist-dashboard/tracks/:id/*',
    artist_manageTrack_specifiedTrack_nested_edit: '',
    artist_manageTrack_specifiedTrack_nested_albumsOfTrack: 'albums',
    artist_manageTrack_specifiedTrack_nested_lyricsOfTrack: 'lyrics',

    artist_manageAlbum: '/artist-dashboard/albums',
    artist_manageAlbum_newAlbum: '/artist-dashboard/albums/new-track',
    artist_manageAlbum_specifiedAlbum: '/artist-dashboard/albums/:id/*',
    artist_manageAlbum_specifiedAlbum_nested_edit: '',
    artist_manageAlbum_specifiedAlbum_nested_tracksOfAlbum: 'tracks',
};

export default routes;
