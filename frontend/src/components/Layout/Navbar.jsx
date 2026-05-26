import React from 'react';
import { FiMenu, FiBell, FiUser, FiSun, FiMoon, FiSettings } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { notifications } = useApp();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md px-6 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
          >
            <FiMenu size={24} />
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-800 dark:text-white">
            Defect Detection System
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <FiBell size={20} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          <button
            onClick={toggleDarkMode}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <FiSettings size={20} />
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <FiUser className="text-white" size={18} />
            </div>
            <span className="text-gray-700 dark:text-gray-300">Admin</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;