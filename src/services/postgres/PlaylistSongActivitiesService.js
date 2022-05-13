const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongActivities(playlistId) {
    const query = {
      text: `SELECT u.username, s.title, psa.action, psa.time 
              FROM playlistsongactivities AS psa 
              JOIN users AS u ON psa.user_id = u.id 
              JOIN songs AS s ON psa.song_id = s.id
              WHERE playlist_id = $1 ORDER BY time ASC`,
      values: [playlistId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    return {
      rows, rowCount,
    };
  }

  async addPlaylistSongActivities(playlistId, songId, userId, action) {
    const id = `playlist_song_activities-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO playlistsongactivities
              VALUES ($1, $2, $3, $4, $5)
              RETURNING id`,
      values: [id, playlistId, songId, userId, action],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Playlist song activity failed to add');
    }
  }

  async deletePlaylistSongActivities(playlistId) {
    const query = {
      text: `DELETE FROM playlistsongactivities
              WHERE playlist_id = $1
              RETURNING id`,
      values: [playlistId],
    };

    const { rowCount } = await this.getPlaylistSongActivities(playlistId);

    if (rowCount > 0) {
      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new InvariantError('Playlist song activities failed to delete');
      }
    }
  }
}

module.exports = PlaylistSongActivitiesService;
