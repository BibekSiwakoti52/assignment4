const ROLES = {
  User: 'user',
  Expert: 'expert',
};

const BASE_URL = '/api/v1';

const SALT_ROUNDS = 10;

const JWT_EXPIRY = '30d';
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = { ROLES, BASE_URL, JWT_EXPIRY, JWT_SECRET, SALT_ROUNDS };
