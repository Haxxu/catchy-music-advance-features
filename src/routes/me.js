const router = require('express').Router();

const meController = require('../app/controllers/MeController');
const audioPlayerController = require('../app/controllers/AudioPlayerController');
const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');

// [GET] /api/me => get current user profile
router.get('/', userAuth, meController.getCurrentUserProfile);
// [GET] /api/me/following/contains => check following user
router.get('/following/contains', userAuth, meController.checkFollowingUser);
// [GET] /api/me/following => get following user
router.get('/following', userAuth, meController.getFollowing);
// [PUT] /api/me/following => follow user or artist
router.put('/following', userAuth, meController.followUser);
// [DELETE] /api/me/following => unfollow user or artist
router.delete('/following', userAuth, meController.unfollowUser);
// [GET] /api/me/albums/contains => check saved albums
router.get('/albums/contains', userAuth, meController.checkSavedAlbum);
// [GET] /api/me/albums => get saved albums
router.get('/albums', userAuth, meController.getSavedAlbums);
// [PUT] /api/me/albums => save album to library
router.put('/albums', userAuth, meController.saveAblum);
// [DELETE] /api/me/albums => remove saved album from library
router.delete('/albums', userAuth, meController.removeSavedAlbum);
// [PUT] /api/me/podcasts => save podcast to library
router.put('/podcasts', userAuth, meController.savePodcast);
// [DELETE] /api/me/podcasts => remove saved podcast from library
router.delete('/podcasts', userAuth, meController.removeSavedPodcast);
// [GET] /api/me/playlists/contains => check saved playlists
router.get('/playlists/contains', userAuth, meController.checkSavedPlaylist);
// [GET] /api/me/playlists => get saved playlists
router.get('/playlists', userAuth, meController.getSavedPlaylists);
// [PUT] /api/me/playlists => save playlist to library
router.put('/playlists', userAuth, meController.savePlaylist);
// [DELETE] /api/me/playlists => remove saved playlist from library
router.delete('/playlists', userAuth, meController.removeSavedPlaylist);
// [GET] /api/me/tracks/contains => check liked tracks
router.get('/tracks/contains', userAuth, meController.checkSavedTrack);
// [GET] /api/me/tracks => get liked tracks
router.get('/tracks', userAuth, meController.getLikedTracks);
// [PUT] /api/me/tracks => save liked track to library
router.put('/tracks', userAuth, meController.saveTrack);
// [DELETE] /api/me/tracks => remove liked track from library
router.delete('/tracks', userAuth, meController.removeLikedTrack);
// [PUT] /api/me/episodes => save liked episode to library
router.put('/episodes', userAuth, meController.saveEpisode);
// [DELETE] /api/me/episodes => remove liked episode from library
router.delete('/episodes', userAuth, meController.removeLikedEpisode);
// [PUT] /api/me/audio-player/plays/increase => increase plays of current Track
router.put('/audio-player/currently-playing/increase', userAuth, audioPlayerController.increasePlay);
// [GET] /api/me/audio-player => get audio player state
router.get('/audio-player/currently-playing', userAuth, audioPlayerController.getCurrentlyPlayingTrack);
// [GET] /api/me/audio-player/queue => get queue
router.get('/audio-player/queue', userAuth, audioPlayerController.getQueue);
// [GET] /api/me/audio-player => get audio player state
router.get('/audio-player', userAuth, audioPlayerController.getAudioPlayerState);
// [PUT] /api/me/audio-player/repeat => set repeat mode
router.put('/audio-player/repeat', userAuth, audioPlayerController.setRepeat);
// [PUT] /api/me/audio-player/shuffle => set shuffle mode
router.put('/audio-player/shuffle', userAuth, audioPlayerController.setShuffle);
// [PUT] /api/me/audio-player/volume =>  set volume
router.put('/audio-player/volume', userAuth, audioPlayerController.setVolume);
// [PUT] /api/me/audio-player/pause => pause track
router.put('/audio-player/pause', userAuth, audioPlayerController.pause);
// [PUT] /api/me/audio-player/play => play(start/resume) track
router.put('/audio-player/play', userAuth, audioPlayerController.play);
// [POST] /api/me/audio-player/next =>  skip to next
router.post('/audio-player/next', userAuth, audioPlayerController.skipToNext);
// [POST] /api/me/audio-player/previous =>  skip to previous
router.post('/audio-player/previous', userAuth, audioPlayerController.skipToPrevious);
// [POST] /api/me/audio-player/queue =>  add items to queue
router.post('/audio-player/queue', userAuth, audioPlayerController.addItemsToQueue);
// [DELETE] /api/me/audio-player/queue =>  remove items to queue
router.delete('/audio-player/queue', userAuth, audioPlayerController.removeItemsFromQueue);

module.exports = router;
