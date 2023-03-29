const moment = require('moment');

const { Track, validateTrack, validateEpisode } = require('../models/Track');
const { Album } = require('../models/Album');
const { Library } = require('../models/Library');
const { Playlist } = require('../models/Playlist');
const { Lyric } = require('../models/Lyric');
const { Comment } = require('../models/Comment');
const { User } = require('../models/User');
const ApiError = require('../../utils/ApiError');
const TrackService = require('../services/TrackService');
const PodcastService = require('../services/PodcastService');
const PlaylistService = require('../services/PlaylistService');
const LibraryService = require('../services/LibraryService');
const LyricService = require('../services/LyricService');
const CommentService = require('../services/CommentService');
const { Podcast } = require('../models/Podcast');
class TrackController {
    // Get track by id
    async getTrackById(req, res, next) {
        try {
            const track = await Track.findOne({ _id: req.params.id }).lean();
            if (!track) {
                return res.status(400).send({ message: 'Track does not exist' });
            }

            if (req.query.detail || req.query.detail === true) {
                let artistsLength = track.artists.length;
                for (let i = 0; i < artistsLength; ++i) {
                    const user = await User.findOne({ _id: track.artists[i].id }).select('image name type').lean();
                    const albums = await Album.find({ owner: track.artists[i].id, isReleased: true })
                        .populate({
                            path: 'owner',
                            select: '_id name type image',
                        })
                        .sort({ saved: 'desc' })
                        .limit(10)
                        .lean();

                    const popularAlbums = albums.map((album) => {
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
                    track.artists[i].popularAlbums = popularAlbums;
                    track.artists[i].image = user.image;
                    track.artists[i].type = user.type;
                }

                const lyrics = await Lyric.find({ track: track._id })
                    .populate({
                        path: 'owner',
                        select: '_id name',
                    })
                    .lean();
                track.lyrics = lyrics;
            }

            res.status(200).send({ data: track, message: 'Get track successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Get episode by id
    async getEpisodeById(req, res, next) {
        try {
            const track = await Track.findOne({ _id: req.params.id, type: 'episode' }).lean();
            if (!track) {
                return res.status(400).send({ message: 'Episode does not exist' });
            }

            if (req.query.detail || req.query.detail === true) {
                let artistsLength = track.artists.length;
                for (let i = 0; i < artistsLength; ++i) {
                    const user = await User.findOne({ _id: track.artists[i].id }).select('image name type').lean();
                    const podcasts = await Podcast.find({ owner: track.artists[i].id, isReleased: true })
                        .populate({
                            path: 'owner',
                            select: '_id name type image',
                        })
                        .sort({ saved: 'desc' })
                        .limit(10)
                        .lean();

                    const popularPodcasts = podcasts.map((podcast) => {
                        if (podcast.tracks.length === 0) {
                            return podcast;
                        } else {
                            return {
                                ...podcast,
                                firstTrack: {
                                    context_uri: `podcast:${podcast._id}:${podcast.episodes[0]?.track}:${podcast._id}:podcast`,
                                    position: 0,
                                },
                            };
                        }
                    });
                    track.artists[i].popularPodcasts = popularPodcasts;
                    track.artists[i].image = user.image;
                    track.artists[i].type = user.type;
                }

                const lyrics = await Lyric.find({ track: track._id })
                    .populate({
                        path: 'owner',
                        select: '_id name',
                    })
                    .lean();
                track.lyrics = lyrics;
            }

            res.status(200).send({ data: track, message: 'Get episode successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getTracksInfo(req, res, next) {
        try {
            const condition = {};
            if (req.query.type) {
                condition.type = req.query.type;
            }

            const totalTracks = await Track.find({ ...condition }).count('_id');

            const today = moment().startOf('day');

            const newTracksToday = await Track.find({
                createdAt: {
                    $gte: today.toDate(),
                    $lte: moment(today).endOf('day').toDate(),
                },
                ...condition,
            }).count('_id');

            const newTracksThisMonth = await Track.find({
                createdAt: {
                    $gte: moment(today).startOf('month').toDate(),
                    $lte: moment(today).endOf('month').toDate(),
                },
                ...condition,
            }).count('_id');

            const newTracksLastMonth = await Track.find({
                createdAt: {
                    $gte: moment(today).subtract(1, 'months').startOf('month').toDate(),
                    $lte: moment(today).subtract(1, 'months').endOf('month').toDate(),
                },
                ...condition,
            }).count('_id');

            return res.status(200).send({
                data: { totalTracks, newTracksToday, newTracksThisMonth, newTracksLastMonth },
                message: `Get ${req.query.type || 'track'}s info successfuly`,
            });
        } catch (error) {
            return res.status(404).send({ message: error });
        }
    }

    // Create new track
    async createTrack(req, res, next) {
        try {
            const { error } = validateTrack(req.body);
            if (error) {
                return res.status(400).send({ message: error.details[0].message });
            }

            const newTrack = await new Track({
                ...req.body,
                owner: req.user._id,
            }).save();

            return res.status(200).send({ data: newTrack, message: 'Track created successfully!' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Update track
    async updateTrack(req, res, next) {
        try {
            const { error } = validateTrack(req.body);
            if (error) {
                return res.status(400).send({ message: error.details[0].message });
            }

            const track = await Track.findOne({ _id: req.params.id });
            if (!track) {
                return res.status(400).send({ message: 'Track does not exist' });
            }

            if (req.user._id !== track.owner.toString()) {
                return res.status(403).send({ message: "You don't have permission to perform this action" });
            }

            let updatedTrack = await Track.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

            return res.status(200).send({ data: updatedTrack, message: 'Track updated successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Remove track
    async deleteTrack(req, res, next) {
        try {
            const track = await Track.findOne({ _id: req.params.id });

            if (!track) {
                return res.status(400).send({ message: 'Track does not exist' });
            }

            if (req.user._id !== track.owner.toString() && req.user.type !== 'admin') {
                return res.status(403).send({ message: "You don't have permission to perform this action" });
            }

            // Delete track in album
            await Album.updateMany({ owner: track.owner.toString() }, { $pull: { tracks: { track: req.params.id } } });
            // Delete track in playlist
            await Playlist.updateMany({}, { $pull: { tracks: { track: req.params.id } } });
            // Delete track in likedTrack (Library)
            await Library.updateMany({}, { $pull: { likedTracks: { track: req.params.id } } });
            // Delete lyric of track
            await Lyric.deleteMany({ track: req.params.id });
            // Delete comment of track
            await Comment.deleteMany({ track: req.params.id });
            //Delete track
            await Track.findOneAndRemove({ _id: req.params.id });

            return res.status(200).send({ message: 'Delete track successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getTracksByContext(req, res, next) {
        try {
            if (!req.query.type) {
                let message = '';
                let searchCondition = {};
                if (req.query.search && req.query.search.trim() !== '') {
                    let search = req.query.search.trim();
                    searchCondition = {
                        $or: [
                            {
                                name: {
                                    $regex: search,
                                    $options: 'i',
                                },
                            },
                            {
                                artists: {
                                    $elemMatch: {
                                        name: {
                                            $regex: search,
                                            $options: 'i',
                                        },
                                    },
                                },
                            },
                        ],
                    };
                }

                const tracks = await Track.find({ ...searchCondition });
                return res.status(200).send({ data: tracks, message: 'Get tracks successfully' });
            } else if (req.query.type && req.query.type === 'album' && req.query.id) {
                const album = await Album.findOne({ _id: req.query.id }).lean();
                if (!album) {
                    return res.status(404).send({ message: 'Album not found' });
                }

                const tracks = [];

                let length = album.tracks.length;
                for (let i = 0; i < length; ++i) {
                    const track = await Track.findOne({ _id: album.tracks[i].track }).lean();

                    tracks.push({
                        ...track,
                        addedAt: album.tracks[i].addedAt,
                    });
                }

                return res.status(200).send({ data: tracks, message: 'Get tracks successfully' });
            } else if (req.query.type && req.query.type === 'playlist' && req.query.id) {
                const playlist = await Playlist.findOne({ _id: req.query.id }).lean();
                if (!playlist) {
                    return res.status(404).send({ message: 'Playlist not found' });
                }

                const tracks = [];

                let length = playlist.tracks.length;
                for (let i = 0; i < length; ++i) {
                    const track = await Track.findOne({ _id: playlist.tracks[i].track }).lean();
                    const album = await Album.findOne({ _id: playlist.tracks[i].album }).select('name');

                    tracks.push({
                        ...track,
                        album: album.name,
                        albumId: playlist.tracks[i].album,
                        addedAt: playlist.tracks[i].addedAt,
                    });
                }

                return res.status(200).send({ data: tracks, message: 'Get tracks successfully' });
            } else if (req.query.type && req.query.type === 'podcast' && req.query.id) {
                const podcast = await Podcast.findOne({ _id: req.query.id }).lean();
                if (!podcast) {
                    return res.status(404).send({ message: 'Podcast not found' });
                }

                const episodes = [];

                let length = podcast.episodes.length;
                for (let i = 0; i < length; ++i) {
                    const track = await Track.findOne({ _id: podcast.episodes[i].track }).lean();

                    episodes.push({
                        ...track,
                        addedAt: podcast.episodes[i].addedAt,
                    });
                }

                return res.status(200).send({ data: episodes, message: 'Get episodes successfully' });
            }

            return res.status(404).send({ message: 'Tracks not found' });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async playTrack(req, res, next) {
        try {
            const track = await Track.findOne({ _id: req.params.id });
            track.plays = track.plays + 1;

            await track.save();
            return res.status(200).send({ message: 'Play track successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getLyricsOfTrack(req, res, next) {
        try {
            const lyrics = await Lyric.find({ track: req.params.id })
                .populate({
                    path: 'owner',
                    select: '_id name',
                })
                .lean();

            return res.status(200).send({ data: lyrics, message: 'Get lyric successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Create new episode
    async createEpisode(req, res, next) {
        try {
            const { error } = validateEpisode(req.body);
            if (error) {
                return next(new ApiError(400, error.details[0].message));
            }

            const payload = {
                ...req.body,
                owner: req.user._id,
                type: 'episode',
            };

            const newTrack = await TrackService.createEpisode(payload);

            return res.status(200).send({ data: newTrack, message: 'Episode created successfully!' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Update episode
    async updateEpisode(req, res, next) {
        try {
            const { error } = validateEpisode(req.body);
            if (error) {
                return res.status(400).send({ message: error.details[0].message });
            }

            // const track = await Track.findOne({ _id: req.params.id });
            const track = await TrackService.findOne({ _id: req.params.id });
            if (!track) {
                return res.status(400).send({ message: 'Episode does not exist' });
            }

            if (req.user._id !== track.owner.toString()) {
                return res.status(403).send({ message: "You don't have permission to perform this action" });
            }

            const trackService = new TrackService(track._id);

            const updatedTrack = await trackService.update(req.body);

            return res.status(200).send({ data: updatedTrack, message: 'Episode updated successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Remove track
    async deleteEpisode(req, res, next) {
        try {
            const track = await TrackService.findOne({ _id: req.params.id });
            if (!track) {
                return res.status(400).send({ message: 'Track does not exist' });
            }

            if (req.user._id !== track.owner.toString() && req.user.type !== 'admin') {
                return res.status(403).send({ message: "You don't have permission to perform this action" });
            }

            // Delete episode in podcast
            await PodcastService.removeEpisodeFromAllPodcasts(track._id, track.owner.toString());
            // Delete episode in playlist
            await PlaylistService.removeEpisodeFromAllPlaylists(track._id);
            // Delete episode in likedEpisodes (Library)
            await LibraryService.removeEpisodeFromAllLibraries(track._id);
            // Delete lyric of episode
            await LyricService.deleteMany({ track: req.params.id });
            // Delete comment of episode
            await CommentService.deleteMany({ track: req.params.id });
            //Delete track
            await TrackService.findOneAndRemove({ _id: req.params.id });

            return res.status(200).send({ message: 'Delete episode successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }
}

module.exports = new TrackController();
