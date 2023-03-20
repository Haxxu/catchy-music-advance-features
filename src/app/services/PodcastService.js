const { Podcast } = require('../models/Podcast');

class PodcastService {
    constructor(podcastId) {
        this.podcastId = podcastId;
    }

    extractPodcastData(payload) {
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
}

module.exports = PodcastService;
