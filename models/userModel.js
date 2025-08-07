const db = require('../config/db');

class UserModel {
  static async getAllUsers() {
    try {
      const [rows] = await db.execute('SELECT id, username FROM ekarigar_users WHERE delete_status = "0"');
      return rows;
    } catch (err) {
      throw new Error('Error fetching users: ' + err.message);
    }
  }

  static async findUserByEmailOrUsername(username) {
    try {
      const [rows] = await db.execute(
        'SELECT id, username, email, role_id, assigned_services, permissions FROM ekarigar_users WHERE (username = ? OR email = ?) AND delete_status = "0"',
        [username, username]
      );
      return rows[0];
    } catch (err) {
      throw new Error('Error finding user: ' + err.message);
    }
  }

  static async findUserById(userId) {
    try {
      const [rows] = await db.execute(
        'SELECT id, username, role_id, assigned_services, permissions FROM ekarigar_users WHERE id = ? AND delete_status = "0"',
        [userId]
      );
      return rows[0];
    } catch (err) {
      throw new Error('Error finding user by ID: ' + err.message);
    }
  }

  static async getAssignedUser(serviceId) {
    try {
      if (!serviceId) {
        console.warn('getAssignedUser: serviceId is null or undefined, returning default user ID');
        return 1;
      }
      const query = `
        SELECT id
        FROM ekarigar_users
        WHERE FIND_IN_SET(?, assigned_services) > 0
        AND delete_status = '0'
        LIMIT 1
      `;
      const [rows] = await db.execute(query, [serviceId]);
      return rows.length > 0 ? rows[0].id : 1;
    } catch (err) {
      console.error('Error fetching assigned user:', err.message);
      throw new Error('Error fetching assigned user: ' + err.message);
    }
  }

  static async getUserRole(userId) {
    try {
      const [rows] = await db.execute(
        'SELECT role_id FROM ekarigar_users WHERE id = ? AND delete_status = "0"',
        [userId]
      );
      return rows[0]?.role_id || null;
    } catch (err) {
      throw new Error('Error fetching user role: ' + err.message);
    }
  }

  static async getUserPermissions(userId) {
    try {
      const [rows] = await db.execute(
        `SELECT p.id 
         FROM ekarigar_users u 
         JOIN ekarigar_permissions p 
         ON FIND_IN_SET(p.id, u.permissions) > 0 
         WHERE u.id = ? AND u.delete_status = '0'`,
        [userId]
      );
      return rows.map(row => row.id);
    } catch (err) {
      throw new Error('Error fetching user permissions: ' + err.message);
    }
  }

  static async getUserServiceTypes(userId) {
    try {
      const [userResults] = await db.execute(
        'SELECT assigned_services FROM ekarigar_users WHERE id = ? AND delete_status = "0"',
        [userId]
      );
      if (userResults.length === 0) {
        return null;
      }
      const assignedServices = userResults[0].assigned_services;
      if (!assignedServices) {
        return [];
      }
      const serviceIds = assignedServices.split(',').map(id => id.trim());
      if (serviceIds.length === 0) {
        return [];
      }
      const placeholders = serviceIds.map(() => '?').join(',');
      const [serviceResults] = await db.execute(
        `SELECT * FROM ekarigar_servicetype WHERE id IN (${placeholders})`,
        serviceIds
      );
      return serviceResults;
    } catch (err) {
      throw new Error('Error fetching user service types: ' + err.message);
    }
  }
}

module.exports = UserModel;