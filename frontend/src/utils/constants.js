export const DEFECT_TYPES = {
  SCRATCH: 'scratch',
  DENT: 'dent',
  CRACK: 'crack',
  HOLE: 'hole',
  STAIN: 'stain',
  DEFORMATION: 'deformation',
  BURR: 'burr',
  DISCOLORATION: 'discoloration',
  NORMAL: 'normal'
};

export const SEVERITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  VERY_LOW: 'very_low',
  NONE: 'none'
};

export const SEVERITY_COLORS = {
  [SEVERITY_LEVELS.CRITICAL]: '#dc2626',
  [SEVERITY_LEVELS.HIGH]: '#ef4444',
  [SEVERITY_LEVELS.MEDIUM]: '#f59e0b',
  [SEVERITY_LEVELS.LOW]: '#eab308',
  [SEVERITY_LEVELS.VERY_LOW]: '#22c55e',
  [SEVERITY_LEVELS.NONE]: '#9ca3af'
};

export const API_ENDPOINTS = {
  DETECTION: '/api/detection',
  HISTORY: '/api/history',
  STATS: '/api/stats',
  SETTINGS: '/api/settings',
  WEBSOCKET: '/ws/detection'
};

export const CHART_COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4'];

export const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_UPLOAD_SIZE_MB = 10;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];