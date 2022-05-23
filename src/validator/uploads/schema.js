const Joi = require('joi');

const IMAGE_MIME_TYPES = [
  'image/apng',
  'image/avif',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
];

const imageHeadersSchema = Joi.object({
  'content-type': Joi.string()
    .valid(...IMAGE_MIME_TYPES)
    .required(),
}).unknown();

module.exports = {
  imageHeadersSchema
};
