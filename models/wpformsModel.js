const db = require('../config/db');

class WpformsModel {
  static async getWpformsEntries() {
    try {
      const query = `
        SELECT entry_id, fields, date
        FROM wpkh_wpforms_entries
      `;
      const [results] = await db.execute(query);
      return results;
    } catch (err) {
      throw new Error('Error fetching WPForms entries: ' + err.message);
    }
  }
}

module.exports = WpformsModel;