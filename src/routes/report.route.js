// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/report.controller');
const authApiKey = require('../middlewares/authApiKey');

router.post('/create', authApiKey, ReportController.createReport);
router.get('/', ReportController.getAllReports);
router.get('/:id', ReportController.getReportById);
router.delete('/:id',authApiKey, ReportController.deleteReport);

module.exports = router;
