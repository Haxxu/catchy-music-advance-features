const { Library } = require('../models/Library');

class LibraryService {
    constructor(userId) {
        this.userId = userId;
    }

    async savePodcast(podcastId) {
        await Library.updateOne(
            { owner: this.userId },
            { $push: { podcasts: { podcast_id: podcastId, addedAt: Date.now() } } },
        );
    }

    static async removePodcastFromAllLibraries(podcastId) {
        // Delete podcast in Library
        await Library.updateMany(
            {},
            {
                $pull: {
                    podcasts: { podcast_id: podcastId },
                },
            },
        );
        // Delete podcast in library likedTracks
        await Library.updateMany(
            {},
            {
                $pull: {
                    likedEpisodes: { podcast_id: podcastId },
                },
            },
        );
    }
}

module.exports = LibraryService;
