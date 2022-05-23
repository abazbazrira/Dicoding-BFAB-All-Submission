const { SERVER_CONFIG } = require('../../config');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumCoverHandler = this.postAlbumCoverHandler.bind(this);
  }

  async postAlbumCoverHandler({ payload, params }, h) {
    const data = payload.cover;
    const { id } = params;
    this._validator.validateImageHeaders(data.hapi.headers);

    const filename = await this._service.writeFile(data, data.hapi);
    const pictureUrl = `http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT}/upload/pictures/${filename}`;

    await this._service.updateCoverAlbum(id, pictureUrl);

    const response = h.response({
      status: 'success',
      message: 'Cover added',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
