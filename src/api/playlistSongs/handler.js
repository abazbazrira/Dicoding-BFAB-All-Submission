class PlaylistSongsHandler {
  constructor(playlistSongsService, playlistsService, songsService, validator) {
    this._playlistSongsService = playlistSongsService;
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
  }

  async postPlaylistSongHandler({ payload, auth, params }, h) {
    this._validator.validatePlaylistSongPayload(payload);
    const { songId } = payload;
    const { playlistId } = params;
    const { id: credentialId } = auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._songsService.getSongById(songId);
    await this._playlistSongsService.addPlaylistSong(songId, playlistId);
    const response = h.response({
      status: 'success',
      message: 'The song has been successfully added to the playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler({ auth, params }) {
    const { playlistId } = params;
    const { id: credentialId } = auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const playlist = await this._playlistsService.getDetailPlaylist(
      credentialId,
      playlistId,
    );

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongHandler({ payload, auth, params }) {
    this._validator.validatePlaylistSongPayload(payload);
    const { playlistId } = params;
    const { songId } = payload;
    const { id: credentialId } = auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistSongsService.deletePlaylistSong(playlistId, songId);

    return {
      status: 'success',
      message: 'The song has been successfully removed from the playlist',
    };
  }
}

module.exports = PlaylistSongsHandler;
