const Joi = require('joi');

const collaborationPlayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = {
  collaborationPlayloadSchema,
};
