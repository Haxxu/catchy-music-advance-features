const baseApiUrl = process.env.REACT_APP_API_URL;

// [POST] (public)
export const createUserUrl = baseApiUrl + '/users';

// [GET] (admin)
export const getUsersInfoUrl = baseApiUrl + '/users/info';

// [GET] (admin)
export const getUsersByContextUrl = baseApiUrl + '/users/context';

// [GET]
export const getUserByIdUrl = (id) => baseApiUrl + `/users/${id}`;

// [PUT]
export const updateUserByIdUrl = (id) => baseApiUrl + `/users/${id}`;

// [PATCH] (admin) + /:id
export const freezeUserUrl = baseApiUrl + '/users/freeze/';

// [PATCH] (admin) + /:id
export const unfreezeUserUrl = baseApiUrl + '/users/unfreeze/';

// [POST] (admin) + /:id
export const verifyArtistUrl = baseApiUrl + '/users/verify-artist/';

// [POST] (admin) + /:id
export const unverifyArtistUrl = baseApiUrl + '/users/unverify-artist/';
