const ApiError = require('../../utils/ApiError');
const { Album } = require('../models/Album');
const { AudioPlayer } = require('../models/AudioPlayer');
const { Library } = require('../models/Library');
const { Playlist } = require('../models/Playlist');
const { Track } = require('../models/Track');
const AudioPlayerService = require('../services/AudioPlayerService');
const PodcastService = require('../services/PodcastService');

class AudioPlayerController {
    async play(req, res, next) {
        try {
            const player = await AudioPlayer.findOne({ owner: req.user._id });
            if (!player) {
                return res.status(404).send({ message: 'AudioPlayer does not exist' });
            }

            if (!req.body.context_uri && player.currentPlayingTrack.track !== '') {
                player.isPlaying = true;
                await player.save();
                return res.status(200).send({ message: 'Resume track succesffuly' });
            }

            let [contextType, contextId, trackId, albumId, trackContextType] = req.body.context_uri.split(':');
            // Tuy vao truong hop ma trackContext la album hoac podcast (moi track phai thuoc 1 trong
            // cac type song, episode, chapter => album, podcast, audiobook)
            let trackContextId = albumId;
            if (!trackContextType) trackContextType = 'album';

            if (contextType === 'album') {
                const album = await Album.findOne({ _id: contextId }).lean();
                if (!album) {
                    return res.status(404).send({ message: 'Album does not exist' });
                }

                const object = {
                    player,
                    tracks: album.tracks.map((obj) => ({ track: obj.track, album: albumId })),
                    contextType,
                    contextId,
                    albumId,
                    trackId,
                    trackContextId,
                    trackContextType,
                    position: req.body.position,
                    context_uri: req.body.context_uri,
                };

                if (player.shuffle === 'none') {
                    playWithShuffleOff(object);
                } else {
                    playWithShuffleOn(object);
                }
            } else if (contextType === 'playlist') {
                const playlist = await Playlist.findOne({ _id: contextId }).lean();
                if (!playlist) {
                    return res.status(404).send({ message: 'Playlist does not exist' });
                }

                const object = {
                    player,
                    tracks: playlist.tracks,
                    contextType,
                    contextId,
                    albumId,
                    trackId,
                    trackContextId,
                    trackContextType,
                    position: req.body.position,
                    context_uri: req.body.context_uri,
                };

                if (player.shuffle === 'none') {
                    playWithShuffleOff(object);
                } else {
                    playWithShuffleOn(object);
                }
            } else if (contextType === 'liked') {
                const library = await Library.findOne({ _id: contextId }).lean();
                if (!library) {
                    return res.status(404).send({ message: 'Library does not exist' });
                }

                const object = {
                    player,
                    tracks: library.likedTracks,
                    contextType,
                    contextId,
                    albumId,
                    trackId,
                    trackContextId,
                    trackContextType,
                    position: req.body.position,
                    context_uri: req.body.context_uri,
                };

                if (player.shuffle === 'none') {
                    playWithShuffleOff(object);
                } else {
                    playWithShuffleOn(object);
                }
            } else if (contextType === 'podcast') {
                const podcast = await PodcastService.findOne({ _id: contextId });
                if (!podcast) {
                    return next(new ApiError(404, 'Podcast not found.'));
                }

                const object = {
                    player,
                    tracks: podcast.episodes.map((obj) => ({ track: obj.track, podcast: podcast._id })),
                    contextType,
                    contextId,
                    albumId,
                    trackId,
                    trackContextId,
                    trackContextType,
                    position: req.body.position,
                    context_uri: req.body.context_uri,
                };

                if (player.shuffle === 'none') {
                    playWithShuffleOff(object);
                } else {
                    playWithShuffleOn(object);
                }
            }

            await player.save();
            return res.status(200).send({ message: 'Start track successfuly' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }
    async pause(req, res, next) {
        try {
            const player = await AudioPlayer.findOne({ owner: req.user._id });
            if (!player) {
                return res.status(404).send({ message: 'Audio Player does not exist' });
            }

            player.isPlaying = false;
            await player.save();

            return res.status(200).send({ message: 'Pause track successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async skipToNext(req, res, next) {
        try {
            const player = await AudioPlayerService.findOne({ owner: req.user._id });
            if (!player) {
                return res.status(404).send({ message: 'Audio player not found' });
            }

            // Co track trong queue
            if (player.queue.tracks[0]) {
                if (player.queue.currentTrackWhenQueueActive === null) {
                    player.queue.currentTrackWhenQueueActive = { ...player.currentPlayingTrack };
                }

                const track = player.queue.tracks.shift();
                player.currentPlayingTrack = {
                    track: track.track,
                    album: track.album,
                    context_uri: track.context_uri,
                    position: track.position,
                    podcast: track.podcast,
                    trackType: track.trackType,
                };

                await player.save();
                return res.status(200).send({ message: 'skip to next' });
            } else if (!player.queue.tracks[0] && player.queue.currentTrackWhenQueueActive !== null) {
                player.currentPlayingTrack = { ...player.queue.currentTrackWhenQueueActive };
                player.queue.currentTrackWhenQueueActive = null;
            }

            if (player.currentPlayingTrack.position === -1 || player.currentPlayingTrack.track === '') {
                // doi sang track ngau nhien
            } else {
                let [contextType, contextId, trackId, albumId, trackContextType] =
                    player.currentPlayingTrack.context_uri.split(':');
                let trackContextId = albumId;
                if (!trackContextType) trackContextType = 'album';

                if (contextType === 'album') {
                    const album = await Album.findOne({ _id: contextId }).lean();
                    if (!album) {
                        return res.status(404).send({ message: 'Album not found' });
                    }

                    const object = {
                        player,
                        tracks: album.tracks.map((obj) => ({
                            track: obj.track,
                            album: album._id,
                            trackType: 'song',
                        })),
                        contextType,
                        contextId,
                        albumId,
                        trackId,
                        trackContextId,
                        trackContextType,
                    };

                    if (player.shuffle === 'none') {
                        skipNextWithShuffleOff(object);
                    } else {
                        skipNextWithShuffleOn(object);
                    }
                } else if (contextType === 'playlist') {
                    const playlist = await Playlist.findOne({ _id: contextId }).lean();
                    if (!playlist) {
                        return res.status(404).send({ message: 'Playlist not found' });
                    }
                    const object = {
                        player,
                        tracks: playlist.tracks,
                        contextType,
                        contextId,
                        albumId,
                        trackId,
                        trackContextId,
                        trackContextType,
                    };

                    if (player.shuffle === 'none') {
                        skipNextWithShuffleOff(object);
                    } else {
                        skipNextWithShuffleOn(object);
                    }
                } else if (contextType === 'liked') {
                    const library = await Library.findOne({ _id: contextId }).lean();
                    if (!library) {
                        return res.status(404).send({ message: 'Library not found' });
                    }

                    const object = {
                        player,
                        tracks: library.likedTracks,
                        contextType,
                        contextId,
                        albumId,
                        trackId,
                        trackContextId,
                        trackContextType,
                    };

                    if (player.shuffle === 'none') {
                        skipNextWithShuffleOff(object);
                    } else {
                        skipNextWithShuffleOn(object);
                    }
                } else if (contextType === 'podcast') {
                    const podcast = await PodcastService.findOne({ _id: contextId });
                    if (!podcast) {
                        return next(new ApiError(404, 'Podcast not found.'));
                    }

                    const object = {
                        player,
                        tracks: podcast.episodes.map((obj) => ({
                            track: obj.track,
                            podcast: podcast._id,
                            trackType: 'episode',
                        })),
                        contextType,
                        contextId,
                        albumId,
                        trackId,
                        trackContextId,
                        trackContextType,
                    };

                    if (player.shuffle === 'none') {
                        skipNextWithShuffleOff(object);
                    } else {
                        skipNextWithShuffleOn(object);
                    }
                }
            }

            player.isPlaying = true;
            await player.save();
            return res.status(200).send({ message: 'skip to next' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async skipToPrevious(req, res, next) {
        try {
            const player = await AudioPlayer.findOne({ owner: req.user._id });
            if (!player) {
                return res.status(404).send({ message: 'Audio player not found' });
            }

            if (player.queue.currentTrackWhenQueueActive !== null) {
                player.currentPlayingTrack = { ...player.queue.currentTrackWhenQueueActive };
                player.queue.currentTrackWhenQueueActive = null;

                await player.save();
                return res.status(200).send({ message: 'skip to previous' });
            }

            if (player.currentPlayingTrack.position === -1 || player.currentPlayingTrack.track === '') {
                // doi sang track ngau nhien
            } else {
                let [contextType, contextId, trackId, albumId, trackContextType] =
                    player.currentPlayingTrack.context_uri.split(':');
                let trackContextId = albumId;
                if (!trackContextType) trackContextType = 'album';

                if (contextType === 'album') {
                    const album = await Album.findOne({ _id: contextId });
                    if (!album) {
                        return res.status(404).send({ message: 'Album not found' });
                    }

                    const object = {
                        player,
                        tracks: album.tracks.map((obj) => ({
                            track: obj.track,
                            album: album._id,
                            trackType: 'song',
                        })),
                        contextType,
                        contextId,
                        albumId,
                        trackId,
                        trackContextId,
                        trackContextType,
                    };

                    if (player.shuffle == 'none') {
                        skipPreviousWithShuffleOff(object);
                    } else {
                        skipPreviousWithShuffleOn(object);
                    }
                } else if (contextType === 'playlist') {
                    const playlist = await Playlist.findOne({ _id: contextId });
                    if (!playlist) {
                        return res.status(404).send({ message: 'Playlist not found' });
                    }
                    const object = {
                        player,
                        tracks: playlist.tracks,
                        contextType,
                        contextId,
                        albumId,
                        trackId,
                        trackContextId,
                        trackContextType,
                    };
                    if (player.shuffle == 'none') {
                        skipPreviousWithShuffleOff(object);
                    } else {
                        skipPreviousWithShuffleOn(object);
                    }
                } else if (contextType === 'liked') {
                    const library = await Library.findOne({ _id: contextId });
                    if (!library) {
                        return res.status(404).send({ message: 'Library not found' });
                    }
                    const object = {
                        player,
                        tracks: library.likedTracks,
                        contextType,
                        contextId,
                        albumId,
                        trackId,
                        trackContextId,
                        trackContextType,
                    };

                    if (player.shuffle == 'none') {
                        skipPreviousWithShuffleOff(object);
                    } else {
                        skipPreviousWithShuffleOn(object);
                    }
                } else if (contextType === 'podcast') {
                    const podcast = await PodcastService.findOne({ _id: contextId });
                    if (!podcast) {
                        return next(new ApiError(404, 'Podcast not found.'));
                    }

                    const object = {
                        player,
                        tracks: podcast.episodes.map((obj) => ({
                            track: obj.track,
                            podcast: podcast._id,
                            trackType: 'episode',
                        })),
                        contextType,
                        contextId,
                        albumId,
                        trackId,
                        trackContextId,
                        trackContextType,
                    };

                    if (player.shuffle == 'none') {
                        skipPreviousWithShuffleOff(object);
                    } else {
                        skipPreviousWithShuffleOn(object);
                    }
                }
            }

            player.isPlaying = true;
            await player.save();
            return res.status(200).send({ message: 'skip to previous' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async setShuffle(req, res, next) {
        try {
            const player = await AudioPlayer.findOne({ owner: req.user._id });
            if (!player) {
                return res.status(404).send({ message: 'Audio Player not found' });
            }

            if (!req.query.type || req.query.type === 'none') {
                player.shuffle = 'none';
                player.shuffleTracks = [];
                player.shufflePosition = -1;
            } else if (req.query.type === 'shuffle') {
                if (player.currentPlayingTrack.track !== '' && player.currentPlayingTrack.album !== '') {
                    const [contextType, contextId, trackId, albumId] =
                        player.currentPlayingTrack.context_uri.split(':');
                    let tracks;

                    if (contextType === 'album') {
                        const album = await Album.findOne({ _id: contextId });
                        if (!album) {
                            return res.status(404).send({ message: 'Album not found' });
                        }
                        tracks = album.tracks.map((obj, index) => ({
                            track: obj.track,
                            album: albumId,
                            position: index,
                            context_uri: contextType + ':' + contextId + ':' + obj.track + albumId,
                        }));
                    } else if (contextType === 'playlist') {
                        const playlist = await Playlist.findOne({ _id: contextId });
                        if (!playlist) {
                            return res.status(404).send({ message: 'Playlist not found' });
                        }
                        tracks = playlist.tracks.map((obj, index) => ({
                            track: obj.track,
                            album: obj.album,
                            position: index,
                            context_uri: contextType + ':' + contextId + ':' + obj.track + obj.album,
                        }));
                    } else if (contextType === 'liked') {
                        const library = await Library.findOne({ _id: contextId });
                        if (!library) {
                            return res.status(404).send({ message: 'Library not found' });
                        }
                        tracks = library.likedTracks.map((obj, index) => ({
                            track: obj.track,
                            album: obj.album,
                            position: index,
                            context_uri: contextType + ':' + contextId + ':' + obj.track + obj.album,
                        }));
                    }
                    player.shuffle = 'shuffle';
                    player.shuffleTracks = shuffleArray(tracks);
                    player.shufflePosition = player.shuffleTracks
                        .map((obj) => obj.track + obj.album)
                        .indexOf(trackId + albumId);
                }
            }

            await player.save();

            return res.status(200).send({ message: 'Set shuffle mode successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async setRepeat(req, res, next) {
        try {
            const player = await AudioPlayer.findOne({ owner: req.user._id });
            if (!player) {
                return res.status(404).send({ message: 'Audio Player does not exist' });
            }
            if (!req.query.type || req.query.type === 'none') {
                player.repeat = 'none';
            } else if (req.query.type === 'repeat') {
                player.repeat = 'repeat';
            } else if (req.query.type === 'repeat-one') {
                player.repeat = 'repeat-one';
            } else {
                player.repeat = 'none';
            }
            await player.save();

            return res.status(200).send({ message: 'Set repeat mode successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async setVolume(req, res, next) {
        try {
            const player = await AudioPlayer.findOne({ owner: req.user._id });
            if (!player) {
                return res.status(404).send({ message: 'Audio Player does not exist' });
            }

            if (req.query.volume_percent) {
                player.volume = req.query.volume_percent;
                if (player.volume < 0) {
                    player.volume = 0;
                } else if (player.volume > 100) {
                    player.volume = 100;
                }
                await player.save();
            }

            return res.status(200).send({ message: 'Set volume to ' + player.volume });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async addItemsToQueue(req, res, next) {
        try {
            const player = await AudioPlayer.findOne({ owner: req.user._id });
            if (!player) {
                return res.status(404).send({ message: 'AudioPlayer not found' });
            }
            let items = req.body.items;

            for (let item of items) {
                let [contextType, contextId, trackId, albumId, trackContextType] = item.context_uri.split(':');
                let trackContextId = albumId;
                if (!trackContextType) trackContextType = 'album';
                let trackType = trackContextType === 'album' ? 'song' : 'episode';

                if (!player.queue.tracks[0]) {
                    player.queue.tracks.push({
                        track: trackId,
                        album: '',
                        podcast: '',
                        [trackContextType]: trackContextId,
                        context_uri: item.context_uri,
                        position: item.position,
                        trackType,
                        addedAt: Date.now(),
                        order: 0,
                    });
                } else {
                    player.queue.tracks.push({
                        track: trackId,
                        album: '',
                        podcast: '',
                        [trackContextType]: trackContextId,
                        context_uri: item.context_uri,
                        position: item.position,
                        trackType,
                        addedAt: Date.now(),
                        order: player.queue.tracks[player.queue.tracks.length - 1].order + 1,
                    });
                }
            }

            await player.save();
            return res.status(200).send({ message: 'Add track to queue' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async removeItemsFromQueue(req, res, next) {
        try {
            const player = await AudioPlayer.findOne({ owner: req.user._id });
            if (!player) {
                return res.status(404).send({ message: 'AudioPlayer not found' });
            }
            let items = req.body.items;
            // Hang doi co track
            if (player.queue.tracks[0]) {
                items.forEach((item) => {
                    let index = player.queue.tracks
                        .map((obj) => obj.context_uri + obj.order)
                        .indexOf(item.context_uri + item.order);
                    player.queue.tracks.splice(index, 1);
                });
            }
            await player.save();
            return res.status(200).send({ message: 'Remove track from queue' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getAudioPlayerState(req, res, next) {
        try {
            const player = await AudioPlayer.findOne({ owner: req.user._id }).lean();
            if (!player) {
                return res.status(404).send({ message: 'AudioPlayer not found' });
            }

            const context = {};
            if (player.currentPlayingTrack.context_uri !== '') {
                const [contextType, contextId, trackId, albumId] = player.currentPlayingTrack.context_uri.split(':');
                context.type = contextType;
                context._id = contextId;
                context.trackId = trackId;
                context.albumId = albumId;
            }

            return res
                .status(200)
                .send({ data: { ...player, context }, message: 'Get audio player state successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getQueue(req, res, next) {
        try {
            const player = await AudioPlayer.findOne({ owner: req.user._id }).lean();
            if (!player) {
                return res.status(404).send({ message: 'Audio Player not found' });
            }

            const [contextType, contextId, trackId, albumId] = player.currentPlayingTrack.context_uri.split(':');

            let currentTrack;

            const t = await Track.findOne({ _id: trackId });
            const a = await Album.findOne({ _id: albumId });

            currentTrack = {
                track: t,
                album: a,
                context_uri: player.currentPlayingTrack.context_uri,
                position: player.currentPlayingTrack.position,
            };

            async function getTracksInQueue(item) {
                const track = await Track.findOne({ _id: item.track });
                const album = await Album.findOne({ _id: item.album });
                return {
                    track: track,
                    album: album,
                    addedAt: item.addedAt,
                    context_uri: item.context_uri,
                    position: item.position,
                    order: item.order,
                };
            }

            const tracksInQueue = await Promise.all(player.queue.tracks.map(getTracksInQueue));

            let nextTracks;

            if (player.shuffle !== 'none') {
                async function getTracksInShuffle(item) {
                    const track = await Track.findOne({ _id: item.track });
                    const album = await Album.findOne({ _id: item.album });
                    return {
                        track: track,
                        album: album,
                        context_uri: item.context_uri,
                        position: item.position,
                    };
                }

                let index;
                if (player.queue.currentTrackWhenQueueActive) {
                    index = player.shuffleTracks
                        .map((item) => item.position)
                        .indexOf(player.queue.currentTrackWhenQueueActive?.position);
                } else {
                    index = player.shuffleTracks
                        .map((item) => item.position)
                        .indexOf(player.currentPlayingTrack?.position);
                }

                let nextTr = player.shuffleTracks.slice(index + 1);

                // nextTracks = await Promise.all(player.shuffleTracks.map(getTracksInShuffle));
                nextTracks = await Promise.all(nextTr.map(getTracksInShuffle));
            } else {
                if (contextType === 'liked') {
                    async function getTracksInLiked(item, index, libraryId) {
                        const track = await Track.findOne({ _id: item.track });
                        const album = await Album.findOne({ _id: item.album });
                        return {
                            track: track,
                            album: album,
                            context_uri: `liked:${libraryId}:${track._id}:${album._id}`,
                            position: index,
                        };
                    }

                    const library = await Library.findOne({ owner: req.user._id }).lean();

                    let nextTrs = await Promise.all(
                        library.likedTracks.map((item, index) => getTracksInLiked(item, index, library._id)),
                    );

                    let index;
                    if (player.queue.currentTrackWhenQueueActive) {
                        index = player.queue.currentTrackWhenQueueActive?.position;
                    } else {
                        index = player.currentPlayingTrack.position;
                    }

                    nextTracks = nextTrs.slice(index + 1);
                } else if (contextType === 'playlist') {
                    async function getTracksInPlaylist(item, index, playlistId) {
                        const track = await Track.findOne({ _id: item.track });
                        const album = await Album.findOne({ _id: item.album });
                        return {
                            track: track,
                            album: album,
                            context_uri: `playlist:${playlistId}:${track._id}:${album._id}`,
                            position: index,
                        };
                    }

                    let index;
                    let playlistId;
                    if (player.queue.currentTrackWhenQueueActive) {
                        index = player?.queue?.currentTrackWhenQueueActive?.position;
                        playlistId = player?.queue?.currentTrackWhenQueueActive?.context_uri.split(':')[1];
                    } else {
                        index = player?.currentPlayingTrack?.position;
                        playlistId = contextId;
                    }

                    const playlist = await Playlist.findOne({ _id: playlistId }).lean();

                    // console.log(playlistId);

                    let nextTrs = await Promise.all(
                        playlist?.tracks?.map((item, index) => getTracksInPlaylist(item, index, playlistId)),
                    );

                    nextTracks = nextTrs.slice(index + 1);
                } else {
                    async function getTracksInAlbum(item, index, albumId, album) {
                        const track = await Track.findOne({ _id: item.track });
                        return {
                            track: track,
                            album: album,
                            context_uri: `album:${albumId}:${track._id}:${albumId}`,
                            position: index,
                        };
                    }

                    let index;
                    let albumId;
                    if (player.queue.currentTrackWhenQueueActive) {
                        index = player.queue.currentTrackWhenQueueActive?.position;
                        albumId = player.queue.currentTrackWhenQueueActive?.context_uri.split(':')[1];
                    } else {
                        index = player.currentPlayingTrack.position;
                        albumId = contextId;
                    }
                    const album = await Album.findOne({ _id: albumId }).lean();

                    // console.log(album);

                    let nextTrs = await Promise.all(
                        album?.tracks?.map((item, index) => getTracksInAlbum(item, index, albumId, album)),
                    );

                    nextTracks = nextTrs.slice(index + 1);
                }
            }

            return res
                .status(200)
                .send({ data: { currentTrack, tracksInQueue, nextTracks }, message: 'Get queue successfuly' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getCurrentlyPlayingTrack(req, res, next) {
        try {
            const player = await AudioPlayer.findOne({ owner: req.user._id }).lean();
            if (!player) {
                return res.status(404).send({ message: 'AudioPlayer not found' });
            }

            const context = {};
            if (player.currentPlayingTrack.context_uri !== '') {
                let [contextType, contextId, trackId, albumId, trackContextType] =
                    player.currentPlayingTrack.context_uri.split(':');
                let trackContextId = albumId;
                if (!trackContextType) trackContextType = 'album';

                context.contextType = contextType;
                context.contextId = contextId;
                context.trackId = trackId;
                context.albumId = trackContextType === 'album' ? albumId : '';
                context.podcastId = trackContextType === 'podcast' ? trackContextId : '';
                context.context_uri = player.currentPlayingTrack.context_uri;

                const track = await Track.findOne({ _id: trackId }).lean();
                const album = await Album.findOne({ _id: albumId }).lean();
                player.currentPlayingTrack.detailTrack = track;
                player.currentPlayingTrack.detailAlbum = album;
            }

            return res
                .status(200)
                .send({ data: { ...player, context }, message: 'Get audio player state successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async increasePlay(req, res, next) {
        try {
            const player = await AudioPlayer.findOne({ owner: req.user._id });
            if (!player) {
                return res.status(404).send({ message: 'Player not found' });
            }

            if (player.currentPlayingTrack.track === '') {
                return res.status(404).send({ message: 'Current Track not found' });
            } else {
                const track = await Track.findOne({ _id: player.currentPlayingTrack.track });
                if (!track) {
                    return res.status(404).send({ message: 'Track not found' });
                }
                track.plays = track.plays + 1;
                await track.save();
                return res.status(200).send({ message: 'Increase plays of track successfully' });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }
}

const shuffleArray = (array) => {
    const arr = [...array];
    let currentIndex = arr.length,
        randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }

    return arr;
};

const playWithShuffleOff = function ({
    player,
    tracks,
    contextType,
    contextId,
    trackId,
    albumId,
    trackContextId,
    trackContextType,
    position,
    context_uri,
}) {
    let index;
    if (position && tracks[position]?.track + tracks[position]?.[trackContextType] === trackId + trackContextId) {
        index = position;
    } else {
        index = tracks
            .map((obj) => {
                if (obj.trackType === 'episode') return obj.track + obj.podcast;
                return obj.track + obj.album;
            })
            .indexOf(trackId + trackContextId);
    }
    if (index !== -1) {
        player.currentPlayingTrack.track = tracks[index].track;
        player.currentPlayingTrack.album = tracks[index].album;
        player.currentPlayingTrack.podcast = tracks[index].podcast;
        let trackType = 'song';
        if (trackContextType === 'podcast') {
            trackType = 'episode';
        }
        player.currentPlayingTrack.trackType = trackType;
        player.currentPlayingTrack.context_uri = context_uri;
        player.currentPlayingTrack.position = index;
        player.shuffleTracks = [];
        player.shufflePosition = -1;

        // if (player.queue.currentTrackWhenQueueActive.track !== '') {
        //     player.queue.currentTrackWhenQueueActive.track = tracks[index].track;
        //     player.queue.currentTrackWhenQueueActive.album = tracks[index].album;
        //     player.queue.currentTrackWhenQueueActive.context_uri = req.body.context_uri;
        //     player.queue.currentTrackWhenQueueActive = index;
        // }
    }
};

const playWithShuffleOn = function ({
    player,
    tracks,
    contextType,
    contextId,
    trackId,
    albumId,
    position,
    trackContextId,
    trackContextType,
    context_uri,
}) {
    tracks = tracks.map((obj, index) => ({ ...obj, position: index }));
    const shuffleTracks = shuffleArray(tracks);

    let indexInShuffle = shuffleTracks
        .map((obj) => {
            if (obj.trackType === 'episode') {
                return obj.track + obj.podcast;
            }
            return obj.track + obj.album;
        })
        .indexOf(trackId + trackContextId);

    if (indexInShuffle !== -1) {
        player.currentPlayingTrack.track = shuffleTracks[indexInShuffle].track;
        player.currentPlayingTrack.album = shuffleTracks[indexInShuffle].album;
        player.currentPlayingTrack.podcast = shuffleTracks[indexInShuffle].podcast;
        player.currentPlayingTrack.position = shuffleTracks[indexInShuffle].position;
        let trackType = 'song';
        if (trackContextType === 'podcast') {
            trackType = 'episode';
        }
        player.currentPlayingTrack.trackType = trackType;
        player.currentPlayingTrack.context_uri = context_uri;
        player.shuffleTracks = shuffleTracks.map((obj) => {
            let trackContextTypeObj = 'album';
            if (obj.trackType === 'episode') trackContextTypeObj = 'podcast';

            return {
                track: obj.track,
                album: obj.album,
                podcast: obj.podcast,
                trackType: obj.trackType,
                context_uri:
                    contextType +
                    ':' +
                    contextId +
                    ':' +
                    obj.track +
                    ':' +
                    obj?.[trackContextType] +
                    ':' +
                    trackContextTypeObj,
                position: obj.position,
            };
        });
        player.shufflePosition = indexInShuffle;

        // if (player.queue.currentTrackWhenQueueActive.track !== '') {
        //     player.queue.currentTrackWhenQueueActive.track = shuffleTracks[indexInShuffle].track;
        //     player.queue.currentTrackWhenQueueActive.album = shuffleTracks[indexInShuffle].album;
        //     player.queue.currentTrackWhenQueueActive.position = shuffleTracks[indexInShuffle].position;
        //     player.queue.currentTrackWhenQueueActive.context_uri = req.body.context_uri;
        // }
    } else {
    }
};

const skipNextWithShuffleOff = function ({
    player,
    tracks,
    contextType,
    contextId,
    trackId,
    albumId,
    trackContextId,
    trackContextType,
}) {
    let index = player.currentPlayingTrack.position;
    if (!tracks[index] || tracks[index]?.track + tracks[index]?.[trackContextType] !== trackId + trackContextId) {
        index = tracks
            .map((obj) => {
                if (obj.trackType === 'episode') {
                    return obj.track + obj.podcast;
                }
                return obj.track + obj.album;
            })
            .indexOf(trackId + trackContextId);
    }
    if (index !== -1) {
        let nextIndex = index + 1 < tracks.length ? index + 1 : 0;
        player.currentPlayingTrack.track = tracks[nextIndex].track;
        player.currentPlayingTrack.album = tracks[nextIndex].album;
        player.currentPlayingTrack.podcast = tracks[nextIndex].podcast;
        if (tracks[nextIndex].trackType === 'episode') {
            player.currentPlayingTrack.context_uri = `${contextType}:${contextId}:${tracks[nextIndex].track}:${tracks[nextIndex].podcast}:podcast`;
        } else if (tracks[nextIndex].trackType === 'chapter') {
        } else {
            player.currentPlayingTrack.context_uri = `${contextType}:${contextId}:${tracks[nextIndex].track}:${tracks[nextIndex].album}:album`;
        }
        player.currentPlayingTrack.position = nextIndex;
        player.currentPlayingTrack.trackType = tracks[nextIndex].trackType;
    } else {
        // player.currentPlayingTrack.track = '';
        // player.currentPlayingTrack.album = '';
        // player.currentPlayingTrack.context_uri = '';
        // player.currentPlayingTrack.position = -1;
        player.currentPlayingTrack.track = tracks[player.currentPlayingTrack.position].track;
        player.currentPlayingTrack.album = tracks[player.currentPlayingTrack.position].album;
        player.currentPlayingTrack.podcast = tracks[player.currentPlayingTrack.position].podcast;
        player.currentPlayingTrack.context_uri =
            contextType +
            ':' +
            contextId +
            ':' +
            tracks[player.currentPlayingTrack.position].track +
            ':' +
            tracks[player.currentPlayingTrack.position]?.[trackContextType] +
            ':' +
            trackContextType;
        player.currentPlayingTrack.position = player.currentPlayingTrack.position;
        player.currentPlayingTrack.trackType = tracks[player.currentPlayingTrack.position].trackType;
    }
};

const skipNextWithShuffleOn = function ({
    player,
    tracks,
    contextType,
    contextId,
    trackId,
    albumId,
    trackContextId,
    trackContextType,
}) {
    let index, indexInShuffle, nextIndex, nextIndexInShuffle;
    index = player.currentPlayingTrack.position;
    indexInShuffle = player.shufflePosition;

    if (!tracks[index] || tracks[index]?.track + tracks[index]?.[trackContextType] !== trackId + trackContextId) {
        index = tracks
            .map((obj) => {
                // Episode => PodcastId
                if (obj.trackType === 'episode') {
                    return obj.track + obj.podcast;
                }
                // Song (default) => AlbumId
                return obj.track + obj.album;
            })
            .indexOf(trackId + trackContextId);
    }

    if (
        !player.shuffleTracks[indexInShuffle] ||
        player.shuffleTracks[indexInShuffle]?.track + player.shuffleTracks[indexInShuffle]?.[trackContextType] !==
            trackId + trackContextId
    ) {
        indexInShuffle = player.shuffleTracks
            .map((obj) => {
                // Episode => PodcastId
                if (obj.trackType === 'episode') {
                    return obj.track + obj.podcast;
                }
                // Song (default) => AlbumId
                return obj.track + obj.album;
            })
            .indexOf(trackId + trackContextId);
    }

    if (index !== -1 && indexInShuffle !== -1) {
        let shuffleTracksLength = player.shuffleTracks.length;
        nextIndexInShuffle = indexInShuffle + 1 < shuffleTracksLength ? indexInShuffle + 1 : 0;

        let nextTrackContextInShuffleType = 'album';
        if (player.shuffleTracks[nextIndexInShuffle].trackType === 'episode') {
            nextTrackContextInShuffleType = 'podcast';
        }

        nextIndex = tracks
            .map((obj) => {
                if (obj.trackType === 'episode') {
                    return obj.track + obj.podcast;
                }
                return obj.track + obj.album;
            })
            .indexOf(
                player.shuffleTracks[nextIndexInShuffle].track +
                    player.shuffleTracks[nextIndexInShuffle]?.[nextTrackContextInShuffleType],
            );
        let updatedTracksLength = tracks.length;
        if (nextIndex === -1 || updatedTracksLength !== shuffleTracksLength) {
            tracks = tracks.map((obj, index) => ({ ...obj, position: index }));
            const shuffleTracks = shuffleArray(tracks);
            player.shuffleTracks = shuffleTracks.map((obj) => {
                let objTrackContextType = 'album';
                if (obj.trackType === 'episode') objTrackContextType = 'podcast';
                return {
                    track: obj.track,
                    album: obj.album,
                    podcast: obj.podcast,
                    trackType: obj.trackType,
                    context_uri:
                        contextType +
                        ':' +
                        contextId +
                        ':' +
                        obj.track +
                        ':' +
                        obj?.[objTrackContextType] +
                        ':' +
                        objTrackContextType,
                    position: obj.position,
                };
            });
            indexInShuffle = player.shuffleTracks
                .map((obj) => {
                    if (obj.trackType === 'episode') return obj.track + obj.podcast;
                    return obj.track + obj.album;
                })
                .indexOf(trackId + trackContextId);
            nextIndexInShuffle = indexInShuffle + 1 < updatedTracksLength ? indexInShuffle + 1 : 0;
        }

        player.currentPlayingTrack.track = player.shuffleTracks[nextIndexInShuffle].track;
        player.currentPlayingTrack.album = player.shuffleTracks[nextIndexInShuffle].album;
        player.currentPlayingTrack.podcast = player.shuffleTracks[nextIndexInShuffle].podcast;
        player.currentPlayingTrack.trackType = player.shuffleTracks[nextIndexInShuffle].trackType;
        if (tracks[nextIndex].trackType === 'episode') {
            player.currentPlayingTrack.context_uri = `${contextType}:${contextId}:${player.shuffleTracks[nextIndexInShuffle].track}:${player.shuffleTracks[nextIndexInShuffle].podcast}:podcast`;
        } else if (tracks[nextIndex].trackType === 'chapter') {
        } else {
            player.currentPlayingTrack.context_uri = `${contextType}:${contextId}:${player.shuffleTracks[nextIndexInShuffle].track}:${player.shuffleTracks[nextIndexInShuffle].album}:album`;
        }
        player.currentPlayingTrack.position = player.shuffleTracks[nextIndexInShuffle].position;
        player.shufflePosition = nextIndexInShuffle;
    } else {
        // player.currentPlayingTrack.track = '';
        // player.currentPlayingTrack.album = '';
        // player.currentPlayingTrack.context_uri = '';
        // player.currentPlayingTrack.position = -1;
        // player.shuffleTracks = [];
        // player.shufflePosition = -1;

        player.currentPlayingTrack.track = tracks[player.currentPlayingTrack.position].track;
        player.currentPlayingTrack.album = tracks[player.currentPlayingTrack.position].album;
        player.currentPlayingTrack.podcast = tracks[player.currentPlayingTrack.position].podcast;
        player.currentPlayingTrack.trackType = tracks[player.currentPlayingTrack.position].trackType;
        player.currentPlayingTrack.context_uri = player.currentPlayingTrack.context_uri =
            contextType +
            ':' +
            contextId +
            ':' +
            tracks[player.currentPlayingTrack.position].track +
            ':' +
            tracks[player.currentPlayingTrack.position]?.[trackContextType] +
            ':' +
            trackContextType;
        player.currentPlayingTrack.position = player.currentPlayingTrack.position;

        const shuffleTracks = shuffleArray(tracks);
        player.shuffleTracks = shuffleTracks.map((obj) => {
            let objTrackContextType = 'album';
            if (obj.trackType === 'episode') {
                objTrackContextType = 'podcast';
            }
            return {
                track: obj.track,
                album: obj.album,
                podcast: obj.podcast,
                trackType: obj.trackType,
                context_uri:
                    contextType +
                    ':' +
                    contextId +
                    ':' +
                    obj.track +
                    ':' +
                    obj?.[objTrackContextType] +
                    ':' +
                    objTrackContextType,
                position: obj.position,
            };
        });
        indexInShuffle = player.shuffleTracks
            .map((obj) => {
                if (obj.trackType === 'episode') {
                    return obj.track + obj.podcast;
                }
                return obj.track + obj.album;
            })
            .indexOf(trackId + trackContextId);
        player.shufflePosition = indexInShuffle;
    }
};

const skipPreviousWithShuffleOff = function ({
    player,
    tracks,
    contextType,
    contextId,
    trackId,
    albumId,
    trackContextId,
    trackContextType,
}) {
    // nextIndex here (skip previous) mean previous of tracks order (will play)
    let index = player.currentPlayingTrack.position;
    if (!tracks[index] || tracks[index]?.track + tracks[index]?.[trackContextType] !== trackId + trackContextId) {
        index = tracks.map((obj) => obj.track + obj?.[trackContextType]).indexOf(trackId + trackContextId);
    }
    if (index !== -1) {
        let nextIndex = index - 1 >= 0 ? index - 1 : 0;
        player.currentPlayingTrack.track = tracks[nextIndex].track;
        player.currentPlayingTrack.album = tracks[nextIndex].album;
        player.currentPlayingTrack.podcast = tracks[nextIndex].podcast;
        if (tracks[nextIndex].trackType === 'episode') {
            player.currentPlayingTrack.context_uri = `${contextType}:${contextId}:${tracks[nextIndex].track}:${tracks[nextIndex].podcast}:podcast`;
        } else if (tracks[nextIndex].trackType === 'chapter') {
        } else {
            player.currentPlayingTrack.context_uri = `${contextType}:${contextId}:${tracks[nextIndex].track}:${tracks[nextIndex].album}:album`;
        }
        player.currentPlayingTrack.position = nextIndex;
        player.currentPlayingTrack.trackType = tracks[nextIndex].trackType;
    } else {
        // player.currentPlayingTrack.track = '';
        // player.currentPlayingTrack.album = '';
        // player.currentPlayingTrack.context_uri = '';
        // player.currentPlayingTrack.position = -1;
        player.currentPlayingTrack.track = tracks[player.currentPlayingTrack.position].track;
        player.currentPlayingTrack.album = tracks[player.currentPlayingTrack.position].album;
        player.currentPlayingTrack.podcast = tracks[player.currentPlayingTrack.position].podcast;
        player.currentPlayingTrack.context_uri =
            contextType +
            ':' +
            contextId +
            ':' +
            tracks[player.currentPlayingTrack.position].track +
            ':' +
            tracks[player.currentPlayingTrack.position]?.[trackContextType] +
            ':' +
            trackContextType;
        player.currentPlayingTrack.position = player.currentPlayingTrack.position;
        player.currentPlayingTrack.trackType = tracks[player.currentPlayingTrack.position].trackType;
    }
};

const skipPreviousWithShuffleOn = function ({
    player,
    tracks,
    contextType,
    contextId,
    trackId,
    albumId,
    trackContextId,
    trackContextType,
}) {
    // nextIndex here (skip previous) mean previous of tracks order (will play)
    // nextIndexInShuffle here (skip previous) mean previous of shuffle tracks order (will play)
    let index, indexInShuffle, nextIndex, nextIndexInShuffle;
    index = player.currentPlayingTrack.position;
    indexInShuffle = player.shufflePosition;

    if (!tracks[index] || tracks[index]?.track + tracks[index]?.[trackContextType] !== trackId + trackContextId) {
        index = tracks
            .map((obj) => {
                // Episode => PodcastId
                if (obj.trackType === 'episode') {
                    return obj.track + obj.podcast;
                }
                // Song (default) => AlbumId
                return obj.track + obj.album;
            })
            .indexOf(trackId + trackContextId);
    }
    if (
        !player.shuffleTracks[indexInShuffle] ||
        player.shuffleTracks[indexInShuffle]?.track + player.shuffleTracks[indexInShuffle]?.[trackContextType] !==
            trackId + trackContextId
    ) {
        indexInShuffle = player.shuffleTracks
            .map((obj) => {
                // Episode => PodcastId
                if (obj.trackType === 'episode') {
                    return obj.track + obj.podcast;
                }
                // Song (default) => AlbumId
                return obj.track + obj.album;
            })
            .indexOf(trackId + trackContextId);
    }

    if (index !== -1 && indexInShuffle !== -1) {
        nextIndexInShuffle = indexInShuffle - 1 >= 0 ? indexInShuffle - 1 : 0;

        let nextTrackContextInShuffleType = 'album';
        if (player.shuffleTracks[nextIndexInShuffle].trackType === 'episode') {
            nextTrackContextInShuffleType = 'podcast';
        }

        nextIndex = tracks
            .map((obj) => {
                if (obj.trackType === 'episode') {
                    return obj.track + obj.podcast;
                }
                return obj.track + obj.album;
            })
            .indexOf(
                player.shuffleTracks[nextIndexInShuffle].track +
                    player.shuffleTracks[nextIndexInShuffle]?.[nextTrackContextInShuffleType],
            );
        if (nextIndex === -1 || tracks.length !== player.shuffleTracks.length) {
            tracks = tracks.map((obj, index) => ({ ...obj, position: index }));
            const shuffleTracks = shuffleArray(tracks);
            player.shuffleTracks = shuffleTracks.map((obj) => {
                let objTrackContextType = 'album';
                if (obj.trackType === 'episode') objTrackContextType = 'podcast';
                return {
                    track: obj.track,
                    album: obj.album,
                    podcast: obj.podcast,
                    trackType: obj.trackType,
                    context_uri:
                        contextType +
                        ':' +
                        contextId +
                        ':' +
                        obj.track +
                        ':' +
                        obj?.[objTrackContextType] +
                        ':' +
                        objTrackContextType,
                    position: obj.position,
                };
            });
            indexInShuffle = player.shuffleTracks
                .map((obj) => {
                    if (obj.trackType === 'episode') return obj.track + obj.podcast;
                    return obj.track + obj.album;
                })
                .indexOf(trackId + trackContextId);
            nextIndexInShuffle = indexInShuffle - 1 >= 0 ? indexInShuffle - 1 : 0;
        }
        player.currentPlayingTrack.track = player.shuffleTracks[nextIndexInShuffle].track;
        player.currentPlayingTrack.album = player.shuffleTracks[nextIndexInShuffle].album;
        player.currentPlayingTrack.podcast = player.shuffleTracks[nextIndexInShuffle].podcast;
        if (tracks[nextIndex].trackType === 'episode') {
            player.currentPlayingTrack.context_uri = `${contextType}:${contextId}:${player.shuffleTracks[nextIndexInShuffle].track}:${player.shuffleTracks[nextIndexInShuffle].podcast}:podcast`;
        } else if (tracks[nextIndex].trackType === 'chapter') {
        } else {
            player.currentPlayingTrack.context_uri = `${contextType}:${contextId}:${player.shuffleTracks[nextIndexInShuffle].track}:${player.shuffleTracks[nextIndexInShuffle].album}:album`;
        }
        player.currentPlayingTrack.position = player.shuffleTracks[nextIndexInShuffle].position;
        player.shufflePosition = nextIndexInShuffle;
    } else {
        // player.currentPlayingTrack.track = '';
        // player.currentPlayingTrack.album = '';
        // player.currentPlayingTrack.context_uri = '';
        // player.currentPlayingTrack.position = -1;
        // player.shuffleTracks = [];
        // player.shufflePosition = -1;

        player.currentPlayingTrack.track = tracks[player.currentPlayingTrack.position].track;
        player.currentPlayingTrack.album = tracks[player.currentPlayingTrack.position].album;
        player.currentPlayingTrack.podcast = tracks[player.currentPlayingTrack.position].podcast;
        player.currentPlayingTrack.trackType = tracks[player.currentPlayingTrack.position].trackType;
        player.currentPlayingTrack.context_uri = player.currentPlayingTrack.context_uri =
            contextType +
            ':' +
            contextId +
            ':' +
            tracks[player.currentPlayingTrack.position].track +
            ':' +
            tracks[player.currentPlayingTrack.position]?.[trackContextType] +
            ':' +
            trackContextType;
        player.currentPlayingTrack.position = player.currentPlayingTrack.position;

        const shuffleTracks = shuffleArray(tracks);
        player.shuffleTracks = shuffleTracks.map((obj) => {
            let objTrackContextType = 'album';
            if (obj.trackType === 'episode') {
                objTrackContextType = 'podcast';
            }
            return {
                track: obj.track,
                album: obj.album,
                podcast: obj.podcast,
                trackType: obj.trackType,
                context_uri:
                    contextType +
                    ':' +
                    contextId +
                    ':' +
                    obj.track +
                    ':' +
                    obj?.[objTrackContextType] +
                    ':' +
                    objTrackContextType,
                position: obj.position,
            };
        });
        indexInShuffle = player.shuffleTracks
            .map((obj) => {
                if (obj.trackType === 'episode') {
                    return obj.track + obj.podcast;
                }
                return obj.track + obj.album;
            })
            .indexOf(trackId + trackContextId);
        player.shufflePosition = indexInShuffle;
    }
};

module.exports = new AudioPlayerController();
