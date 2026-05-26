import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle, FiX } from 'react-icons/fi';

const AlertMessage = ({ type, message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const config = {
    success: { icon: FiCheckCircle, bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-200', border: 'border-green-400' },
    error: { icon: FiXCircle, bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-800 dark:text-red-200', border: 'border-red-400' },
    warning: { icon: FiAlertCircle, bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-200', border: 'border-yellow-400' },
    info: { icon: FiInfo, bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-800 dark:text-blue-200', border: 'border-blue-400' }
  };

  const { icon: Icon, bg, text, border } = config[type] || config.info;

  return (
    <div className={`${bg} border-l-4 ${border} rounded-lg p-4 mb-4 shadow-md`}>
      <div className="flex items-start">
        <Icon className={`${text} mr-3 flex-shrink-0`} size={20} />
        <div className={`flex-1 ${text}`}>
          <p className="text-sm">{message}</p>
        </div>
        <button onClick={() => setVisible(false)} className={`${text} hover:opacity-70`}>
          <FiX size={18} />
        </button>
      </div>
    </div>
  );
};

export default AlertMessage;