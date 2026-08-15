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
    <div className="art-deco-card art-deco-corner-wrapper p-6 mb-10 shadow-gold-glow-sm">
      {/* Search Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gold/40 pb-4 mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="border border-gold p-2 bg-obsidian text-gold shadow-gold-glow-sm rotate-45">
            <Filter className="w-4 h-4 -rotate-45" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl uppercase tracking-widest text-gold leading-none">
              THE GAZETTE INDEX & CLASSIFIED SEARCH
            </h3>
            <p className="text-xs font-mono text-pewter uppercase tracking-wider mt-1">
              Filter by Status, Category, Urgency Level & Gazette Tags
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={clearAllFilters}
            className="border border-gold/50 text-gold px-3 py-1.5 uppercase hover:border-gold hover:bg-gold/10 transition-all flex items-center gap-1.5 tracking-wider"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            CLEAR ALL
          </button>
          
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="art-deco-btn-solid px-4 py-1.5 text-xs tracking-widest flex items-center gap-1"
          >
            {showAdvanced ? '[-] HIDE FILTERS' : '[+] ADVANCED FILTERS'}
          </button>
        </div>
      </div>
      
      {/* Primary Search Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Search Term Input */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-gold/80 tracking-widest mb-1">
            KEYWORD SEARCH
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-0 top-3 text-gold" />
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              placeholder="Search archive..."
              className="w-full pl-7 pr-3 py-2 art-deco-input text-sm text-champagne placeholder:text-pewter uppercase"
            />
          </div>
        </div>

        {/* Status Select */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-gold/80 tracking-widest mb-1">
            DISPATCH STATUS
          </label>
          <select
            value={filters.statusFilter}
            onChange={(e) => handleFilterChange('statusFilter', e.target.value)}
            className="w-full px-3 py-2 bg-obsidian border-b-2 border-gold text-champagne font-mono text-sm focus:outline-none focus:border-gold-light cursor-pointer uppercase tracking-wider"
          >
            <option value="" className="bg-charcoal text-champagne">ALL STATUSES</option>
            <option value="open" className="bg-charcoal text-champagne">OPEN (UNRESOLVED)</option>
            <option value="in-progress" className="bg-charcoal text-champagne">IN PROGRESS</option>
            <option value="resolved" className="bg-charcoal text-champagne">RESOLVED</option>
          </select>
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-gold/80 tracking-widest mb-1">
            HAZARD CATEGORY
          </label>
          <select
            value={filters.categoryFilter}
            onChange={(e) => handleFilterChange('categoryFilter', e.target.value)}
            className="w-full px-3 py-2 bg-obsidian border-b-2 border-gold text-champagne font-mono text-sm focus:outline-none focus:border-gold-light cursor-pointer uppercase tracking-wider"
          >
            <option value="" className="bg-charcoal text-champagne">ALL CATEGORIES</option>
            <option value="safety" className="bg-charcoal text-champagne">SAFETY</option>
            <option value="infrastructure" className="bg-charcoal text-champagne">INFRASTRUCTURE</option>
            <option value="environmental" className="bg-charcoal text-champagne">ENVIRONMENTAL</option>
            <option value="security" className="bg-charcoal text-champagne">SECURITY</option>
            <option value="maintenance" className="bg-charcoal text-champagne">MAINTENANCE</option>
            <option value="other" className="bg-charcoal text-champagne">OTHER</option>
          </select>
        </div>

        {/* Priority Select */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-gold/80 tracking-widest mb-1">
            URGENCY LEVEL
          </label>
          <select
            value={filters.priorityFilter}
            onChange={(e) => handleFilterChange('priorityFilter', e.target.value)}
            className="w-full px-3 py-2 bg-obsidian border-b-2 border-gold text-champagne font-mono text-sm focus:outline-none focus:border-gold-light cursor-pointer uppercase tracking-wider"
          >
            <option value="" className="bg-charcoal text-champagne">ALL PRIORITIES</option>
            <option value="low" className="bg-charcoal text-champagne">LOW</option>
            <option value="medium" className="bg-charcoal text-champagne">MEDIUM</option>
            <option value="high" className="bg-charcoal text-champagne">HIGH</option>
            <option value="critical" className="bg-charcoal text-champagne">CRITICAL</option>
          </select>
        </div>
      </div>

      {/* Advanced Drawer */}
      {showAdvanced && (
        <div className="space-y-6 pt-6 mt-6 border-t border-gold/30">
          {/* Date Range Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-gold tracking-widest mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                REPORTED FROM DATE
              </label>
              <input
                type="date"
                value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full px-3 py-2 art-deco-input font-mono text-sm text-champagne"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-gold tracking-widest mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                REPORTED TO DATE
              </label>
              <input
                type="date"
                value={filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full px-3 py-2 art-deco-input font-mono text-sm text-champagne"
              />
            </div>
          </div>

          {/* Location Radius */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-gold tracking-widest mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              LOCATION RADIUS (KILOMETERS)
            </label>
            <input
              type="number"
              value={filters.locationRadius || ''}
              onChange={(e) => handleFilterChange('locationRadius', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Enter radius in km..."
              min="1"
              max="100"
              className="w-full px-3 py-2 art-deco-input font-mono text-sm text-champagne placeholder:text-pewter"
            />
          </div>

          {/* Tags Filter */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-gold tracking-widest mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-gold" />
              ACTIVE SEARCH TAGS
            </label>
            
            {/* Active Tags Pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-obsidian text-gold border border-gold font-mono text-xs uppercase font-bold tracking-widest shadow-gold-glow-sm"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-gold-light transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag(newTag)}
                placeholder="Type tag name..."
                className="flex-1 px-3 py-2 art-deco-input font-mono text-sm text-champagne placeholder:text-pewter"
              />
              <button
                onClick={() => addTag(newTag)}
                className="art-deco-btn-gold px-5 py-2 text-xs"
              >
                + ADD TAG
              </button>
            </div>

            {/* Popular Tags List */}
            {availableTags.length > 0 && (
              <div className="mt-4">
                <span className="text-[10px] font-mono uppercase text-pewter tracking-widest mr-2">POPULAR INDEX TAGS:</span>
                <div className="inline-flex flex-wrap gap-2 mt-1">
                  {availableTags.slice(0, 10).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => addTag(tag)}
                      className="px-2.5 py-1 text-xs font-mono border border-gold/30 bg-obsidian text-gold hover:border-gold hover:bg-gold/10 transition-colors tracking-wider"
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