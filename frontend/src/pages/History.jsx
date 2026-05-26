import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DetectionTable from '../components/History/DetectionTable';
import FilterBar from '../components/History/FilterBar';
import ExportButton from '../components/History/ExportButton';
import Modal from '../components/Common/Modal';
import { useDetection } from '../context/DetectionContext';
import axios from 'axios';
import { useApp } from '../context/AppContext';

const History = () => {
  const [detections, setDetections] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [filters, setFilters] = useState({});
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { API_URL } = useApp();

  useEffect(() => {
    fetchHistory();
  }, [page, filters]);

  const fetchHistory = async () => {
    try {
      const params = { page, page_size: pageSize, ...filters };
      const response = await axios.get(`${API_URL}/api/history/`, { params });
      setDetections(response.data.detections);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const handleViewDetails = async (detection) => {
    setSelectedDetection(detection);
    setModalOpen(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Detection History</h1>
        <ExportButton data={detections} filename="detection_history" />
      </div>

      <FilterBar onFilter={handleFilter} onClear={handleClearFilters} />

      <div className="card">
        <DetectionTable
          detections={detections}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onViewDetails={handleViewDetails}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Detection Details"
        size="lg"
      >
        {selectedDetection && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">ID</label>
                <p className="font-semibold">#{selectedDetection.id}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Time</label>
                <p className="font-semibold">{new Date(selectedDetection.inspection_time).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Defect Type</label>
                <p className="font-semibold">{selectedDetection.defect_type}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Confidence</label>
                <p className="font-semibold">{(selectedDetection.confidence_score * 100).toFixed(1)}%</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Severity</label>
                <p className="font-semibold capitalize">{selectedDetection.severity_level}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Status</label>
                <p className={`font-semibold ${selectedDetection.is_rejected ? 'text-red-600' : 'text-green-600'}`}>
                  {selectedDetection.is_rejected ? 'Rejected' : 'Accepted'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Processing Time</label>
                <p className="font-semibold">{selectedDetection.processing_time_ms?.toFixed(0)} ms</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Image Path</label>
                <p className="text-sm font-mono break-all">{selectedDetection.image_path}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default History;