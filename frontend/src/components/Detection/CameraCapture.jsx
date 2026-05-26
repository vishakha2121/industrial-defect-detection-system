import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { FiCamera, FiRefreshCw, FiCheck } from 'react-icons/fi';
import { useDetection } from '../../context/DetectionContext';

const CameraCapture = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [screenshot, setScreenshot] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const { isDetecting } = useDetection();

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setScreenshot(imageSrc);
    setIsCapturing(true);
  };

  const retake = () => {
    setScreenshot(null);
    setIsCapturing(false);
  };

  const confirmCapture = async () => {
    if (screenshot) {
      const blob = await fetch(screenshot).then(res => res.blob());
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      onCapture?.(file);
      setScreenshot(null);
      setIsCapturing(false);
    }
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment"
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      {!isCapturing ? (
        <div className="relative">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-auto"
          />
          <button
            onClick={capture}
            disabled={isDetecting}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition"
          >
            <FiCamera size={24} className="text-gray-800" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img src={screenshot} alt="Captured" className="w-full h-auto" />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <button
              onClick={retake}
              className="bg-yellow-500 text-white rounded-full p-3 hover:bg-yellow-600 transition"
            >
              <FiRefreshCw size={24} />
            </button>
            <button
              onClick={confirmCapture}
              disabled={isDetecting}
              className="bg-green-500 text-white rounded-full p-3 hover:bg-green-600 transition"
            >
              <FiCheck size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;