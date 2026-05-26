import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiAlertTriangle } from 'react-icons/fi';

const ResultViewer = ({ result }) => {
  if (!result) return null;

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
      case 'critical':
        return <FiAlertTriangle className="text-red-500" size={24} />;
      case 'medium':
        return <FiAlertTriangle className="text-yellow-500" size={24} />;
      default:
        return <FiCheckCircle className="text-green-500" size={24} />;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-red-600';
    if (confidence >= 0.5) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Detection Result</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              {getSeverityIcon(result.severity)}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Defect Type</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {result.defect_type || 'No Defect'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Confidence</p>
              <p className={`text-lg font-semibold ${getConfidenceColor(result.confidence)}`}>
                {(result.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Severity</p>
              <p className="font-semibold capitalize text-gray-800 dark:text-white">
                {result.severity}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Decision</p>
              <p className={`font-semibold ${result.should_reject ? 'text-red-600' : 'text-green-600'}`}>
                {result.should_reject ? 'REJECT' : 'ACCEPT'}
              </p>
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Processing Time</p>
            <p className="font-semibold text-gray-800 dark:text-white">
              {result.processing_time?.toFixed(0)} ms
            </p>
          </div>

          {result.defect_location && result.defect_location.x_min && (
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Defect Location</p>
              <p className="text-sm font-mono text-gray-800 dark:text-white">
                X: {result.defect_location.x_min?.toFixed(0)} - {result.defect_location.x_max?.toFixed(0)}<br />
                Y: {result.defect_location.y_min?.toFixed(0)} - {result.defect_location.y_max?.toFixed(0)}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultViewer;