import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Dashboard from '../../src/pages/Dashboard';
import { AppProvider } from '../../src/context/AppContext';

describe('Dashboard Page', () => {
  test('renders dashboard title', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <Dashboard />
        </AppProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });
  
  test('displays stats cards', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <Dashboard />
        </AppProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Total Inspections/i)).toBeInTheDocument();
  });
});

describe('LiveDetection Page', () => {
  test('renders upload and camera options', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <LiveDetection />
        </AppProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Upload Image/i)).toBeInTheDocument();
    expect(screen.getByText(/Camera Capture/i)).toBeInTheDocument();
  });
});