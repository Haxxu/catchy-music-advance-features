const mongoose = require('mongoose');

const { validatePodcast, Podcast } = require('../models/Podcast');
const ApiError = require('../../utils/ApiError');
const PodcastService = require('../services/PodcastService');
const TrackService = require('../services/TrackService');
const LibraryService = require('../services/LibraryService');
const PlaylistService = require('../services/PlaylistService');

class PodcastController {
    async createPodcast(req, res, next) {
        try {
            const { error } = validatePodcast(req.body);
            if (error) {
                return next(new ApiError(400, error.details[0].message));
            }

            const payload = {
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
}

module.exports = new PodcastController();
