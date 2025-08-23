const db = require('../config/db');

class OptionsController {
  static async getCheckboxOptions(req, res) {
    try {
      const query = 'SELECT id, option_name FROM ekarigar_lead_checkbox';
      const [results] = await db.execute(query);
      res.json(results);
    } catch (err) {
      console.error('Error fetching checkbox options:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getStatusOptions(req, res) {
    try {
      const query = 'SELECT id, status_name FROM ekarigar_leads_status';
      const [results] = await db.execute(query);
      res.status(200).json(results);
    } catch (err) {
      console.error('Error fetching status options:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getLikelihoodOptions(req, res) {
    try {
      const query = 'SELECT id, likelihood_name FROM ekarigar_leads_likelihood';
      const [results] = await db.execute(query);
      res.json(results);
    } catch (err) {
      console.error('Error fetching likelihood options:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getLeadSources(req, res) {
    try {
      const query = 'SELECT id, source_name FROM ekarigar_lead_source';
      const [results] = await db.execute(query);
      res.json(results);
    } catch (err) {
      console.error('Error fetching lead sources:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getIndustryTypes(req, res) {
    try {
      const query = 'SELECT id, industryname FROM ekarigar_industrytype';
      const [results] = await db.execute(query);
      res.json(results);
    } catch (err) {
      console.error('Error fetching industry types:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getServiceTypes(req, res) {
    try {
      const query = 'SELECT * FROM ekarigar_servicetype';
      const [results] = await db.execute(query);
      res.json(results);
    } catch (err) {
      console.error('Error fetching service types:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getRoles(req, res) {
    try {
      const query = 'SELECT * FROM ekarigar_roles';
      const [results] = await db.execute(query);
      res.json(results);
    } catch (err) {
      console.error('Error fetching roles:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getContactMethods(req, res) {
    try {
      const query = 'SELECT * FROM ekarigar_contact_methods';
      const [results] = await db.execute(query);
      res.json(results);
    } catch (err) {
      console.error('Error fetching contact methods:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getPermissions(req, res) {
    try {
      const query = 'SELECT * FROM ekarigar_permissions';
      const [results] = await db.execute(query);
      res.json(results);
    } catch (err) {
      console.error('Error fetching permissions:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getServicesWithStatus(req, res) {
    try {
      const query = `
        SELECT 
          s.id, 
          s.servicename,
          (
            SELECT COUNT(*) 
            FROM ekarigar_users u 
            WHERE FIND_IN_SET(s.id, u.assigned_services) 
            AND u.delete_status = '0'
          ) AS is_assigned
        FROM ekarigar_servicetype s
      `;
      const [results] = await db.execute(query);
      res.json(results);
    } catch (err) {
      console.error('Error fetching services with status:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = OptionsController;