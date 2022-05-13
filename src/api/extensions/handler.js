/* eslint-disable class-methods-use-this */
const ClientError = require('../../exceptions/ClientError');

class ExtensionsHandler {
  onPreResponseHandler(request, h) {
    const { response } = request;

    const authenticationsError = response?.output?.payload;

    if (authenticationsError?.error === 'Unauthorized') {
      // authentication error
      const newResponse = h.response({
        status: 'fail',
        message: authenticationsError.message,
      });
      newResponse.code(authenticationsError.statusCode);
      return newResponse;
    }

    if (response instanceof ClientError) {
      // client error
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    // server error
    if (response instanceof Error) {
      const newResponse = h.response({
        status: 'error',
        // message: 'Server error',
        message: response.message,
      });
      newResponse.code(500);
      return newResponse;
    }

    return response.continue || response;
  }
}

module.exports = {
  ExtensionsHandler,
};
