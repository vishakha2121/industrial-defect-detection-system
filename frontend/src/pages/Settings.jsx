import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Settings = () => {
  const { API_URL, addNotification } = useApp();
  const [settings, setSettings] = useState({
    confidence_threshold: 0.5,
    iou_threshold: 0.45,
    auto_reject_enabled: true,
    max_upload_size: 10
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/settings/`);
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/api/settings/thresholds`, {
        confidence_threshold: settings.confidence_threshold,
        iou_threshold: settings.iou_threshold,
        auto_reject_enabled: settings.auto_reject_enabled
      });
      addNotification('Settings saved successfully!', 'success');
    } catch (error) {
      addNotification('Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      try {
        await axios.post(`${API_URL}/api/settings/reset`);
        await fetchSettings();
        addNotification('Settings reset to default', 'success');
      } catch (error) {
        addNotification('Failed to reset settings', 'error');
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">System Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Detection Thresholds</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Confidence Threshold: {settings.confidence_threshold}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={settings.confidence_threshold}
                onChange={(e) => setSettings({ ...settings, confidence_threshold: parseFloat(e.target.value) })}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum confidence to consider as defect</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">IOU Threshold: {settings.iou_threshold}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={settings.iou_threshold}
                onChange={(e) => setSettings({ ...settings, iou_threshold: parseFloat(e.target.value) })}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Intersection over Union for duplicate detections</p>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Auto Reject Defective Items</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.auto_reject_enabled}
                  onChange={(e) => setSettings({ ...settings, auto_reject_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">System Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Max Upload Size (MB)</label>
              <input
                type="number"
                value={settings.max_upload_size}
                onChange={(e) => setSettings({ ...settings, max_upload_size: parseInt(e.target.value) })}
                className="input"
                min="1"
                max="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Model Path</label>
              <input
                type="text"
                value={settings.model_path || 'models/yolov8n.pt'}
                disabled
                className="input bg-gray-100 dark:bg-gray-700"
              />
            </div>

            <div className="pt-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
              <button
                onClick={handleReset}
                className="btn-secondary w-full mt-2"
              >
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">About System</h2>
        <div className="space-y-2 text-gray-600 dark:text-gray-400">
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Detection Model:</strong> YOLOv8n (CPU Optimized)</p>
          <p><strong>Classification Model:</strong> MobileNetV2 Transfer Learning</p>
          <p><strong>API Integration:</strong> Gemini AI for Advanced Analysis</p>
          <p><strong>Deployment:</strong> Edge-Ready Architecture</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;