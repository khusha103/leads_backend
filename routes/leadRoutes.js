const express = require('express');
const leadController = require('../controllers/leadController');

const router = express.Router();

router.post('/', leadController.processWebhook);
router.get('/recentleads', leadController.getRecentLeads);
router.get('/leadcounts_user/:userId', leadController.getLeadCounts);
router.get('/leadcounts_user_pause/:userId', leadController.getLeadCounts);
router.get('/leadsources_user/:userId', leadController.getLeadSources);
router.get('/leadcounts', leadController.getLeadCountsAll);
router.get('/leadsources', leadController.getLeadSourcesAll);
router.get('/today-followups', leadController.getTodayFollowups);
router.post('/leads', leadController.createLead);
router.put('/update_leads', leadController.updateLead);
router.delete('/leads/:lead_id', leadController.deleteLead);
router.get('/getleads', leadController.getLeads);
router.get('/getleads_wip', leadController.getLeads);
router.get('/getleads_wipp', leadController.getLeads);
router.post('/transfer_wpforms_entries', leadController.transferWpformsEntries);

module.exports = router;