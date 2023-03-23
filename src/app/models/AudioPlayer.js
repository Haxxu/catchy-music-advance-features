const Joi = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const audioPlayerSchema = new mongoose.Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        currentPlayingTrack: {
            track: { type: String, default: '' },
            album: { type: String, default: '' },
            context_uri: { type: String, default: '' },
            position: { type: Number, default: -1 },
            podcast: { type: String, default: '' },
            // type: song, episode, chapter
            trackType: { type: String, default: 'song' },
        },
        isPlaying: { type: Boolean, default: false },
        queue: {
            tracks: [
                {
                    track: { type: String, default: '' },
                    album: { type: String, default: '' },
                    podcast: { type: String, default: '' },
                    context_uri: { type: String, default: '' },
                    position: { type: Number, default: 0 },
                    addedAt: { type: Date, default: Date.now() },
                    order: { type: Number },
                    // type: song, episode, chapter
                    trackType: { type: String, default: 'song' },
                    _id: false,
                },
            ],
            currentTrackWhenQueueActive: {
                track: { type: String, default: '' },
                album: { type: String, default: '' },
                podcast: { type: String, default: '' },
                context_uri: { type: String, default: '' },
                position: { type: Number, default: 0 },
                trackType: { type: String, default: 'song' },
                type: Object,
                default: null,
            },
        },
        shuffleTracks: [
            {
                track: { type: String, default: '' },
                album: { type: String, default: '' },
                context_uri: { type: String, default: '' },
                position: { type: Number, default: 0 },
                trackType: { type: String, default: 'song' },
                podcast: { type: String, default: '' },
                _id: false,
            },
        ],
        repeat: {
            type: String,
            default: 'none',
        },
        shuffle: {
            type: String,
            default: 'none',
        },
        shufflePosition: { type: Number, default: -1 },
        volume: {
            type: Number,
            default: 50,
            min: 0,
            max: 100,
        },
    },
    { timestamps: true },
);

const AudioPlayer = mongoose.model('AudioPlayer', audioPlayerSchema);

module.exports = { AudioPlayer };

// const Joi = require('joi');
// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const audioPlayerSchema = new mongoose.Schema(
//     {
//         owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//         currentPlayingTrack: {
//             track: { type: String, default: '' },
//             album: { type: String, default: '' },
//             context_uri: { type: String, default: '' },
//             position: { type: Number, default: 0 },
//         },
//         state: { type: String, default: 'pause' },
//         queue: {
//             tracks: [
//                 {
//                     track: { type: String, default: '' },
//                     album: { type: String, default: '' },
//                     context_uri: { type: String, default: '' },
//                     addedAt: { type: Date, default: Date.now() },
//                     order: { type: Number },
//                     _id: false,
//                 },
//             ],
//             currentTrackWhenQueueActive: {
//                 context_uri: { type: String, default: '' },
//                 position: { type: Number, default: 0 },
//                 type: Object,
//                 default: null,
//             },
//         },
//         previousTracks: [{ track: { type: String }, album: { type: String } }],
//         context_uri: { type: String, default: '' },
//         repeat: {
//             type: String,
//             default: 'none',
//         },
//         shuffle: {
//             type: String,
//             default: 'none',
//         },
//         volume: {
//             type: Number,
//             default: 50,
//             min: 0,
//             max: 100,
//         },
//     },
//     { timestamps: true },
// );

// const AudioPlayer = mongoose.model('AudioPlayer', audioPlayerSchema);

// module.exports = { AudioPlayer };
