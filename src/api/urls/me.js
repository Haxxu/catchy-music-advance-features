const baseApiUrl = process.env.REACT_APP_API_URL;

// [GET]
export const getCurrentUserProfileUrl = baseApiUrl + '/me';

// [GET] get liked tracks
export const getLikedTracksUrl = baseApiUrl + '/me/tracks';

// [GET] get saved playlists
export const getSavedPlaylistsUrl = baseApiUrl + '/me/playlists';

// [GET] get saved albums
export const getSavedAlbumsUrl = baseApiUrl + '/me/albums';

// [GET] get following user
export const getFollowingUsersUrl = baseApiUrl + '/me/following';

// [GET] get audio player state
export const getAudioPlayerStateUrl = baseApiUrl + '/me/audio-player';

// [GET] get queue
export const getQueueUrl = baseApiUrl + '/me/audio-player/queue';

// [PUT] increase track play
export const increaseCurrenTrackPlaysUrl = baseApiUrl + '/me/audio-player/currently-playing/increase';

// [POST] add item to queue
export const addItemsToQueueUrl = baseApiUrl + '/me/audio-player/queue';

// [DELETE] add item to queue
export const removeItemsFromQueueUrl = baseApiUrl + '/me/audio-player/queue';

// [GET] get audio player state
export const getCurrentlyPlayingTrackUrl = baseApiUrl + '/me/audio-player/currently-playing';

// [PUT] set volume
export const setVolumeUrl = baseApiUrl + '/me/audio-player/volume';

// [PUT] pause track
export const pauseTrackUrl = baseApiUrl + '/me/audio-player/pause';

// [PUT] play track
export const playTrackUrl = baseApiUrl + '/me/audio-player/play';

// [POST] skip next
export const skipNextUrl = baseApiUrl + '/me/audio-player/next';

// [POST] skip previous
export const skipPreviousUrl = baseApiUrl + '/me/audio-player/previous';

// [PUT] set repeat mode
export const setShuffleModeUrl = baseApiUrl + '/me/audio-player/shuffle';

// [PUT] set repeat mode
export const setRepeatModeUrl = baseApiUrl + '/me/audio-player/repeat';

// [GET] check liked track
export const checkLikedTrackUrl = baseApiUrl + '/me/tracks/contains';

// [GET] check saved album
export const checkSavedAlbumUrl = baseApiUrl + '/me/albums/contains';

// [GET] check saved playlist
export const checkSavedPlaylistUrl = baseApiUrl + '/me/playlists/contains';

// [GET] check following user
export const checkFollowingUserUrl = baseApiUrl + '/me/following/contains';

// [DELETE] remove liked track from library
export const removeLikedTrackFromLibraryUrl = baseApiUrl + '/me/tracks';

// [PUT] save track to library
export const saveTrackToLibraryUrl = baseApiUrl + '/me/tracks';

// [DELETE] remove album from library
export const removeAlbumFromLibraryUrl = baseApiUrl + '/me/albums';

// [PUT] save album to library
export const saveAlbumToLibraryUrl = baseApiUrl + '/me/albums';

// [DELETE] remove playlist from library
export const removePlaylistFromLibraryUrl = baseApiUrl + '/me/playlists';

// [PUT] save playlist to library
export const savePlaylistToLibraryUrl = baseApiUrl + '/me/playlists';

// [DELETE] remove playlist from library
export const followUserUrl = baseApiUrl + '/me/following';

// [PUT] save playlist to library
export const unfollowUserUrl = baseApiUrl + '/me/following';
