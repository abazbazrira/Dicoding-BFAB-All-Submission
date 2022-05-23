class ExportsHandler {
  constructor(exportsService, playlistsService, validator) {
    this._exportsService = exportsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportPlaylistSongsHandler =
      this.postExportPlaylistSongsHandler.bind(this);
  }

  async postExportPlaylistSongsHandler({ payload, params, auth }, h) {
    this._validator.validateExportPlaylistSongsPayload(payload);
    const { targetEmail } = payload;
    const { playlistId } = params;
    const { id: credentialId } = auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const message = {
      playlistId, targetEmail
    };

    await this._exportsService.sendMessage(
      'export:playlist-songs',
      JSON.stringify(message)
    );

    const response = h.response({
      status: 'success',
      message: 'Your request is being processed',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
