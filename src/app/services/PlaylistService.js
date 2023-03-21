const { Playlist } = require('../models/Playlist');

class PlaylistService {
    constructor(playlistId) {
        this.playlistId = playlistId;
    }

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

    static async removeEpisodeFromAllPlaylists(trackId) {
        await Playlist.updateMany(
            {},
            {
                $pull: {
                    tracks: { track: trackId },
                },
            },
        );
    }
}

module.exports = PlaylistService;
