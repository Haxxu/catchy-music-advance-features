const { validatePodcast, Podcast } = require('../models/Podcast');
const ApiError = require('../../utils/ApiError');
const PodcastService = require('../services/PodcastService');
const trackService = require('../services/TrackService');
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
                const isExist = await trackService.findOne({ _id: obj.track, owner: req.user._id });
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
}

module.exports = new PodcastController();
