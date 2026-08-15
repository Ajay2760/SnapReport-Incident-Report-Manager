import React, { useState } from 'react';
import { Search, Filter, Calendar, Tag, X, RotateCcw, Compass } from 'lucide-react';
import { SearchFilters } from '../types/incident';

interface AdvancedSearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  availableTags: string[];
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  filters,
  onFiltersChange,
  availableTags
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const addTag = (tag: string) => {
    if (tag && !filters.tags?.includes(tag)) {
      handleFilterChange('tags', [...(filters.tags || []), tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleFilterChange('tags', filters.tags?.filter(tag => tag !== tagToRemove) || []);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchTerm: '',
      statusFilter: '',
      categoryFilter: '',
      priorityFilter: '',
      dateFrom: undefined,
      dateTo: undefined,
      locationRadius: undefined,
      tags: []
    });
  };

  return (
    <div className="app-card p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4 mb-5 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Filter & Search Dispatches
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Refine by keyword, category, status, urgency, or distance radius
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={clearAllFilters}
            className="app-btn-secondary px-3 py-2 text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Filters
          </button>
          
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="app-btn-primary px-4 py-2 text-xs flex items-center gap-1"
          >
            {showAdvanced ? 'Hide Filters' : 'Advanced Filters'}
          </button>
        </div>
      </div>

      {/* Near Me Distance Filters */}
      <div className="mb-5 pb-4 border-b border-slate-100 dark:border-slate-700/50 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mr-2">
          <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          📍 Distance Radius:
        </span>
        {[
          { label: 'All City', value: undefined },
          { label: 'Within 1 km', value: 1 },
          { label: 'Within 5 km', value: 5 },
          { label: 'Within 10 km', value: 10 },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => handleFilterChange('locationRadius', item.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filters.locationRadius === item.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      
      {/* Primary Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Term */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Keyword Search
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              placeholder="Search by title or street..."
              className="w-full pl-9 pr-3 py-2 app-input text-xs"
            />
          </div>
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Status
          </label>
          <select
            value={filters.statusFilter}
            onChange={(e) => handleFilterChange('statusFilter', e.target.value)}
            className="w-full py-2 px-3 app-input text-xs font-semibold cursor-pointer"
          >
            <option value="">✦ All Statuses</option>
            <option value="open">Open Reports</option>
            <option value="in-progress">In Repair</option>
            <option value="resolved">Resolved & Fixed</option>
          </select>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={filters.categoryFilter}
            onChange={(e) => handleFilterChange('categoryFilter', e.target.value)}
            className="w-full py-2 px-3 app-input text-xs font-semibold cursor-pointer"
          >
            <option value="">✦ All Categories</option>
            <option value="safety">Safety Hazard</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="environmental">Environmental</option>
            <option value="security">Public Security</option>
            <option value="maintenance">Maintenance</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Priority Dropdown */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Urgency Priority
          </label>
          <select
            value={filters.priorityFilter}
            onChange={(e) => handleFilterChange('priorityFilter', e.target.value)}
            className="w-full py-2 px-3 app-input text-xs font-semibold cursor-pointer"
          >
            <option value="">✦ All Priorities</option>
            <option value="critical">Critical Emergency</option>
            <option value="high">High Urgency</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Routine Notice</option>
          </select>
        </div>
      </div>

      {/* Expandable Advanced Section */}
      {showAdvanced && (
        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700/60 space-y-4">
          
          {/* Date Range Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Reported After Date
              </label>
              <input
                type="date"
                onChange={(e) => handleFilterChange('dateFrom', e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full px-3 py-2 app-input text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Reported Before Date
              </label>
              <input
                type="date"
                onChange={(e) => handleFilterChange('dateTo', e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full px-3 py-2 app-input text-xs"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-2 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Filter by Tags
            </label>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {filters.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-semibold"
                >
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-rose-200">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = filters.tags?.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => (isSelected ? removeTag(tag) : addTag(tag))}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};