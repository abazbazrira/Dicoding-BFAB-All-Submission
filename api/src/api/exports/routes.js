const routes = (handler, { auth }) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.postExportPlaylistSongsHandler,
    options: {
      auth,
    },
  },
];

module.exports = routes;
