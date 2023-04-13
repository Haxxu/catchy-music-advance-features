const baseApiUrl = process.env.REACT_APP_API_URL;

export const getCommentsUrl = () => `${baseApiUrl}/comments`;

export const createCommentUrl = () => `${baseApiUrl}/comments`;

export const updateCommentByIdUrl = (commentId) => `${baseApiUrl}/comments/${commentId}`;

export const deleteCommentByIdUrl = (commentId) => `${baseApiUrl}/comments/${commentId}`;

export const replyCommentUrl = () => `${baseApiUrl}/comments/reply`;
