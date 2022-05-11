const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: [Joi.number().optional(), Joi.allow(null)],
  albumId: [Joi.string().optional(), Joi.allow(null)],
});

module.exports = { SongPayloadSchema };
