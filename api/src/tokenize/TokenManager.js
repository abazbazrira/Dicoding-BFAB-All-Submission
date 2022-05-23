const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');
const { JWT_CONFIG } = require('../config');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, JWT_CONFIG.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, JWT_CONFIG.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, JWT_CONFIG.REFRESH_TOKEN_KEY);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },

};

module.exports = TokenManager;
