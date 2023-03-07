const baseApiUrl = process.env.REACT_APP_API_URL;

// [GET]
export const getGenresUrl = baseApiUrl + '/genres';

// [GET]
export const getGenreByIdUrl = (id) => baseApiUrl + `/genres/${id}`;

// [DELETE]
export const deleteGenreUrl = (id) => baseApiUrl + `/genres/${id}`;

// [POST]
export const createGenreUrl = baseApiUrl + '/genres';

// [PUT]
export const updateGenreUrl = (id) => baseApiUrl + `/genres/${id}`;
