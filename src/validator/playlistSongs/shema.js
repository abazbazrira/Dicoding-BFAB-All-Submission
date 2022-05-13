const Joi = require('joi');

const playlistSongSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  playlistSongSchema,
};
