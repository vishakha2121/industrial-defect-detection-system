import React, { useState } from 'react';
import { FiDownload, FiFileText, FiFile } from 'react-icons/fi';
import { exportService } from '../../services/exportService';
import { useApp } from '../../context/AppContext';

const ExportButton = ({ data, filename = 'detections' }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { addNotification } = useApp();

  const handleExport = async (format) => {
    setIsExporting(true);
    setShowMenu(false);
    
    try {
      if (format === 'csv') {
        exportService.exportToCSV(data, filename);
        addNotification('CSV exported successfully!', 'success');
      } else if (format === 'json') {
        exportService.exportToJSON(data, filename);
        addNotification('JSON exported successfully!', 'success');
      } else if (format === 'pdf') {
        await exportService.exportToPDF(data, filename);
        addNotification('PDF exported successfully!', 'success');
      }
    } catch (error) {
      addNotification('Export failed', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className="btn-secondary inline-flex items-center"
      >
        <FiDownload className="mr-2" />
        Export
      </button>
      
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => handleExport('csv')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <FiFileText className="mr-2" /> Export as CSV
          </button>
          <button
            onClick={() => handleExport('json')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <FiFile className="mr-2" /> Export as JSON
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <FiFile className="mr-2" /> Export as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportButton;