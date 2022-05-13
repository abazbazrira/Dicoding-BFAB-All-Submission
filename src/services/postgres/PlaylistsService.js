const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { mapDBToPlaylistModel, mapDBToSongModel } = require('../../utils');

class PlaylistsService {
  constructor(songsService, collaborationsService) {
    this._pool = new Pool();
    this._songsService = songsService;
    this._collaborationsService = collaborationsService;
  }

  async addPlaylist(playlistName, ownerId) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO playlists
              VALUES ($1, $2, $3)
              RETURNING id`,
      values: [id, playlistName, ownerId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) throw new InvariantError('Playlist failed to add');

    return rows[0].id;
  }

  async getPlaylists(ownerId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
              FROM playlists
              LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
              LEFT JOIN users ON users.id = playlists.owner
              WHERE users.id = $1 OR collaborations.user_id = $1`,
      values: [ownerId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }

  async getPlaylistById(ownerId, playlistId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
              FROM playlists
              LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
              LEFT JOIN users ON users.id = playlists.owner
              WHERE playlists.id = $2 AND (users.id = $1 OR collaborations.user_id = $1)`,
      values: [ownerId, playlistId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    return {
      rows,
      rowCount,
    };
  }

  async getDetailPlaylist(ownerId, playlistId) {
    const { rows, rowCount } = await this.getPlaylistById(ownerId, playlistId);

    if (!rowCount) {
      throw new NotFoundError(
        'Playlist failed to delete, playlist id not found',
      );
    } else {
      const resultPlaylist = rows.map(mapDBToPlaylistModel)[0];
      const listSong = await this._songsService.getSongsByPlaylistId(
        resultPlaylist.id,
      );

      return {
        id: resultPlaylist.id,
        name: resultPlaylist.name,
        username: resultPlaylist.username,
        songs: listSong.map(mapDBToSongModel),
      };
    }
  }

  async deletePlaylistById(playlistId) {
    const query = {
      text: `DELETE FROM playlists
              WHERE id = $1
              RETURNING id`,
      values: [playlistId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError(
        'Playlist failed to delete, playlist id not found',
      );
    }
  }

  async verifyPlaylistOwner(playlistId, ownerId) {
    const query = {
      text: `SELECT owner
              FROM playlists
              WHERE id = $1`,
      values: [playlistId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Playlist Not Found');
    }

    const playlist = rows[0];

    if (playlist.owner !== ownerId) {
      throw new AuthorizationError('You have no access to this resource');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      await this._collaborationsService.verifyCollaborator(playlistId, userId);
    }
  }
}

module.exports = PlaylistsService;
