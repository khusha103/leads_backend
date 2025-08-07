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

 
}

module.exports = UserModel;