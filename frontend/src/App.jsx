import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppProvider } from './context/AppContext';
import { DetectionProvider } from './context/DetectionContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import Dashboard from './pages/Dashboard';
import LiveDetection from './pages/LiveDetection';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Reports from './pages/Reports';

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <ThemeProvider>
      <AppProvider>
        <DetectionProvider>
          <Router>
            <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
              <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
                  <div className="container mx-auto px-6 py-8">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/detection" element={<LiveDetection />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/reports" element={<Reports />} />
                    </Routes>
                  </div>
                </main>
                <Footer />
              </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
          </Router>
        </DetectionProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;