const extensionEvents = (handler) => [
  {
    type: 'onPreResponse',
    method: handler.onPreResponseHandler,
  },
];

module.exports = {
  extensionEvents,
};
