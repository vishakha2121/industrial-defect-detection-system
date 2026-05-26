import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiCalendar, FiPrinter } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import axios from 'axios';
import ExportButton from '../components/History/ExportButton';

const Reports = () => {
  const { API_URL } = useApp();
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const params = {};
      if (dateRange.start) params.start_date = dateRange.start;
      if (dateRange.end) params.end_date = dateRange.end;
      
      const [statsRes, historyRes] = await Promise.all([
        axios.get(`${API_URL}/api/stats/overall`, { params }),
        axios.get(`${API_URL}/api/history/`, { params, params: { page_size: 100, ...params } })
      ]);
      
      setReportData({
        stats: statsRes.data,
        detections: historyRes.data.detections,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const printReport = () => {
    window.print();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Reports</h1>
        <div className="flex space-x-2 print:hidden">
          <button onClick={printReport} className="btn-secondary inline-flex items-center">
            <FiPrinter className="mr-2" /> Print
          </button>
          {reportData && <ExportButton data={reportData.detections} filename="quality_report" />}
        </div>
      </div>

      <div className="card print:hidden">
        <h2 className="text-lg font-semibold mb-4">Report Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="input"
            />
          </div>
        </div>
        <div className="mt-4">
          <button onClick={generateReport} disabled={loading} className="btn-primary">
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {reportData && (
        <div className="card" id="report-content">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Quality Inspection Report</h2>
            <p className="text-gray-500">Generated: {new Date(reportData.generatedAt).toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-2xl font-bold">{reportData.stats?.total_inspections || 0}</p>
              <p className="text-sm text-gray-500">Total Inspections</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-2xl font-bold text-red-600">{reportData.stats?.total_defects || 0}</p>
              <p className="text-sm text-gray-500">Defects Found</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-2xl font-bold text-orange-600">{reportData.stats?.total_rejected || 0}</p>
              <p className="text-sm text-gray-500">Rejected Items</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-2xl font-bold text-green-600">{reportData.stats?.overall_accuracy?.toFixed(1) || 0}%</p>
              <p className="text-sm text-gray-500">System Accuracy</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3">Defect Breakdown</h3>
          <table className="w-full mb-8">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr><th className="px-4 py-2 text-left">Defect Type</th><th className="px-4 py-2 text-left">Count</th><th className="px-4 py-2 text-left">Percentage</th></tr>
            </thead>
            <tbody>
              {reportData.stats?.defect_by_type?.map((defect, idx) => (
                <tr key={idx} className="border-b">
                  <td className="px-4 py-2">{defect.defect_type}</td>
                  <td className="px-4 py-2">{defect.count}</td>
                  <td className="px-4 py-2">{defect.percentage?.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 pt-4 border-t text-center text-sm text-gray-500">
            <p>This report is auto-generated by Industrial Defect Detection System</p>
            <p>© 2024 - AI-Powered Quality Control</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Reports;