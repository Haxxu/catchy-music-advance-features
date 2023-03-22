const { AudioPlayer } = require('../models/AudioPlayer');

class AudioPlayerService {
    constructor(id) {
        this.id = id;
    }

    static async findOne(condition) {
        return await AudioPlayer.findOne(condition);
    }
}

module.exports = AudioPlayerService;
