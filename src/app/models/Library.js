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
                trackType: { type: String, default: 'song' },
                _id: false,
            },
        ],
        likedEpisodes: [
            {
                track: { type: String },
                podcast: { type: String },
                addedAt: { type: Date, default: Date.now() },
                trackType: { type: String, default: 'episode' },
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
                podcast: { type: String, required: true },
                addedAt: { type: Date, default: Date.now() },
                _id: false,
            },
        ],
        // Array which save time info of track (chapter, episode)
        listeningTracks: [
            {
                track: { type: String, required: true },
                podcast: { type: String },
                // type: episode, chapter
                trackType: { type: String, default: 'episode' },
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
