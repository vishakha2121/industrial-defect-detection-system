import api from './api';

export const detectionService = {
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/detection/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async rejectItem(detectionId) {
    const response = await api.post(`/api/detection/reject/${detectionId}`);
    return response.data;
  },

  async startBatch(batchName) {
    const response = await api.post('/api/detection/batch/start', null, {
      params: { batch_name: batchName }
    });
    return response.data;
  },

  async endBatch(batchId) {
    const response = await api.post(`/api/detection/batch/end/${batchId}`);
    return response.data;
  },

  async getHistory(filters) {
    const response = await api.get('/api/history/', { params: filters });
    return response.data;
  },

  async getDetectionById(id) {
    const response = await api.get(`/api/history/${id}`);
    return response.data;
  },

  async deleteDetection(id) {
    const response = await api.delete(`/api/history/${id}`);
    return response.data;
  },

  async getStats() {
    const response = await api.get('/api/stats/overall');
    return response.data;
  },

  async getDefectTypes() {
    const response = await api.get('/api/stats/defect-types');
    return response.data;
  },

  async getRealtimeStats(minutes = 60) {
    const response = await api.get('/api/stats/real-time', {
      params: { minutes }
    });
    return response.data;
  },

  async getSettings() {
    const response = await api.get('/api/settings/');
    return response.data;
  },

  async updateThresholds(thresholds) {
    const response = await api.put('/api/settings/thresholds', thresholds);
    return response.data;
  },

  async resetSettings() {
    const response = await api.post('/api/settings/reset');
    return response.data;
  }
};