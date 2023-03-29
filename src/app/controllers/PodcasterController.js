const moment = require('moment');

const { Library } = require('../models/Library');
const { User } = require('../models/User');
const { Genre } = require('../models/Genre');
const { Track } = require('../models/Track');
const { Album } = require('../models/Album');
const { Podcast } = require('../models/Podcast');

class PodcasterController {
    async getPodcasterById(req, res, next) {
        try {
            const podcaster = await User.findOne({ _id: req.params.id, type: 'podcaster' })
                .select('-email -password -createdAt -updatedAt -status -__v')
                .lean();
            if (!podcaster) {
                return res.status(404).send({ message: 'Podcaster not found' });
            }

            const library = await Library.findOne({ owner: podcaster._id });
            if (!library) {
                return res.status(404).send({ message: 'Library not found' });
            }

            const detailGenres = [];
            for (let genre of podcaster.genres) {
                const g = await Genre.findOne({ _id: genre });
                detailGenres.push({
                    _id: genre,
                    name: g.name,
                    description: g.description,
                });
            }

            let moreInfo = {
                followers: { total: library.followers.length },
                followings: { total: library.followings.length },
            };
            if (req.user._id === podcaster._id.toString() && req.query.context === 'detail') {
                const podcasts = await Podcast.find({ owner: req.user._id }).lean();
                const episodes = await Track.find({ owner: req.user._id }).lean();

                const [totalPlays, totalSaved] = episodes.reduce(
                    (prev, track) => [prev[0] + track.plays, prev[1] + track.saved],
                    [0, 0],
                );
                moreInfo.episodes = {
                    total: episodes.length,
                    items: episodes,
                    totalPlays,
                    totalSaved,
                };
                moreInfo.podcasts = {
                    total: podcasts.length,
                    totalReleasedPodcasts: podcasts.filter((podcast) => podcast.isReleased).length,
                    items: podcasts,
                    totalSaved: podcasts.reduce((prev, podcast) => prev + podcast.saved, 0),
                };

                const today = moment().startOf('day');

                moreInfo.followers.newFollowersToday = library.followers.filter(
                    (follower) =>
                        follower.addedAt >= today.toDate() && follower.addedAt <= moment(today).endOf('day').toDate(),
                ).length;
                moreInfo.followers.newFollowersThisMonth = library.followers.filter(
                    (follower) =>
                        follower.addedAt >= moment(today).startOf('month').toDate() &&
                        follower.addedAt <= moment(today).endOf('month').toDate(),
                ).length;
                moreInfo.followers.newFollowersLastMonth = library.followers.filter(
                    (follower) =>
                        follower.addedAt >= moment(today).subtract(1, 'months').startOf('month').toDate() &&
                        follower.addedAt <= moment(today).subtract(1, 'months').endOf('month').toDate(),
                ).length;
            } else {
                const podcasts = await Podcast.find({ owner: req.user._id, isReleased: true }).lean();
                const episodes = await Track.find({ owner: req.user._id }).lean();
                moreInfo.episodes = {
                    total: episodes.length,
                    items: episodes,
                };
                moreInfo.podcasts = {
                    total: podcasts.length,
                    items: podcasts,
                };
            }

            const podcasterDetail = {
                ...podcaster,
                genres: detailGenres,
                ...moreInfo,
            };

            return res.status(200).send({ data: podcasterDetail, message: 'Get podcaster successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Get podcasters info (for admin)
    async getPodcastersInfo(req, res, next) {
        try {
            const totalPodcasters = await User.find({ type: 'podcaster' }).count('_id');

            return res.status(200).send({ data: { totalPodcasters }, message: 'Get podcasters info successfully' });
        } catch (error) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Get podcaster by context (admin)
    async getPodcastersByContext(req, res, next) {
        try {
            let message = '';
            let searchCondition = {};
            if (req.query.search && req.query.search.trim() !== '') {
                let search = req.query.search.trim();

                const tracks = await Track.find({ name: { $regex: search, $options: 'i' }, type: 'episode' }).select(
                    'owner',
                );
                const podcasts = await Podcast.find({ name: { $regex: search, $options: 'i' } }).select('owner');

                let podcasterIdsList = tracks.map((track) => track.owner.toString());
                podcasterIdsList = podcasterIdsList.concat(podcasts.map((podcast) => podcast.owner.toString()));

                searchCondition = {
                    $or: [
                        {
                            name: {
                                $regex: search,
                                $options: 'i',
                            },
                        },
                        {
                            email: {
                                $regex: search,
                                $options: 'i',
                            },
                        },
                        {
                            _id: { $in: podcasterIdsList },
                        },
                    ],
                };
            }

            const users = await User.find({ ...searchCondition, type: 'podcaster' })
                .select('-password -__v')
                .lean();

            let length = users.length;
            for (let i = 0; i < length; ++i) {
                let id = users[i]._id;
                const library = await Library.findOne({ owner: id });
                users[i].totalFollowers = library.followers.length;
                users[i].totalEpisodes = await Track.find({ owner: id }).count();
                users[i].totalPodcasts = await Podcast.find({ owner: id }).count();
            }

            return res.status(200).send({ data: users, message });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getEpisodesOfPodcaster(req, res, next) {
        try {
            const podcaster = await User.findOne({ _id: req.params.id, type: 'podcaster' });
            if (!podcaster) {
                return res.status(404).send({ message: 'Podcaster not found' });
            }

            let searchCondition = {};
            let search = req.query.search.trim();
            if (req.query.search && search !== '') {
                searchCondition = {
                    name: {
                        $regex: search,
                        $options: 'i',
                    },
                };
            }

            const tracks = await Track.find({ owner: req.params.id, ...searchCondition }).sort({ createdAt: 'desc' });
            return res.status(200).send({ data: tracks, message: 'Get episode successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getPodcasters(req, res, next) {
        try {
            const podcasters = await User.find({ type: 'podcaster' }).select('name _id').lean();

            const newPodcasters = podcasters.map((podcaster) => ({ name: podcaster.name, id: podcaster._id }));
            return res.status(200).send({ data: newPodcasters, message: 'Get artists successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getPodcastsOfPodcaster(req, res, next) {
        try {
            const podcaster = await User.findOne({ _id: req.params.id, type: 'podcaster' });
            if (!podcaster) {
                return res.status(404).send({ message: 'Podcaster not found' });
            }

            let condition = {};
            if (req.user._id === podcaster._id.toString() && req.query.context === 'detail') {
                if (req.query.search && req.query.search.trim() !== '') {
                    let search = req.query.search.trim();
                    condition = {
                        name: {
                            $regex: search,
                            $options: 'i',
                        },
                    };
                }
            } else {
                condition = {
                    isReleased: true,
                };
            }

            const podcasts = await Podcast.find({ owner: podcaster._id.toString(), ...condition })
                .populate({
                    path: 'owner',
                    select: '_id name',
                })
                .lean();

            const detailPodcasts = podcasts.map((podcast) => {
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

            return res.status(200).send({ data: detailPodcasts, message: 'Get podcasts successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }
}

module.exports = new PodcasterController();
