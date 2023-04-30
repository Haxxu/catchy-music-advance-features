const mongoose = require('mongoose');
const moment = require('moment');

const { Album, validateAlbum } = require('../models/Album');
const { Library } = require('../models/Library');
const { Playlist } = require('../models/Playlist');
const { Track } = require('../models/Track');
const { User } = require('../models/User');
const NotificationService = require('../services/NotificationService');

class AlbumController {
    // get album by id (get released album or album artist own)
    async getAlbumById(req, res, next) {
        try {
            const album = await Album.findById(req.params.id).populate({ path: 'owner', select: '_id name' }).lean();
            if (!album) {
                return res.status(404).send({ message: 'Album does not exist' });
            }

            if (album.isReleased || album.owner._id.toString() === req.user._id) {
                const detailTracks = [];
                let position = 0;
                for (let track of album.tracks) {
                    const t = await Track.findOne({ _id: track.track });
                    detailTracks.push({
                        ...track,
                        track: t,
                        context_uri: 'album' + ':' + album._id + ':' + t._id + ':' + album._id + ':album',
                        position: position,
                    });
                    position++;
                }

                return res.status(200).send({
                    data: { ...album, tracks: detailTracks },
                    message: 'Get album successfully',
                });
            } else {
                return res.status(403).send({ message: 'Album does not release' });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // get albums info for admin
    async getAlbumsInfo(req, res, next) {
        try {
            const totalAlbums = await Album.count('_id');

            const today = moment().startOf('day');

            const newAlbumsToday = await Album.find({
                createdAt: {
                    $gte: today.toDate(),
                    $lte: moment(today).endOf('day').toDate(),
                },
            }).count('_id');

            const newAlbumsThisMonth = await Album.find({
                createdAt: {
                    $gte: moment(today).startOf('month').toDate(),
                    $lte: moment(today).endOf('month').toDate(),
                },
            }).count('_id');

            const newAlbumsLastMonth = await Album.find({
                createdAt: {
                    $gte: moment(today).subtract(1, 'months').startOf('month').toDate(),
                    $lte: moment(today).subtract(1, 'months').endOf('month').toDate(),
                },
            }).count('_id');

            return res.status(200).send({
                data: { totalAlbums, newAlbumsToday, newAlbumsThisMonth, newAlbumsLastMonth },
                message: 'Get album info successfuly',
            });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getAlbumsByContext(req, res, next) {
        try {
            let message = '';
            let searchCondition = {};
            if (req.query.search && req.query.search.trim() !== '') {
                let search = req.query.search.trim();

                const artists = await User.find({
                    type: 'artist',
                    $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }],
                }).select('_id');

                const artistsId = artists.map((artist) => artist._id.toString());

                searchCondition = {
                    $or: [
                        {
                            name: { $regex: search, $options: 'i' },
                        },
                        {
                            owner: { $in: artistsId },
                        },
                    ],
                };
            }

            const albums = await Album.find({ ...searchCondition }).populate('owner', '_id name');
            return res.status(200).send({ data: albums, message: 'Get albums successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getAlbumsByTags(req, res, next) {
        try {
            if (req.query.tags) {
                const tags = req.query.tags;

                let popularAlbums;
                let newReleaseAlbums;
                let randomAlbums;

                if (tags.includes('popular')) {
                    const albums = await Album.find({ isReleased: true })
                        .sort({ saved: 'desc' })
                        .populate({ path: 'owner', select: '_id name' })
                        .limit(8)
                        .lean();

                    popularAlbums = albums.map((album) => {
                        if (album.tracks.length === 0) {
                            return album;
                        } else {
                            return {
                                ...album,
                                firstTrack: {
                                    context_uri: `album:${album._id}:${album.tracks[0]?.track}:${album._id}`,
                                    position: 0,
                                },
                            };
                        }
                    });
                }

                if (tags.includes('new-release')) {
                    const albums = await Album.find({ isReleased: true })
                        .sort({ releaseDate: 'desc' })
                        .populate({ path: 'owner', select: '_id name' })
                        .limit(8)
                        .lean();

                    newReleaseAlbums = albums.map((album) => {
                        if (album.tracks.length === 0) {
                            return album;
                        } else {
                            return {
                                ...album,
                                firstTrack: {
                                    context_uri: `album:${album._id}:${album.tracks[0]?.track}:${album._id}`,
                                    position: 0,
                                },
                            };
                        }
                    });
                }

                if (tags.includes('random')) {
                    const result = await Album.aggregate([{ $match: { isReleased: true } }, { $sample: { size: 8 } }]);

                    const albums = await Album.populate(result, { path: 'owner', select: '_id name' });

                    randomAlbums = albums.map((album) => {
                        if (album.tracks.length === 0) {
                            return album;
                        } else {
                            return {
                                ...album,
                                firstTrack: {
                                    context_uri: `album:${album._id}:${album.tracks[0].track}:${album._id}`,
                                    position: 0,
                                },
                            };
                        }
                    });
                }

                return res.status(200).send({
                    data: { popularAlbums, newReleaseAlbums, randomAlbums },
                    message: 'Get albums by tags successfully',
                });
            }

            return res.status(200).send({ data: [], message: 'Nothing to send' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getArtistsOfAlbum(req, res, next) {
        try {
            const album = await Album.findOne({ _id: req.params.id }).lean();
            if (!album) {
                return res.status(404).send({ message: 'Album not found' });
            }

            let length = album.tracks.length;
            for (let i = 0; i < length; ++i) {}
        } catch (err) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // create new album
    async createAlbum(req, res, next) {
        try {
            // console.log(req.body.tracks);
            const { error } = validateAlbum(req.body);
            if (error) {
                return res.status(400).send({ message: error.details[0].message });
            }

            const tracks = [...req.body.tracks];
            var mes = '';

            for (let obj of tracks) {
                const isExist = await Track.findOne({ _id: obj.track, owner: req.user._id });
                if (!isExist) {
                    const index = req.body.tracks.map((i) => i.track).indexOf(obj.track);
                    if (index > -1) {
                        req.body.tracks.splice(index, 1);
                    }
                    mes = mes + obj.track + ', ';
                }
            }

            const album = await new Album({
                ...req.body,
                owner: req.user._id,
            }).save();

            await Library.updateOne(
                { owner: req.user._id },
                { $push: { albums: { album: album._id, addedAt: Date.now() } } },
            );

            return res.status(200).send({
                data: album,
                message: mes === '' ? 'Create album successfully' : 'Can not add track to album: ' + mes,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // update album
    async updateAlbum(req, res, next) {
        try {
            const { error } = validateAlbum(req.body);
            if (error) {
                return res.status(400).send({ message: error.details[0].message });
            }

            const album = await Album.findById(req.params.id);
            if (!album) {
                return res.status(400).send({ message: 'Album does not exist' });
            }

            if (req.user._id !== album.owner.toString()) {
                return res.status(403).send({ message: "You don't have permission to perform this action" });
            }

            var tracks = [...req.body.tracks];
            var mes = '';

            for (let obj of tracks) {
                const isExist = await Track.findOne({ _id: obj.track, owner: req.user._id });
                if (!isExist) {
                    const index = req.body.tracks.map((i) => i.track).indexOf(obj.track);
                    if (index > -1) {
                        req.body.tracks.splice(index, 1);
                    }
                    mes = mes + obj.track + ', ';
                }
            }

            if (req.body.isReleased && !album.isReleased) {
                req.body.releaseDate = Date.now();
            }

            const updatedAlbum = await Album.findOneAndUpdate(
                { _id: req.params.id },
                { $set: req.body },
                { new: true },
            );

            return res.status(200).send({
                data: updatedAlbum,
                message: mes === '' ? 'Updated album successfully' : 'Can not add track to album: ' + mes,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async deleteAlbum(req, res, next) {
        try {
            const album = await Album.findOne({ _id: req.params.id });
            if (!album) {
                return res.status(404).send({ message: 'Album does not exist' });
            }
            if (album.owner.toString() !== req.user._id && req.user.type !== 'admin') {
                return res.status(403).send({ message: "User doesn't have access to delete" });
            }

            // Delete album in Library
            await Library.updateMany(
                {},
                {
                    $pull: {
                        albums: { album: req.params.id },
                    },
                },
            );
            // Delete album in library likedTracks
            await Library.updateMany(
                {},
                {
                    $pull: {
                        likedTracks: { album: req.params.id },
                    },
                },
            );
            // Delete album in playlists
            await Playlist.updateMany(
                {},
                {
                    $pull: {
                        tracks: { album: req.params.id },
                    },
                },
            );

            await Album.findByIdAndRemove(req.params.id);

            return res.status(200).send({ message: 'Delete album successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async toggleReleaseAlbum(req, res, next) {
        try {
            const album = await Album.findOne({ _id: req.params.id });
            if (!album) {
                return res.status(404).send({ message: 'Album does not exist' });
            }
            if (album.owner.toString() !== req.user._id && req.user.type !== 'admin') {
                return res.status(403).send({ message: "You don't have permision to toggle release this album" });
            }

            var flag = await album.isReleased;
            var message = '';
            if (flag) {
                message = 'Unreleased album successfully';
            } else {
                message = 'Released album successfully';
            }
            await album.updateOne({ isReleased: !flag, releaseDate: Date.now() });

            // New Notification
            if (flag === false && req.user._id === album.owner.toString()) {
                const payload = {
                    owner: req.user._id,
                };

                payload.contextObject = {
                    name: album.name,
                    _id: album._id.toString(),
                    image: album.image,
                    type: 'album',
                    url: `/album/${album._id.toString()}`,
                };

                if (album.tracks[0]) {
                    payload.playTrack = {
                        trackId: album.tracks[0].track,
                        trackType: 'song',
                        trackContextId: album._id.toString(),
                        context_uri: `album:${album._id.toString()}:${
                            album.tracks[0].track
                        }:${album._id.toString()}:album`,
                        position: 0,
                    };
                }

                payload.description = 'New album release';
                payload.addedAt = Date.now();
                payload.type = 'new-album';

                const owner = await User.findOne({ _id: album.owner.toString() });

                payload.artists = [{ id: owner._id, name: owner.name, url: `/artist/${owner._id}` }];

                const new_notification = await NotificationService.createNotifcation(payload);

                const { io } = require('../../index');
                // console.log(req.user._id);
                io.to(`${req.user._id}`).emit('newNotification', new_notification);
            }

            return res.status(200).send({ message: message });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async addTrackToAlbum(req, res, next) {
        try {
            if (!mongoose.isValidObjectId(req.body.track)) {
                return res.status(404).send({ message: 'Invalid ID' });
            }

            const album = await Album.findOne({ _id: req.params.id }).select('-__v');
            if (!album) {
                return res.status(404).send({ message: 'Album does not exist' });
            }

            const track = await Track.findOne({ _id: req.body.track }).select('-__v');
            if (!track) {
                return res.status(404).send({ message: 'Track does not exist' });
            }

            if (album.owner.toString() !== req.user._id || track.owner.toString() !== req.user._id) {
                return res.status(403).send({ message: "User don't have access to add" });
            }

            if (album.tracks.map((obj) => obj.track).indexOf(req.body.track) !== -1) {
                return res.status(404).send({ message: 'Track already in album' });
            } else {
                album.tracks.push({
                    track: req.body.track,
                    addedAt: Date.now(),
                });
            }

            await album.save();

            return res.status(200).send({ data: album, message: 'Added to album' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async removeTrackFromAlbum(req, res, next) {
        try {
            if (!mongoose.isValidObjectId(req.body.track)) {
                return res.status(404).send({ message: 'Invalid ID' });
            }

            const album = await Album.findOne({ _id: req.params.id }).select('-__v');
            if (!album) {
                return res.status(404).send({ message: 'Album does not exist' });
            }

            const track = await Track.findOne({ _id: req.body.track }).select('-__v');
            if (!track) {
                return res.status(404).send({ message: 'Track does not exist' });
            }

            if (
                (album.owner.toString() !== req.user._id || track.owner.toString() !== req.user._id) &&
                req.user.type !== 'admin'
            ) {
                return res.status(403).send({ message: "User don't have access to remove" });
            }

            var index = album.tracks.map((obj) => obj.track).indexOf(req.body.track);
            if (index === -1) {
                return res.status(404).send({ message: 'Track does not in album' });
            } else {
                album.tracks.splice(index, 1);
            }

            await album.save();

            return res.status(200).send({ data: album, message: 'Removed from album' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getUserAlbums(req, res, next) {
        try {
            let albums;
            if (req.user._id === req.params.id) {
                albums = await Album.find({ owner: req.params.id }).populate({ path: 'owner', select: '_id name' });
            } else {
                albums = await Album.find({ owner: req.params.id, isReleased: true }).populate({
                    path: 'owner',
                    select: '_id name',
                });
            }

            const detailAlbums = [];
            for (let album of albums) {
                const tracks = album.tracks;

                const detailTracks = [];
                let position = 0;
                for (let track of tracks) {
                    const t = await Track.findOne({ _id: track.track });
                    detailTracks.push({
                        ...track.toObject(),
                        track: t,
                        context_uri: 'album' + ':' + album._id + ':' + t._id + ':' + album._id,
                        position: position,
                    });
                    position++;
                }
                detailAlbums.push({
                    ...album.toObject(),
                    tracks: detailTracks,
                });
            }

            res.status(200).send({ data: detailAlbums, message: 'Get user albums' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }
}

module.exports = new AlbumController();
