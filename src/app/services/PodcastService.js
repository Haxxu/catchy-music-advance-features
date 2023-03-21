const { Podcast } = require('../models/Podcast');

class PodcastService {
    constructor(podcastId) {
        this.podcastId = podcastId;
    }

    static extractPodcastData(payload) {
        const podcast = {
            owner: payload.owner,
            name: payload.name,
            description: payload.description,
            episodes: [...payload.episodes],
            images: [...payload.images],
            categories: [...payload.categories],
            date: payload.date,
            month: payload.month,
            year: payload.year,
        };
        return podcast;
    }

    static async create(payload) {
        const podcast = this.extractPodcastData(payload);
        const newPodcast = await new Podcast(podcast).save();

        return newPodcast;
    }

    static async findById(id) {
        return await Podcast.findById(id);
    }

    static async findOne(condition) {
        return await Podcast.findOne(condition);
    }

    static async updatePodcastById(podcastId, payload) {
        return await Podcast.findOneAndUpdate({ _id: podcastId }, { $set: payload }, { new: true });
    }

    static async findByIdAndRemove(podcastId) {
        await Podcast.findByIdAndRemove(podcastId);
    }

    static async removeEpisodeFromAllPodcasts(trackId, trackOwnerId) {
        await Podcast.updateMany({ owner: trackOwnerId }, { $pull: { episodes: { track: trackId } } });
    }

    async addEpisode(trackId) {
        const podcast = await Podcast.findOne({ _id: this.podcastId });
        podcast.episodes.push({
            track: trackId,
            addedAt: Date.now(),
        });
        return await podcast.save();
    }

    async removeEpisode(trackId) {
        const podcast = await Podcast.findOne({ _id: this.podcastId });

        let index = podcast.episodes.map((obj) => obj.track).indexOf(trackId);

        if (index !== -1) podcast.episodes.splice(index, 1);

        return await podcast.save();
    }
}

module.exports = PodcastService;
