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

  const handleFilterChange = (
    key: keyof SearchFilters,
    value: SearchFilters[keyof SearchFilters]
  ) => {
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-soft-mist dark:border-white/[0.12] pb-4 mb-5 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-cards bg-lilac-mist flex items-center justify-center">
            <Filter className="w-5 h-5 text-royal-violet" />
          </div>
          <div>
            <h3 className="font-bold text-[17px] text-ink-charcoal dark:text-ink-light">
              Filter & Search
            </h3>
            <p className="text-[13px] text-stone-gray mt-0.5">
              Refine by keyword, category, status, or urgency
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearAllFilters}
            className="app-btn-ghost px-3.5 py-2 text-[13px] flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
          
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="app-btn-primary px-4 py-2 text-[13px] flex items-center gap-1.5"
          >
            {showAdvanced ? 'Hide Filters' : 'Advanced'}
          </button>
        </div>
      </div>

      {/* Distance Radius Pills */}
      <div className="mb-5 pb-4 border-b border-soft-mist dark:border-white/[0.08] flex flex-wrap items-center gap-2 text-[13px]">
        <span className="font-semibold text-ink-charcoal dark:text-ink-light flex items-center gap-1.5 mr-1">
          <Compass className="w-4 h-4 text-royal-violet" />
          Radius:
        </span>
        {[
          { label: 'All City', value: undefined },
          { label: '1 km', value: 1 },
          { label: '5 km', value: 5 },
          { label: '10 km', value: 10 },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => handleFilterChange('locationRadius', item.value)}
            className={`px-3.5 py-1.5 rounded-pill text-[13px] font-medium transition-all ${
              filters.locationRadius === item.value
                ? 'bg-lilac-mist text-ink-charcoal border border-royal-violet/20'
                : 'bg-warm-parchment dark:bg-white/[0.06] text-ink-charcoal dark:text-ink-light hover:bg-soft-mist dark:hover:bg-white/[0.10] border border-soft-mist dark:border-white/[0.10]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      
      {/* Primary Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="text-caption text-stone-gray block mb-1.5">Search</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-gray" />
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              placeholder="Title or street..."
              className="w-full pl-9 pr-3 py-2 app-input text-[13px]"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-caption text-stone-gray block mb-1.5">Status</label>
          <select
            value={filters.statusFilter}
            onChange={(e) => handleFilterChange('statusFilter', e.target.value)}
            className="w-full py-2 px-3 app-input text-[13px] font-medium cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Repair</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="text-caption text-stone-gray block mb-1.5">Category</label>
          <select
            value={filters.categoryFilter}
            onChange={(e) => handleFilterChange('categoryFilter', e.target.value)}
            className="w-full py-2 px-3 app-input text-[13px] font-medium cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="safety">Safety Hazard</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="environmental">Environmental</option>
            <option value="security">Public Security</option>
            <option value="maintenance">Maintenance</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="text-caption text-stone-gray block mb-1.5">Priority</label>
          <select
            value={filters.priorityFilter}
            onChange={(e) => handleFilterChange('priorityFilter', e.target.value)}
            className="w-full py-2 px-3 app-input text-[13px] font-medium cursor-pointer"
          >
            <option value="">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-5 pt-5 border-t border-soft-mist dark:border-white/[0.12] space-y-5">
          
          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-caption text-stone-gray block mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-royal-violet" />
                After Date
              </label>
              <input
                type="date"
                onChange={(e) => handleFilterChange('dateFrom', e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full px-3 py-2 app-input text-[13px]"
              />
            </div>
            <div>
              <label className="text-caption text-stone-gray block mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-royal-violet" />
                Before Date
              </label>
              <input
                type="date"
                onChange={(e) => handleFilterChange('dateTo', e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full px-3 py-2 app-input text-[13px]"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-caption text-stone-gray block mb-2 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-royal-violet" />
              Filter by Tags
            </label>
            
            {/* Active tags */}
            {filters.tags && filters.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {filters.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-lilac-mist text-royal-violet rounded-pill text-[13px] font-semibold"
                  >
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-midnight-wine">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = filters.tags?.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => (isSelected ? removeTag(tag) : addTag(tag))}
                    className={`px-3 py-1.5 rounded-pill text-[13px] font-medium transition-all ${
                      isSelected
                        ? 'bg-lilac-mist text-royal-violet border border-royal-violet/20'
                        : 'bg-warm-parchment dark:bg-white/[0.06] text-ink-charcoal dark:text-ink-light hover:bg-soft-mist dark:hover:bg-white/[0.10] border border-soft-mist dark:border-white/[0.10]'
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