import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiBox, FiAlertTriangle, FiCheckCircle, FiClock } from 'react-icons/fi';
import StatsCard from '../components/Dashboard/StatsCard';
import DefectChart from '../components/Dashboard/DefectChart';
import RecentDetections from '../components/Dashboard/RecentDetections';
import { useApp } from '../context/AppContext';
import axios from 'axios';

const Dashboard = () => {
  const { API_URL, loading } = useApp();
  const [stats, setStats] = useState(null);
  const [recentDetections, setRecentDetections] = useState([]);
  const [defectDistribution, setDefectDistribution] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        axios.get(`${API_URL}/api/stats/overall`),
        axios.get(`${API_URL}/api/history/?page=1&page_size=5`)
      ]);
      
      setStats(statsRes.data);
      setRecentDetections(historyRes.data.detections || []);
      
      // Transform defect distribution for chart
      if (statsRes.data?.defect_by_type) {
        setDefectDistribution(statsRes.data.defect_by_type.map(d => ({
          name: d.defect_type,
          value: d.count
        })));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const statCards = [
    { title: 'Total Inspections', value: stats?.total_inspections || 0, icon: FiBox, color: 'blue', trend: 'up', trendValue: '12' },
    { title: 'Defects Found', value: stats?.total_defects || 0, icon: FiAlertTriangle, color: 'red', trend: 'up', trendValue: '8' },
    { title: 'Acceptance Rate', value: `${((stats?.total_inspections - stats?.total_rejected) / stats?.total_inspections * 100).toFixed(1) || 0}%`, icon: FiCheckCircle, color: 'green', trend: 'down', trendValue: '3' },
    { title: 'Avg Processing', value: `${stats?.avg_processing_time?.toFixed(0) || 0}ms`, icon: FiClock, color: 'purple', trend: 'up', trendValue: '5' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Last updated: {new Date().toLocaleTimeString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Defect Distribution</h2>
          <DefectChart data={defectDistribution} type="pie" />
        </div>
        
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Daily Trend</h2>
          {stats?.daily_trend && (
            <DefectChart 
              data={stats.daily_trend.slice(-7).map(d => ({ name: d.date, value: d.defects_found }))} 
              type="bar" 
            />
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Recent Detections</h2>
        <RecentDetections detections={recentDetections} />
      </div>
    </motion.div>
  );
};

export default Dashboard;