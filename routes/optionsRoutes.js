const express = require('express');
const OptionsController = require('../controllers/optionsController');
const UserModel = require('../models/userModel');

const router = express.Router();

router.get('/checkbox-options', OptionsController.getCheckboxOptions);
router.get('/status-options', OptionsController.getStatusOptions);
router.get('/likelihood-options', OptionsController.getLikelihoodOptions);
router.get('/lead-sources', OptionsController.getLeadSources);
router.get('/get_industryType', OptionsController.getIndustryTypes);
router.get('/getservicetypes', OptionsController.getServiceTypes);
router.get('/get_roles', OptionsController.getRoles);
router.get('/get_contact_methods', OptionsController.getContactMethods);
router.get('/get_permissions', OptionsController.getPermissions);
router.get('/get_services_with_status', OptionsController.getServicesWithStatus);
router.get('/get_users', async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    if (users.length === 0) {
      return res.status(200).json({ status: true, data: [], message: 'No users found' });
    }
    res.json({ status: true, data: users });
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/getuserservicetypes', async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const services = await UserModel.getUserServiceTypes(userId);
    if (!services) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ status: 'success', data: services, message: services.length === 0 ? 'No services assigned to this user' : undefined });
  } catch (err) {
    console.error('Error fetching user service types:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/getUserRole/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const roleId = await UserModel.getUserRole(userId);
    if (!roleId) {
      return res.status(404).json({ error: 'User not found or deleted' });
    }
    res.json({ role_id: roleId });
  } catch (err) {
    console.error('Error fetching user role:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/user/:userId/permissions', async (req, res) => {
  try {
    const userId = req.params.userId;
    const permissions = await UserModel.getUserPermissions(userId);
    res.json(permissions);
  } catch (err) {
    console.error('Error fetching user permissions:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;