const { Album } = require('../models/Album');
const { Playlist } = require('../models/Playlist');
const { Track } = require('../models/Track');
const { Podcast } = require('../models/Podcast');
const { User } = require('../models/User');

class SearchController {
    async search(req, res, next) {
        try {
            const data = {};
            if (req.query.tags && req.query.q && req.query.q.trim() !== '') {
                let search = req.query.q.trim();
                let limit = req.query.limit && !isNaN(req.query.limit) ? req.query.limit : 10;

                const users = await User.find({
                    $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }],
                })
                    .select('_id')
                    .limit(limit)
                    .lean();

                const userIds = users.map((user) => user._id.toString());

                if (req.query.tags.includes('track') || req.query.tags.includes('episodes')) {
                    const searchCondition = {
                        $or: [
                            {
                                name: {
                                    $regex: search,
                                    $options: 'i',
                                },
                            },
                            { owner: { $in: userIds } },
                        ],
                    };
                    const tracks = await Track.find({ ...searchCondition })
                        .populate({
                            path: 'owner',
                            select: '_id name',
                        })
                        .sort({ plays: 'desc' })
                        .limit(limit)
                        .lean();

                    let trackLenght = tracks.length;
                    const trackResults = [];
                    const episodeResults = [];

                    for (let i = 0; i < trackLenght; ++i) {
                        const album = await Album.findOne({
                            isReleased: true,
                            tracks: { $elemMatch: { track: tracks[i]._id } },
                        }).lean();

                        const podcast = await Podcast.findOne({
                            isReleased: true,
                            episodes: { $elemMatch: { track: tracks[i]._id } },
                        }).lean();

                        if (album) {
                            let position = album.tracks.map((item) => item.track).indexOf(tracks[i]._id.toString());

                            trackResults.push({
                                track: tracks[i],
                                album: album,
                                context_uri:
                                    'album' + ':' + album._id + ':' + tracks[i]._id + ':' + album._id + ':album',
                                position: position,
                                trackType: 'song',
                            });
                        }

                        if (podcast) {
                            let position = podcast.episodes.map((item) => item.track).indexOf(tracks[i]._id.toString());

                            episodeResults.push({
                                track: tracks[i],
                                podcast: podcast,
                                context_uri:
                                    'podcast' +
                                    ':' +
                                    podcast._id +
                                    ':' +
                                    tracks[i]._id +
                                    ':' +
                                    podcast._id +
                                    ':podcast',
                                position: position,
                                trackType: 'episode',
                            });
                        }
                    }

                    data.tracks = trackResults;

                    data.episodes = episodeResults;
                }

                if (req.query.tags.includes('playlist')) {
                    const searchCondition = {
                        $or: [
                            {
                                name: { $regex: search, $options: 'i' },
                            },
                            {
                                owner: { $in: userIds },
                            },
                        ],
                        isPublic: true,
                    };
                    const playlists = await Playlist.find({ ...searchCondition })
                        .populate({ path: 'owner', select: '_id name type' })
                        .sort({ saved: 'desc' })
                        .limit(limit)
                        .lean();
                    // const playlistIds = playlists.map((playlist) => playlist._id.toString());

                    const playlistResults = playlists.map((playlist) => {
                        if (playlist.tracks.length === 0) {
                            return playlist;
                        } else {
                            let trackContextType, trackContextId;
                            if (playlist.tracks[0].trackType === 'episode') {
                                trackContextType = 'podcast';
                                trackContextId = playlist.tracks[0].podcast;
                            } else {
                                trackContextType = 'album';
                                trackContextId = playlist.tracks[0].album;
                            }
                            return {
                                ...playlist,
                                firstTrack: {
                                    context_uri: `playlist:${playlist._id}:${playlist.tracks[0]?.track}:${trackContextId}:${trackContextType}`,
                                    position: 0,
                                },
                            };
                        }
                    });

                    let length = playlistResults.length;
                    for (let i = 0; i < length; ++i) {
                        if (playlistResults[i].owner.type === 'admin') {
                            playlistResults[i].owner.type = 'user';
                        }
                    }

                    data.playlists = playlistResults;
                }

                if (req.query.tags.includes('album')) {
                    const searchCondition = {
                        $or: [
                            {
                                name: { $regex: search, $options: 'i' },
                            },
                            {
                                owner: { $in: userIds },
                            },
                        ],
                        isReleased: true,
                    };

                    const albums = await Album.find({ ...searchCondition })
                        .populate({ path: 'owner', select: '_id name type' })
                        .sort({ saved: 'desc' })
                        .limit(limit)
                        .lean();

                    const albumResults = albums.map((album) => {
                        if (album.tracks.length === 0) {
                            return album;
                        } else {
                            return {
                                ...album,
                                firstTrack: {
                                    context_uri: `album:${album._id}:${album.tracks[0]?.track}:${album._id}:album`,
                                    position: 0,
                                },
                            };
                        }
                    });

                    let length = albumResults.length;
                    for (let i = 0; i < length; ++i) {
                        if (albumResults[i].owner.type === 'admin') {
                            albumResults[i].owner.type = 'user';
                        }
                    }

                    data.albums = albumResults;
                }

                if (req.query.tags.includes('podcasts')) {
                    const searchCondition = {
                        $or: [
                            {
                                name: { $regex: search, $options: 'i' },
                            },
                            {
                                owner: { $in: userIds },
                            },
                        ],
                        isReleased: true,
                    };

                    const podcasts = await Podcast.find({ ...searchCondition })
                        .populate({ path: 'owner', select: '_id name type' })
                        .sort({ saved: 'desc' })
                        .limit(limit)
                        .lean();

                    const podcastResults = podcasts.map((podcast) => {
                        if (podcast.episodes.length === 0) {
                            return podcast;
                        } else {
                            return {
                                ...podcast,
                                firstTrack: {
                                    context_uri: `podcast:${podcast._id}:${podcast.episodes[0]?.track}:${podcast._id}:podcast`,
                                    position: 0,
                                },
                            };
                        }
                    });

                    let length = podcastResults.length;
                    for (let i = 0; i < length; ++i) {
                        if (podcastResults[i].owner.type === 'admin') {
                            podcastResults[i].owner.type = 'user';
                        }
                    }

                    data.podcasts = podcastResults;
                }

                if (req.query.tags.includes('artist')) {
                    const artists = await User.find({
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { email: { $regex: search, $options: 'i' } },
                        ],
                        type: 'artist',
                    })
                        .select('_id name description image type')
                        .limit(limit)
                        .lean();

                    data.artists = artists;
                }

                if (req.query.tags.includes('podcasters')) {
                    const podcasters = await User.find({
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { email: { $regex: search, $options: 'i' } },
                        ],
                        type: 'podcaster',
                    })
                        .select('_id name description image type')
                        .limit(limit)
                        .lean();

                    data.podcasters = podcasters;
                }

                if (req.query.tags.includes('user')) {
                    const users = await User.find({
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { email: { $regex: search, $options: 'i' } },
                        ],
                        type: { $ne: 'artist' },
                    })
                        .select('_id name description image type')
                        .limit(limit)
                        .lean();

                    data.users = users;
                }
            }

            return res.status(200).send({ data, message: 'Search successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }
}

module.exports = new SearchController();
