const User = require('../models/user.model');
const bcrypt = require('bcrypt');

// Create an admin user on startup if none exists
// Requires env vars: ADMIN_EMAIL, ADMIN_PASSWORD; optional ADMIN_PSEUDO
async function ensureAdminExists() {
  try {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const ADMIN_PSEUDO = process.env.ADMIN_PSEUDO || 'admin';

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.warn('[seedAdmin] Skipped: ADMIN_EMAIL or ADMIN_PASSWORD not set');
      return;
    }

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('[seedAdmin] Admin already exists:', existingAdmin.email);
      return;
    }

    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const admin = await User.create({
      pseudo: ADMIN_PSEUDO,
      email: ADMIN_EMAIL,
      password: hash,
      role: 'admin',
    });

    console.log('[seedAdmin] Admin user created:', admin.email);
  } catch (err) {
    console.error('[seedAdmin] Failed to create admin:', err?.message || err);
  }
}

module.exports = { ensureAdminExists };