// routes/reportRoutes.js

import express from 'express';
import ReportController from '../controllers/report.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import apiKeyLogger from '../middlewares/apiKeyLogger.js';
const reportRouter = express.Router();

// submit a new report
reportRouter.post('/create',apiKeyLogger, authMiddleware, ReportController.createReport);

// get all reports
reportRouter.get('/',apiKeyLogger,authMiddleware, ReportController.getAllReports);

// get report by ID
reportRouter.get('/:id',apiKeyLogger,authMiddleware, ReportController.getReportById);

// delete report by ID
reportRouter.delete('/:id',apiKeyLogger,authMiddleware, authorizeRoles('admin',"manager"), ReportController.deleteReport);



export default reportRouter;
