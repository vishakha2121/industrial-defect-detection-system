import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ImageUploader from '../components/Detection/ImageUploader';
import CameraCapture from '../components/Detection/CameraCapture';
import ResultViewer from '../components/Detection/ResultViewer';
import { useDetection } from '../context/DetectionContext';

const LiveDetection = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [currentResult, setCurrentResult] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const { isDetecting } = useDetection();

  const handleImageUploaded = (result, file) => {
    setCurrentResult(result);
    setCurrentImage(URL.createObjectURL(file));
  };

  const handleCameraCapture = async (file) => {
    const result = await handleImageUploaded(null, file);
    setCurrentImage(URL.createObjectURL(file));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Live Detection</h1>
      
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'upload' 
              ? 'text-primary-600 border-b-2 border-primary-600' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          Upload Image
        </button>
        <button
          onClick={() => setActiveTab('camera')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'camera' 
              ? 'text-primary-600 border-b-2 border-primary-600' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          Camera Capture
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">
            {activeTab === 'upload' ? 'Upload Image' : 'Capture from Camera'}
          </h2>
          
          {activeTab === 'upload' && (
            <ImageUploader onImageUploaded={handleImageUploaded} />
          )}
          
          {activeTab === 'camera' && (
            <CameraCapture onCapture={handleCameraCapture} />
          )}
          
          {currentImage && !isDetecting && (
            <div className="mt-4">
              <img src={currentImage} alt="Preview" className="rounded-lg max-h-96 mx-auto" />
            </div>
          )}
        </div>

        <div>
          <ResultViewer result={currentResult} />
        </div>
      </div>

      {isDetecting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300">Analyzing image for defects...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LiveDetection;