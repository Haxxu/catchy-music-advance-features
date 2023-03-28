const baseApiUrl = process.env.REACT_APP_API_URL;

// [GET]
export const getTracksInfoUrl = baseApiUrl + '/tracks/info';

// [GET]
export const getTracksByContextUrl = baseApiUrl + '/tracks/context';

// [DELETE]
export const deleteTrackUrl = (id) => baseApiUrl + `/tracks/${id}`;

// [GET] get track by id
export const getTrackByIdUrl = (id) => baseApiUrl + `/tracks/${id}`;

// [GET] get lyric of track
export const getLyricsOfTrack = (trackId) => baseApiUrl + `/tracks/${trackId}/lyrics`;

// [POST] create track
export const createTrackUrl = baseApiUrl + '/tracks';

// [PUT] update track
export const updateTrackUrl = (id) => baseApiUrl + `/tracks/${id}`;

// [DELETE]
export const deleteEpisodeUrl = (id) => baseApiUrl + `/episodes/${id}`;

// [POST] create episode
export const createEpisodeUrl = baseApiUrl + '/episodes';

// [PUT] update episode
export const updateEpisodeUrl = (id) => baseApiUrl + `/episodes/${id}`;

// [GET] get episode by id
export const getEpisodeByIdUrl = (id) => baseApiUrl + `/episodes/${id}`;
