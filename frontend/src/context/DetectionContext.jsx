import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { useApp } from './AppContext';

const DetectionContext = createContext();

export const useDetection = () => useContext(DetectionContext);

export const DetectionProvider = ({ children }) => {
  const [currentDetection, setCurrentDetection] = useState(null);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const { API_URL, addNotification } = useApp();

  const detectImage = async (file) => {
    setIsDetecting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/api/detection/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000
      });
      
      setCurrentDetection(response.data);
      addNotification('Detection completed successfully!', 'success');
      return response.data;
    } catch (error) {
      addNotification(error.response?.data?.detail || 'Detection failed', 'error');
      throw error;
    } finally {
      setIsDetecting(false);
    }
  };

  const fetchHistory = async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_URL}/api/history/?${params}`);
      setDetectionHistory(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching history:', error);
      throw error;
    }
  };

  const rejectItem = async (detectionId) => {
    try {
      await axios.post(`${API_URL}/api/detection/reject/${detectionId}`);
      addNotification('Item rejected successfully', 'warning');
      await fetchHistory();
    } catch (error) {
      addNotification('Failed to reject item', 'error');
      throw error;
    }
  };

  return (
    <DetectionContext.Provider value={{
      currentDetection,
      detectionHistory,
      isDetecting,
      detectImage,
      fetchHistory,
      rejectItem,
      setCurrentDetection
    }}>
      {children}
    </DetectionContext.Provider>
  );
};