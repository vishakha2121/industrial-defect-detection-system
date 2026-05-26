import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiCamera, FiList, FiBarChart2, FiSettings, FiFileText,
  FiTruck, FiCpu, FiAlertCircle 
} from 'react-icons/fi';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/detection', icon: FiCamera, label: 'Live Detection' },
    { path: '/history', icon: FiList, label: 'History' },
    { path: '/analytics', icon: FiBarChart2, label: 'Analytics' },
    { path: '/reports', icon: FiFileText, label: 'Reports' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
      
      <aside className={`fixed lg:relative z-30 w-64 bg-gray-900 dark:bg-gray-950 h-full transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <FiCpu className="text-primary-500" size={32} />
            <span className="text-white text-xl font-bold">DefectDetect</span>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200
                  ${isActive 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <FiAlertCircle className="text-yellow-500 mb-2" size={24} />
            <p className="text-white text-sm">System Status: Active</p>
            <p className="text-gray-400 text-xs mt-1">Model: YOLOv8</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;