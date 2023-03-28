const baseApiUrl = process.env.REACT_APP_API_URL;

// [GET]
export const getArtistsInfoUrl = baseApiUrl + '/artists/info';

// [GET]
export const getArtistsByContextUrl = baseApiUrl + '/artists/context';

// [GET]
export const getPodcastersUrl = baseApiUrl + '/podcasters/all';

// [GET]
export const getArtistByIdUrl = (id) => baseApiUrl + `/artists/${id}`;

// [GET]
export const getPodcasterEpisodesUrl = (id) => baseApiUrl + `/podcasters/${id}/episodes`;

// [GET] get artist albums
export const getPodcasterPodcastsUrl = (id) => baseApiUrl + `/podcasters/${id}/podcasts`;
