const pool = require('../config/db');

module.exports = {
  // Fetch by email (for login) and ensure active by default
  async getByEmail(email, { includeInactive = false } = {}) {
    const sql = includeInactive
      ? 'SELECT * FROM "Users" WHERE "Email" = $1'
      : 'SELECT * FROM "Users" WHERE "Email" = $1 AND "IsActive" = TRUE';
    const { rows } = await pool.query(sql, [email]);
    return rows[0] || null;
  },

  async getById(userId, { includeInactive = false } = {}) {
    const sql = includeInactive
      ? 'SELECT * FROM "Users" WHERE "UserId" = $1'
      : 'SELECT * FROM "Users" WHERE "UserId" = $1 AND "IsActive" = TRUE';
    const { rows } = await pool.query(sql, [userId]);
    return rows[0] || null;
  },

  async listActive() {
    const { rows } = await pool.query(
      'SELECT * FROM "Users" WHERE "IsActive" = TRUE ORDER BY "CreatedAt" DESC'
    );
    return rows;
  },

  // Calls the upsert_user(user_input) function. Pass values in correct order.
  async upsert(user) {
    const sql = `
      SELECT * FROM upsert_user(ROW(
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
      )::user_input)
    `;
    const values = [
      user.userId || null,
      user.firstName || null,
      user.lastName || null,
      user.email || null,
      user.username || null,
      user.passwordHash || null,
      user.primaryPhoneCountryCode || null,
      user.primaryPhoneNumber || null,
      user.secondaryPhoneCountryCode || null,
      user.secondaryPhoneNumber || null,
      user.dateOfBirth || null,
      user.countryTimezone || null
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0] || null;
  },

  // Soft delete through DB function (IsActive = FALSE)
  async softDelete(userId) {
    const { rows } = await pool.query('SELECT * FROM soft_delete_user($1)', [userId]);
    return rows[0] || null;
  }
};
