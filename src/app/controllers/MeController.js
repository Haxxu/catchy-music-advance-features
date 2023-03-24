const { User } = require('../models/User');
const { Library } = require('../models/Library');
const { Album } = require('../models/Album');
const { Playlist } = require('../models/Playlist');
const { Track } = require('../models/Track');
const TrackService = require('../services/TrackService');
const PodcastService = require('../services/PodcastService');
const LibraryService = require('../services/LibraryService');
const { Podcast } = require('../models/Podcast');

class MeController {
    // Get current user profile
    async getCurrentUserProfile(req, res, next) {
        try {
            const user = await User.findOne({ _id: req.user._id }).select('-password -__v');

            return res.status(200).send({ data: user, message: 'Get user profile successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Check saved playlist
    async checkSavedTrack(req, res, next) {
        try {
            let saved = false;
            if (req.query.trackId && req.query.albumId) {
                const library = await Library.findOne({ owner: req.user._id }).select('likedTracks');
                if (!library) {
                    return res.status(404).send({ message: 'Library not found' });
                }

                if (
                    library.likedTracks.find(
                        (item) => item.track === req.query.trackId && item.album === req.query.albumId,
                    )
                ) {
                    saved = true;
                }
            }

            return res.status(200).send({ data: saved, message: 'Check saved track' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Get liked tracks
    async getLikedTracks(req, res, next) {
        try {
            const library = await Library.findOne({ owner: req.user._id });
            if (!library) {
                return res.status(404).send({ message: 'Library not found' });
            }

            async function getLikedTrack(item, index) {
                const track = await Track.findOne({ _id: item.track });
                const album = await Album.findOne({ _id: item.album });
                return {
                    track: track,
                    album: album,
                    podcast: '',
                    trackType: 'song',
                    addedAt: item.addedAt,
                    context_uri:
                        'liked' + ':' + library._id.toString() + ':' + item.track + ':' + item.album + ':album',
                    position: index,
                };
            }

            const likedTracks = await Promise.all(library.likedTracks.map(getLikedTrack));

            return res.status(200).send({ data: likedTracks, message: 'Get liked tracks successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Check following user
    async checkFollowingUser(req, res, next) {
        try {
            let saved = false;
            if (req.query.id) {
                const library = await Library.findOne({ owner: req.user._id }).select('followings');
                if (!library) {
                    return res.status(404).send({ message: 'Library not found' });
                }

                if (library.followings.find((item) => item.user === req.query.id)) {
                    saved = true;
                }
            }

            return res.status(200).send({ data: saved, message: 'Check following user' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Get following users
    async getFollowing(req, res, next) {
        try {
            const library = await Library.findOne({ owner: req.user._id });
            const followings = library.followings.map((item) => item.user);
            const artists = await User.find({ _id: { $in: followings }, type: 'artist' })
                .select('-password -__v -email -createdAt -updatedAt')
                .lean();
            let users = await User.find({ _id: { $in: followings }, type: { $ne: 'artist' } })
                .select('-password -__v -email -createdAt -updatedAt')
                .lean();
            users = users.map((user) => ({ ...user, type: 'user' }));

            return res.status(200).send({
                data: { artists: artists, users: users, all: [...artists, users] },
                message: 'Get following user successfully',
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Follow user or arist
    async followUser(req, res, next) {
        try {
            if (req.body.user === req.user._id) {
                return res.status(404).send({ message: 'Cannot perform this action' });
            }

            const userFollowLibrary = await Library.findOne({ owner: req.body.user });
            if (!userFollowLibrary) {
                return res.status(404).send({ message: 'User does not exist' });
            }

            const library = await Library.findOne({ owner: req.user._id });
            if (!library) {
                return res.status(404).send({ message: 'Cannot find user library' });
            }

            const index = library.followings.map((item) => item.user).indexOf(req.body.user);
            if (index === -1) {
                library.followings.push({
                    user: req.body.user,
                    addedAt: Date.now(),
                });
                userFollowLibrary.followers.push({
                    user: req.user._id,
                    addedAt: Date.now(),
                });
            }
            await library.save();
            await userFollowLibrary.save();

            return res.status(200).send({ message: 'Follow user or artist successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Unfollow user or arist
    async unfollowUser(req, res, next) {
        try {
            if (req.body.user === req.user._id) {
                return res.status(404).send({ message: 'Cannot perform this action' });
            }

            const userFollowLibrary = await Library.findOne({ owner: req.body.user });
            if (!userFollowLibrary) {
                return res.status(404).send({ message: 'User does not exist' });
            }

            const library = await Library.findOne({ owner: req.user._id });
            if (!library) {
                return res.status(404).send({ message: 'Cannot find user library' });
            }

            const indexFollowing = library.followings.map((item) => item.user).indexOf(req.body.user);
            if (indexFollowing !== -1) {
                library.followings.splice(indexFollowing, 1);
                const indexFollower = userFollowLibrary.followers.map((item) => item.user).indexOf(req.user._id);
                userFollowLibrary.followers.splice(indexFollower, 1);
            }

            await library.save();
            await userFollowLibrary.save();

            return res.status(200).send({ message: 'Unfollow user or artist successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Check saved albums
    async checkSavedAlbum(req, res, next) {
        try {
            let saved = false;
            if (req.query.albumId) {
                const library = await Library.findOne({ owner: req.user._id }).select('albums');
                if (!library) {
                    return res.status(404).send({ message: 'Library not found' });
                }

                if (library.albums.find((item) => item.album === req.query.albumId)) {
                    saved = true;
                }
            }

            return res.status(200).send({ data: saved, message: 'Check saved album' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Get saved albums
    async getSavedAlbums(req, res, next) {
        try {
            const library = await Library.findOne({ owner: req.user._id });
            if (!library) {
                return res.status(404).send({ message: 'Library not found' });
            }

            const albums = [...library.albums];
            // Sort newest addedAt first
            albums.sort((a, b) => {
                return new Date(b.addedAt) - new Date(a.addedAt);
            });
            // Get saved albums ( array of album obj)
            const a = await Album.find({ _id: { $in: albums.map((item) => item.album) } })
                .populate({ path: 'owner', select: '_id name' })
                .lean();
            // array of album id
            const aClean = a.map((item) => item._id.toString());

            // Add album detail to savedAlbums
            const detailSavedAlbums = albums.map((obj) => {
                let index = aClean.indexOf(obj.album);
                return {
                    album: {
                        ...a[index],
                        firstTrack: {
                            context_uri: `album:${a[index]._id}:${a[index].tracks[0]?.track}:${a[index]._id}`,
                            position: 0,
                        },
                    },
                    addedAt: obj.addedAt,
                };
            });

            return res.status(200).send({ data: detailSavedAlbums, message: 'Get saved album successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Save album to user library
    async saveAblum(req, res, next) {
        try {
            const album = await Album.findOne({ _id: req.body.album });
            if (!album) {
                return res.status(404).send({ message: 'Album does not exist' });
            }

            const library = await Library.findOne({ owner: req.user._id });
            if (!library) {
                return res.status(404).send({ message: 'Cannot find user library' });
            }

            const index = library.albums.map((item) => item.album).indexOf(req.body.album);
            if (index === -1) {
                library.albums.push({
                    album: req.body.album,
                    addedAt: Date.now(),
                });
                album.saved = album.saved + 1;
            }

            await library.save();
            await album.save();

            return res.status(200).send({ message: 'Saved to library' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Remove album from user library
    async removeSavedAlbum(req, res, next) {
        try {
            const album = await Album.findOne({ _id: req.body.album });
            if (!album) {
                return res.status(404).send({ message: 'Album does not exist' });
            }

            if (album.owner.toString() === req.user._id) {
                return res.status(403).send({ message: 'You should not remove your album from your library' });
            }

            const library = await Library.findOne({ owner: req.user._id });
            if (!library) {
                return res.status(404).send({ message: 'Cannot find user library' });
            }

            const index = library.albums.map((item) => item.album).indexOf(req.body.album);
            if (index !== -1) {
                library.albums.splice(index, 1);
                album.saved = album.saved - 1;
                if (album.saved < 0) {
                    album.saved = 0;
                }
            }

            await library.save();
            await album.save();

            return res.status(200).send({ message: 'Removed from library' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Check saved podcast
    async checkSavedPodcast(req, res, next) {
        try {
            let saved = false;
            if (req.query.podcastId) {
                const library = await Library.findOne({ owner: req.user._id }).select('podcasts');
                if (!library) {
                    return res.status(404).send({ message: 'Library not found' });
                }

                if (library.podcasts.find((item) => item.podcast === req.query.podcastId)) {
                    saved = true;
                }
            }

            return res.status(200).send({ data: saved, message: 'Check saved podcast' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Get saved podcast
    async getSavedPodcasts(req, res, next) {
        try {
            const library = await Library.findOne({ owner: req.user._id });
            if (!library) {
                return res.status(404).send({ message: 'Library not found' });
            }

            const podcasts = [...library.podcasts];
            // Sort newest addedAt first
            podcasts.sort((a, b) => {
                return new Date(b.addedAt) - new Date(a.addedAt);
            });
            // Get saved podcasts ( array of podcasts obj)
            const p = await Podcast.find({ _id: { $in: podcasts.map((item) => item.podcast) } })
                .populate({ path: 'owner', select: '_id name' })
                .lean();
            // array of album id
            const pClean = p.map((item) => item._id.toString());

            // Add album detail to savedPodcasts
            const detailSavedPodcasts = podcasts.map((obj) => {
                let index = pClean.indexOf(obj.podcast);
                return {
                    podcast: {
                        ...p[index],
                        firstTrack: {
                            context_uri: `podcast:${p[index]._id}:${p[index].episodes[0]?.track}:${p[index]._id}:podcast`,
                            position: 0,
                        },
                    },
                    addedAt: obj.addedAt,
                };
            });

            return res.status(200).send({ data: detailSavedPodcasts, message: 'Get saved podcasts successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Save podcast to user library
    async savePodcast(req, res, next) {
        try {
            const podcast = await PodcastService.findOne({ _id: req.body.podcast });
            if (!podcast) {
                return res.status(404).send({ message: 'Podcast does not exist' });
            }

            const library = await Library.findOne({ owner: req.user._id });
            if (!library) {
                return res.status(404).send({ message: 'Cannot find user library' });
            }

            const index = library.podcasts.map((item) => item.podcast).indexOf(req.body.podcast);
            if (index === -1) {
                library.podcasts.push({
                    podcast: req.body.podcast,
                    addedAt: Date.now(),
                });
                podcast.saved = podcast.saved + 1;
            }

            await library.save();
            await podcast.save();

            return res.status(200).send({ message: 'Saved podcast to library' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Remove album from user library
    async removeSavedPodcast(req, res, next) {
        try {
            const podcast = await PodcastService.findOne({ _id: req.body.podcast });
            if (!podcast) {
                return res.status(404).send({ message: 'Podcast does not exist' });
            }

            if (podcast.owner.toString() === req.user._id) {
                return res.status(403).send({ message: 'You should not remove your podcast from your library' });
            }

            const library = await Library.findOne({ owner: req.user._id });
            if (!library) {
                return res.status(404).send({ message: 'Cannot find user library' });
            }

            const index = library.podcasts.map((item) => item.podcast).indexOf(req.body.podcast);
            if (index !== -1) {
                library.podcasts.splice(index, 1);
                podcast.saved = podcast.saved - 1;
                if (podcast.saved < 0) {
                    podcast.saved = 0;
                }
            }

            await library.save();
            await podcast.save();

            return res.status(200).send({ message: 'Removed podcast from library' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Check saved playlist
    async checkSavedPlaylist(req, res, next) {
        try {
            let saved = false;
            if (req.query.playlistId) {
                const library = await Library.findOne({ owner: req.user._id }).select('playlists');
                if (!library) {
                    return res.status(404).send({ message: 'Library not found' });
                }

                if (library.playlists.find((item) => item.playlist === req.query.playlistId)) {
                    saved = true;
                }
            }

            return res.status(200).send({ data: saved, message: 'Check saved playlist' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Get saved playlist
    async getSavedPlaylists(req, res, next) {
        try {
            const library = await Library.findOne({ owner: req.user._id });

            const playlists = [...library.playlists];
            // Sort newest addedAt first
            playlists.sort((a, b) => {
                return new Date(b.addedAt) - new Date(a.addedAt);
            });
            // Get saved playlists ( array of playlist obj)
            const p = await Playlist.find({ _id: { $in: playlists.map((item) => item.playlist) } }).lean();
            // array of playlist id
            const pClean = p.map((item) => item._id.toString());

            // Add album detail to savedAlbums
            const detailSavedPlaylists = playlists.map((obj) => {
                let index = pClean.indexOf(obj.playlist);
                return {
                    playlist: {
                        ...p[index],
                        firstTrack: {
                            context_uri: `playlist:${p[index]._id}:${p[index].tracks[0]?.track}:${p[index].tracks[0]?.album}`,
                            position: 0,
                        },
                    },
                    addedAt: obj.addedAt,
                };
            });

            return res.status(200).send({ data: detailSavedPlaylists, message: 'Get saved playlist successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Save playlist to user library
    async savePlaylist(req, res, next) {
        try {
            const playlist = await Playlist.findOne({ _id: req.body.playlist });
            if (!playlist) {
                return res.status(404).send({ message: 'Playlist does not exist' });
            }

            const library = await Library.findOne({ owner: req.user._id });
            if (!library) {
                return res.status(404).send({ message: 'Cannot find user library' });
            }

            const index = library.playlists.map((item) => item.playlist).indexOf(req.body.playlist);
            if (index === -1) {
                library.playlists.push({
                    playlist: req.body.playlist,
                    addedAt: Date.now(),
                });
                playlist.saved = playlist.saved + 1;
            }

            await library.save();
            await playlist.save();

            return res.status(200).send({ message: 'Saved to library' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Remove album from user library
    async removeSavedPlaylist(req, res, next) {
        try {
            const playlist = await Playlist.findOne({ _id: req.body.playlist });
            if (!playlist) {
                return res.status(404).send({ message: 'Playlist does not exist' });
            }

            if (playlist.owner.toString() === req.user._id) {
                return res.status(403).send({ message: 'You should not remove your playlist from your library' });
            }

            const library = await Library.findOne({ owner: req.user._id });
            if (!library) {
                return res.status(404).send({ message: 'Cannot find user library' });
            }

            const index = library.playlists.map((item) => item.playlist).indexOf(req.body.playlist);
            if (index !== -1) {
                library.playlists.splice(index, 1);
                playlist.saved = playlist.saved - 1;
                if (playlist.saved < 0) {
                    playlist.saved = 0;
                }
            }

            await library.save();
            await playlist.save();

            res.status(200).send({ message: 'Removed from library' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Save track to user library
    async saveTrack(req, res, next) {
        try {
            const track = await Track.findOne({ _id: req.body.track });
            if (!track) {
                return res.status(404).send({ message: 'Track does not exist' });
            }
            const album = await Album.findOne({ _id: req.body.album });
            if (!album) {
                return res.status(404).send({ message: 'Album does not exist' });
            }

            // Check track in album
            const indexOfTrackInAlbum = album.tracks.map((obj) => obj.track).indexOf(req.body.track);
            if (indexOfTrackInAlbum === -1) {
                return res.status(404).send({ message: 'Track does not in album' });
            }

            const library = await Library.findOne({ owner: req.user._id });
            if (!library) {
                return res.status(404).send({ message: 'Cannot find user library' });
            }

            const index = library.likedTracks
                .map((item) => item.track + item.album)
                .indexOf(req.body.track + req.body.album);
            if (index === -1) {
                library.likedTracks.unshift({
                    track: req.body.track,
                    album: req.body.album,
                    trackType: 'song',
                    addedAt: Date.now(),
                });
                track.saved = track.saved + 1;
            }

            await library.save();
            await track.save();

            return res.status(200).send({ message: 'Saved to library' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Remove track from user library
    async removeLikedTrack(req, res, next) {
        try {
            const track = await Track.findOne({ _id: req.body.track });
            if (!track) {
                return res.status(404).send({ message: 'Track does not exist' });
            }

            const album = await Album.findOne({ _id: req.body.album });
            if (!album) {
                return res.status(404).send({ message: 'Album does not exist' });
            }

            const library = await Library.findOne({ owner: req.user._id });
            if (!library) {
                return res.status(404).send({ message: 'Cannot find user library' });
            }

            const index = library.likedTracks
                .map((item) => item.track + item.album)
                .indexOf(req.body.track + req.body.album);
            if (index !== -1) {
                library.likedTracks.splice(index, 1);
                track.saved = track.saved - 1;
                if (track.saved < 0) {
                    track.saved = 0;
                }
            }

            await library.save();
            await track.save();

            return res.status(200).send({ message: 'Removed from library' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Check saved playlist
    async checkSavedEpisode(req, res, next) {
        try {
            let saved = false;
            if (req.query.trackId && req.query.podcastId) {
                const library = await Library.findOne({ owner: req.user._id }).select('likedEpisodes');
                if (!library) {
                    return res.status(404).send({ message: 'Library not found' });
                }

                if (
                    library.likedEpisodes.find(
                        (item) => item.track === req.query.trackId && item.podcast === req.query.podcastId,
                    )
                ) {
                    saved = true;
                }
            }

            return res.status(200).send({ data: saved, message: 'Check saved episode' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Get liked episodes
    async getLikedEpisodes(req, res, next) {
        try {
            const library = await Library.findOne({ owner: req.user._id });
            if (!library) {
                return res.status(404).send({ message: 'Library not found' });
            }

            async function getLikedEpisode(item, index) {
                const track = await Track.findOne({ _id: item.track });
                const podcast = await Podcast.findOne({ _id: item.podcast });
                return {
                    track: track,
                    podcast: podcast,
                    album: '',
                    trackType: 'episode',
                    addedAt: item.addedAt,
                    context_uri:
                        'likedEpisodes' +
                        ':' +
                        library._id.toString() +
                        ':' +
                        item.track +
                        ':' +
                        item.podcast +
                        ':podcast',
                    position: index,
                };
            }

            const likedEpisodes = await Promise.all(library.likedEpisodes.map(getLikedEpisode));

            return res.status(200).send({ data: likedEpisodes, message: 'Get liked tracks successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Save episode to user library
    async saveEpisode(req, res, next) {
        try {
            const track = await TrackService.findOne({ _id: req.body.track });
            if (!track) {
                return res.status(404).send({ message: 'Episode does not exist' });
            }
            const podcast = await PodcastService.findOne({ _id: req.body.podcast });
            if (!podcast) {
                return res.status(404).send({ message: 'Podcast does not exist' });
            }

            // Check track in album
            const indexOfTrackInPodcast = podcast.episodes.map((obj) => obj.track).indexOf(req.body.track);
            if (indexOfTrackInPodcast === -1) {
                return res.status(404).send({ message: 'Track does not in podcast' });
            }

            const library = await LibraryService.findOne({ owner: req.user._id });
            if (!library) {
                return res.status(404).send({ message: 'Cannot find user library' });
            }

            const index = library.likedEpisodes
                .map((item) => item.track + item.podcast)
                .indexOf(req.body.track + req.body.podcast);
            if (index === -1) {
                library.likedEpisodes.unshift({
                    track: req.body.track,
                    podcast: req.body.podcast,
                    trackType: 'episode',
                    addedAt: Date.now(),
                });
                track.saved = track.saved + 1;
            }

            await library.save();
            await track.save();

            return res.status(200).send({ message: 'Saved to library' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Remove episode from user library
    async removeLikedEpisode(req, res, next) {
        try {
            const track = await TrackService.findOne({ _id: req.body.track });
            if (!track) {
                return res.status(404).send({ message: 'Episode does not exist' });
            }

            const podcast = await PodcastService.findOne({ _id: req.body.podcast });
            if (!podcast) {
                return res.status(404).send({ message: 'Podcast does not exist' });
            }

            const library = await LibraryService.findOne({ owner: req.user._id });
            if (!library) {
                return res.status(404).send({ message: 'Cannot find user library' });
            }

            const index = library.likedEpisodes
                .map((item) => item.track + item.podcast)
                .indexOf(req.body.track + req.body.podcast);
            if (index !== -1) {
                library.likedEpisodes.splice(index, 1);
                track.saved = track.saved - 1;
                if (track.saved < 0) {
                    track.saved = 0;
                }
            }

            await library.save();
            await track.save();

            return res.status(200).send({ message: 'Removed from library' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }
}

module.exports = new MeController();
