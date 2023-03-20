const { Track } = require('../models/Track');

class TrackService {
    async findOne(condition) {
        return await Track.findOne(condition);
    }
}

module.exports = new TrackService();
