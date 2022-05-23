const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
  constructor(playlistSongActivitiesService, cacheService) {
    this._pool = new Pool();
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._cacheService = cacheService;
  }

  async addPlaylistSong(songId, playlistId, credentialId) {
    const id = `playlist_song-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO playlistsongs
              VALUES ($1, $2, $3)
              RETURNING id`,
      values: [id, playlistId, songId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Song playlist failed to add');
    }

    await this._playlistSongActivitiesService.addPlaylistSongActivities(
      playlistId,
      songId,
      credentialId,
      'add',
    );
  }

  async deletePlaylistSong(playlistId, songId, credentialId) {
    const query = {
      text: `DELETE FROM playlistsongs
              WHERE playlist_id = $1 AND song_id = $2
              RETURNING id`,
      values: [playlistId, songId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Song playlist failed to delete');
    }

    await this._playlistSongActivitiesService.addPlaylistSongActivities(
      playlistId,
      songId,
      credentialId,
      'delete',
    );
  }
}

module.exports = PlaylistSongsService;
