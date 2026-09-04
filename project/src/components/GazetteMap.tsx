import React, { useState } from 'react';
import { MapPin, ThumbsUp } from 'lucide-react';
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
      case 'open': return 'bg-amber-alert text-black';
      case 'in-progress': return 'bg-signal-blue text-white';
      case 'resolved': return 'bg-emerald-500 text-white';
      default: return 'bg-steel text-white';
    }
  };

  return (
    <div className="app-card overflow-hidden mb-8 relative">
      {/* Control Bar */}
      <div className="p-4 border-b border-silver/30 dark:border-white/[0.08] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 font-bold text-[15px] text-black dark:text-white tracking-tight-sm">
          <MapPin className="w-4 h-4 text-signal-blue" />
          <span>City Incident Map</span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[13px] font-medium text-steel">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-alert inline-block"></span> Open
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-signal-blue inline-block"></span> In Repair
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Resolved
          </span>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative aspect-video sm:aspect-[21/9] bg-linen dark:bg-midnight-ink overflow-hidden flex items-center justify-center">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cfcfcf_1px,transparent_1px),linear-gradient(to_bottom,#cfcfcf_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>

        <p className="text-[11px] font-medium text-steel tracking-widest uppercase absolute top-4 left-4">
          Metropolitan Grid Sector 04-A
        </p>

        {/* Pins */}
        {incidents.map((incident, idx) => {
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
                className={`p-2.5 rounded-pill shadow-subtle-2 transition-transform duration-200 hover:scale-110 ${getPinColor(incident.status)} flex items-center justify-center`}
                title={incident.title}
              >
                <MapPin className="w-5 h-5" />
              </button>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black dark:bg-white text-white dark:text-black text-[11px] font-semibold py-1.5 px-3 rounded-pill whitespace-nowrap z-20" style={{ boxShadow: 'var(--shadow-floating)' }}>
                {incident.title}
              </div>
            </div>
          );
        })}

        {/* Selected Popover */}
        {selectedIncident && (
          <div className="absolute bottom-4 right-4 left-4 sm:left-auto max-w-sm app-card-floating p-4 z-30 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-micro text-signal-blue">
                  {selectedIncident.category}
                </span>
                <h4 className="font-bold text-[15px] text-black dark:text-white mt-0.5 tracking-tight-xs">
                  {selectedIncident.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-steel hover:text-black dark:hover:text-white text-[13px] font-bold ml-3"
              >
                ✕
              </button>
            </div>

            <p className="text-[13px] text-steel line-clamp-2">
              {selectedIncident.description}
            </p>

            <div className="flex items-center justify-between pt-2.5 border-t border-silver/30 dark:border-white/[0.08]">
              <span className="text-[13px] font-medium text-steel">
                📍 {selectedIncident.location}
              </span>
              <button
                onClick={() => onSelectIncident(selectedIncident)}
                className="app-btn-primary px-3.5 py-1.5 text-[13px]"
              >
                View
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
