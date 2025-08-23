const db = require('../config/db');
const moment = require('moment-timezone');

class FollowupModel {
  static async getTodayFollowups(userId) {
    try {
      const todayIST = moment().tz('Asia/Kolkata').format('YYYY-MM-DD');
      const query = `
        SELECT 
          f.id,
          f.lead_id,
          f.description,
          f.medium,
          f.attended_by,
          f.assign_to,
          f.followup_date,
          f.followup_doc_description,
          f.followup_doc,
          DATE(CONVERT_TZ(STR_TO_DATE(f.followup_date, '%Y-%m-%dT%H:%i'), '+00:00', '+05:30')) as formatted_date
        FROM 
          ekarigar_followups f
        WHERE 
          DATE(CONVERT_TZ(STR_TO_DATE(f.followup_date, '%Y-%m-%dT%H:%i'), '+00:00', '+05:30')) = ?
          AND f.attended_by = ?
        ORDER BY 
          f.followup_date ASC
      `;
      const [results] = await db.execute(query, [todayIST, userId]);
      return {
        total: results.length,
        followups: results.map((row) => ({
          id: row.id,
          lead_id: row.lead_id,
          description: row.description,
          medium: row.medium,
          attended_by: row.attended_by,
          assign_to: row.assign_to,
          followup_date: row.followup_date,
          followup_doc_description: row.followup_doc_description,
          followup_doc: row.followup_doc,
        })),
      };
    } catch (err) {
      throw new Error('Error fetching followups: ' + err.message);
    }
  }
}

module.exports = FollowupModel;