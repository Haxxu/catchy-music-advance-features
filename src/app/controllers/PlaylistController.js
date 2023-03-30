const mongoose = require('mongoose');
const moment = require('moment');

const { Playlist, validatePlaylist } = require('../models/Playlist');
const { Track } = require('../models/Track');
const { Album } = require('../models/Album');
const { Library } = require('../models/Library');
const { User } = require('../models/User');
const PodcastService = require('../services/PodcastService');

class PlaylistController {
    // get playlist public or playlist (user own)
    async getPlaylistById(req, res, next) {
        try {
            const playlist = await Playlist.findOne({ _id: req.params.id })
                .populate({ path: 'owner', select: '_id name type' })
                .select('-__v');

            if (!playlist) {
                return res.status(404).send({ message: 'Playlist does not exist' });
            }

            if (playlist.owner.type !== 'artist') {
                playlist.owner.type = 'user';
            }

            if (playlist.isPublic || req.user._id === playlist.owner._id.toString()) {
                const detailTracks = [];
                let position = 0;

                for (let track of playlist.tracks) {
                    const t = await Track.findOne({ _id: track.track });
                    const a = await Album.findOne({ _id: track.album });
                    detailTracks.push({
                        ...track.toObject(),
                        track: t,
                        album: a,
                        context_uri: 'playlist' + ':' + playlist._id + ':' + t._id + ':' + a._id,
                        position: position,
                    });
                    position++;
                }

                return res.status(200).send({
                    data: { ...playlist.toObject(), tracks: detailTracks },
                    message: 'Get playlist successfully',
                });
            } else {
                return res.status(403).send({ message: 'Playlist does not public' });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getPlaylistsInfo(req, res, next) {
        try {
            const totalPlaylists = await Playlist.count('_id');

            const today = moment().startOf('day');

            const newPlaylistsToday = await Playlist.find({
                createdAt: {
                    $gte: today.toDate(),
                    $lte: moment(today).endOf('day').toDate(),
                },
            }).count('_id');

            const newPlaylistsThisMonth = await Playlist.find({
                createdAt: {
                    $gte: moment(today).startOf('month').toDate(),
                    $lte: moment(today).endOf('month').toDate(),
                },
            }).count('_id');

            const newPlaylistsLastMonth = await Playlist.find({
                createdAt: {
                    $gte: moment(today).subtract(1, 'months').startOf('month').toDate(),
                    $lte: moment(today).subtract(1, 'months').endOf('month').toDate(),
                },
            }).count('_id');

            return res.status(200).send({
                data: { totalPlaylists, newPlaylistsToday, newPlaylistsThisMonth, newPlaylistsLastMonth },
                message: 'Get playlist info successfuly',
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getPlaylistsByContext(req, res, next) {
        try {
            let message = '';
            let searchCondition = {};
            if (req.query.search && req.query.search.trim() !== '') {
                let search = req.query.search.trim();

                const users = await User.find({
                    $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }],
                }).select('_id');

                const usersId = users.map((user) => user._id.toString());

                searchCondition = {
                    $or: [
                        {
                            name: { $regex: search, $options: 'i' },
                        },
                        {
                            owner: { $in: usersId },
                        },
                    ],
                };
            }

            const playlists = await Playlist.find({ ...searchCondition })
                .populate('owner', '_id name type')
                .lean();

            let length = playlists.length;
            for (let i = 0; i < length; ++i) {
                if (playlists[i]?.owner?.type === 'admin' || playlists[i].owner.type === 'user') {
                    playlists[i].owner.type = 'user';
                }
            }

            return res.status(200).send({ data: playlists, message: 'Get playlists successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getPopularPlaylists(req, res, next) {
        try {
            const playlists = await Playlist.find({ isPublic: true }).sort({ saved: 'desc' }).limit(8).lean();

            const detailPlaylists = playlists.map((playlist) => {
                if (playlist.tracks.length === 0) {
                    return playlist;
                } else {
                    return {
                        ...playlist,
                        firstTrack: {
                            context_uri: `playlist:${playlist._id}:${playlist.tracks[0]?.track}:${playlist.tracks[0]?.album}`,
                            position: 0,
                        },
                    };
                }
            });

            return res.status(200).send({ data: detailPlaylists, message: 'Get popular playlists successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getPlaylistsByTags(req, res, next) {
        try {
            if (req.query.tags) {
                const tags = req.query.tags;

                let popularPlaylists;
                let recommendPlaylists;
                let randomPlaylists;

                if (tags.includes('popular')) {
                    const p = await Playlist.find({ isPublic: true }).sort({ saved: 'desc' }).limit(8).lean();

                    popularPlaylists = p.map((playlist) => {
                        if (playlist.tracks.length === 0) {
                            return playlist;
                        } else {
                            return {
                                ...playlist,
                                firstTrack: {
                                    context_uri: `playlist:${playlist._id}:${playlist.tracks[0]?.track}:${playlist.tracks[0]?.album}`,
                                    position: 0,
                                },
                            };
                        }
                    });
                }

                if (tags.includes('recommend')) {
                    const admin = await User.find({ type: 'admin' }).select('_id').lean();

                    const adminId = admin.map((item) => item._id);

                    // const p = await Playlist.find({ isPublic: true, owner: { $in: adminId } })
                    //     .limit(8)
                    //     .lean();

                    const p = await Playlist.aggregate([
                        { $match: { isPublic: true, owner: { $in: adminId } } },
                        { $sample: { size: 8 } },
                    ]);

                    recommendPlaylists = p.map((playlist) => {
                        if (playlist.tracks.length === 0) {
                            return playlist;
                        } else {
                            return {
                                ...playlist,
                                firstTrack: {
                                    context_uri: `playlist:${playlist._id}:${playlist.tracks[0]?.track}:${playlist.tracks[0]?.album}`,
                                    position: 0,
                                },
                            };
                        }
                    });
                }

                if (tags.includes('random')) {
                    const p = await Playlist.aggregate([{ $match: { isPublic: true } }, { $sample: { size: 8 } }]);

                    randomPlaylists = p.map((playlist) => {
                        if (playlist.tracks.length === 0) {
                            return playlist;
                        } else {
                            return {
                                ...playlist,
                                firstTrack: {
                                    context_uri: `playlist:${playlist._id}:${playlist.tracks[0]?.track}:${playlist.tracks[0]?.album}`,
                                    position: 0,
                                },
                            };
                        }
                    });
                }

                return res.status(200).send({
                    data: { popularPlaylists, recommendPlaylists, randomPlaylists },
                    message: 'Get playlists by tags successfully',
                });
            }

            return res.status(200).send({ data: [], message: 'Nothing to send' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async createPlaylist(req, res, next) {
        try {
            const { error } = validatePlaylist(req.body);
            if (error) {
                return res.status(404).send({ message: error.details[0].message });
            }

            const playlist = await new Playlist({
                ...req.body,
                owner: req.user._id,
            }).save();

            await Library.updateOne(
                { owner: req.user._id },
                { $push: { playlists: { playlist: playlist._id, addedAt: Date.now() } } },
            );

            return res.status(200).send({ data: playlist, message: 'Playlist created successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async updatePlaylist(req, res, next) {
        try {
            const { error } = validatePlaylist(req.body);
            if (error) {
                return res.status(404).send({ message: error.details[0].message });
            }

            const playlist = await Playlist.findById(req.params.id).select('-__v');
            if (!playlist) {
                return res.status(404).send({ message: 'Playlist does not exist' });
            }

            if (req.user._id !== playlist.owner.toString()) {
                return res.status(403).send({ message: "You don't have permission to change this playlist" });
            }

            const newPlaylist = await Playlist.findOneAndUpdate(
                { _id: req.params.id },
                { $set: req.body },
                { new: true },
            );

            return res.status(200).send({ data: newPlaylist, message: 'Playlist updated successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async deletePlaylist(req, res, next) {
        try {
            const playlist = await Playlist.findOne({ _id: req.params.id });
            if (!playlist) {
                return res.status(404).send({ message: 'Playlist does not exist' });
            }
            if (playlist.owner.toString() !== req.user._id && req.user.type !== 'admin') {
                return res.status(403).send({ message: "User doesn't have access to delete" });
            }

            await Library.updateMany(
                {},
                {
                    $pull: {
                        playlists: { playlist: req.params.id },
                    },
                },
            );

            await Playlist.findByIdAndRemove(req.params.id);

            return res.status(200).send({ message: 'Delete playlist successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async togglePublicPlaylist(req, res, next) {
        try {
            const playlist = await Playlist.findOne({ _id: req.params.id });
            if (!playlist) {
                return res.status(404).send({ message: 'Playlist does not exist' });
            }
            if (playlist.owner.toString() !== req.user._id && req.user.type !== 'admin') {
                return res.status(403).send({ message: "You don't have permision to toggle public this playlist" });
            }

            var flag = await playlist.isPublic;
            var message = '';
            if (flag) {
                message = 'Private playlist successfully';
            } else {
                message = 'Public playlist successfully';
            }
            await playlist.updateOne({ isPublic: !flag });

            return res.status(200).send({ message: message });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async addTrackToPlaylist(req, res, next) {
        try {
            console.log('lkfasd;');
            if (!mongoose.isValidObjectId(req.body.track)) {
                return res.status(404).send({ message: 'Invalid track ID' });
            }

            const playlist = await Playlist.findOne({ _id: req.params.id }).select('-__v');
            if (!playlist) {
                return res.status(404).send({ message: 'Playlist does not exist' });
            }
            if (playlist.owner.toString() !== req.user._id) {
                return res.status(403).send({ message: "User don't have access to add" });
            }

            const track = await Track.findOne({ _id: req.body.track }).select('-__v');
            if (!track) {
                return res.status(404).send({ message: 'Track does not exist' });
            }

            if (track.type === 'song') {
                const album = await Album.findOne({ _id: req.body.album }).select('-__v');
                if (!album) {
                    return res.status(404).send({ message: 'Album does not exist' });
                }
                if (album.tracks.map((obj) => obj.track).indexOf(req.body.track) === -1) {
                    return res.status(404).send({ message: 'Add track to playlist failure' });
                }

                const index = playlist.tracks
                    .map((obj) => obj.track + obj.album)
                    .indexOf(req.body.track + req.body.album);
                if (index === -1) {
                    playlist.tracks.push({
                        track: req.body.track,
                        album: req.body.album,
                        trackType: 'song',
                        addedAt: Date.now(),
                    });
                }
            } else if (track.type === 'episode') {
                const podcast = await PodcastService.findOne({ _id: req.body.podcast });
                if (!podcast) {
                    return res.status(404).send({ message: 'Podcast does not exist' });
                }
                if (podcast.episodes.map((obj) => obj.track).indexOf(req.body.track) === -1) {
                    return res.status(404).send({ message: 'Add track (episode) to playlist failure' });
                }

                const index = playlist.tracks
                    .map((obj) => obj.track + obj.podcast)
                    .indexOf(req.body.track + req.body.podcast);
                if (index === -1) {
                    playlist.tracks.push({
                        track: req.body.track,
                        podcast: req.body.podcast,
                        trackType: 'episode',
                        addedAt: Date.now(),
                    });
                }
            }

            await playlist.save();

            return res.status(200).send({ data: playlist, message: 'Added to playlist' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // async addTrackToPlaylist(req, res, next) {
    //     try {
    //         if (!mongoose.isValidObjectId(req.body.track) || !mongoose.isValidObjectId(req.body.album)) {
    //             return res.status(404).send({ message: 'Invalid ID' });
    //         }

    //         const playlist = await Playlist.findOne({ _id: req.params.id }).select('-__v');
    //         if (!playlist) {
    //             return res.status(404).send({ message: 'Playlist does not exist' });
    //         }
    //         if (playlist.owner.toString() !== req.user._id) {
    //             return res.status(403).send({ message: "User don't have access to add" });
    //         }

    //         const track = await Track.findOne({ _id: req.body.track }).select('-__v');
    //         if (!track) {
    //             return res.status(404).send({ message: 'Track does not exist' });
    //         }

    //         const album = await Album.findOne({ _id: req.body.album }).select('-__v');
    //         if (!album) {
    //             return res.status(404).send({ message: 'Album does not exist' });
    //         }
    //         if (album.tracks.map((obj) => obj.track).indexOf(req.body.track) === -1) {
    //             return res.status(404).send({ message: 'Add track to playlist failure' });
    //         }

    //         const index = playlist.tracks.map((obj) => obj.track).indexOf(req.body.track);
    //         if (index === -1) {
    //             playlist.tracks.push({
    //                 track: req.body.track,
    //                 album: req.body.album,
    //                 addedAt: Date.now(),
    //             });
    //         }
    //         await playlist.save();

    //         return res.status(200).send({ data: playlist, message: 'Added to playlist' });
    //     } catch (err) {
    //         console.log(err);
    //         return res.status(500).send({ message: 'Something went wrong' });
    //     }
    // }

    async removeTrackFromPlaylist(req, res, next) {
        try {
            if (!mongoose.isValidObjectId(req.body.track)) {
                return res.status(404).send({ message: 'Invalid ID' });
            }

            const playlist = await Playlist.findOne({ _id: req.params.id }).select('-__v');
            if (!playlist) {
                return res.status(404).send({ message: 'Playlist does not exist' });
            }
            if (playlist.owner.toString() !== req.user._id && req.user.type !== 'admin') {
                return res.status(403).send({ message: "User don't have access to remove" });
            }

            const track = await Track.findOne({ _id: req.body.track }).select('-__v');
            if (!track) {
                return res.status(404).send({ message: 'Track does not exist' });
            }

            if (track.type === 'song') {
                const album = await Album.findOne({ _id: req.body.album }).select('-__v');
                if (!album) {
                    return res.status(404).send({ message: 'Album does not exist' });
                }
                if (album.tracks.map((obj) => obj.track).indexOf(req.body.track) === -1) {
                    return res.status(404).send({ message: 'Remove track from playlist failure' });
                }

                var index = -1;
                playlist.tracks.forEach((item, i) => {
                    if (item.track.toString() === req.body.track && item.album.toString() === req.body.album) {
                        index = i;
                    }
                });
                if (index !== -1) {
                    playlist.tracks.splice(index, 1);
                }
            } else if (track.type === 'episode') {
                const podcast = await PodcastService.findOne({ _id: req.body.podcast });
                if (!podcast) {
                    return res.status(404).send({ message: 'Podcast does not exist' });
                }
                if (podcast.episodes.map((obj) => obj.track).indexOf(req.body.track) === -1) {
                    return res.status(404).send({ message: 'Remove track (episode) from playlist failure' });
                }

                var index = -1;
                playlist.tracks.forEach((item, i) => {
                    if (item.track.toString() === req.body.track && item.podcast.toString() === req.body.podcast) {
                        index = i;
                    }
                });
                if (index !== -1) {
                    playlist.tracks.splice(index, 1);
                }
            }

            await playlist.save();

            return res.status(200).send({ data: playlist, message: 'Removed from playlist' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Get user playlists by user id
    async getUserPlaylists(req, res, next) {
        try {
            let playlists;
            if (req.user._id === req.params.id) {
                playlists = await Playlist.find({ owner: req.params.id }).populate({
                    path: 'owner',
                    select: '_id name',
                });
            } else {
                playlists = await Playlist.find({ owner: req.params.id, isPublic: true }).populate({
                    path: 'owner',
                    select: '_id name',
                });
            }

            const detailPlaylists = [];
            for (let playlist of playlists) {
                const tracks = playlist.tracks;

                const detailTracks = [];
                let position = 0;
                for (let track of tracks) {
                    const t = await Track.findOne({ _id: track.track });
                    const a = await Album.findOne({ _id: track.album });
                    detailTracks.push({
                        ...track.toObject(),
                        track: t,
                        album: a,
                        context_uri: 'playlist' + ':' + playlist._id + ':' + t._id + ':' + a._id,
                        position: position,
                    });
                    position++;
                }
                detailPlaylists.push({
                    ...playlist.toObject(),
                    tracks: detailTracks,
                });
            }

            return res.status(200).send({ data: detailPlaylists, message: 'Get user playlists' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }
}

module.exports = new PlaylistController();
