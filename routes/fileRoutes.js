const express = require('express');
const fileController = require('../controllers/fileController');
const leadController = require('../controllers/leadController');

const router = express.Router();

router.get('/lead-statuses', leadController.getLeadStatuses);
router.post('/upload_g', fileController.uploadFile);
router.all('/form', leadController.getFormData); // Note: Should be updated to handle form submissions properly
router.get('/mode', leadController.getMode);

module.exports = router;