import React, { useState } from 'react';
import { FiEye, FiDownload, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import RejectButton from '../Detection/RejectButton';

const DetectionTable = ({ detections, total, page, pageSize, onPageChange, onViewDetails }) => {
  const totalPages = Math.ceil(total / pageSize);

  const getSeverityBadge = (severity) => {
    const classes = {
      high: 'badge-danger',
      medium: 'badge-warning',
      low: 'badge-success',
    };
    return <span className={`badge ${classes[severity] || 'badge-info'}`}>{severity}</span>;
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Defect Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Confidence</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Severity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {detections?.map((detection) => (
              <tr key={detection.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">#{detection.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                  {new Date(detection.inspection_time).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{detection.defect_type}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="font-medium">{(detection.confidence_score * 100).toFixed(1)}%</span>
                </td>
                <td className="px-6 py-4">{getSeverityBadge(detection.severity_level)}</td>
                <td className="px-6 py-4">
                  {detection.is_rejected ? (
                    <span className="badge badge-danger">Rejected</span>
                  ) : (
                    <span className="badge badge-success">Accepted</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => onViewDetails?.(detection)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEye size={18} />
                  </button>
                  {!detection.is_rejected && (
                    <RejectButton detectionId={detection.id} onReject={() => onPageChange?.(page)} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 px-6 py-3">
          <button
            onClick={() => onPageChange?.(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
          >
            <FiChevronLeft />
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange?.(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default DetectionTable;