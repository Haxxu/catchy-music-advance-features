const { Album } = require('../models/Album');
const { Genre, validateGenre } = require('../models/Genre');
const { Playlist } = require('../models/Playlist');
const { Track } = require('../models/Track');
const { User } = require('../models/User');

class GenreController {
    // Get all genres
    async getAllGenres(req, res, next) {
        try {
            const genres = await Genre.find();

            return res.status(200).send({ data: genres, message: 'Get all genres successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Get genre by id
    async getGenreById(req, res, next) {
        try {
            const genre = await Genre.findOne({ _id: req.params.id }).lean();
            if (!genre) {
                return res.status(404).send({ message: 'Genre not found' });
            }

            if (req.query.detail || req.query.detail === true) {
                const artists = await User.find({ type: 'artist', genres: { $elemMatch: { $eq: req.params.id } } })
                    .select('_id name description image type')
                    .limit(12)
                    .lean();
                genre.artists = artists;

                const admins = await User.find({ type: 'admin' })
                    .select('_id name description image type')
                    .limit(12)
                    .lean();

                const tracks = await Track.find({ genres: { $elemMatch: { $eq: req.params.id } } })
                    .sort({ plays: 'desc' })
                    .limit(100)
                    .lean();

                const trackIds = tracks.map((track) => track._id);
                const adminIds = admins.map((admin) => admin._id);
                const artistIds = artists.map((artist) => artist._id);

                try {
                    const newReleaseAlbums = await Album.find({
                        isReleased: true,
                        $or: [{ owner: { $in: artistIds } }, { tracks: { $elemMatch: { track: { $in: trackIds } } } }],
                    })
                        .populate({ path: 'owner', select: '_id name type' })
                        .sort({ releaseDate: 'desc' })
                        .limit(12)
                        .lean();
                    const detailNewReleaseAlbums = newReleaseAlbums.map((album) => {
                        if (album.tracks.length === 0) {
                            return album;
                        } else {
                            return {
                                ...album,
                                firstTrack: {
                                    context_uri: `album:${album._id}:${album.tracks[0]?.track}:${album._id}`,
                                    position: 0,
                                },
                            };
                        }
                    });
                    genre.newReleaseAlbums = detailNewReleaseAlbums;
                } catch (err) {
                    console.log(err);
                }

                try {
                    const popularAlbums = await Album.find({
                        isReleased: true,
                        $or: [{ owner: { $in: artistIds } }, { tracks: { $elemMatch: { track: { $in: trackIds } } } }],
                    })
                        .populate({ path: 'owner', select: '_id name type' })
                        .sort({ saved: 'desc' })
                        .limit(12)
                        .lean();
                    const detailPopularAlbums = popularAlbums.map((album) => {
                        if (album.tracks.length === 0) {
                            return album;
                        } else {
                            return {
                                ...album,
                                firstTrack: {
                                    context_uri: `album:${album._id}:${album.tracks[0]?.track}:${album._id}`,
                                    position: 0,
                                },
                            };
                        }
                    });
                    genre.popularAlbums = detailPopularAlbums;
                } catch (err) {
                    console.log(err);
                }

                try {
                    const recommendPlaylists = await Playlist.find({
                        isPublic: true,
                        $or: [{ owner: { $in: adminIds } }, { tracks: { $elemMatch: { track: { $in: trackIds } } } }],
                    })
                        .populate({ path: 'owner', select: '_id name type' })
                        .limit(12)
                        .lean();
                    const detailRecommendPlaylists = recommendPlaylists.map((playlist) => {
                        if (playlist.tracks.length === 0) {
                            return playlist;
                        } else {
                            return {
                                ...playlist,
                                firstTrack: {
                                    context_uri: `playlist:${playlist._id}:${playlist.tracks[0]?.track}:${playlist.tracks[0]?.album}`,
                                    position: 0,
                                },
                            };
                        }
                    });
                    let length = detailRecommendPlaylists.length;
                    for (let i = 0; i < length; ++i) {
                        if (detailRecommendPlaylists[i].owner.type === 'admin') {
                            detailRecommendPlaylists[i].owner.type = 'user';
                        }
                    }
                    genre.recommendPlaylists = detailRecommendPlaylists;
                } catch (err) {
                    console.log(err);
                }

                try {
                    const popularPlaylists = await Playlist.find({
                        isPublic: true,
                        tracks: { $elemMatch: { track: { $in: trackIds } } },
                    })
                        .populate({ path: 'owner', select: '_id name type' })
                        .sort({ saved: 'desc' })
                        .limit(12)
                        .lean();
                    const detailPopularPlaylists = popularPlaylists.map((playlist) => {
                        if (playlist.tracks.length === 0) {
                            return playlist;
                        } else {
                            return {
                                ...playlist,
                                firstTrack: {
                                    context_uri: `playlist:${playlist._id}:${playlist.tracks[0]?.track}:${playlist.tracks[0]?.album}`,
                                    position: 0,
                                },
                            };
                        }
                    });
                    let length = detailPopularPlaylists.length;
                    for (let i = 0; i < length; ++i) {
                        if (detailPopularPlaylists[i].owner.type === 'admin') {
                            detailPopularPlaylists[i].owner.type = 'user';
                        }
                    }
                    genre.popularPlaylists = detailPopularPlaylists;
                } catch (err) {
                    console.log(err);
                }
            }

            return res.status(200).send({ data: genre, message: 'Get genre successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // create new genre
    async createGenre(req, res, next) {
        try {
            const { error } = validateGenre(req.body);
            if (error) {
                return res.status(400).send({ message: error.details[0].message });
            }

            const genre = await new Genre({
                ...req.body,
            }).save();

            return res.status(200).send({ data: genre, message: 'Genre created successully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // update genre by id
    async updateGenre(req, res, next) {
        try {
            const { error } = validateGenre(req.body);
            if (error) {
                return res.status(400).send({ message: error.details[0].message });
            }

            const genre = await Genre.findById(req.params.id);
            if (!genre) {
                return res.status(404).send({ message: 'Genre does not exist' });
            }

            const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

            res.status(200).send({ data: updatedGenre, message: 'Genre updated successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // delete genre by id
    async deleteGenre(req, res, next) {
        try {
            const genre = await Genre.findOne({ _id: req.params.id });
            if (!genre) {
                return res.status(404).send({ messaeg: 'Genre not found' });
            }

            await User.updateMany({}, { $pull: { genres: req.params.id } });

            await Track.updateMany({}, { $pull: { genres: req.param.id } });

            await Genre.findOneAndRemove({ _id: req.params.id });

            return res.status(200).send({ message: 'Deleted genre successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }
}

module.exports = new GenreController();
