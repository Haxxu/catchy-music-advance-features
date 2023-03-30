const baseApiUrl = process.env.REACT_APP_API_URL;

// [GET] (admin)
export const getPodcastsInfoUrl = baseApiUrl + '/podcasts/info';

// [GET] (admin)
export const getPodcastsByContextUrl = baseApiUrl + '/podcasts/context';

// [GET] get albums by tags
export const getPodcastsByTagsUrl = baseApiUrl + '/podcasts/tags';

// [GEt] (userauth)
export const getPodcastByIdUrl = (id) => baseApiUrl + `/podcasts/${id}`;

// [POST]
export const createPodcastUrl = baseApiUrl + `/podcasts`;

// [PUT] update album
export const updatePodcastUrl = (id) => `/podcasts/${id}`;

// [DELETE] (admin, podcaster owner)
export const deletePodcastUrl = (id) => baseApiUrl + `/podcasts/${id}`;

// [PUT] (admin, podcaster owner)
export const toggleReleasePodcastUrl = (id) => baseApiUrl + `/podcasts/${id}/release`;

// [DELETE] remove episode from podcast
export const removeEpisodeFromPodcastUrl = (id) => baseApiUrl + `/podcasts/${id}/episodes`;

// [POST] add episode from podcast
export const addEpisodeToPodcastUrl = (id) => baseApiUrl + `/podcasts/${id}/episodes`;
