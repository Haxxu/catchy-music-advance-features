const { Album } = require('../models/Album');

class AlbumService {
    constructor(albumId) {
        this.albumId = albumId;
    }

    static async findOne(condition) {
        return await Album.findOne(condition);
    }
}

module.exports = AlbumService;
