import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatsCard from '../../src/components/Dashboard/StatsCard';
import { FiBox } from 'react-icons/fi';

describe('StatsCard Component', () => {
  test('renders with correct title and value', () => {
    render(
      <StatsCard 
        title="Total Detections" 
        value="150" 
        icon={FiBox} 
        color="blue"
      />
    );
    
    expect(screen.getByText('Total Detections')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });
  
  test('shows trend indicator when provided', () => {
    render(
      <StatsCard 
        title="Defects" 
        value="25" 
        icon={FiBox} 
        color="red"
        trend="up"
        trendValue="12"
      />
    );
    
    expect(screen.getByText(/↑/)).toBeInTheDocument();
  });
});

describe('ImageUploader Component', () => {
  test('handles file upload', () => {
    const mockOnUpload = jest.fn();
    render(<ImageUploader onImageUploaded={mockOnUpload} />);
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    expect(mockOnUpload).toHaveBeenCalled();
  });
});