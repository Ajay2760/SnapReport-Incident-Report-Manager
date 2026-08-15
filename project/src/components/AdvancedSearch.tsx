import React, { useState } from 'react';
import { Search, Filter, Calendar, MapPin, Tag, X, RotateCcw } from 'lucide-react';
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
  const [newTag, setNewTag] = useState('');

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const addTag = (tag: string) => {
    if (tag && !filters.tags?.includes(tag)) {
      handleFilterChange('tags', [...(filters.tags || []), tag]);
    }
    setNewTag('');
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
    <div className="border-2 border-[#111111] bg-white p-6 mb-8 hard-shadow">
      {/* Search Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#111111] pb-4 mb-5 gap-3">
        <div className="flex items-center gap-2">
          <div className="border border-[#111111] p-1.5 bg-[#F9F9F7]">
            <Filter className="w-4 h-4 text-[#111111]" />
          </div>
          <div>
            <h3 className="font-serif font-black text-xl uppercase text-[#111111] leading-none">
              THE GAZETTE INDEX & CLASSIFIED SEARCH
            </h3>
            <p className="text-xs font-mono text-neutral-500 uppercase mt-0.5">
              Filter by Status, Category, Priority & Publication Tag
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={clearAllFilters}
            className="border border-[#111111] px-3 py-1.5 uppercase hover:bg-[#111111] hover:text-white transition-all flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            CLEAR ALL
          </button>
          
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="border border-[#111111] bg-[#111111] text-white px-3 py-1.5 uppercase hover:bg-[#CC0000] transition-all font-bold"
          >
            {showAdvanced ? '[-] HIDE ADVANCED' : '[+] ADVANCED FILTERS'}
          </button>
        </div>
      </div>
      
      {/* Primary Search Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Term Input */}
        <div className="relative">
          <label className="block text-[10px] font-mono font-bold uppercase text-neutral-600 mb-1">
            KEYWORD SEARCH
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              placeholder="Search archive..."
              className="w-full pl-9 pr-3 py-2 border border-[#111111] font-mono text-sm bg-[#F9F9F7] text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
            />
          </div>
        </div>

        {/* Status Select */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-neutral-600 mb-1">
            DISPATCH STATUS
          </label>
          <select
            value={filters.statusFilter}
            onChange={(e) => handleFilterChange('statusFilter', e.target.value)}
            className="w-full px-3 py-2 border border-[#111111] font-mono text-sm bg-[#F9F9F7] text-[#111111] focus:bg-white focus:outline-none cursor-pointer uppercase"
          >
            <option value="">ALL STATUSES</option>
            <option value="open">OPEN (UNRESOLVED)</option>
            <option value="in-progress">IN PROGRESS</option>
            <option value="resolved">RESOLVED</option>
          </select>
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-neutral-600 mb-1">
            HAZARD CATEGORY
          </label>
          <select
            value={filters.categoryFilter}
            onChange={(e) => handleFilterChange('categoryFilter', e.target.value)}
            className="w-full px-3 py-2 border border-[#111111] font-mono text-sm bg-[#F9F9F7] text-[#111111] focus:bg-white focus:outline-none cursor-pointer uppercase"
          >
            <option value="">ALL CATEGORIES</option>
            <option value="safety">SAFETY</option>
            <option value="infrastructure">INFRASTRUCTURE</option>
            <option value="environmental">ENVIRONMENTAL</option>
            <option value="security">SECURITY</option>
            <option value="maintenance">MAINTENANCE</option>
            <option value="other">OTHER</option>
          </select>
        </div>

        {/* Priority Select */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-neutral-600 mb-1">
            URGENCY LEVEL
          </label>
          <select
            value={filters.priorityFilter}
            onChange={(e) => handleFilterChange('priorityFilter', e.target.value)}
            className="w-full px-3 py-2 border border-[#111111] font-mono text-sm bg-[#F9F9F7] text-[#111111] focus:bg-white focus:outline-none cursor-pointer uppercase"
          >
            <option value="">ALL PRIORITIES</option>
            <option value="low">LOW</option>
            <option value="medium">MEDIUM</option>
            <option value="high">HIGH</option>
            <option value="critical">CRITICAL</option>
          </select>
        </div>
      </div>

      {/* Advanced Drawer */}
      {showAdvanced && (
        <div className="space-y-4 pt-5 mt-5 border-t border-[#111111]">
          {/* Date Range Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#111111]" />
                REPORTED FROM DATE
              </label>
              <input
                type="date"
                value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-[#111111] font-mono text-sm bg-[#F9F9F7] text-[#111111] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#111111]" />
                REPORTED TO DATE
              </label>
              <input
                type="date"
                value={filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-[#111111] font-mono text-sm bg-[#F9F9F7] text-[#111111] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Location Radius */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#111111]" />
              LOCATION RADIUS (KILOMETERS)
            </label>
            <input
              type="number"
              value={filters.locationRadius || ''}
              onChange={(e) => handleFilterChange('locationRadius', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Enter radius in km..."
              min="1"
              max="100"
              className="w-full px-3 py-2 border border-[#111111] font-mono text-sm bg-[#F9F9F7] text-[#111111] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Tags Filter */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#111111]" />
              ACTIVE SEARCH TAGS
            </label>
            
            {/* Active Tags Pills */}
            <div className="flex flex-wrap gap-2 mb-3">
              {filters.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#111111] text-white font-mono text-xs uppercase font-bold"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-[#CC0000] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag(newTag)}
                placeholder="Type tag name..."
                className="flex-1 px-3 py-2 border border-[#111111] font-mono text-sm bg-[#F9F9F7] text-[#111111] focus:bg-white focus:outline-none"
              />
              <button
                onClick={() => addTag(newTag)}
                className="px-5 py-2 bg-[#111111] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-[#CC0000] transition-colors"
              >
                + ADD TAG
              </button>
            </div>

            {/* Popular Tags List */}
            {availableTags.length > 0 && (
              <div className="mt-3">
                <span className="text-[10px] font-mono uppercase text-neutral-500 mr-2">POPULAR INDEX TAGS:</span>
                <div className="inline-flex flex-wrap gap-1.5 mt-1">
                  {availableTags.slice(0, 10).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => addTag(tag)}
                      className="px-2 py-0.5 text-xs font-mono border border-neutral-300 bg-neutral-100 hover:border-[#111111] hover:bg-white transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};