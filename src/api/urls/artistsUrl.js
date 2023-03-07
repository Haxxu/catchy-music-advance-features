const baseApiUrl = process.env.REACT_APP_API_URL;

// [GET]
export const getArtistsInfoUrl = baseApiUrl + '/artists/info';

// [GET]
export const getArtistsByContextUrl = baseApiUrl + '/artists/context';

// [GET]
export const getArtistsUrl = baseApiUrl + '/artists/all';

// [GET]
export const getArtistByIdUrl = (id) => baseApiUrl + `/artists/${id}`;

// [GET]
export const getArtistTracksUrl = (id) => baseApiUrl + `/artists/${id}/tracks`;

// [GET] get artist albums
export const getArtistAlbumsUrl = (id) => baseApiUrl + `/artists/${id}/albums`;
