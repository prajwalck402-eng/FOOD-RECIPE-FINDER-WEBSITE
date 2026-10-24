/**
 * JWT Configuration Helper
 * Loads JWT secret securely from process.env.JWT_SECRET
 */
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET environment variable is missing in production! Please define JWT_SECRET in your Render dashboard.');
    }
    return 'savory_dev_secret_recipe_finder_key';
  }
  return secret;
}

module.exports = { getJwtSecret };
