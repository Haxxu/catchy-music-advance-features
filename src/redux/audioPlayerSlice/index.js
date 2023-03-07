import { createSlice } from '@reduxjs/toolkit';

const audioPlayer = createSlice({
    name: 'audioPlayer',
    initialState: {
        currentTrack: null,
        context: null,
        isPlaying: false,
        repeat: 'none',
        shuffle: 'none',
        volume: 40,
        update: false,
    },
    reducers: {
        setCurrentTrack: (state, action) => {
            state.currentTrack = action.payload;
        },

        setContext: (state, action) => {
            state.context = action.payload;
        },

        setRepeat: (state, action) => {
            state.repeat = action.payload;
        },

        setShuffle: (state, action) => {
            state.shuffle = action.payload;
        },

        setVolume: (state, action) => {
            state.volume = action.payload;
        },

        setPlayMode: (state, action) => {
            state.isPlaying = action.payload;
        },

        updateTrack: (state, action) => {
            state.update = !state.update;
        },
    },
});

export const audioPlayerReducer = audioPlayer.reducer;
export const {
    setCurrentTrack,
    setVolume,
    setRepeat,
    setPlayMode,
    setShuffle,
    updateTrack,
    setContext,
} = audioPlayer.actions;

export default audioPlayer;
