const LeadModel = require('../models/leadModel');
const FollowupModel = require('../models/followupModel');
const WpformsModel = require('../models/wpformsModel');
const { mapPayloadToLead } = require('../utils/leadMapper');
const { mapWpformsEntry } = require('../utils/wpformsMapper');
const moment = require('moment-timezone');

const leadController = {
  async verifyWebhook(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'your_verify_token';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified');
      return res.status(200).send(challenge);
    }
    console.log('Verification failed:', { mode, token });
    return res.status(403).send('Forbidden');
  },

  async processWebhook(req, res) {
    try {
      const payload = req.body;
      if (!payload.entry || !payload.entry[0].changes) {
        return res.status(400).json({ error: 'Invalid payload structure' });
      }
      const leadData = mapPayloadToLead(payload.entry[0].changes[0].value);
      const newLead = await LeadModel.createLead(leadData);
      res.status(200).json({ status: 'success', lead: newLead });
    } catch (err) {
      console.error('Error processing webhook:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async saveFbLead(req, res) {
    try {
      const payload = req.body;
      const formId = payload.form_id;
      const allowedFormIds = ['637356575939309', '529677880213221', '1343440076956786'];
      if (!allowedFormIds.includes(formId)) {
        return res.status(400).json({ error: 'Invalid form_id' });
      }
      const mappedLead = mapPayloadToLead(payload);
      const newLead = await LeadModel.createLead(mappedLead);
      res.status(200).json({ message: 'Lead saved successfully', lead: newLead });
    } catch (err) {
      console.error('Error processing fb lead:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async transferWpformsEntries(req, res) {
    try {
      const entries = await WpformsModel.getWpformsEntries();
      if (entries.length === 0) {
        return res.status(200).json({
          status: 'success',
          message: 'No entries found for the past month.',
        });
      }

      const leadInsertPromises = entries.map(async (entry) => {
        const leadData = await mapWpformsEntry(entry);
        await LeadModel.createLead(leadData);
      });

      await Promise.all(leadInsertPromises);
      res.status(200).json({
        status: 'success',
        message: 'All leads have been successfully transferred.',
      });
    } catch (err) {
      console.error('Error during lead processing:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getRecentLeads(req, res) {
    try {
      const userId = req.headers['user-id'];
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      const user = await UserModel.findUserById(userId);
      if (!user || user.delete_status === '1') {
        return res.status(404).json({ error: 'User not found or inactive' });
      }
      const leads = await LeadModel.getRecentLeads(userId, user.role_id);
      res.status(200).json({
        success: true,
        message: 'Recent leads fetched successfully',
        data: leads,
      });
    } catch (err) {
      console.error('Error fetching recent leads:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getLeadCounts(req, res) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      const user = await UserModel.findUserById(userId);
      if (!user || user.delete_status === '1') {
        return res.status(404).json({ error: 'User not found or inactive' });
      }
      const counts = await LeadModel.getLeadCounts(userId, user.role_id, user.assigned_services);
      res.status(200).json({
        success: true,
        message: 'Lead counts fetched successfully',
        data: counts,
      });
    } catch (err) {
      console.error('Error fetching lead counts:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getLeadCountsAll(req, res) {
    try {
      const counts = await LeadModel.getAllLeadCounts();
      res.status(200).json({
        success: true,
        message: 'Lead counts fetched successfully',
        data: counts,
      });
    } catch (err) {
      console.error('Error fetching all lead counts:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getLeadSources(req, res) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      const user = await UserModel.findUserById(userId);
      if (!user || user.delete_status === '1') {
        return res.status(404).json({ error: 'User not found or inactive' });
      }
      const sources = await LeadModel.getLeadSources(userId, user.role_id, user.assigned_services);
      res.status(200).json({
        success: true,
        message: 'Lead sources fetched successfully',
        data: sources,
      });
    } catch (err) {
      console.error('Error fetching lead sources:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getLeadSourcesAll(req, res) {
    try {
      const sources = await LeadModel.getAllLeadSources();
      res.status(200).json({
        success: true,
        message: 'Lead sources fetched successfully',
        data: sources,
      });
    } catch (err) {
      console.error('Error fetching all lead sources:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getTodayFollowups(req, res) {
    try {
      const userId = req.query.userId;
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      const followups = await FollowupModel.getTodayFollowups(userId);
      res.status(200).json({
        success: true,
        message: "Today's followups fetched successfully",
        data: followups,
      });
    } catch (err) {
      console.error('Error fetching followups:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async createLead(req, res) {
    try {
      const lead = req.body;
      if (!lead.assigned_to) {
        return res.status(400).json({
          status: false,
          message: 'Assigned to field is required',
        });
      }

      const checkboxIds = lead.selectedCheckboxes && lead.selectedCheckboxes.length > 0
        ? lead.selectedCheckboxes.join(',')
        : null;

      const leadData = {
        name: lead.name ?? null,
        mobile_number: lead.mobile_number ?? null,
        assigned_to: lead.assigned_to,
        email: lead.email ?? null,
        city: lead.city ?? null,
        website_type: lead.service_type ?? null,
        industry_type: lead.industry_type ?? null,
        contact_preference: lead.contact_preference ?? null,
        preferred_date: lead.preferred_date ?? null,
        preferred_time: lead.preferred_time_slot ?? null,
        requirements: lead.requirements ?? null,
        lead_source: lead.lead_source || 'Manual',
        checkbox_ids: checkboxIds,
        created_at: moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
      };

      const result = await LeadModel.createLead(leadData);
      res.status(200).json({
        status: true,
        message: 'Lead saved successfully',
        id: result.id,
      });
    } catch (err) {
      console.error('Error inserting lead:', err.message);
      res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    }
  },

  async updateLead(req, res) {
    try {
      const lead = req.body;
      const updatedAt = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

      const leadData = {
        id: lead.id,
        name: lead.name ?? null,
        mobile_number: lead.mobile_number ?? null,
        email: lead.email ?? null,
        city: lead.city ?? null,
        website_type: lead.website_type_id ?? null,
        industry_type: lead.industry_type_id ?? null,
        preferred_date: lead.preferred_date ?? null,
        preferred_time: lead.preferred_time ?? null,
        requirements: lead.requirements ?? null,
        lead_source: lead.source_id || 0,
        status: lead.status_id ?? null,
        updated_at: updatedAt,
      };

      const result = await LeadModel.updateLead(leadData);
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: 'Lead not found',
        });
      }

      res.status(200).json({
        status: true,
        message: 'Lead updated successfully',
      });
    } catch (err) {
      console.error('Error updating lead:', err.message);
      res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    }
  },

  async deleteLead(req, res) {
    try {
      const leadId = req.params.lead_id;
      if (!leadId) {
        return res.status(400).json({
          status: false,
          message: 'Lead ID is required',
        });
      }

      const result = await LeadModel.deleteLead(leadId);
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: 'Lead not found',
        });
      }

      res.status(200).json({
        status: true,
        message: 'Lead deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting lead:', err.message);
      res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    }
  },

  async getLeads(req, res) {
    try {
      const userId = req.headers['user-id'];
      const userPermissions = req.headers['user-permissions'];
      const { createdStartDate, createdEndDate, updatedStartDate, updatedEndDate } = req.query;

      if (!userId || !userPermissions) {
        return res.status(400).json({ error: 'User ID or permissions not provided' });
      }

      const leads = await LeadModel.getLeads(userId, userPermissions, {
        createdStartDate,
        createdEndDate,
        updatedStartDate,
        updatedEndDate,
      });

      res.status(200).json({ status: true, data: leads });
    } catch (err) {
      console.error('Error fetching leads:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = leadController;