// routes/reportRoutes.js

import express from 'express';
import ReportController from '../controllers/report.controller.js';
import authApiKey from '../middlewares/authApiKey.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
const reportRouter = express.Router();

// submit a new report
reportRouter.post('/create', authMiddleware, ReportController.createReport);

// get all reports
reportRouter.get('/',authMiddleware, ReportController.getAllReports);

// get report by ID
reportRouter.get('/:id',authMiddleware, ReportController.getReportById);

// delete report by ID
reportRouter.delete('/:id',authMiddleware, authorizeRoles('admin'), ReportController.deleteReport);



export default reportRouter;
