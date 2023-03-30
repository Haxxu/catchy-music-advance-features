import { createSlice } from '@reduxjs/toolkit';

const updateState = createSlice({
    name: 'updateState',
    initialState: {
        likeTrackState: false,
        likeEpisodeState: false,
        playlistState: false,
        playlistsInSidebarState: false,
        userProfileState: false,
        userPageState: false,
        albumState: false,
        podcastState: false,
        queueState: false,
    },
    reducers: {
        updateLikeTrackState: (state, payload) => {
            state.likeTrackState = !state.likeTrackState;
        },

        updateLikeEpisodeState: (state, payload) => {
            state.likeEpisodeState = !state.likeEpisodeState;
        },

        updatePlaylistState: (state, payload) => {
            state.playlistState = !state.playlistState;
        },

        updatePlaylistInSidebarState: (state, payload) => {
            state.playlistsInSidebarState = !state.playlistsInSidebarState;
        },

        updateUserProfileState: (state, payload) => {
            state.userProfileState = !state.userProfileState;
        },

        updateUserPageState: (state, payload) => {
            state.userPageState = !state.userPageState;
        },

        updateAlbumState: (state, payload) => {
            state.albumState = !state.albumState;
        },

        updatePodcastState: (state, payload) => {
            state.albumState = !state.podcastState;
        },

        updateQueueState: (state, payload) => {
            state.queueState = !state.queueState;
        },
    },
});

export const updateStateReducer = updateState.reducer;
export const {
    updateLikeTrackState,
    updateLikeEpisodeState,
    updatePlaylistState,
    updatePlaylistInSidebarState,
    updateUserProfileState,
    updateUserPageState,
    updateAlbumState,
    updatePodcastState,
    updateQueueState,
} = updateState.actions;

export default updateState;
