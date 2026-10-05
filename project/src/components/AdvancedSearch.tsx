import React, { useState } from 'react';
import { Search, SlidersHorizontal, Calendar, Tag, X, RotateCcw, Compass } from 'lucide-react';
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

  const handleFilterChange = (key: keyof SearchFilters, value: SearchFilters[keyof SearchFilters]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const addTag = (tag: string) => {
    if (tag && !filters.tags?.includes(tag)) handleFilterChange('tags', [...(filters.tags || []), tag]);
  };
  const removeTag = (tagToRemove: string) => {
    handleFilterChange('tags', filters.tags?.filter((t) => t !== tagToRemove) || []);
  };
  const clearAllFilters = () => {
    onFiltersChange({ searchTerm: '', statusFilter: '', categoryFilter: '', priorityFilter: '', dateFrom: undefined, dateTo: undefined, locationRadius: undefined, tags: [] });
  };

  const activeCount = [filters.statusFilter, filters.categoryFilter, filters.priorityFilter, filters.locationRadius, filters.dateFrom, filters.dateTo, filters.tags?.length ? 't' : ''].filter(Boolean).length + (filters.searchTerm ? 1 : 0);

  return (
    <div className="bezel">
      <div className="bezel-inner p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center" style={{ borderColor: 'var(--border-default)' }}>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: 'var(--surface)', color: 'var(--accent-bright)' }}>
              <SlidersHorizontal className="h-5 w-5" />
            </span>
            <div>
              <h3 className="flex items-center gap-2 text-[15px] font-bold">
                Filter & search
                {activeCount > 0 && <span className="badge badge-accent !px-2.5 !py-0.5 !text-[11px] tabular">{activeCount} active</span>}
              </h3>
              <p className="text-body-sm">Refine by keyword, category, status or urgency</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={clearAllFilters} className="btn btn-ghost !min-h-[38px] px-3.5 py-2 text-[13px]">
              <RotateCcw className="h-3.5 w-3.5" /> Clear
            </button>
            <button onClick={() => setShowAdvanced(!showAdvanced)} className={`btn !min-h-[38px] px-4 py-2 text-[13px] ${showAdvanced ? 'btn-secondary' : 'btn-primary'}`}>
              {showAdvanced ? 'Hide filters' : 'Advanced'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b py-4 text-[13.5px]" style={{ borderColor: 'var(--border-default)' }}>
          <span className="mr-1 flex items-center gap-1.5 font-bold" style={{ color: 'var(--foreground-muted)' }}>
            <Compass className="h-4 w-4" style={{ color: 'var(--accent-bright)' }} /> Radius:
          </span>
          {[{ label: 'All city', value: undefined }, { label: '1 km', value: 1 }, { label: '5 km', value: 5 }, { label: '10 km', value: 10 }].map((item) => (
            <button key={item.label} onClick={() => handleFilterChange('locationRadius', item.value)}
              className="rounded-full px-4 py-1.5 text-[13px] font-bold transition-all duration-300"
              style={filters.locationRadius === item.value
                ? { background: 'var(--accent)', color: '#fff', boxShadow: '0 6px 18px -6px var(--accent-glow)' }
                : { background: 'var(--surface)', color: 'var(--foreground-muted)', border: '1px solid var(--border-default)' }}>
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3.5 pt-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="field">
            <label className="text-caption">Search</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--foreground-subtle)' }} />
              <input type="text" value={filters.searchTerm} onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                placeholder="Title, street, keyword…" className="field-input !rounded-full !py-2.5 pl-10 text-[13.5px]" />
            </div>
          </div>
          {([
            { k: 'statusFilter', label: 'Status', opts: [['', 'All statuses'], ['open', 'Open'], ['in-progress', 'In repair'], ['resolved', 'Resolved']] },
            { k: 'categoryFilter', label: 'Category', opts: [['', 'All categories'], ['safety', 'Safety'], ['infrastructure', 'Infrastructure'], ['environmental', 'Environmental'], ['security', 'Security'], ['maintenance', 'Maintenance'], ['other', 'Other']] },
            { k: 'priorityFilter', label: 'Priority', opts: [['', 'All priorities'], ['critical', 'Critical'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low']] },
          ] as const).map((f) => (
            <div key={f.k} className="field">
              <label className="text-caption">{f.label}</label>
              <select value={filters[f.k] as string} onChange={(e) => handleFilterChange(f.k, e.target.value)}
                className="field-input field-select !rounded-full !py-2.5 text-[13.5px]">
                {f.opts.map(([v, l]) => <option key={v || l} value={v}>{l}</option>)}
              </select>
            </div>
          ))}
        </div>

        {showAdvanced && (
          <div className="mt-4 space-y-4 border-t pt-4" style={{ borderColor: 'var(--border-default)' }}>
            <div className="grid gap-3.5 sm:grid-cols-2">
              {([
                { k: 'dateFrom', label: 'After date' },
                { k: 'dateTo', label: 'Before date' },
              ] as const).map((d) => (
                <div key={d.k} className="field">
                  <label className="text-caption flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" style={{ color: 'var(--accent-bright)' }} /> {d.label}</label>
                  <input type="date" onChange={(e) => handleFilterChange(d.k, e.target.value ? new Date(e.target.value) : undefined)}
                    className="field-input !rounded-full !py-2.5 text-[13.5px]" style={{ colorScheme: 'light dark' }} />
                </div>
              ))}
            </div>
            <div>
              <label className="text-caption flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" style={{ color: 'var(--accent-bright)' }} /> Filter by tags</label>
              {filters.tags && filters.tags.length > 0 && (
                <div className="mb-2.5 mt-2 flex flex-wrap gap-1.5">
                  {filters.tags.map((tag) => (
                    <span key={tag} className="badge badge-accent !text-[12.5px]">
                      #{tag}
                      <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}><X className="h-3.5 w-3.5" /></button>
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {availableTags.length === 0 && <span className="text-body-sm">No tags yet — they appear after reports add them.</span>}
                {availableTags.map((tag) => {
                  const sel = filters.tags?.includes(tag);
                  return (
                    <button key={tag} type="button" onClick={() => (sel ? removeTag(tag) : addTag(tag))}
                      className="rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition-all duration-300"
                      style={sel
                        ? { background: 'var(--accent-glow)', border: '1px solid var(--border-accent)', color: 'var(--foreground)' }
                        : { background: 'var(--surface)', border: '1px solid var(--border-default)', color: 'var(--foreground-muted)' }}>
                      #{tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
