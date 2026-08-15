import React, { useState } from 'react';
import { MapPin, ThumbsUp, CheckCircle2 } from 'lucide-react';
import { Incident } from '../types/incident';

interface GazetteMapProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onCoSign?: (incidentId: string) => void;
}

export const GazetteMap: React.FC<GazetteMapProps> = ({
  incidents,
  onSelectIncident,
  onCoSign
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const getPinColor = (status: Incident['status']) => {
    switch (status) {
      case 'open': return 'bg-amber-500 text-white ring-amber-300';
      case 'in-progress': return 'bg-indigo-600 text-white ring-indigo-300';
      case 'resolved': return 'bg-emerald-500 text-white ring-emerald-300';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="app-card overflow-hidden mb-8 relative">
      {/* Map Control Bar */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
          <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Interactive City Incident Map</span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Open
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span> In Repair
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Resolved
          </span>
        </div>
      </div>

      {/* Map Canvas Background Container */}
      <div className="relative aspect-video sm:aspect-[21/9] bg-slate-100 dark:bg-slate-950 overflow-hidden flex items-center justify-center">
        {/* Grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40"></div>

        <p className="text-xs font-mono text-slate-400 dark:text-slate-600 uppercase tracking-widest absolute top-4 left-4">
          METROPOLITAN GRID SECTOR 04-A
        </p>

        {/* Incident Pins */}
        {incidents.map((incident, idx) => {
          // Calculate mock positions across canvas grid
          const leftPercent = 25 + (idx * 25) % 55;
          const topPercent = 30 + (idx * 20) % 45;

          return (
            <div
              key={incident.id}
              style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
            >
              <button
                onClick={() => setSelectedIncident(incident)}
                className={`p-2.5 rounded-2xl shadow-lg transition-transform duration-200 hover:scale-115 ring-4 ${getPinColor(incident.status)} flex items-center justify-center`}
                title={incident.title}
              >
                <MapPin className="w-5 h-5" />
              </button>

              {/* Pin Tooltip Hover Tag */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg whitespace-nowrap shadow-xl z-20">
                {incident.title}
              </div>
            </div>
          );
        })}

        {/* Selected Incident Popover */}
        {selectedIncident && (
          <div className="absolute bottom-4 right-4 left-4 sm:left-auto max-w-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-2xl z-30 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                  {selectedIncident.category}
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                  {selectedIncident.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
              {selectedIncident.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                📍 {selectedIncident.location}
              </span>
              <button
                onClick={() => onSelectIncident(selectedIncident)}
                className="app-btn-primary px-3 py-1 text-xs"
              >
                View Dispatch
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
