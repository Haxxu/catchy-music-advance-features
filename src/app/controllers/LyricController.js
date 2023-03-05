const mongoose = require('mongoose');

const { Lyric, validateLyric } = require('../models/Lyric');
const { Track } = require('../models/Track');

class LyricController {
    async addLyricToTrack(req, res, next) {
        try {
            const { error } = validateLyric(req.body);
            if (error) {
                return res.status(404).send({ message: error.details[0].message });
            }

            if (!mongoose.isValidObjectId(req.body.track)) {
                return res.status(404).send({ message: 'Invalid ID.' });
            }
            const track = await Track.findOne({ _id: req.body.track });
            if (!track) {
                return res.status(404).send({ message: 'Track does not exist' });
            } else {
                if (track.owner.toString() !== req.user._id) {
                    return res.status(400).send({ message: "You don't have permission to add lyric to this track" });
                }
            }

            const newLyric = await new Lyric({
                ...req.body,
                owner: req.user._id,
            }).save();

            return res.status(200).send({ data: newLyric, message: 'Added lyric to track successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getLyricById(req, res, next) {
        try {
            const lyric = await Lyric.findOne({ _id: req.params.id });
            if (!lyric) {
                return res.status(404).send({ message: 'Lyric not found' });
            }

            return res.status(200).send({ data: lyric, message: 'Get lyric successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async updateLyric(req, res, next) {
        try {
            const { error } = validateLyric(req.body);
            if (error) {
                return res.status(400).send({ message: error.details[0].message });
            }

            if (!mongoose.isValidObjectId(req.body.track)) {
                return res.status(404).send({ message: 'Invalid ID.' });
            }
            const track = await Track.findOne({ _id: req.body.track });
            if (!track) {
                return res.status(404).send({ message: 'Track does not exist' });
            } else {
                if (track.owner.toString() !== req.user._id) {
                    return res.status(400).send({ message: "You don't have permission to update lyric to this track" });
                }
            }

            let updatedLyric = await Lyric.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

            return res.status(200).send({ data: updatedLyric, message: 'Updated lyric successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getAllLyricsOfTrack(req, res, next) {
        try {
            const lyrics = await Lyric.find({ track: req.params.id }).populate('track', 'name').lean();

            // const newLyrics = lyrics.map((lyric) => ({ ...lyric, track: lyric.track.name }));

            return res.status(200).send({ data: lyrics, message: 'Get lyrics successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // remove lyric by id
    async removeLyric(req, res, next) {
        try {
            const lyric = await Lyric.findById(req.params.id); //lyric_id
            if (!lyric) {
                return res.status(404).send({ message: 'Lyric does not exist' });
            }

            if (lyric.owner.toString() !== req.user._id) {
                return res.status(400).send({ message: "You don't have permision to remove this lyric" });
            }

            await Lyric.findOneAndRemove({ _id: req.params.id });

            res.status(200).send({ message: 'Remove lyric successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }
}

module.exports = new LyricController();
