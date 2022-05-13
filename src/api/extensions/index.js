const { extensionEvents } = require('./events');
const { ExtensionsHandler } = require('./handler');

const extensionsPlugin = {
  name: 'server extensions',
  version: '1.0.0',
  register: (server) => {
    const extensionHandler = new ExtensionsHandler();
    const extensionsEvent = extensionEvents(extensionHandler);
    server.ext(extensionsEvent);
  },
};

module.exports = {
  extensionsPlugin,
};
