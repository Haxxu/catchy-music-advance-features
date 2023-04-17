const baseApiUrl = process.env.REACT_APP_API_URL;

// [GET]
export const getUserPostsByUserIdUrl = (userId) => `${baseApiUrl}/users/${userId}/posts`;

// [GET] get post by id
export const getPostByIdUrl = (postId) => `${baseApiUrl}/posts/${postId}`;

// [PATCH] update post by id
export const updatePostByIdUrl = (postId) => `${baseApiUrl}/posts/${postId}`;

// [DELETE] delete post by id
export const deletePostByIdUrl = (postId) => `${baseApiUrl}/posts/${postId}`;

// [POST] create new post
export const createPostUrl = () => `${baseApiUrl}/posts`;

// [GET] get post by tags [following, random, ...]
export const getPostsByTagsUrl = () => `${baseApiUrl}/posts`;
