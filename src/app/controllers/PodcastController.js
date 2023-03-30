const mongoose = require('mongoose');
const moment = require('moment');

const { validatePodcast, Podcast } = require('../models/Podcast');
const { User } = require('../models/User');
const ApiError = require('../../utils/ApiError');
const PodcastService = require('../services/PodcastService');
const TrackService = require('../services/TrackService');
const LibraryService = require('../services/LibraryService');
const PlaylistService = require('../services/PlaylistService');

class PodcastController {
    // get podcast by id (get released podcast or podcast podcaster own)
    async getPodcastById(req, res, next) {
        try {
            const podcast = await Podcast.findById(req.params.id)
                .populate({ path: 'owner', select: '_id name' })
                .lean();
            if (!podcast) {
                return res.status(404).send({ message: 'Podcast does not exist' });
            }

            if (podcast.isReleased || podcast.owner._id.toString() === req.user._id) {
                const detailTracks = [];
                let position = 0;
                for (let track of podcast.episodes) {
                    const t = await TrackService.findOne({ _id: track.track });
                    detailTracks.push({
                        ...track,
                        track: t,
                        trackType: t.type,
                        context_uri: 'podcast' + ':' + podcast._id + ':' + t._id + ':' + podcast._id + ':podcast',
                        position: position,
                    });
                    position++;
                }

                return res.status(200).send({
                    data: { ...podcast, episodes: detailTracks },
                    message: 'Get podcast successfully',
                });
            } else {
                return res.status(403).send({ message: 'Podcast does not release' });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getPodcastsByTags(req, res, next) {
        try {
            if (req.query.tags) {
                const tags = req.query.tags;

                let popularPodcasts;
                let newReleasePodcasts;
                let randomPodcasts;

                if (tags.includes('popular')) {
                    const podcasts = await Podcast.find({ isReleased: true })
                        .sort({ saved: 'desc' })
                        .populate({ path: 'owner', select: '_id name' })
                        .limit(8)
                        .lean();

                    popularPodcasts = podcasts.map((podcast) => {
                        if (podcast.episodes.length === 0) {
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
                }

                if (tags.includes('new-release')) {
                    const podcasts = await Podcast.find({ isReleased: true })
                        .sort({ releaseDate: 'desc' })
                        .populate({ path: 'owner', select: '_id name' })
                        .limit(8)
                        .lean();

                    newReleasePodcasts = podcasts.map((podcast) => {
                        if (podcast.episodes.length === 0) {
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
                }

                if (tags.includes('random')) {
                    const result = await Podcast.aggregate([
                        { $match: { isReleased: true } },
                        { $sample: { size: 8 } },
                    ]);

                    const podcasts = await Podcast.populate(result, { path: 'owner', select: '_id name' });

                    randomPodcasts = podcasts.map((podcast) => {
                        if (podcast.episodes.length === 0) {
                            return podcast;
                        } else {
                            return {
                                ...podcast,
                                firstTrack: {
                                    context_uri: `podcast:${podcast._id}:${podcast.episodes[0].track}:${podcast._id}:podcast`,
                                    position: 0,
                                },
                            };
                        }
                    });
                }

                return res.status(200).send({
                    data: { popularPodcasts, newReleasePodcasts, randomPodcasts },
                    message: 'Get podcasts by tags successfully',
                });
            }

            return res.status(200).send({ data: [], message: 'Nothing to send' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async createPodcast(req, res, next) {
        try {
            const { error } = validatePodcast(req.body);
            if (error) {
                return next(new ApiError(400, error.details[0].message));
            }

            const payload = {
                categories: [],
                ...req.body,
                owner: req.user._id,
            };

            const newPodcast = await PodcastService.create(payload);

            const libraryService = new LibraryService(req.user._id);

            await libraryService.savePodcast(newPodcast._id);

            return res.status(200).json({ data: newPodcast, message: 'Create podcast successfully!' });
        } catch (err) {
            console.log(err);
            return next(new ApiError());
        }
    }

    async updatePodcast(req, res, next) {
        try {
            const { error } = validatePodcast(req.body);
            if (error) {
                return next(new ApiError(400, error.details[0].message));
            }

            const podcast = await PodcastService.findById(req.params.id);
            if (!podcast) {
                return next(new ApiError(404, 'Podcast not found'));
            }

            if (req.user._id !== podcast.owner.toString()) {
                return next(new ApiError(403, "You don't have permission to perform this action"));
            }

            var episodes = [...req.body.episodes];
            var mes = '';

            for (let obj of episodes) {
                // const isExist = await Track.findOne({ _id: obj.track, owner: req.user._id });
                const isExist = await TrackService.findOne({ _id: obj.track, owner: req.user._id });
                if (!isExist) {
                    const index = req.body.episodes.map((i) => i.track).indexOf(obj.track);
                    if (index > -1) {
                        req.body.episodes.splice(index, 1);
                    }
                    mes = mes + obj.track + ', ';
                }
            }

            const payload = {
                ...req.body,
            };

            const updatedPodcast = await PodcastService.updatePodcastById(req.params.id, payload);

            return res.status(200).json({
                data: updatedPodcast,
                message: mes === '' ? 'Updated podcast successfully' : 'Can not add episode to podcast: ' + mes,
            });
        } catch (err) {
            console.log(err);
            return next(new ApiError());
        }
    }

    async deletePodcast(req, res, next) {
        try {
            const podcast = await PodcastService.findOne({ _id: req.params.id });
            if (!podcast) {
                return res.status(404).send({ message: 'Podcast does not exist' });
            }
            if (podcast.owner.toString() !== req.user._id && req.user.type !== 'admin') {
                return res.status(403).send({ message: "User doesn't have access to delete this podcast" });
            }

            // Remove podcast from all libraries
            await LibraryService.removePodcastFromAllLibraries(podcast._id);
            // Delete podcast in playlists
            await PlaylistService.removePodcastFromAllPlaylists(podcast._id);

            await PodcastService.findByIdAndRemove(podcast._id);

            return res.status(200).send({ message: 'Delete podcast successfully' });
        } catch (err) {
            console.log(err);
            return next(new ApiError());
        }
    }

    async addEpisodeToPodcast(req, res, next) {
        try {
            if (!mongoose.isValidObjectId(req.body.track)) {
                return res.status(404).send({ message: 'Invalid ID' });
            }

            let podcast = await PodcastService.findOne({ _id: req.params.id });
            if (!podcast) {
                return res.status(404).send({ message: 'Podcast does not exist' });
            }

            const track = await TrackService.findOne({ _id: req.body.track });
            if (!track) {
                return res.status(404).send({ message: 'Episode does not exist' });
            }

            if (podcast.owner.toString() !== req.user._id || track.owner.toString() !== req.user._id) {
                return res.status(403).send({ message: "User don't have access to add" });
            }

            if (podcast.episodes.map((obj) => obj.track).indexOf(req.body.track) !== -1) {
                return res.status(404).send({ message: 'Episode already in podcast' });
            } else {
                const podcastService = new PodcastService(podcast._id);

                podcast = await podcastService.addEpisode(req.body.track);
            }

            return res.status(200).send({ data: podcast, message: 'Added to podcast' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async removeEpisodeFromPodcast(req, res, next) {
        try {
            if (!mongoose.isValidObjectId(req.body.track)) {
                return res.status(404).send({ message: 'Invalid ID' });
            }

            let podcast = await PodcastService.findOne({ _id: req.params.id });
            if (!podcast) {
                return res.status(404).send({ message: 'Podcast does not exist' });
            }

            const track = await TrackService.findOne({ _id: req.body.track });
            if (!track) {
                return res.status(404).send({ message: 'Episode does not exist' });
            }

            if (
                (podcast.owner.toString() !== req.user._id || track.owner.toString() !== req.user._id) &&
                req.user.type !== 'admin'
            ) {
                return res.status(403).send({ message: "User don't have access to remove" });
            }

            const podcastService = new PodcastService(podcast._id);
            podcast = await podcastService.removeEpisode(req.body.track);

            return res.status(200).send({ data: podcast, message: 'Removed from podcast' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async toggleReleasePodcast(req, res, next) {
        try {
            const podcast = await PodcastService.findOne({ _id: req.params.id });
            if (!podcast) {
                return res.status(404).send({ message: 'Podcast does not exist' });
            }
            if (podcast.owner.toString() !== req.user._id && req.user.type !== 'admin') {
                return res.status(403).send({ message: "You don't have permision to toggle release this podcast" });
            }

            var flag = await podcast.isReleased;
            var message = '';
            if (flag) {
                message = 'Unreleased podcast successfully';
            } else {
                message = 'Released podcast successfully';
            }
            await podcast.updateOne({ isReleased: !flag, releaseDate: Date.now() });

            return res.status(200).send({ message: message });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getPodcastsByContext(req, res, next) {
        try {
            let message = '';
            let searchCondition = {};
            if (req.query.search && req.query.search.trim() !== '') {
                let search = req.query.search.trim();

                const podcasters = await User.find({
                    type: 'podcaster',
                    $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }],
                }).select('_id');

                const podcastersId = podcasters.map((podcaster) => podcaster._id.toString());

                searchCondition = {
                    $or: [
                        {
                            name: { $regex: search, $options: 'i' },
                        },
                        {
                            owner: { $in: podcastersId },
                        },
                    ],
                };
            }

            const podcasts = await Podcast.find({ ...searchCondition }).populate('owner', '_id name');
            return res.status(200).send({ data: podcasts, message: 'Get podcasts successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // get podcasts info for admin
    async getPodcastsInfo(req, res, next) {
        try {
            const totalPodcasts = await Podcast.count('_id');

            const today = moment().startOf('day');

            const newPodcastsToday = await Podcast.find({
                createdAt: {
                    $gte: today.toDate(),
                    $lte: moment(today).endOf('day').toDate(),
                },
            }).count('_id');

            const newPodcastsThisMonth = await Podcast.find({
                createdAt: {
                    $gte: moment(today).startOf('month').toDate(),
                    $lte: moment(today).endOf('month').toDate(),
                },
            }).count('_id');

            const newPodcastsLastMonth = await Podcast.find({
                createdAt: {
                    $gte: moment(today).subtract(1, 'months').startOf('month').toDate(),
                    $lte: moment(today).subtract(1, 'months').endOf('month').toDate(),
                },
            }).count('_id');

            return res.status(200).send({
                data: { totalPodcasts, newPodcastsToday, newPodcastsThisMonth, newPodcastsLastMonth },
                message: 'Get podcasts info successfuly',
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }
}

module.exports = new PodcastController();
