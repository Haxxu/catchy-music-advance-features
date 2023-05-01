import { toast } from 'react-toastify';
import axiosInstance from '~/api/axiosInstance';
import { deletePostByIdUrl, getPostsByTagsUrl } from '~/api/urls/postUrl';
import { deletePostAction, getPostsAction, likePostAction } from '~/redux/postSlice';
import { getLikedPostsUrl, likePostUrl, unlikePostUrl } from '~/api/urls/me';

export const getPosts = async (dispatch) => {
    try {
        const res = await axiosInstance.get(getPostsByTagsUrl(), {
            params: {
                tags: ['following', 'random', 'my-posts'],
                limit: 10,
            },
        });

        const posts = mergeSortAndRemoveDuplicates(
            res.data.data.following,
            res.data.data.random,
            res.data.data.myPosts,
        );

        if (res.status === 200) {
            dispatch(
                getPostsAction({
                    posts,
                }),
            );
        }
    } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
    }
};

export const getLikedPosts = async (dispatch) => {
    try {
        const res = await axiosInstance.get(getLikedPostsUrl());

        if (res.status === 200) {
            dispatch(
                getPostsAction({
                    posts: res.data.data,
                }),
            );
        }
    } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
    }
};

export const likePost = async (dispatch, post) => {
    try {
        const res = await axiosInstance.put(likePostUrl(), {
            post: post._id,
        });
        if (res.status === 200) {
            dispatch(likePostAction(res.data.data));
        }
    } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
    }
};

export const unlikePost = async (dispatch, post) => {
    try {
        const res = await axiosInstance.delete(unlikePostUrl(), {
            data: {
                post: post._id,
            },
        });
        if (res.status === 200) {
            dispatch(likePostAction(res.data.data));
        }
    } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
    }
};

export const deletePost = async (dispatch, post) => {
    try {
        const res = await axiosInstance.delete(deletePostByIdUrl(post._id));

        if (res.status === 200) {
            dispatch(deletePostAction(res.data.data));
            toast.success(res.data.message);
        }
    } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
    }
};

// function mergeAndShuffleArrays(arr1, arr2) {
//     // Merge the arrays
//     const mergedArr = arr1.concat(arr2);

//     // Shuffle the merged array
//     for (let i = mergedArr.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [mergedArr[i], mergedArr[j]] = [mergedArr[j], mergedArr[i]];
//     }

//     // Return the shuffled merged array
//     return mergedArr;
// }

function mergeSortAndRemoveDuplicates(...arrays) {
    // merge arrays
    const merged = [].concat(...arrays);

    // sort by createdAt in descending order
    merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // remove duplicates by _id
    const output = merged.reduce((acc, curr) => {
        if (!acc.find((e) => e._id === curr._id)) {
            acc.push(curr);
        }
        return acc;
    }, []);

    return output;
}
