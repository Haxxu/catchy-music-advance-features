const routes = {
    // public routes
    signup: '/signup',
    login: '/login',
    unAuthorized: '/unauthorized',
    notFound: '/not-found',
    active: '/active/:active_token',

    // private routes
    home: '/',
    posts: '/posts',
    search: '/search',
    library: '/library/*',
    library_home: '/library/playlists',
    library_albums_route: '/library/albums',
    library_artists_route: '/library/artists',
    library_playlists: 'playlists',
    library_albums: 'albums',
    library_artists: 'artists',
    library_podcasters: 'podcasters',
    library_podcasts: 'podcasts',
    library_posts: 'posts',
    likedTracks: '/library/tracks',
    likedEpisodes: '/library/episodes',
    playlist: '/playlist/:id',
    artist: '/artist/:id',
    podcaster: '/podcaster/:id',
    user: '/user/:id',
    profile: '/profile',
    settings: '/settings',
    lyrics: '/lyrics',
    comments: '/:contextType/:contextId/comments',
    queue: '/queue',
    album: '/album/:id',
    podcast: '/podcast/:id',
    track: '/track/:id/album/:albumId',
    episode: '/episode/:id/podcast/:podcastId',
    genre: '/genre/:id',

    // Manage posts
    managePosts: '/manage-posts/',
    managePosts_posts: '/manage-posts/posts',
    managePosts_newPost: '/manage-posts/posts/new-post',
    managePosts_specifiedPost: '/manage-posts/posts/:id/*',
    managePosts_specifiedPost_nested_edit: '',
    managePosts_specifiedPost_nested_comments: 'comments',

    // admin routes
    admin_dashboard: '/admin-dashboard/home',

    admin_manageUser: '/admin-dashboard/users',
    admin_manageArtist: '/admin-dashboard/artists',
    admin_managePodcaster: '/admin-dashboard/podcasters',
    admin_manageTrack: '/admin-dashboard/tracks',
    admin_manageAlbum: '/admin-dashboard/albums',
    admin_managePodcast: '/admin-dashboard/podcasts',
    admin_managePlaylist: '/admin-dashboard/playlists',
    admin_manageGenre: '/admin-dashboard/genres',
    admin_manageGenre_genreForm: '/admin-dashboard/genres/:id',
    admin_managePost: '/admin-dashboard/posts',

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

    // podcaster routes
    podcaster_dashboard: '/podcaster-dashboard/home',

    podcaster_manageEpisode: '/podcaster-dashboard/episodes',
    podcaster_manageEpisode_newEpisode: '/podcaster-dashboard/episodes/new-episode',
    podcaster_manageEpisode_specifiedEpisode: '/podcaster-dashboard/episodes/:id/*',
    podcaster_manageEpisode_specifiedEpisode_nested_edit: '',
    podcaster_manageEpisode_specifiedEpisode_nested_podcastsOfEpisode: 'podcasts',
    podcaster_manageEpisode_specifiedEpisode_nested_lyricsOfEpisode: 'lyrics',

    podcaster_managePodcast: '/podcaster-dashboard/podcasts',
    podcaster_managePodcast_newPodcast: '/podcaster-dashboard/podcasts/new-podcast',
    podcaster_managePodcast_specifiedPodcast: '/podcaster-dashboard/podcasts/:id/*',
    podcaster_managePodcast_specifiedPodcast_nested_edit: '',
    podcaster_managePodcast_specifiedPodcast_nested_episodesOfPodcast: 'episodes',
};

export default routes;
