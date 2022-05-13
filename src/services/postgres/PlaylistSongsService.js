const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong(songId, playlistId) {
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
  }

  async deletePlaylistSong(playlistId, songId) {
    const query = {
      text: `DELETE FROM playlistsongs
              WHERE playlist_id = $1 AND song_id = $2
              RETURNING id`,
      values: [playlistId, songId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Playlist song failed to delete');
    }
  }
}

module.exports = PlaylistSongsService;
