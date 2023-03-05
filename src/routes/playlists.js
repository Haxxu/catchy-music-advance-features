const router = require('express').Router();

const playlistController = require('../app/controllers/PlaylistController');
const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');
const artistAuth = require('../app/middlewares/artistAuth');

// [POST] /api/playlists => create new playlist
router.post('/', userAuth, playlistController.createPlaylist);
// [GET] /api/playlists/info => get playlists info
router.get('/info', adminAuth, playlistController.getPlaylistsInfo);
// [GET] /api/playlists/context?search => get playlists by context
router.get('/context', adminAuth, playlistController.getPlaylistsByContext);
// [GET] /api/playlists/popular => get popular playlist
router.get('/popular', userAuth, playlistController.getPopularPlaylists);
// [GET] /api/playlists/tags => get playlists by tags
router.get('/tags', userAuth, playlistController.getPlaylistsByTags);
// [PUT] /api/playlists/:id/toggle-public=> toggle public playlist
router.put('/:id/toggle-public', [userAuth, validateObjectId], playlistController.togglePublicPlaylist);
// [POST] /api/playlists/:id/tracks => add track to playlist {track, album} (:id => playlist_id)
router.post('/:id/tracks', [userAuth, validateObjectId], playlistController.addTrackToPlaylist);
// [DELETE] /api/playlists/:id/tracks => remove track from playlist {track, album} (:id => playlist_id)
router.delete('/:id/tracks', [userAuth, validateObjectId], playlistController.removeTrackFromPlaylist);
// [GET] /api/playlists/:id => get playlist by id
router.get('/:id', [userAuth, validateObjectId], playlistController.getPlaylistById);
// [PUT] /api/playlists/:id => update playlist
router.put('/:id', [userAuth, validateObjectId], playlistController.updatePlaylist);
// [DELETE] /api/playlists/:id => delete playlist by id
router.delete('/:id', [userAuth, validateObjectId], playlistController.deletePlaylist);

module.exports = router;
