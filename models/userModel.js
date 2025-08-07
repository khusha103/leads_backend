const db = require('../config/db');

class UserModel {
  static async getAllUsers() {
    try {
      const [rows] = await db.query('SELECT * FROM ekarigar_users');
      return rows;
    } catch (err) {
      throw new Error('Error fetching users: ' + err.message);
    }
  }

  static async findUserByEmail(email) {
    try {
      const [rows] = await db.query('SELECT * FROM ekarigar_users WHERE email = ?', [email]);
      return rows[0];
    } catch (err) {
      throw new Error('Error finding user: ' + err.message);
    }
  }

  static async createUser(userData) {
    try {
      const { name, email, password } = userData;
      const [result] = await db.query(
        'INSERT INTO ekarigar_users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
      );
      return { id: result.insertId, name, email };
    } catch (err) {
      throw new Error('Error creating user: ' + err.message);
    }
  }
}

module.exports = UserModel;