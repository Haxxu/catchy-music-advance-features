const baseApiUrl = process.env.REACT_APP_API_URL;

// [GET]
export const getPlaylistsInfoUrl = baseApiUrl + '/playlists/info';

// [GET]
export const getPlaylistsByContextUrl = baseApiUrl + '/playlists/context';

// [GET] get popular playlists
export const getPopularPlaylistsUrl = baseApiUrl + '/playlists/popular';

// [GET] get playlists by tags
export const getPlaylistsByTagsUrl = baseApiUrl + '/playlists/tags';

// [GET] get playlist by id
export const getPlaylistByIdUrl = (id) => baseApiUrl + `/playlists/${id}`;

// [POST] create new playlist
export const createPlaylistUrl = baseApiUrl + `/playlists`;

// [PUT] update playlist by id
export const updatePlaylistUrl = (id) => baseApiUrl + `/playlists/${id}`;

// [PUT]
export const togglePublicPlaylistUrl = (id) => baseApiUrl + `/playlists/${id}/toggle-public`;

// [DELETE]
export const deletePlaylistUrl = (id) => baseApiUrl + `/playlists/${id}`;

// [DELETE] reomve track from playlist
export const removeTrackFromPlaylistUrl = (id) => baseApiUrl + `/playlists/${id}/tracks`;

// [POST] add track to playlist
export const addTrackToPlaylistUrl = (playlistId) => baseApiUrl + `/playlists/${playlistId}/tracks`;
