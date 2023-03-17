const mongoose = require('mongoose');
const { Schema } = mongoose;

const librarySchema = new mongoose.Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        likedTracks: [
            {
                track: { type: String, required: true },
                album: { type: String, required: true },
                addedAt: { type: Date, default: Date.now() },
                _id: false,
            },
        ],
        likedEpisodes: [
            {
                track_id: { type: String, required: true },
                podcast_id: { type: String, required: true },
                addedAt: { type: Date, default: Date.now() },
                _id: false,
            },
        ],
        albums: [
            {
                album: { type: String, required: true },
                addedAt: { type: Date, default: Date.now() },
                _id: false,
            },
        ],
        playlists: [
            {
                playlist: { type: String, required: true },
                addedAt: { type: Date, default: Date.now() },
                _id: false,
            },
        ],
        followings: [
            {
                user: { type: String, required: true },
                addedAt: { type: Date, default: Date.now() },
                _id: false,
            },
        ],
        followers: [
            {
                user: { type: String, required: true },
                addedAt: { type: Date, default: Date.now() },
                _id: false,
            },
        ],
        // advance
        podcasts: [
            {
                podcast_id: { type: String, required: true },
                addedAt: { type: Date, default: Date.now() },
                _id: false,
            },
        ],
        // Array which save time info of track (chapter, episode)
        listeningTracks: [
            {
                track_id: { type: String, required: true },
                podcast_id: { type: String },
                // type: episode, chapter
                type: { type: String, default: 'episode' },
                duration: { type: Number, required: true, default: 0 },
                currentListeningTime: { type: Number, required: true, default: 0 },
                played: { type: Boolean, default: false },
            },
        ],
    },
    { timestamps: true },
);

const Library = mongoose.model('Library', librarySchema);

module.exports = { Library };
