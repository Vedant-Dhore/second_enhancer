import React, { useState } from 'react';
import { Search, Filter, SortAsc, X, Briefcase, MapPin, User, FolderOpen, ChevronDown } from 'lucide-react';

interface SearchFilterPanelProps {
  onSearchChange: (search: string) => void;
  onSortChange: (sort: string) => void;
  onFiltersChange: (filters: any) => void;
  searchTerm: string;
  sortBy: string;
  filters: any;
}

const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({
  onSearchChange,
  onSortChange,
  onFiltersChange,
  searchTerm,
  sortBy,
  filters
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { value: 'priority', label: 'Priority (High → Low)' },
    { value: 'aging', label: 'Aging (Oldest → Newest)' },
    { value: 'joining', label: 'Expected Joining Date' }
  ];

  const employmentTypes = ['Full-time', 'Internship'];
  const locations = ['Pune', 'Mumbai', 'Pune, Maharashtra'];
  const hiringManagers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Alex Brown'];

  const handleFilterChange = (category: string, value: string, checked: boolean) => {
    const newFilters = { ...filters };
    if (!newFilters[category]) newFilters[category] = [];
    
    if (checked) {
      newFilters[category] = [...newFilters[category], value];
    } else {
      newFilters[category] = newFilters[category].filter((item: string) => item !== value);
    }
    
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onSortChange('priority');
    onFiltersChange({});
  };

  const hasActiveFilters = searchTerm || Object.keys(filters).some(key => filters[key]?.length > 0);

  return (
    <div className="p-4 border-b border-gray-200 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search job titles or keywords..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Sort and Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-sm border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[180px]"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors border ${
            showFilters ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span></span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filters Label and Clear All */}
      {showFilters && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Clear Filters Button */}
      {hasActiveFilters && !showFilters && (
        <button
          onClick={clearAllFilters}
          className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Clear All Filters</span>
        </button>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="space-y-4">
          {/* Employment Type */}
          <div>
            <h4 className="font-medium text-gray-700 text-sm mb-2">Employment Type</h4>
            <div className="space-y-1">
              {employmentTypes.map(type => (
                <label key={type} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.employmentType?.includes(type) || false}
                    onChange={(e) => handleFilterChange('employmentType', type, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-600">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-medium text-gray-700 text-sm mb-2">Location</h4>
            <div className="space-y-1">
              {locations.map(location => (
                <label key={location} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.location?.includes(location) || false}
                    onChange={(e) => handleFilterChange('location', location, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-600">{location}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Hiring Manager */}
          <div>
            <h4 className="font-medium text-gray-700 text-sm mb-2">Hiring Manager</h4>
            <div className="space-y-1">
              {hiringManagers.map(manager => (
                <label key={manager} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.hiringManager?.includes(manager) || false}
                    onChange={(e) => handleFilterChange('hiringManager', manager, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-600">{manager}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilterPanel;