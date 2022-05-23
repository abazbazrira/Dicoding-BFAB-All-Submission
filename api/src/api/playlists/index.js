const PlaylistsHandler = require('./handler');
const routes = require('./routes');
const { JWT_CONFIG } = require('../../config');

module.exports = {
  name: 'plugins',
  version: '1.0.0',
  register: (
    server,
    { playlistsService, playlistSongActivitiesService, validator },
  ) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistsService,
      playlistSongActivitiesService,
      validator,
    );
    server.route(
      routes(playlistsHandler, {
        auth: JWT_CONFIG.AUTH_STRATEGY_NAME,
      }),
    );
  },
};
