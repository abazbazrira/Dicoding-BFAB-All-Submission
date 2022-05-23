const routes = (handler, { auth }) => [
  {
    method: 'POST',
    path: '/playlists/{playlistId}/songs',
    handler: handler.postPlaylistSongHandler,
    options: {
      auth,
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}/songs',
    handler: handler.getPlaylistSongsHandler,
    options: {
      auth,
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}/songs',
    handler: handler.deletePlaylistSongHandler,
    options: {
      auth,
    },
  },
];

module.exports = routes;
