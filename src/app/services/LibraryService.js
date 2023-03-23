const { Library } = require('../models/Library');

class LibraryService {
    constructor(userId) {
        this.userId = userId;
    }

    async savePodcast(podcastId) {
        await Library.updateOne(
            { owner: this.userId },
            { $push: { podcasts: { podcast: podcastId, addedAt: Date.now() } } },
        );
    }

    static async findOne(condition) {
        return await Library.findOne(condition);
    }

    static async removePodcastFromAllLibraries(podcastId) {
        // Delete podcast in Library
        await Library.updateMany(
            {},
            {
                $pull: {
                    podcasts: { podcast: podcastId },
                },
            },
        );
        // Delete podcast in library likedTracks
        await Library.updateMany(
            {},
            {
                $pull: {
                    likedEpisodes: { podcast: podcastId },
                },
            },
        );
    }

    static async removeEpisodeFromAllLibraries(trackId) {
        await Library.updateMany({}, { $pull: { likedEpisodes: { track: trackId } } });
    }
}

module.exports = LibraryService;
