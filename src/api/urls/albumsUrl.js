const baseApiUrl = process.env.REACT_APP_API_URL;

// [GET] (admin)
export const getAlbumsInfoUrl = baseApiUrl + '/albums/info';

// [GET] (admin)
export const getAlbumsByContextUrl = baseApiUrl + '/albums/context';

// [GET] get albums by tags
export const getAlbumsByTagsUrl = baseApiUrl + '/albums/tags';

// [GEt] (userauth)
export const getAlbumByIdUrl = (id) => baseApiUrl + `/albums/${id}`;

// [POST]
export const createAlbumUrl = baseApiUrl + `/albums`;

// [PUT] update album
export const updateAlbumUrl = (id) => `/albums/${id}`;

// [DELETE] (admin, artist owner)
export const deleteAlbumUrl = (id) => baseApiUrl + `/albums/${id}`;

// [PUT] (admin, artist owner)
export const toggleReleaseAlbumUrl = (id) => baseApiUrl + `/albums/${id}/release`;

// [DELETE] remove track from album
export const removeTrackFromAlbumUrl = (id) => baseApiUrl + `/albums/${id}/tracks`;

// [POST] add track from album
export const addTrackToAlbumUrl = (albumId) => baseApiUrl + `/albums/${albumId}/tracks`;
