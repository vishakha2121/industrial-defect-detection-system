import { useState, useEffect, useCallback } from 'react';
import { detectionService } from '../services/detectionService';

export const useRealTimeDetection = (intervalMs = 5000) => {
  const [realtimeStats, setRealtimeStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const stats = await detectionService.getRealtimeStats();
      setRealtimeStats(stats);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, intervalMs);
    return () => clearInterval(interval);
  }, [fetchStats, intervalMs]);

  return { realtimeStats, loading, error, refresh: fetchStats };
};