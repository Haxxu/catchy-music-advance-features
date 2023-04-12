const baseApiUrl = process.env.REACT_APP_API_URL;

export const getCommentsUrl = () => `${baseApiUrl}/comments`;

export const createCommentUrl = () => `${baseApiUrl}/comments`;
