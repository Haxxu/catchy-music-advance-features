const { Lyric } = require('../models/Lyric');

class LyricService {
    static async deleteMany(condition) {
        await Lyric.deleteMany(condition);
    }
}

module.exports = LyricService;
