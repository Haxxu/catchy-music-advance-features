const moment = require('moment');

const { Library } = require('../models/Library');
const { User } = require('../models/User');
const { Genre } = require('../models/Genre');
const { Track } = require('../models/Track');
const { Album } = require('../models/Album');

class ArtistController {
    async getArtistById(req, res, next) {
        try {
            const artist = await User.findOne({ _id: req.params.id, type: 'artist' })
                .select('-email -password -createdAt -updatedAt -status -__v')
                .lean();
            if (!artist) {
                return res.status(404).send({ message: 'Artist not found' });
            }

            const library = await Library.findOne({ owner: artist._id });
            if (!library) {
                return res.status(404).send({ message: 'Library not found' });
            }

            const detailGenres = [];
            for (let genre of artist.genres) {
                const g = await Genre.findOne({ _id: genre });
                detailGenres.push({
                    _id: genre,
                    name: g.name,
                    description: g.description,
                });
            }

            let moreInfo = {
                followers: { total: library.followers.length },
                followings: { total: library.followings.length },
            };
            if (req.user._id === artist._id.toString() && req.query.context === 'detail') {
                const albums = await Album.find({ owner: req.user._id }).lean();
                const tracks = await Track.find({ owner: req.user._id }).lean();

                const [totalPlays, totalSaved] = tracks.reduce(
                    (prev, track) => [prev[0] + track.plays, prev[1] + track.saved],
                    [0, 0],
                );
                moreInfo.tracks = {
                    total: tracks.length,
                    items: tracks,
                    totalPlays,
                    totalSaved,
                };
                moreInfo.albums = {
                    total: albums.length,
                    totalReleasedAlbums: albums.filter((album) => album.isReleased).length,
                    items: albums,
                    totalSaved: albums.reduce((prev, album) => prev + album.saved, 0),
                };

                const today = moment().startOf('day');

                moreInfo.followers.newFollowersToday = library.followers.filter(
                    (follower) =>
                        follower.addedAt >= today.toDate() && follower.addedAt <= moment(today).endOf('day').toDate(),
                ).length;
                moreInfo.followers.newFollowersThisMonth = library.followers.filter(
                    (follower) =>
                        follower.addedAt >= moment(today).startOf('month').toDate() &&
                        follower.addedAt <= moment(today).endOf('month').toDate(),
                ).length;
                moreInfo.followers.newFollowersLastMonth = library.followers.filter(
                    (follower) =>
                        follower.addedAt >= moment(today).subtract(1, 'months').startOf('month').toDate() &&
                        follower.addedAt <= moment(today).subtract(1, 'months').endOf('month').toDate(),
                ).length;
            } else {
                const albums = await Album.find({ owner: req.user._id, isReleased: true }).lean();
                const tracks = await Track.find({ owner: req.user._id }).lean();
                moreInfo.tracks = {
                    total: tracks.length,
                    items: tracks,
                };
                moreInfo.albums = {
                    total: albums.length,
                    items: albums,
                };
            }

            const artistDetail = {
                ...artist,
                genres: detailGenres,
                ...moreInfo,
            };

            return res.status(200).send({ data: artistDetail, message: 'Get artist successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Get artist info (for admin)
    async getArtistsInfo(req, res, next) {
        try {
            const totalArtists = await User.find({ type: 'artist' }).count('_id');

            return res.status(200).send({ data: { totalArtists }, message: 'Get artist info successfully' });
        } catch (error) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Get artist by context (admin)
    async getArtistsByContext(req, res, next) {
        try {
            let message = '';
            let searchCondition = {};
            if (req.query.search && req.query.search.trim() !== '') {
                let search = req.query.search.trim();

                const tracks = await Track.find({ name: { $regex: search, $options: 'i' }, type: 'song' }).select(
                    'owner',
                );
                const albums = await Album.find({ name: { $regex: search, $options: 'i' } }).select('owner');

                let artistIdsList = tracks.map((track) => track.owner.toString());
                artistIdsList = artistIdsList.concat(albums.map((album) => album.owner.toString()));

                searchCondition = {
                    $or: [
                        {
                            name: {
                                $regex: search,
                                $options: 'i',
                            },
                        },
                        {
                            email: {
                                $regex: search,
                                $options: 'i',
                            },
                        },
                        {
                            _id: { $in: artistIdsList },
                        },
                    ],
                };
            }

            const users = await User.find({ ...searchCondition, type: 'artist' })
                .select('-password -__v')
                .lean();

            let length = users.length;
            for (let i = 0; i < length; ++i) {
                let id = users[i]._id;
                const library = await Library.findOne({ owner: id });
                users[i].totalFollowers = library.followers.length;
                users[i].totalTracks = await Track.find({ owner: id }).count();
                users[i].totalAlbums = await Album.find({ owner: id }).count();
            }

            return res.status(200).send({ data: users, message });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getTracksOfArtist(req, res, next) {
        try {
            const artist = await User.findOne({ _id: req.params.id, type: 'artist' });
            if (!artist) {
                return res.status(404).send({ message: 'Artist not found' });
            }

            let searchCondition = {};
            let search = req.query.search.trim();
            if (req.query.search && search !== '') {
                searchCondition = {
                    name: {
                        $regex: search,
                        $options: 'i',
                    },
                };
            }

            const tracks = await Track.find({ owner: req.params.id, ...searchCondition }).sort({ createdAt: 'desc' });
            return res.status(200).send({ data: tracks, message: 'Get tracks successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getArtists(req, res, next) {
        try {
            const artists = await User.find({ type: 'artist' }).select('name _id').lean();

            const newArtists = artists.map((artist) => ({ name: artist.name, id: artist._id }));
            return res.status(200).send({ data: newArtists, message: 'Get artists successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getAlbumsOfArtist(req, res, next) {
        try {
            const artist = await User.findOne({ _id: req.params.id, type: 'artist' });
            if (!artist) {
                return res.status(404).send({ message: 'Artist not found' });
            }

            let condition = {};
            if (req.user._id === artist._id.toString() && req.query.context === 'detail') {
                if (req.query.search && req.query.search.trim() !== '') {
                    let search = req.query.search.trim();
                    condition = {
                        name: {
                            $regex: search,
                            $options: 'i',
                        },
                    };
                }
            } else {
                condition = {
                    isReleased: true,
                };
            }

            const albums = await Album.find({ owner: artist._id.toString(), ...condition })
                .populate({
                    path: 'owner',
                    select: '_id name',
                })
                .lean();

            const detailAlbums = albums.map((album) => {
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

            return res.status(200).send({ data: detailAlbums, message: 'Get albums successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }
}

module.exports = new ArtistController();
