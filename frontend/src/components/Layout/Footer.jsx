import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-md py-4 px-6">
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <div>
          © 2024 Industrial Defect Detection System. All rights reserved.
        </div>
        <div className="flex space-x-4">
          <span>Version 1.0.0</span>
          <span>|</span>
          <span>AI-Powered Quality Control</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;