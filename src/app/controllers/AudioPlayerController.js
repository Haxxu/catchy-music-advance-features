const { Album } = require('../models/Album');
const { AudioPlayer } = require('../models/AudioPlayer');
const { Library } = require('../models/Library');
const { Playlist } = require('../models/Playlist');
const { Track } = require('../models/Track');
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

            const [contextType, contextId, trackId, albumId] = req.body.context_uri.split(':');

            const playWithShuffleOff = function (player, tracks, contextType, contextId, trackId, albumId, position) {
                let index;
                if (position && tracks[position]?.track + tracks[position]?.album === trackId + albumId) {
                    index = position;
                } else {
                    index = tracks.map((obj) => obj.track + obj.album).indexOf(trackId + albumId);
                }
                if (index !== -1) {
                    player.currentPlayingTrack.track = tracks[index].track;
                    player.currentPlayingTrack.album = tracks[index].album;
                    player.currentPlayingTrack.context_uri = req.body.context_uri;
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

            const playWithShuffleOn = function (player, tracks, contextType, contextId, trackId, albumId, position) {
                tracks = tracks.map((obj, index) => ({ ...obj, position: index }));
                const shuffleTracks = shuffleArray(tracks);

                let indexInShuffle = shuffleTracks.map((obj) => obj.track + obj.album).indexOf(trackId + albumId);
                if (indexInShuffle !== -1) {
                    player.currentPlayingTrack.track = shuffleTracks[indexInShuffle].track;
                    player.currentPlayingTrack.album = shuffleTracks[indexInShuffle].album;
                    player.currentPlayingTrack.position = shuffleTracks[indexInShuffle].position;
                    player.currentPlayingTrack.context_uri = req.body.context_uri;
                    player.shuffleTracks = shuffleTracks.map((obj) => ({
                        track: obj.track,
                        album: obj.album,
                        context_uri: contextType + ':' + contextId + ':' + obj.track + ':' + obj.album,
                        position: obj.position,
                    }));
                    player.shufflePosition = indexInShuffle;

                    // if (player.queue.currentTrackWhenQueueActive.track !== '') {
                    //     player.queue.currentTrackWhenQueueActive.track = shuffleTracks[indexInShuffle].track;
                    //     player.queue.currentTrackWhenQueueActive.album = shuffleTracks[indexInShuffle].album;
                    //     player.queue.currentTrackWhenQueueActive.position = shuffleTracks[indexInShuffle].position;
                    //     player.queue.currentTrackWhenQueueActive.context_uri = req.body.context_uri;
                    // }
                }
            };

            if (player.shuffle === 'none') {
                if (contextType === 'album') {
                    const album = await Album.findOne({ _id: contextId }).lean();
                    if (!album) {
                        return res.status(404).send({ message: 'Album does not exist' });
                    }
                    playWithShuffleOff(
                        player,
                        album.tracks.map((obj) => ({ track: obj.track, album: albumId })),
                        contextType,
                        contextId,
                        trackId,
                        albumId,
                        req.body.position,
                    );
                } else if (contextType === 'playlist') {
                    const playlist = await Playlist.findOne({ _id: contextId }).lean();
                    if (!playlist) {
                        return res.status(404).send({ message: 'Playlist does not exist' });
                    }
                    playWithShuffleOff(
                        player,
                        playlist.tracks,
                        contextType,
                        contextId,
                        trackId,
                        albumId,
                        req.body.position,
                    );
                } else if (contextType === 'liked') {
                    const library = await Library.findOne({ _id: contextId }).lean();
                    if (!library) {
                        return res.status(404).send({ message: 'Library does not exist' });
                    }
                    playWithShuffleOff(
                        player,
                        library.likedTracks,
                        contextType,
                        contextId,
                        trackId,
                        albumId,
                        req.body.position,
                    );
                }
            } else {
                // Che do shuffle
                if (contextType === 'album') {
                    const album = await Album.findOne({ _id: contextId }).lean();
                    if (!album) {
                        return res.status(404).send({ message: 'Album does not exist' });
                    }
                    playWithShuffleOn(
                        player,
                        album.tracks.map((obj) => ({ track: obj.track, album: albumId })),
                        contextType,
                        contextId,
                        trackId,
                        albumId,
                        req.body.position,
                    );
                } else if (contextType === 'playlist') {
                    const playlist = await Playlist.findOne({ _id: contextId }).lean();
                    if (!playlist) {
                        return res.status(404).send({ message: 'Playlist does not exist' });
                    }
                    playWithShuffleOn(
                        player,
                        playlist.tracks,
                        contextType,
                        contextId,
                        trackId,
                        albumId,
                        req.body.position,
                    );
                } else if (contextType === 'liked') {
                    const library = await Library.findOne({ _id: contextId }).lean();
                    if (!library) {
                        return res.status(404).send({ message: 'Library does not exist' });
                    }
                    playWithShuffleOn(
                        player,
                        library.likedTracks,
                        contextType,
                        contextId,
                        trackId,
                        albumId,
                        req.body.position,
                    );
                }
            }

            await player.save();
            res.status(200).send({ message: 'Start track successfuly' });
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
            const player = await AudioPlayer.findOne({ owner: req.user._id });
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
                const [contextType, contextId, trackId, albumId] = player.currentPlayingTrack.context_uri.split(':');

                const skipNextWithShuffleOff = function (player, tracks, contextType, contextId, trackId, albumId) {
                    let index = player.currentPlayingTrack.position;
                    if (!tracks[index] || tracks[index]?.track + tracks[index]?.album !== trackId + albumId) {
                        index = tracks.map((obj) => obj.track + obj.album).indexOf(trackId + albumId);
                    }
                    if (index !== -1) {
                        let nextIndex = index + 1 < tracks.length ? index + 1 : 0;
                        player.currentPlayingTrack.track = tracks[nextIndex].track;
                        player.currentPlayingTrack.album = tracks[nextIndex].album;
                        player.currentPlayingTrack.context_uri =
                            contextType +
                            ':' +
                            contextId +
                            ':' +
                            tracks[nextIndex].track +
                            ':' +
                            tracks[nextIndex].album;
                        player.currentPlayingTrack.position = nextIndex;
                    } else {
                        // player.currentPlayingTrack.track = '';
                        // player.currentPlayingTrack.album = '';
                        // player.currentPlayingTrack.context_uri = '';
                        // player.currentPlayingTrack.position = -1;
                        player.currentPlayingTrack.track = tracks[player.currentPlayingTrack.position].track;
                        player.currentPlayingTrack.album = tracks[player.currentPlayingTrack.position].album;
                        player.currentPlayingTrack.context_uri =
                            contextType +
                            ':' +
                            contextId +
                            ':' +
                            tracks[player.currentPlayingTrack.position].track +
                            ':' +
                            tracks[player.currentPlayingTrack.position].album;
                        player.currentPlayingTrack.position = player.currentPlayingTrack.position;
                    }
                };

                const skipNextWithShuffleOn = function (player, tracks, contextType, contextId, trackId, albumId) {
                    let index, indexInShuffle, nextIndex, nextIndexInShuffle;
                    index = player.currentPlayingTrack.position;
                    indexInShuffle = player.shufflePosition;

                    if (!tracks[index] || tracks[index]?.track + tracks[index]?.album !== trackId + albumId) {
                        index = tracks.map((obj) => obj.track + obj.album).indexOf(trackId + albumId);
                    }
                    if (
                        !player.shuffleTracks[indexInShuffle] ||
                        player.shuffleTracks[indexInShuffle]?.track + player.shuffleTracks[indexInShuffle]?.album !==
                            trackId + albumId
                    ) {
                        indexInShuffle = player.shuffleTracks
                            .map((obj) => obj.track + obj.album)
                            .indexOf(trackId + albumId);
                    }

                    if (index !== -1 && indexInShuffle !== -1) {
                        let shuffleTracksLength = player.shuffleTracks.length;
                        nextIndexInShuffle = indexInShuffle + 1 < shuffleTracksLength ? indexInShuffle + 1 : 0;
                        nextIndex = tracks
                            .map((obj) => obj.track + obj.album)
                            .indexOf(
                                player.shuffleTracks[nextIndexInShuffle].track +
                                    player.shuffleTracks[nextIndexInShuffle].album,
                            );
                        let updatedTracksLength = tracks.length;
                        if (nextIndex === -1 || updatedTracksLength !== shuffleTracksLength) {
                            tracks = tracks.map((obj, index) => ({ ...obj, position: index }));
                            const shuffleTracks = shuffleArray(tracks);
                            player.shuffleTracks = shuffleTracks.map((obj) => ({
                                track: obj.track,
                                album: obj.album,
                                context_uri: contextType + ':' + contextId + ':' + obj.track + ':' + obj.album,
                                position: obj.position,
                            }));
                            indexInShuffle = player.shuffleTracks
                                .map((obj) => obj.track + obj.album)
                                .indexOf(trackId + albumId);
                            nextIndexInShuffle = indexInShuffle + 1 < updatedTracksLength ? indexInShuffle + 1 : 0;
                        }
                        player.currentPlayingTrack.track = player.shuffleTracks[nextIndexInShuffle].track;
                        player.currentPlayingTrack.album = player.shuffleTracks[nextIndexInShuffle].album;
                        player.currentPlayingTrack.context_uri =
                            contextType +
                            ':' +
                            contextId +
                            ':' +
                            player.currentPlayingTrack.track +
                            ':' +
                            player.currentPlayingTrack.album;
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
                        player.currentPlayingTrack.context_uri = player.currentPlayingTrack.context_uri =
                            contextType +
                            ':' +
                            contextId +
                            ':' +
                            tracks[player.currentPlayingTrack.position].track +
                            ':' +
                            tracks[player.currentPlayingTrack.position].album;
                        player.currentPlayingTrack.position = player.currentPlayingTrack.position;
                        const shuffleTracks = shuffleArray(tracks);
                        player.shuffleTracks = shuffleTracks.map((obj) => ({
                            track: obj.track,
                            album: obj.album,
                            context_uri: contextType + ':' + contextId + ':' + obj.track + ':' + obj.album,
                            position: obj.position,
                        }));
                        indexInShuffle = player.shuffleTracks
                            .map((obj) => obj.track + obj.album)
                            .indexOf(trackId + albumId);
                        player.shufflePosition = indexInShuffle;
                    }
                };

                if (player.shuffle === 'none') {
                    if (contextType === 'album') {
                        const album = await Album.findOne({ _id: contextId }).lean();
                        if (!album) {
                            return res.status(404).send({ message: 'Album not found' });
                        }
                        skipNextWithShuffleOff(
                            player,
                            album.tracks.map((obj) => ({ track: obj.track, album: albumId })),
                            contextType,
                            contextId,
                            trackId,
                            albumId,
                        );
                    } else if (contextType === 'playlist') {
                        const playlist = await Playlist.findOne({ _id: contextId }).lean();
                        if (!playlist) {
                            return res.status(404).send({ message: 'Playlist not found' });
                        }
                        skipNextWithShuffleOff(player, playlist.tracks, contextType, contextId, trackId, albumId);
                    } else if (contextType === 'liked') {
                        const library = await Library.findOne({ _id: contextId }).lean();
                        if (!library) {
                            return res.status(404).send({ message: 'Library not found' });
                        }
                        skipNextWithShuffleOff(player, library.likedTracks, contextType, contextId, trackId, albumId);
                    }
                } else {
                    // Che do shuffle
                    if (contextType === 'album') {
                        const album = await Album.findOne({ _id: contextId }).lean();
                        if (!album) {
                            return res.status(404).send({ message: 'Album not found' });
                        }
                        skipNextWithShuffleOn(
                            player,
                            album.tracks.map((obj) => ({ track: obj.track, album: albumId })),
                            contextType,
                            contextId,
                            trackId,
                            albumId,
                        );
                    } else if (contextType === 'playlist') {
                        const playlist = await Playlist.findOne({ _id: contextId }).lean();
                        if (!playlist) {
                            return res.status(404).send({ message: 'Playlist not found' });
                        }
                        skipNextWithShuffleOn(player, playlist.tracks, contextType, contextId, trackId, albumId);
                    } else if (contextType === 'liked') {
                        const library = await Library.findOne({ _id: contextId }).lean();
                        if (!library) {
                            return res.status(404).send({ message: 'Library not found' });
                        }
                        skipNextWithShuffleOn(player, library.likedTracks, contextType, contextId, trackId, albumId);
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
                const [contextType, contextId, trackId, albumId] = player.currentPlayingTrack.context_uri.split(':');

                const skipPreviousWithShuffleOff = function (player, tracks, contextType, contextId, trackId, albumId) {
                    // nextIndex here (skip previous) mean previous of tracks order (will play)
                    let index = player.currentPlayingTrack.position;
                    if (!tracks[index] || tracks[index]?.track + tracks[index]?.album !== trackId + albumId) {
                        index = tracks.map((obj) => obj.track + obj.album).indexOf(trackId + albumId);
                    }
                    if (index !== -1) {
                        let nextIndex = index - 1 >= 0 ? index - 1 : 0;
                        player.currentPlayingTrack.track = tracks[nextIndex].track;
                        player.currentPlayingTrack.album = tracks[nextIndex].album;
                        player.currentPlayingTrack.context_uri =
                            contextType +
                            ':' +
                            contextId +
                            ':' +
                            tracks[nextIndex].track +
                            ':' +
                            tracks[nextIndex].album;
                        player.currentPlayingTrack.position = nextIndex;
                    } else {
                        // player.currentPlayingTrack.track = '';
                        // player.currentPlayingTrack.album = '';
                        // player.currentPlayingTrack.context_uri = '';
                        // player.currentPlayingTrack.position = -1;
                        player.currentPlayingTrack.track = tracks[player.currentPlayingTrack.position].track;
                        player.currentPlayingTrack.album = tracks[player.currentPlayingTrack.position].album;
                        player.currentPlayingTrack.context_uri =
                            contextType +
                            ':' +
                            contextId +
                            ':' +
                            tracks[player.currentPlayingTrack.position].track +
                            ':' +
                            tracks[player.currentPlayingTrack.position].album;
                        player.currentPlayingTrack.position = player.currentPlayingTrack.position;
                    }
                };

                const skipPreviousWithShuffleOn = function (player, tracks, contextType, contextId, trackId, albumId) {
                    // nextIndex here (skip previous) mean previous of tracks order (will play)
                    // nextIndexInShuffle here (skip previous) mean previous of shuffle tracks order (will play)
                    let index, indexInShuffle, nextIndex, nextIndexInShuffle;
                    index = player.currentPlayingTrack.position;
                    indexInShuffle = player.shufflePosition;

                    if (!tracks[index] || tracks[index]?.track + tracks[index]?.album !== trackId + albumId) {
                        index = tracks.map((obj) => obj.track + obj.album).indexOf(trackId + albumId);
                    }
                    if (
                        !player.shuffleTracks[indexInShuffle] ||
                        player.shuffleTracks[indexInShuffle]?.track + player.shuffleTracks[indexInShuffle]?.album !==
                            trackId + albumId
                    ) {
                        indexInShuffle = player.shuffleTracks
                            .map((obj) => obj.track + obj.album)
                            .indexOf(trackId + albumId);
                    }

                    if (index !== -1 && indexInShuffle !== -1) {
                        nextIndexInShuffle = indexInShuffle - 1 >= 0 ? indexInShuffle - 1 : 0;
                        nextIndex = tracks
                            .map((obj) => obj.track + obj.album)
                            .indexOf(
                                player.shuffleTracks[nextIndexInShuffle].track +
                                    player.shuffleTracks[nextIndexInShuffle].album,
                            );
                        if (nextIndex === -1 || tracks.length !== player.shuffleTracks.length) {
                            tracks = tracks.map((obj, index) => ({ ...obj, position: index }));
                            const shuffleTracks = shuffleArray(tracks);
                            player.shuffleTracks = shuffleTracks.map((obj) => ({
                                track: obj.track,
                                album: obj.album,
                                context_uri: contextType + ':' + contextId + ':' + obj.track + ':' + obj.album,
                                position: obj.position,
                            }));
                            indexInShuffle = player.shuffleTracks
                                .map((obj) => obj.track + obj.album)
                                .indexOf(trackId + albumId);
                            nextIndexInShuffle = indexInShuffle - 1 >= 0 ? indexInShuffle - 1 : 0;
                        }
                        player.currentPlayingTrack.track = player.shuffleTracks[nextIndexInShuffle].track;
                        player.currentPlayingTrack.album = player.shuffleTracks[nextIndexInShuffle].album;
                        player.currentPlayingTrack.context_uri =
                            contextType +
                            ':' +
                            contextId +
                            ':' +
                            player.currentPlayingTrack.track +
                            ':' +
                            player.currentPlayingTrack.album;
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
                        player.currentPlayingTrack.context_uri = player.currentPlayingTrack.context_uri =
                            contextType +
                            ':' +
                            contextId +
                            ':' +
                            tracks[player.currentPlayingTrack.position].track +
                            ':' +
                            tracks[player.currentPlayingTrack.position].album;
                        player.currentPlayingTrack.position = player.currentPlayingTrack.position;
                        const shuffleTracks = shuffleArray(tracks);
                        player.shuffleTracks = shuffleTracks.map((obj) => ({
                            track: obj.track,
                            album: obj.album,
                            context_uri: contextType + ':' + contextId + ':' + obj.track + ':' + obj.album,
                            position: obj.position,
                        }));
                        indexInShuffle = player.shuffleTracks
                            .map((obj) => obj.track + obj.album)
                            .indexOf(trackId + albumId);
                        player.shufflePosition = indexInShuffle;
                    }
                };

                if (player.shuffle === 'none') {
                    if (contextType === 'album') {
                        const album = await Album.findOne({ _id: contextId });
                        if (!album) {
                            return res.status(404).send({ message: 'Album not found' });
                        }
                        skipPreviousWithShuffleOff(
                            player,
                            album.tracks.map((obj) => ({ track: obj.track, album: albumId })),
                            contextType,
                            contextId,
                            trackId,
                            albumId,
                        );
                    } else if (contextType === 'playlist') {
                        const playlist = await Playlist.findOne({ _id: contextId });
                        if (!playlist) {
                            return res.status(404).send({ message: 'Playlist not found' });
                        }
                        skipPreviousWithShuffleOff(player, playlist.tracks, contextType, contextId, trackId, albumId);
                    } else if (contextType === 'liked') {
                        const library = await Library.findOne({ _id: contextId });
                        if (!library) {
                            return res.status(404).send({ message: 'Library not found' });
                        }
                        skipPreviousWithShuffleOff(
                            player,
                            library.likedTracks,
                            contextType,
                            contextId,
                            trackId,
                            albumId,
                        );
                    }
                } else {
                    // Che do shuffle
                    if (contextType === 'album') {
                        const album = await Album.findOne({ _id: contextId });
                        if (!album) {
                            return res.status(404).send({ message: 'Album not found' });
                        }
                        skipPreviousWithShuffleOn(
                            player,
                            album.tracks.map((obj) => ({ track: obj.track, album: albumId })),
                            contextType,
                            contextId,
                            trackId,
                            albumId,
                        );
                    } else if (contextType === 'playlist') {
                        const playlist = await Playlist.findOne({ _id: contextId });
                        if (!playlist) {
                            return res.status(404).send({ message: 'Playlist not found' });
                        }
                        skipPreviousWithShuffleOn(player, playlist.tracks, contextType, contextId, trackId, albumId);
                    } else if (contextType === 'liked') {
                        const library = await Library.findOne({ _id: contextId });
                        if (!library) {
                            return res.status(404).send({ message: 'Library not found' });
                        }
                        skipPreviousWithShuffleOn(
                            player,
                            library.likedTracks,
                            contextType,
                            contextId,
                            trackId,
                            albumId,
                        );
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
                const [contextType, contextId, trackId, albumId] = item.context_uri.split(':');
                if (!player.queue.tracks[0]) {
                    player.queue.tracks.push({
                        track: trackId,
                        album: albumId,
                        context_uri: item.context_uri,
                        position: item.position,
                        addedAt: Date.now(),
                        order: 0,
                    });
                } else {
                    player.queue.tracks.push({
                        track: trackId,
                        album: albumId,
                        context_uri: item.context_uri,
                        position: item.position,
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
                const [contextType, contextId, trackId, albumId] = player.currentPlayingTrack.context_uri.split(':');
                context.contextType = contextType;
                context.contextId = contextId;
                context.trackId = trackId;
                context.albumId = albumId;
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

module.exports = new AudioPlayerController();
