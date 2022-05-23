const CollaborationsHandler = require('./handler');
const routes = require('./routes');
const { JWT_CONFIG } = require('../../config');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: (
    server,
    { usersService, collaborationsService, playlistsService, validator },
  ) => {
    const collaborationsHandler = new CollaborationsHandler(
      usersService,
      collaborationsService,
      playlistsService,
      validator,
    );
    server.route(
      routes(collaborationsHandler, {
        auth: JWT_CONFIG.AUTH_STRATEGY_NAME,
      }),
    );
  },
};
