import React from 'react';
import { TailSpin } from 'react-loader-spinner';

const LoadingSpinner = ({ size = 40, color = '#3b82f6', message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <TailSpin
        visible={true}
        height={size}
        width={size}
        color={color}
        ariaLabel="loading"
      />
      {message && <p className="mt-4 text-gray-500 dark:text-gray-400">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;