const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToPlaylistModel, mapDBToActivitiesModel } = require('../../utils');

class PlaylistsHandler {
  constructor(playlistsService, playlistSongActivitiesService, validator) {
    this._playlistsService = playlistsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.getPlaylistActivitiesHandler =
      this.getPlaylistActivitiesHandler.bind(this);
  }

  async postPlaylistHandler({ payload, auth }, h) {
    this._validator.validatePlaylistPayload(payload);
    const { name } = payload;
    const { id: credentialId } = auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist(
      name,
      credentialId
    );

    const response = h.response({
      status: 'success',
      message: 'Playlist added successfully',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler({ auth }) {
    const { id: credentialId } = auth.credentials;

    const playlists = await this._playlistsService.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async getPlaylistActivitiesHandler({ params, auth }) {
    const { id: credentialId } = auth.credentials;
    const { playlistId } = params;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const resultPlaylists = await this._playlistsService.getPlaylistById(
      credentialId,
      playlistId
    );

    if (resultPlaylists.rowCount > 0) {
      const resultPlaylist = resultPlaylists.rows.map(mapDBToPlaylistModel)[0];
      const listSong = await this._playlistSongActivitiesService.getPlaylistSongActivities(
        resultPlaylist.id
      );

      return {
        status: 'success',
        data: {
          playlistId: resultPlaylist.id,
          activities: listSong.rows.map(mapDBToActivitiesModel),
        },
      };
    }

    throw new NotFoundError('Playlist tidak ditemukan');
  }

  async deletePlaylistHandler({ auth, params }) {
    const { playlistId } = params;
    const { id: credentialId } = auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsService.deletePlaylistById(playlistId);
    await this._playlistSongActivitiesService.deletePlaylistSongActivities(
      playlistId
    );

    return {
      status: 'success',
      message: 'Playlist successfully deleted',
    };
  }
}

module.exports = PlaylistsHandler;
