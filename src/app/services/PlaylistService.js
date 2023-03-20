const { Playlist } = require('../models/Playlist');

class PlaylistService {
    static async removePodcastFromAllPlaylists(podcastId) {
        await Playlist.updateMany(
            {},
            {
                $pull: {
                    tracks: { podcast: podcastId },
                },
            },
        );
    }
}

module.exports = PlaylistService;
