const bcrypt = require('bcrypt');
const moment = require('moment');

const { User, validateUser, validateUpdatedPassword } = require('../models/User');
const { Library } = require('../models/Library');
const { Playlist } = require('../models/Playlist');
const { Album } = require('../models/Album');
const { AudioPlayer } = require('../models/AudioPlayer');
const { Track } = require('../models/Track');
const { Podcast } = require('../models/Podcast');

class UserController {
    // Get user by id
    async getUserById(req, res, next) {
        try {
            const user = await User.findOne({ _id: req.params.id }).select('-password -__v -email').lean();
            if (!user) {
                return res.status(400).send({ message: 'User does not exist' });
            }

            user.password = undefined;
            user.__v = undefined;
            if (user.type === 'admin') user.type = 'user';

            if (req.query.detail) {
                const library = await Library.findOne({ owner: req.params.id });

                const playlistIds = library.playlists.map((item) => item.playlist);
                const playlists = await Playlist.find({ isPublic: true, _id: { $in: playlistIds } })
                    .sort({ saved: 'desc' })
                    .limit(12)
                    .lean();

                const publicPlaylists = playlists.map((playlist) => {
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

                const followerIds = library.followers.map((item) => item.user);
                const followers = await User.find({ _id: { $in: followerIds } })
                    .select('_id name description image type')
                    .lean();

                const followingIds = library.followings.map((item) => item.user);
                const followings = await User.find({ _id: { $in: followingIds } })
                    .select('_id name description image type')
                    .lean();

                user.publicPlaylists = publicPlaylists;
                user.followers = followers.map((item) => {
                    if (item.type === 'admin') {
                        item.type === 'user';
                    }
                    return item;
                });
                user.followings = followings.map((item) => {
                    if (item.type === 'admin') {
                        item.type === 'user';
                    }
                    return item;
                });

                if (user.type === 'artist') {
                    const albums = await Album.find({ isReleased: true, owner: req.params.id })
                        .populate({ path: 'owner', select: '_id name' })
                        .sort({ releaseDate: 'desc' })
                        .lean();

                    const releasedAlbums = albums.map((album) => {
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

                    user.releasedAlbums = releasedAlbums;

                    const tracks = await Track.find({ owner: req.params.id })
                        .populate({
                            path: 'owner',
                            select: '_id name',
                        })
                        .sort({ plays: 'desc' })
                        .limit(10)
                        .lean();

                    let trackLenght = tracks.length;
                    const popularTracks = [];

                    for (let i = 0; i < trackLenght; ++i) {
                        const album = await Album.findOne({
                            isReleased: true,
                            tracks: { $elemMatch: { track: tracks[i]._id } },
                        }).lean();

                        if (!album) {
                            continue;
                        }

                        let position = album.tracks.map((item) => item.track).indexOf(tracks[i]._id.toString());

                        popularTracks.push({
                            track: tracks[i],
                            album: album,
                            context_uri: 'album' + ':' + album._id + ':' + tracks[i]._id + ':' + album._id + ':album',
                            position: position,
                        });
                    }

                    user.popularTracks = popularTracks;
                } else if (user.type === 'podcaster') {
                    const podcasts = await Podcast.find({ isReleased: true, owner: req.params.id })
                        .populate({ path: 'owner', select: '_id name' })
                        .sort({ releaseDate: 'desc' })
                        .lean();

                    const releasedPodcasts = podcasts.map((podcast) => {
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

                    user.releasedPodcasts = releasedPodcasts;

                    const tracks = await Track.find({ owner: req.params.id })
                        .populate({
                            path: 'owner',
                            select: '_id name',
                        })
                        .sort({ plays: 'desc' })
                        .limit(10)
                        .lean();

                    let trackLenght = tracks.length;
                    const popularEpisodes = [];

                    for (let i = 0; i < trackLenght; ++i) {
                        const podcast = await Podcast.findOne({
                            isReleased: true,
                            episodes: { $elemMatch: { track: tracks[i]._id } },
                        }).lean();

                        if (!podcast) {
                            continue;
                        }

                        let position = podcast.episodes.map((item) => item.track).indexOf(tracks[i]._id.toString());

                        popularEpisodes.push({
                            track: tracks[i],
                            podcast: podcast,
                            context_uri:
                                'podcast' + ':' + podcast._id + ':' + tracks[i]._id + ':' + podcast._id + ':podcast',
                            position: position,
                        });
                    }

                    user.popularEpisodes = popularEpisodes;
                }
            }

            res.status(200).send({ data: user, message: 'Get user successfully' });
        } catch (err) {
            console.log(err);
            res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Get user info
    async getUsersInfo(req, res, next) {
        try {
            const totalUsers = await User.count('_id');

            const today = moment().startOf('day');

            const newUsersToday = await User.find({
                createdAt: {
                    $gte: today.toDate(),
                    $lte: moment(today).endOf('day').toDate(),
                },
            }).count('_id');

            const newUsersThisMonth = await User.find({
                createdAt: {
                    $gte: moment(today).startOf('month').toDate(),
                    $lte: moment(today).endOf('month').toDate(),
                },
            }).count('_id');

            const newUsersLastMonth = await User.find({
                createdAt: {
                    $gte: moment(today).subtract(1, 'months').startOf('month').toDate(),
                    $lte: moment(today).subtract(1, 'months').endOf('month').toDate(),
                },
            }).count('_id');

            return res.status(200).send({
                data: { totalUsers, newUsersToday, newUsersThisMonth, newUsersLastMonth },
                message: 'Get user info successfuly',
            });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // get users by context
    async getUsersByContext(req, res, next) {
        try {
            let message = '';
            let searchCondition = {};
            if (req.query.search && req.query.search.trim() !== '') {
                let search = req.query.search.trim();
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
                    ],
                };
            }
            if (req.query.type) {
                if (req.query.type === 'artist') {
                    searchCondition.type = 'artist';
                    message = 'Get artists successfully';
                } else if (req.query.type === 'user') {
                    searchCondition.type = 'user';
                    message = 'Get users successfully';
                }
            } else {
                searchCondition.type = { $ne: 'admin' };
                message = 'Get users successfully';
            }

            const users = await User.find({ ...searchCondition }).select('-password -__v');

            return res.status(200).send({ data: users, message });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Create user
    async createUser(req, res, next) {
        try {
            const { error } = validateUser(req.body);
            if (error) {
                return res.status(400).send({ message: error.details[0].message });
            }

            const user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(403).send({ message: 'User with given email already exists!' });
            }

            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashPassword = await bcrypt.hash(req.body.password, salt);
            delete req.body.confirm_password;

            let newUser = await new User({
                ...req.body,
                password: hashPassword,
            }).save();

            let library = await new Library({
                owner: newUser._id,
            }).save();

            let audioPlayer = await new AudioPlayer({
                owner: newUser._id,
            }).save();

            newUser.password = undefined;
            newUser.__v = undefined;

            return res.status(200).send({ data: newUser, message: 'Account created successfully!' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Update user by id
    async updateUser(req, res, next) {
        try {
            if (req.user._id !== req.params.id) {
                return res.status(403).send({ message: "User don't have permisson to perform this action" });
            }

            delete req.body.email;

            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).select(
                '-password -__v',
            );
            return res.status(200).send({ data: user, message: 'Profile updated successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // remove user by id
    async removeUser(req, res, next) {
        try {
            const user = await User.findById(req.params.id); //user_id
            if (!user) {
                return res.status(400).send({ message: 'User does not exist' });
            }

            await User.findOneAndRemove({ _id: req.params.id });

            return res.status(200).send({ message: 'Remove user successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // breeze user by id
    async freezeUser(req, res, next) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(400).send({ message: 'User does not exist' });
            }

            let password = user.password;

            if (password[0] !== '!') {
                password = '!' + password;
            }
            await User.findByIdAndUpdate(req.params.id, { password: password, status: 'freezed' });

            return res.status(200).send({ message: 'Freeze user successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // unbreeze user by id
    async unfreezeUser(req, res, next) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(400).send({ message: 'User does not exist' });
            }

            let password = user.password;

            if (password[0] === '!') {
                password = password.slice(1);
            }
            await User.findByIdAndUpdate(req.params.id, { password: password, status: 'actived' });

            return res.status(200).send({ message: 'Unfreeze user successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Update password
    async updatePassword(req, res, next) {
        try {
            const { error } = validateUpdatedPassword(req.body);
            if (error) {
                return res.status(400).send({ message: error.details[0].message });
            }

            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).send({ message: 'Invalid email or password' });
            }

            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(400).send({ message: 'Invalid email or password' });
            }

            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashNewPassword = await bcrypt.hash(req.body.newPassword, salt);

            await User.findOneAndUpdate({ email: req.body.email }, { password: hashNewPassword });

            return res.status(200).send({ message: 'Changed password successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Verify artist
    async verifyArtist(req, res, next) {
        try {
            const user = await User.findById(req.params.id); //user_id
            if (!user) {
                return res.status(400).send({ message: 'User does not exist' });
            }

            await user.updateOne({ type: 'artist' });

            return res.status(200).send({ message: 'Verify artist successfullly' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Unverify artist
    async unverifyArtist(req, res, next) {
        try {
            const user = await User.findById(req.params.id); //user_id
            if (!user) {
                return res.status(400).send({ message: 'User does not exist' });
            }

            await user.updateOne({ type: 'user' });

            return res.status(200).send({ message: 'Unverify artist successfullly' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Verify podcaster
    async verifyPodcaster(req, res, next) {
        try {
            const user = await User.findById(req.params.id); //user_id
            if (!user) {
                return res.status(400).send({ message: 'User does not exist' });
            }

            await user.updateOne({ type: 'podcaster' });

            return res.status(200).send({ message: 'Verify podcaster successfullly' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Unverify artist
    async unverifyPodcaster(req, res, next) {
        try {
            const user = await User.findById(req.params.id); //user_id
            if (!user) {
                return res.status(400).send({ message: 'User does not exist' });
            }

            await user.updateOne({ type: 'user' });

            return res.status(200).send({ message: 'Unverify podcaster successfullly' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }
}

module.exports = new UserController();
