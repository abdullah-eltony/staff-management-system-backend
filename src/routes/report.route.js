// routes/reportRoutes.js

import express from 'express';
import ReportController from '../controllers/report.controller.js';
import authApiKey from '../middlewares/authApiKey.js';
const reportRouter = express.Router();

// submit a new report
reportRouter.post('/create', authApiKey, ReportController.createReport);

// get all reports
reportRouter.get('/',authApiKey, ReportController.getAllReports);

// get report by ID
reportRouter.get('/:id',authApiKey, ReportController.getReportById);

// delete report by ID
reportRouter.delete('/:id',authApiKey, ReportController.deleteReport);



export default reportRouter;
