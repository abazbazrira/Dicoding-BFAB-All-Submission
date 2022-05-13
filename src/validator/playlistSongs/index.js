const InvariantError = require('../../exceptions/InvariantError');
const { playlistSongSchema } = require('./shema');

const PlaylistSongsValidator = {
  validatePlaylistSongPayload: (payload) => {
    const validationResult = playlistSongSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistSongsValidator;
