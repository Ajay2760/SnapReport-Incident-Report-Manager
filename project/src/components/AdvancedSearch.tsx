import React, { useState } from 'react';
import { Search, Filter, Calendar, MapPin, Tag, X, RotateCcw, Compass } from 'lucide-react';
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
              Filter by Status, Category, Distance Radius & Gazette Tags
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

      {/* Citizen Feature: Distance Radius "Near Me" Pills */}
      <div className="mb-6 pb-4 border-b border-gold/30 flex flex-wrap items-center gap-3 font-mono text-xs">
        <span className="font-bold text-gold uppercase tracking-widest flex items-center gap-1.5 mr-2">
          <Compass className="w-4 h-4 text-gold" />
          📍 NEAR ME DISTANCE:
        </span>
        {[
          { label: 'ALL CITY', value: undefined },
          { label: 'WITHIN 1 KM', value: 1 },
          { label: 'WITHIN 5 KM', value: 5 },
          { label: 'WITHIN 10 KM', value: 10 },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => handleFilterChange('locationRadius', item.value)}
            className={`px-3 py-1 text-[11px] font-bold uppercase tracking-widest border transition-all ${
              filters.locationRadius === item.value
                ? 'bg-gold text-obsidian border-gold shadow-gold-glow-sm'
                : 'border-gold/40 text-pewter hover:border-gold hover:text-gold'
            }`}
          >
            {item.label}
          </button>
        ))}
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

        {/* Status Dropdown */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-gold/80 tracking-widest mb-1">
            STATUS FILTER
          </label>
          <select
            value={filters.statusFilter}
            onChange={(e) => handleFilterChange('statusFilter', e.target.value)}
            className="w-full py-2 bg-obsidian border-b-2 border-gold text-champagne font-mono text-sm focus:outline-none cursor-pointer uppercase font-bold tracking-wider"
          >
            <option value="" className="bg-charcoal text-champagne">✦ ALL STATUSES</option>
            <option value="open" className="bg-charcoal text-champagne">OPEN DISPATCHES</option>
            <option value="in-progress" className="bg-charcoal text-champagne">IN REPAIR</option>
            <option value="resolved" className="bg-charcoal text-champagne">RESOLVED & FIXED</option>
          </select>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-gold/80 tracking-widest mb-1">
            CATEGORY CLASSIFICATION
          </label>
          <select
            value={filters.categoryFilter}
            onChange={(e) => handleFilterChange('categoryFilter', e.target.value)}
            className="w-full py-2 bg-obsidian border-b-2 border-gold text-champagne font-mono text-sm focus:outline-none cursor-pointer uppercase font-bold tracking-wider"
          >
            <option value="" className="bg-charcoal text-champagne">✦ ALL CATEGORIES</option>
            <option value="safety" className="bg-charcoal text-champagne">SAFETY HAZARD</option>
            <option value="infrastructure" className="bg-charcoal text-champagne">INFRASTRUCTURE</option>
            <option value="environmental" className="bg-charcoal text-champagne">ENVIRONMENTAL</option>
            <option value="security" className="bg-charcoal text-champagne">PUBLIC SECURITY</option>
            <option value="maintenance" className="bg-charcoal text-champagne">MAINTENANCE</option>
            <option value="other" className="bg-charcoal text-champagne">OTHER DISPATCH</option>
          </select>
        </div>

        {/* Priority Dropdown */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-gold/80 tracking-widest mb-1">
            URGENCY PRIORITY
          </label>
          <select
            value={filters.priorityFilter}
            onChange={(e) => handleFilterChange('priorityFilter', e.target.value)}
            className="w-full py-2 bg-obsidian border-b-2 border-gold text-champagne font-mono text-sm focus:outline-none cursor-pointer uppercase font-bold tracking-wider"
          >
            <option value="" className="bg-charcoal text-champagne">✦ ALL PRIORITIES</option>
            <option value="critical" className="bg-charcoal text-champagne">CRITICAL EMERGENCY</option>
            <option value="high" className="bg-charcoal text-champagne">HIGH URGENCY</option>
            <option value="medium" className="bg-charcoal text-champagne">MEDIUM PRIORITY</option>
            <option value="low" className="bg-charcoal text-champagne">ROUTINE NOTICE</option>
          </select>
        </div>
      </div>

      {/* Expandable Advanced Section */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-gold/30 space-y-6">
          
          {/* Date Range Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gold/80 tracking-widest mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                REPORTED AFTER DATE
              </label>
              <input
                type="date"
                onChange={(e) => handleFilterChange('dateFrom', e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full px-3 py-2 art-deco-input text-sm text-champagne"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gold/80 tracking-widest mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                REPORTED BEFORE DATE
              </label>
              <input
                type="date"
                onChange={(e) => handleFilterChange('dateTo', e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full px-3 py-2 art-deco-input text-sm text-champagne"
              />
            </div>
          </div>

          {/* Tags Selection & Filter */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-gold/80 tracking-widest mb-2 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-gold" />
              FILTER BY GAZETTE INDEX TAGS
            </label>
            
            {/* Active Selected Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {filters.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gold text-obsidian font-mono text-xs uppercase font-bold tracking-widest"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-800"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            {/* Available Tags Selection Pills */}
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = filters.tags?.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => (isSelected ? removeTag(tag) : addTag(tag))}
                    className={`px-3 py-1 font-mono text-xs uppercase tracking-wider border transition-colors ${
                      isSelected
                        ? 'bg-gold text-obsidian font-bold border-gold'
                        : 'border-gold/40 text-champagne hover:border-gold hover:text-gold'
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