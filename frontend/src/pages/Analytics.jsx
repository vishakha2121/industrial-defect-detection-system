import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useApp } from '../context/AppContext';
import axios from 'axios';
import { FiTrendingUp, FiTrendingDown, FiActivity } from 'react-icons/fi';

const COLORS = ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#3b82f6', '#8b5cf6'];

const Analytics = () => {
  const { API_URL } = useApp();
  const [stats, setStats] = useState(null);
  const [defectTypes, setDefectTypes] = useState([]);
  const [realtime, setRealtime] = useState(null);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchRealtime, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [statsRes, defectRes, realtimeRes] = await Promise.all([
        axios.get(`${API_URL}/api/stats/overall`),
        axios.get(`${API_URL}/api/stats/defect-types`),
        axios.get(`${API_URL}/api/stats/real-time`)
      ]);
      setStats(statsRes.data);
      setDefectTypes(defectRes.data);
      setRealtime(realtimeRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchRealtime = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/stats/real-time`);
      setRealtime(response.data);
    } catch (error) {
      console.error('Error fetching realtime stats:', error);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics Dashboard</h1>

      {/* Realtime Stats */}
      {realtime && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Defects/Minute</p>
                <p className="text-2xl font-bold">{realtime.defects_per_minute?.toFixed(1) || 0}</p>
              </div>
              <FiActivity className="text-blue-500" size={32} />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Rejection Rate</p>
                <p className="text-2xl font-bold">{realtime.rejection_rate?.toFixed(1) || 0}%</p>
              </div>
              {realtime.rejection_rate > 10 ? <FiTrendingUp className="text-red-500" size={32} /> : <FiTrendingDown className="text-green-500" size={32} />}
            </div>
          </div>
          <div className="card">
            <div>
              <p className="text-gray-500 text-sm">Total Detections</p>
              <p className="text-2xl font-bold">{realtime.total_detections || 0}</p>
            </div>
          </div>
          <div className="card">
            <div>
              <p className="text-gray-500 text-sm">Time Window</p>
              <p className="text-2xl font-bold">{realtime.time_window_minutes || 60} min</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Daily Detection Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats?.daily_trend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="defects_found" stroke="#ef4444" name="Defects" />
              <Line type="monotone" dataKey="total_inspections" stroke="#3b82f6" name="Inspections" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Defect Type Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={defectTypes.map(d => ({ name: d.defect_type, value: d.count }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {defectTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Defect Type Stats</h2>
          <div className="space-y-3">
            {defectTypes.map((defect, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">{defect.defect_type}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(defect.count / defectTypes.reduce((sum, d) => sum + d.count, 0)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">{defect.count}</span>
                  <span className="text-sm text-gray-500">{(defect.avg_confidence * 100).toFixed(0)}% avg</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Quality Metrics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Overall Accuracy</span>
                <span>{stats?.overall_accuracy?.toFixed(1) || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${stats?.overall_accuracy || 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Acceptance Rate</span>
                <span>{((stats?.total_inspections - stats?.total_rejected) / stats?.total_inspections * 100).toFixed(1) || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${((stats?.total_inspections - stats?.total_rejected) / stats?.total_inspections * 100) || 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;