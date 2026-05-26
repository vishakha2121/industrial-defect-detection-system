import React, { useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';

const FilterBar = ({ onFilter, onClear }) => {
  const [filters, setFilters] = useState({
    defectType: '',
    severity: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter?.(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      defectType: '',
      severity: '',
      status: '',
      startDate: '',
      endDate: ''
    });
    onClear?.();
  };

  const hasFilters = Object.values(filters).some(v => v);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <FiFilter />
          <h3 className="font-semibold">Filters</h3>
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="text-red-500 hover:text-red-700">
            <FiX />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Defect Type"
          value={filters.defectType}
          onChange={(e) => handleChange('defectType', e.target.value)}
          className="input"
        />
        
        <select
          value={filters.severity}
          onChange={(e) => handleChange('severity', e.target.value)}
          className="input"
        >
          <option value="">All Severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        
        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="input"
        >
          <option value="">All Status</option>
          <option value="rejected">Rejected</option>
          <option value="accepted">Accepted</option>
        </select>
        
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          className="input"
          placeholder="Start Date"
        />
        
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          className="input"
          placeholder="End Date"
        />
      </div>
    </div>
  );
};

export default FilterBar;