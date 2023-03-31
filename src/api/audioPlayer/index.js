import axiosInstance from '~/api/axiosInstance';
import {
    getAudioPlayerStateUrl,
    getCurrentlyPlayingTrackUrl,
    setVolumeUrl,
    pauseTrackUrl,
    playTrackUrl,
    skipNextUrl,
    skipPreviousUrl,
    setRepeatModeUrl,
    setShuffleModeUrl,
    increaseCurrenTrackPlaysUrl,
    setListeningTrackUrl,
    getCurrentPlayingTimeUrl,
} from '~/api/urls/me';
import {
    setCurrentTrack,
    setVolume,
    setPlayMode,
    setShuffle,
    setRepeat,
    updateTrack,
    setContext,
} from '~/redux/audioPlayerSlice';
import { updateQueueState } from '~/redux/updateStateSlice';

export const getAudioPlayerState = async (dispatch, payload) => {
    try {
        const { data } = await axiosInstance.get(getAudioPlayerStateUrl);
        await dispatch(setRepeat(data.data.repeat));
        await dispatch(setShuffle(data.data.shuffle));
        await dispatch(setVolume(data.data.volume));
        await dispatch(setPlayMode(data.data.isPlaying));
    } catch (error) {
        console.log(error);
    }
};

export const getCurrentlyPlayingTrack = async (dispatch, payload) => {
    try {
        const { data } = await axiosInstance.get(getCurrentlyPlayingTrackUrl);
        await dispatch(setCurrentTrack(data.data.currentPlayingTrack));
        await dispatch(setContext(data.data.context));
        // console.log(data.data);
    } catch (error) {
        console.log(error);
    }
};

export const changeVolume = async (dispatch, payload) => {
    try {
        await dispatch(setVolume(payload));
        const { data } = await axiosInstance.put(setVolumeUrl, {}, { params: { volume_percent: payload } });
        if (data) {
        }
    } catch (error) {
        console.log(error);
    }
};

export const playTrack = async (dispatch, payload) => {
    try {
        const { data } = await axiosInstance.put(playTrackUrl, payload);
        if (data) {
            const { data } = await axiosInstance.get(getCurrentlyPlayingTrackUrl);
            // console.log({ context: data.data.context });
            dispatch(setContext(data.data.context));
            dispatch(setCurrentTrack(data.data.currentPlayingTrack));
            dispatch(setPlayMode(true));
            dispatch(updateQueueState());
            // dispatch(updateTrack());
            // console.log('test');
            const { data: data2 } = await axiosInstance.put(increaseCurrenTrackPlaysUrl, {});
            // console.log(data2);
            if (data2) {
            }
        }
    } catch (error) {
        console.log(error);
    }
};

export const pauseTrack = async (dispatch, payload) => {
    try {
        const { data } = await axiosInstance.put(pauseTrackUrl);
        if (data) {
            dispatch(setPlayMode(false));
            dispatch(updateTrack());
        }
    } catch (error) {
        console.log(error);
    }
};

export const skipNext = async (dispatch, payload) => {
    try {
        const { data } = await axiosInstance.post(skipNextUrl, {});
        if (data) {
            const { data } = await axiosInstance.get(getCurrentlyPlayingTrackUrl);
            dispatch(setContext(data.data.context));
            dispatch(setCurrentTrack(data.data.currentPlayingTrack));
            dispatch(setPlayMode(true));
            dispatch(updateQueueState());
            // dispatch(updateTrack());
            // console.log('test');
            const { data: data2 } = await axiosInstance.put(increaseCurrenTrackPlaysUrl, {});
            // console.log(data2);
            if (data2) {
            }
        }
    } catch (err) {
        console.log(err);
    }
};

export const skipPrevious = async (dispatch, payload) => {
    try {
        const { data } = await axiosInstance.post(skipPreviousUrl, {});
        if (data) {
            const { data } = await axiosInstance.get(getCurrentlyPlayingTrackUrl);
            dispatch(setContext(data.data.context));
            dispatch(setCurrentTrack(data.data.currentPlayingTrack));
            dispatch(setPlayMode(true));
            dispatch(updateQueueState());
            // dispatch(updateTrack());
            // console.log('test');
            const { data: data2 } = await axiosInstance.put(increaseCurrenTrackPlaysUrl, {});
            // console.log(data2);
            if (data2) {
            }
        }
    } catch (err) {
        console.log(err);
    }
};

export const changeRepeatMode = async (dispatch, payload) => {
    try {
        const mode = ['none', 'repeat', 'repeat-one'];
        let index = mode.indexOf(payload);
        if (index === 2) {
            index = 0;
        } else {
            index = index + 1;
        }
        const { data } = await axiosInstance.put(setRepeatModeUrl, {}, { params: { type: mode[index] } });
        if (data) {
            dispatch(setRepeat(mode[index]));
        }
    } catch (err) {
        console.log(err);
    }
};

export const changeShuffleMode = async (dispatch, payload) => {
    try {
        let newMode = payload === 'none' ? 'shuffle' : 'none';
        const { data } = await axiosInstance.put(setShuffleModeUrl, {}, { params: { type: newMode } });
        if (data) {
            dispatch(setShuffle(newMode));
            dispatch(updateTrack());
            dispatch(updateQueueState());
        }
    } catch (err) {
        console.log(err);
    }
};

export const setListeningTrack = async (dispatch, payload) => {
    try {
        const { data } = await axiosInstance.put(setListeningTrackUrl, payload);
        console.log(data);
    } catch (err) {
        console.log(err);
    }
};

export const getCurrentPlayingTime = async (dispatch, config) => {
    try {
        const { data } = await axiosInstance.get(getCurrentPlayingTimeUrl, config);

        return data;
    } catch (error) {
        console.log(error);
    }
};
