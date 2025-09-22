// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/report.controller');

router.post('/create', ReportController.createReport);
router.get('/', ReportController.getAllReports);
router.get('/:id', ReportController.getReportById);
router.delete('/:id', ReportController.deleteReport);

module.exports = router;
