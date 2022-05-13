const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');
const { JWT_CONFIG } = require('../../config');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (
    server,
    { playlistSongsService, playlistsService, songsService, validator },
  ) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      playlistSongsService,
      playlistsService,
      songsService,
      validator,
    );
    server.route(routes(playlistSongsHandler, {
      auth: JWT_CONFIG.AUTH_STRATEGY_NAME,
    }));
  },
};
