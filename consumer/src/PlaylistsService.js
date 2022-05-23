const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getDetailPlaylist(ownerId, playlistId) {
    const { rows } = await this.getPlaylistById(ownerId, playlistId);

    const resultPlaylist = rows[0];
    const listSong = await this.getSongsByPlaylistId(
      resultPlaylist.id,
    );

    return {
      id: resultPlaylist.id,
      name: resultPlaylist.name,
      songs: listSong,
    };
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: `SELECT playlists.id, playlists.name
              FROM playlists
              WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    return {
      rows,
      rowCount,
    };
  }

  async getSongsByPlaylistId(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
              FROM songs
              LEFT JOIN playlistsongs
              ON playlistsongs.song_id = songs.id
              WHERE playlistsongs.playlist_id = $1`,
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }
}

module.exports = { PlaylistsService };
