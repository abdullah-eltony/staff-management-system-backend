// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/report.controller');
const authApiKey = require('../middlewares/authApiKey');

// submit a new report
router.post('/create', authApiKey, ReportController.createReport);

// get all reports
router.get('/',authApiKey, ReportController.getAllReports);

// get report by ID
router.get('/:id',authApiKey, ReportController.getReportById);

// update report by ID
router.delete('/:id',authApiKey, ReportController.deleteReport);



module.exports = router;
