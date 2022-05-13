const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(playlistId, userId) {
    const id = `collaboration-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO collaborations
              VALUES ($1, $2, $3)
              RETURNING id`,
      values: [id, playlistId, userId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Collaboration failed to add');
    }

    return rows[0].id;
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: `DELETE FROM collaborations
              WHERE playlist_id = $1 AND user_id = $2
              RETURNING id`,
      values: [playlistId, userId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Collaboration failed to delete');
    }
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: `SELECT id FROM collaborations
              WHERE playlist_id = $1 AND user_id = $2`,
      values: [playlistId, userId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new AuthorizationError('Collaboration failed verification');
    }
  }
}

module.exports = CollaborationsService;
