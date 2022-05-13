const PlaylistsHandler = require('./handler');
const routes = require('./routes');
const { JWT_CONFIG } = require('../../config');

module.exports = {
  name: 'plugins',
  version: '1.0.0',
  register: (server, { service, validator }) => {
    const playlistsHandler = new PlaylistsHandler(service, validator);
    server.route(routes(playlistsHandler, {
      auth: JWT_CONFIG.AUTH_STRATEGY_NAME,
    }));
  },
};
