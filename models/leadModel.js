const db = require('../config/db');

class LeadModel {
  static async createLead(leadData) {
    try {
      const query = `
        INSERT INTO ekarigar_leads (
          assigned_to, status, name, mobile_number, email, city, website_type,
          industry_type, contact_preference, preferred_date, preferred_time,
          requirements, lead_source, checkbox_ids, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        leadData.assigned_to ?? null,
        leadData.status ?? null,
        leadData.name ?? null,
        leadData.mobile_number ?? null,
        leadData.email ?? null,
        leadData.city ?? null,
        leadData.website_type ?? null,
        leadData.industry_type ?? null,
        leadData.contact_preference ?? null,
        leadData.preferred_date ?? null,
        leadData.preferred_time ?? null,
        leadData.requirements ?? null,
        leadData.lead_source ?? null,
        leadData.checkbox_ids ?? null,
        leadData.created_at ?? null,
        leadData.updated_at ?? null,
      ];
      const [result] = await db.execute(query, values);
      return { id: result.insertId, ...leadData };
    } catch (err) {
      throw new Error('Error creating lead: ' + err.message);
    }
  }

  static async updateLead(leadData) {
    try {
      const query = `
        UPDATE ekarigar_leads 
        SET 
          name = ?, 
          mobile_number = ?,
          email = ?, 
          city = ?, 
          website_type = ?, 
          industry_type = ?, 
          preferred_date = ?, 
          preferred_time = ?, 
          requirements = ?, 
          lead_source = ?, 
          status = ?,
          updated_at = ?
        WHERE id = ?
      `;
      const values = [
        leadData.name,
        leadData.mobile_number,
        leadData.email,
        leadData.city,
        leadData.website_type,
        leadData.industry_type,
        leadData.preferred_date,
        leadData.preferred_time,
        leadData.requirements,
        leadData.lead_source,
        leadData.status,
        leadData.updated_at,
        leadData.id,
      ];
      const [result] = await db.execute(query, values);
      return result;
    } catch (err) {
      throw new Error('Error updating lead: ' + err.message);
    }
  }

  static async deleteLead(leadId) {
    try {
      await db.beginTransaction();
      const deleteFollowupsQuery = `DELETE FROM ekarigar_followups WHERE lead_id = ?`;
      await db.execute(deleteFollowupsQuery, [leadId]);
      const deleteLeadQuery = `DELETE FROM ekarigar_leads WHERE id = ?`;
      const [result] = await db.execute(deleteLeadQuery, [leadId]);
      await db.commit();
      return result;
    } catch (err) {
      await db.rollback();
      throw new Error('Error deleting lead: ' + err.message);
    }
  }

  static async getRecentLeads(userId, roleId) {
    try {
      let query = `
        SELECT 
          l.id,
          l.name, 
          l.email AS website, 
          l.mobile_number AS mobile, 
          s.status_name AS status
        FROM ekarigar_leads l
        INNER JOIN ekarigar_leads_status s ON l.status = s.id
      `;
      let queryParams = [];
      if (roleId !== 1) {
        query += ' WHERE l.assigned_to = ?';
        queryParams = [userId];
      }
      query += ' ORDER BY l.created_at DESC LIMIT 5';
      const [results] = await db.execute(query, queryParams);
      return results.map((lead) => ({
        id: lead.id,
        name: lead.name,
        website: lead.website,
        mobile: lead.mobile,
        status: lead.status,
      }));
    } catch (err) {
      throw new Error('Error fetching recent leads: ' + err.message);
    }
  }

  static async getLeadCounts(userId, roleId, assignedServices) {
    try {
      let query;
      let queryParams = [];
      if (userId == 6) {
        query = `
          SELECT 
            s.id AS status_id, 
            s.status_name,
            COUNT(l.id) AS count
          FROM 
            ekarigar_leads_status s
            LEFT JOIN ekarigar_leads l ON s.id = l.status AND l.assigned_to = ?
          GROUP BY 
            s.id, s.status_name
          ORDER BY 
            s.id ASC
        `;
        queryParams = [userId];
      } else if (roleId === 1) {
        query = `
          SELECT 
            s.id AS status_id, 
            s.status_name,
            COUNT(l.id) AS count
          FROM 
            ekarigar_leads_status s
            LEFT JOIN ekarigar_leads l ON s.id = l.status
          GROUP BY 
            s.id, s.status_name
          ORDER BY 
            s.id ASC
        `;
      } else if (roleId === 2 && assignedServices) {
        query = `
          SELECT 
            s.id AS status_id, 
            s.status_name,
            COUNT(DISTINCT CASE 
              WHEN FIND_IN_SET(?, l.assigned_to) 
              AND EXISTS (
                SELECT 1 
                FROM (
                  SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(?, ',', numbers.n), ',', -1) service_id
                  FROM (
                    SELECT a.N + b.N * 10 + 1 n
                    FROM 
                      (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
                      (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b
                    ORDER BY n
                  ) numbers
                  WHERE numbers.n <= 1 + (LENGTH(?) - LENGTH(REPLACE(?, ',', '')))
                ) services
                WHERE FIND_IN_SET(services.service_id, l.website_type)
              )
              THEN l.id 
              ELSE NULL 
            END) AS count
          FROM 
            ekarigar_leads_status s
            LEFT JOIN ekarigar_leads l ON s.id = l.status
          GROUP BY 
            s.id, s.status_name
          ORDER BY 
            s.id ASC
        `;
        queryParams = [userId, assignedServices, assignedServices, assignedServices];
      } else {
        return { total: 0, statuses: [] };
      }
      const [results] = await db.execute(query, queryParams);
      return {
        total: results.reduce((sum, row) => sum + Number(row.count), 0),
        statuses: results.map((row) => ({
          id: row.status_id,
          name: row.status_name,
          count: Number(row.count),
        })),
      };
    } catch (err) {
      throw new Error('Error fetching lead counts: ' + err.message);
    }
  }

  static async getLeadSources(userId, roleId, assignedServices) {
    try {
      let query;
      let queryParams = [];
      if (roleId === 1) {
        query = `
          SELECT 
            s.source_name AS source,
            COUNT(DISTINCT l.id) AS count
          FROM 
            ekarigar_lead_source s
            LEFT JOIN ekarigar_leads l ON s.id = l.lead_source
          GROUP BY 
            s.source_name
          ORDER BY 
            s.source_name ASC
        `;
      } else if (roleId === 2 && assignedServices) {
        query = `
          SELECT 
            s.source_name AS source,
            COUNT(DISTINCT l.id) AS count
          FROM 
            ekarigar_lead_source s
            LEFT JOIN ekarigar_leads l ON s.id = l.lead_source
          WHERE 
            FIND_IN_SET(?, l.assigned_to)
            AND EXISTS (
              SELECT 1
              FROM (
                SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(?, ',', numbers.n), ',', -1) service_id
                FROM (
                  SELECT a.N + b.N * 10 + 1 n
                  FROM 
                    (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
                    (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b
                  ORDER BY n
                ) numbers
                WHERE numbers.n <= 1 + (LENGTH(?) - LENGTH(REPLACE(?, ',', '')))
              ) services
              WHERE FIND_IN_SET(services.service_id, l.website_type)
            )
          GROUP BY 
            s.source_name
          ORDER BY 
            s.source_name ASC
        `;
        queryParams = [userId, assignedServices, assignedServices, assignedServices];
      } else {
        return [];
      }
      const [results] = await db.execute(query, queryParams);
      const totalLeads = results.reduce((sum, lead) => sum + Number(lead.count), 0);
      return results.map((lead) => ({
        source: lead.source,
        percentage: totalLeads > 0 ? Number(((lead.count / totalLeads) * 100).toFixed(2)) : 0,
      }));
    } catch (err) {
      throw new Error('Error fetching lead sources: ' + err.message);
    }
  }

  static async getAllLeadCounts() {
    try {
      const query = `
        SELECT 
          s.id AS status_id,
          s.status_name,
          COUNT(l.id) AS count
        FROM 
          ekarigar_leads_status s
          LEFT JOIN ekarigar_leads l ON s.id = l.status
        GROUP BY 
          s.id, s.status_name
        ORDER BY 
          s.id ASC
      `;
      const [results] = await db.execute(query);
      return {
        total: results.reduce((sum, row) => sum + Number(row.count), 0),
        statuses: results.map((row) => ({
          id: row.status_id,
          name: row.status_name,
          count: Number(row.count),
        })),
      };
    } catch (err) {
      throw new Error('Error fetching all lead counts: ' + err.message);
    }
  }

  static async getAllLeadSources() {
    try {
      const query = `
        SELECT 
          s.source_name AS source, 
          COUNT(l.lead_source) AS count
        FROM ekarigar_leads l
        INNER JOIN ekarigar_lead_source s ON l.lead_source = s.id
        GROUP BY s.source_name
      `;
      const [results] = await db.execute(query);
      const totalLeads = results.reduce((sum, lead) => sum + Number(lead.count), 0);
      return results.map((lead) => ({
        source: lead.source,
        percentage: totalLeads > 0 ? Number(((lead.count / totalLeads) * 100).toFixed(2)) : 0,
      }));
    } catch (err) {
      throw new Error('Error fetching all lead sources: ' + err.message);
    }
  }

  static async getLeads(userId, userPermissions, { createdStartDate, createdEndDate, updatedStartDate, updatedEndDate }) {
    try {
      let query = `
        SELECT 
          l.id, 
          l.assigned_to, 
          u.username AS assigned_username,
          l.status AS status_id, 
          ls.status_name AS status, 
          l.name, 
          l.mobile_number, 
          l.email, 
          l.city,
          l.website_type AS website_type_id,
          l.industry_type AS industry_type_id,
          st.servicename AS website_type, 
          it.industryname AS industry_type, 
          cm.id AS contact_preference_id, 
          cm.method_name AS contact_preference, 
          l.preferred_date, 
          l.preferred_time, 
          l.requirements, 
          l.lead_source AS source_id,
          ls_table.source_name AS lead_source,
          l.checkbox_ids, 
          l.created_at, 
          l.updated_at,
          l.likelihood_id,
          COUNT(f.id) AS followUpCount
        FROM 
          ekarigar_leads l
        LEFT JOIN 
          ekarigar_servicetype st ON l.website_type = st.id
        LEFT JOIN 
          ekarigar_industrytype it ON l.industry_type = it.id
        LEFT JOIN 
          ekarigar_followups f ON l.id = f.lead_id
        LEFT JOIN 
          ekarigar_users u ON l.assigned_to = u.id
        LEFT JOIN 
          ekarigar_contact_methods cm ON l.contact_preference = cm.id
        LEFT JOIN 
          ekarigar_leads_status ls ON l.status = ls.id
        LEFT JOIN 
          ekarigar_lead_source ls_table ON l.lead_source = ls_table.id
        WHERE 1=1
      `;
      const queryParams = [];
      const dateConditions = [];

      if (createdStartDate && createdEndDate) {
        dateConditions.push(`DATE(l.created_at) BETWEEN ? AND ?`);
        queryParams.push(createdStartDate, createdEndDate);
      }
      if (updatedStartDate && updatedEndDate) {
        dateConditions.push(`DATE(l.updated_at) BETWEEN ? AND ?`);
        queryParams.push(updatedStartDate, updatedEndDate);
      }
      if (dateConditions.length === 0) {
        dateConditions.push(`MONTH(l.created_at) = MONTH(CURDATE()) AND YEAR(l.created_at) = YEAR(CURDATE())`);
      }
      if (dateConditions.length > 0) {
        query += ` AND (${dateConditions.join(' AND ')})`;
      }

      if (userPermissions !== '1') {
        console.log('Restricted permissions: Fetching assigned leads');
        query += ` AND (l.assigned_to = ? OR l.id IN (SELECT id FROM ekarigar_leads WHERE assigned_to = ?))`;
        queryParams.push(userId, userId);
      } else {
        console.log('Admin permissions: Fetching all leads');
      }

      query += ` GROUP BY l.id ORDER BY l.id DESC`;

      const [results] = await db.execute(query, queryParams);
      return results.map(row => ({
        id: row.id,
        assigned_to_id: row.assigned_to,
        assigned_to: row.assigned_username || null,
        status_id: row.status_id,
        status: row.status,
        name: row.name,
        mobile_number: row.mobile_number,
        email: row.email,
        city: row.city,
        website_type_id: row.website_type_id,
        industry_type_id: row.industry_type_id,
        website_type: row.website_type,
        industry_type: row.industry_type,
        contact_preference: row.contact_preference,
        contact_preference_id: row.contact_preference_id || null,
        preferred_date: row.preferred_date,
        preferred_time: row.preferred_time,
        requirements: row.requirements,
        source_id: row.source_id,
        lead_source: row.lead_source,
        checkbox_ids: row.checkbox_ids,
        created_at: row.created_at,
        updated_at: row.updated_at,
        likelihood_id: row.likelihood_id,
        followUpCount: row.followUpCount || 0,
      }));
    } catch (err) {
      throw new Error('Error fetching leads: ' + err.message);
    }
  }
}

module.exports = LeadModel;