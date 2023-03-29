const baseApiUrl = process.env.REACT_APP_API_URL;

// [GET]
export const getPodcastersInfoUrl = baseApiUrl + '/podcasters/info';

// [GET]
export const getPodcastersByContextUrl = baseApiUrl + '/podcasters/context';

// [GET]
export const getPodcastersUrl = baseApiUrl + '/podcasters/all';

// [GET]
export const getPodcasterByIdUrl = (id) => baseApiUrl + `/podcasters/${id}`;

// [GET]
export const getPodcasterEpisodesUrl = (id) => baseApiUrl + `/podcasters/${id}/episodes`;

// [GET] get podcaster podcasts
export const getPodcasterPodcastsUrl = (id) => baseApiUrl + `/podcasters/${id}/podcasts`;
