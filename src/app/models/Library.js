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
    },
    { timestamps: true },
);

const Library = mongoose.model('Library', librarySchema);

module.exports = { Library };
