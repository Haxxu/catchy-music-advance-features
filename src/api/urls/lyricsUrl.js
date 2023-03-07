const baseApiUrl = process.env.REACT_APP_API_URL;

// [GET]
export const getAllLyricsOfTrackUrl = (trackId) => baseApiUrl + `/lyrics/track/${trackId}`;

// [GET]
export const getLyricByIdUrl = (id) => baseApiUrl + `/lyrics/${id}`;

// [DELETE]
export const deleteLyricUrl = (id) => baseApiUrl + `/lyrics/${id}`;

// [POST] create lyric
export const createLyricUrl = baseApiUrl + '/lyrics';

// [PUT] update lyric
export const updateLyricUrl = (id) => `/lyrics/${id}`;
