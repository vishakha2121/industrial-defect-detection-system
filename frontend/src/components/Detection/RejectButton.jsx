import React, { useState } from 'react';
import { FiThumbsDown, FiCheck } from 'react-icons/fi';
import { useDetection } from '../../context/DetectionContext';

const RejectButton = ({ detectionId, onReject }) => {
  const [isRejecting, setIsRejecting] = useState(false);
  const { rejectItem } = useDetection();

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      await rejectItem(detectionId);
      onReject?.();
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <button
      onClick={handleReject}
      disabled={isRejecting}
      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
    >
      {isRejecting ? (
        <FiCheck className="animate-spin mr-2" size={18} />
      ) : (
        <FiThumbsDown className="mr-2" size={18} />
      )}
      Reject Item
    </button>
  );
};

export default RejectButton;