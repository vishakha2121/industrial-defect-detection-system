import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiImage } from 'react-icons/fi';
import { useDetection } from '../../context/DetectionContext';
import { useApp } from '../../context/AppContext';

const ImageUploader = ({ onImageUploaded }) => {
  const { detectImage, isDetecting } = useDetection();
  const { addNotification } = useApp();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addNotification('Please upload an image file', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addNotification('File size must be less than 10MB', 'error');
      return;
    }

    try {
      const result = await detectImage(file);
      onImageUploaded?.(result, file);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }, [detectImage, onImageUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: 1,
    disabled: isDetecting
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
        ${isDragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600'}
        ${isDetecting ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-500'}
      `}
    >
      <input {...getInputProps()} />
      <FiUpload className="mx-auto text-gray-400 mb-4" size={48} />
      {isDragActive ? (
        <p className="text-primary-500">Drop the image here...</p>
      ) : (
        <>
          <p className="text-gray-600 dark:text-gray-400">
            Drag & drop an image here, or click to select
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Supports: JPG, JPEG, PNG (Max 10MB)
          </p>
        </>
      )}
    </div>
  );
};

export default ImageUploader;