const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToAlbumModel, mapDBToSongModel } = require('../../utils');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');

    const resultAlbums = result.rows.map(mapDBToAlbumModel);

    if (result.rowCount > 0) {
      return Promise.all(
        resultAlbums.flatMap(async (album) => {
          const listsong = await this.getSongsByAlbumId(album.id);

          return {
            id: album.id,
            name: album.name,
            year: album.year,
            songs: listsong,
          };
        }),
      );
    }

    return resultAlbums;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    const resultAlbums = result.rows.map(mapDBToAlbumModel)[0];

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const listsong = await this.getSongsByAlbumId(resultAlbums.id);

    return {
      id: resultAlbums.id,
      name: resultAlbums.name,
      year: resultAlbums.year,
      songs: listsong,
    };
  }

  async getSongsByAlbumId(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE albumid = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    return result.rows.map(mapDBToSongModel);
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;
