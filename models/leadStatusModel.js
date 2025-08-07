const db = require('../config/db');

class LeadStatusModel {
  static async getAllLeadStatuses() {
    try {
      const [rows] = await db.execute('SELECT id, status_name FROM ekarigar_leads_status');
      return rows;
    } catch (err) {
      throw new Error('Error fetching lead statuses: ' + err.message);
    }
  }
}

module.exports = LeadStatusModel;