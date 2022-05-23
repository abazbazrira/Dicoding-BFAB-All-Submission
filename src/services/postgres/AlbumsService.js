const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToAlbumModel } = require('../../utils');

class AlbumsService {
  constructor(songsService, cacheService) {
    this._pool = new Pool();
    this._songsService = songsService;
    this._cacheService = cacheService;
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
          const listsong = await this._songsService.getSongsByAlbumId(album.id);

          return {
            id: album.id,
            name: album.name,
            year: album.year,
            songs: listsong,
            coverUrl: album.coverUrl,
          };
        })
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

    const listsong = await this._songsService.getSongsByAlbumId(
      resultAlbums.id
    );

    return {
      id: resultAlbums.id,
      name: resultAlbums.name,
      year: resultAlbums.year,
      songs: listsong,
      coverUrl: resultAlbums.coverUrl,
    };
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

  async getUserAlbumLikes(userId, albumId) {
    const queryGetAlbum = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };

    const resultGetAlbum = await this._pool.query(queryGetAlbum);

    if (!resultGetAlbum.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const query = {
      text: 'SELECT * FROM useralbumlikes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const { rowCount } = await this._pool.query(query);

    return {
      rowCount,
    };
  }

  async getCountUserAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(
        `user-album-likes:${albumId}`
      );

      return {
        rowCount: JSON.parse(result),
        cache: true,
      };
    } catch (error) {
      const queryGetAlbum = {
        text: 'SELECT * FROM albums WHERE id = $1',
        values: [albumId],
      };

      const resultGetAlbum = await this._pool.query(queryGetAlbum);

      if (!resultGetAlbum.rowCount) {
        throw new NotFoundError('Album tidak ditemukan');
      }

      const query = {
        text: 'SELECT * FROM useralbumlikes WHERE album_id = $1',
        values: [albumId],
      };

      const { rowCount } = await this._pool.query(query);

      await this._cacheService.set(
        `user-album-likes:${albumId}`,
        JSON.stringify(rowCount)
      );

      return {
        rowCount,
        cache: false,
      };
    }
  }

  async postUserAlbumLikes(userId, albumId) {
    const { rowCount } = await this.getUserAlbumLikes(userId, albumId);

    const id = `album-like-${nanoid(16)}`;

    let query = {
      text: 'INSERT INTO useralbumlikes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    let state = 'insert';

    if (rowCount > 0) {
      query = {
        text: 'DELETE FROM useralbumlikes WHERE user_id = $1 AND album_id = $2 RETURNING id',
        values: [userId, albumId],
      };

      state = 'delete';
    }

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError(`Album likes gagal ${state}`);
    }

    await this._cacheService.delete(`user-album-likes:${albumId}`);

    return {
      state,
    };
  }

  async putAlbumCovers(albumId, coverPath) {
    const query = {
      text: 'UPDATE albums SET coverurl = $1 WHERE id = $2 RETURNING id',
      values: [coverPath, albumId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Adding cover failed');
    }
  }
}

module.exports = AlbumsService;
