const { Track } = require('../models/Track');

class TrackService {
    constructor(trackId) {
        this.trackId = trackId;
    }

    static extractEpisodeData(payload) {
        const episode = {
            owner: payload.owner,
            name: payload.name,
            image: payload.image,
            duration: payload.duration,
            artists: [],
            genres: [],
            videoCanvas: payload.videoCanvas,
            date: payload.date,
            month: payload.month,
            year: payload.year,
            type: payload.type,
            audio: payload.audio,
        };
        return episode;
    }

    static async findOne(condition) {
        return await Track.findOne(condition);
    }

    static async createEpisode(payload) {
        const episode = this.extractEpisodeData(payload);
        const newEpisode = await new Track(episode).save();

        return newEpisode;
    }

    async update(payload) {
        return await Track.findOneAndUpdate({ _id: this.trackId }, { $set: payload }, { new: true });
    }

    static async findOneAndRemove(condition) {
        await Track.findOneAndRemove(condition);
    }
}

module.exports = TrackService;
