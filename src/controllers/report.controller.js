// controllers/reportController.js

import ReportService from '../services/report.service.js';
import { summarizeText } from '../utils/textSummary.js';

class ReportController {

  static async createReport(req, res, next) {
    try {
      const { task_id, employee_id, title, content } = req.body;
      const ai_summary = await summarizeText(content);

      const report = await ReportService.create({ task_id, employee_id, title, content, ai_summary });
      res.status(201).json(report);
    } catch (err) {
     if (err.code === "23503") {
        // foreign_key_violation
        let error = new Error("Invalid employee or task ID");
        error.status = 400;
        next(error);
      } else {
        next(err);
      }
    }
  }

  static async getAllReports(req, res) {
    try {
      const reports = await ReportService.getAll(req.user);
      res.json(reports);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  }

  static async getReportById(req, res) {
    try {
      const { id } = req.params;
      const report = await ReportService.getById(id);
      if (!report) return res.status(404).json({ message: 'Report not found' });
      res.json(report);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  }

  static async deleteReport(req, res) {
    try {
      const { id } = req.params;
      const report = await ReportService.delete(id);
      if (!report) return res.status(404).json({ message: 'Report not found' });
      res.json({ message: 'Report deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  }
}

export default ReportController;
