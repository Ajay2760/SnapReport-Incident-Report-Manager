import React, { useState } from 'react';
import { MapPin, Navigation, AlertTriangle, CheckCircle, Tag, Users, Eye, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Incident } from '../types/incident';

interface GazetteMapProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onCoSign: (incidentId: string) => void;
}

export const GazetteMap: React.FC<GazetteMapProps> = ({
  incidents,
  onSelectIncident,
  onCoSign
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    incidents.length > 0 ? incidents[0] : null
  );
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const filteredIncidents = incidents.filter(
    (inc) => activeCategory === 'all' || inc.category === activeCategory
  );

  // Normalize lat/lng to grid percentages for responsive plotting
  const getNormalizedPos = (coords?: { lat: number; lng: number }, idx: number = 0) => {
    if (!coords) {
      const fallbackPositions = [
        { x: 30, y: 40 },
        { x: 65, y: 30 },
        { x: 45, y: 70 },
        { x: 75, y: 65 },
        { x: 20, y: 75 }
      ];
      return fallbackPositions[idx % fallbackPositions.length];
    }

    // Default bounds (e.g. NYC area bounds ~ lat 40.7 to 40.8, lng -74.05 to -73.9)
    const minLat = 40.70;
    const maxLat = 40.80;
    const minLng = -74.05;
    const maxLng = -73.90;

    const x = Math.min(90, Math.max(10, ((coords.lng - minLng) / (maxLng - minLng)) * 100));
    const y = Math.min(90, Math.max(10, 100 - ((coords.lat - minLat) / (maxLat - minLat)) * 100));
    return { x, y };
  };

  const getMarkerColor = (priority: Incident['priority'], status: Incident['status']) => {
    if (status === 'resolved') return 'bg-neutral-300 border-[#111111] text-[#111111]';
    if (priority === 'critical') return 'bg-[#CC0000] border-[#CC0000] text-white animate-pulse';
    if (priority === 'high') return 'bg-[#111111] border-[#111111] text-white';
    return 'bg-white border-[#111111] text-[#111111]';
  };

  return (
    <div className="border-4 border-[#111111] bg-white hard-shadow mb-10 overflow-hidden newsprint-texture">
      {/* Map Control Header */}
      <div className="bg-[#111111] text-white p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-mono text-xs border-b-2 border-[#111111]">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#CC0000]" />
          <span className="font-bold tracking-widest uppercase">
            MUNICIPAL DISTRICT GAZETTE MAP (SECTOR 40.71° N, 74.00° W)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center border border-neutral-700 bg-black">
            <button
              onClick={() => setZoomLevel(Math.min(1.4, zoomLevel + 0.15))}
              className="p-1.5 hover:text-[#CC0000] border-r border-neutral-700"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.15))}
              className="p-1.5 hover:text-[#CC0000] border-r border-neutral-700"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 hover:text-[#CC0000]"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="bg-[#CC0000] text-white px-2 py-1 font-bold uppercase">
            {filteredIncidents.length} DISPATCH PINS PLOTTED
          </span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap border-b border-[#111111] bg-[#F9F9F7] font-mono text-xs">
        {['all', 'safety', 'infrastructure', 'environmental', 'security', 'maintenance'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 uppercase font-bold border-r border-[#111111] transition-colors ${
              activeCategory === cat
                ? 'bg-[#111111] text-white'
                : 'text-[#111111] hover:bg-neutral-200'
            }`}
          >
            {cat === 'all' ? '✦ ALL SECTORS' : cat}
          </button>
        ))}
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="relative min-h-[420px] sm:min-h-[500px] bg-[#F9F9F7] overflow-hidden select-none">
        
        {/* Newsprint Survey Grid Lines Background */}
        <div
          className="absolute inset-0 transition-transform duration-300"
          style={{
            transform: `scale(${zoomLevel})`,
            backgroundImage: `
              linear-gradient(to right, rgba(17, 17, 17, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(17, 17, 17, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        >
          {/* Compass Rose Overlay */}
          <div className="absolute top-4 right-4 border border-[#111111] bg-white p-2 font-mono text-[10px] uppercase font-bold text-center tracking-widest shadow-sm">
            <div>N ▲</div>
            <div>W ◄ ✚ ► E</div>
            <div>S ▼</div>
          </div>

          {/* District Grid Labels */}
          <div className="absolute bottom-2 left-4 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            GRID SECTOR 40.71° N, 74.00° W • SCALE 1:5000
          </div>

          {/* Incident Pins */}
          {filteredIncidents.map((incident, idx) => {
            const pos = getNormalizedPos(incident.coordinates, idx);
            const isSelected = selectedIncident?.id === incident.id;

            return (
              <div
                key={incident.id}
                onClick={() => setSelectedIncident(incident)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 group z-10 ${
                  isSelected ? 'z-30 scale-125' : 'hover:scale-115'
                }`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                {/* Pin Box */}
                <div
                  className={`border-2 p-1.5 flex items-center justify-center shadow-md font-mono text-xs font-bold ${getMarkerColor(
                    incident.priority,
                    incident.status
                  )} ${isSelected ? 'ring-4 ring-[#111111]' : ''}`}
                >
                  <MapPin className="w-4 h-4" />
                </div>

                {/* Hover Label */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap border border-[#111111] bg-[#111111] text-white font-mono text-[10px] uppercase px-2 py-0.5 z-20 pointer-events-none">
                  {incident.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Incident Popover Card Drawer (Bottom Left) */}
        {selectedIncident && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md border-2 border-[#111111] bg-white p-4 hard-shadow-lg z-40 newsprint-texture">
            <div className="flex items-start justify-between gap-2 border-b border-[#111111] pb-2 mb-2 font-mono text-xs">
              <span className="bg-[#CC0000] text-white font-bold px-2 py-0.5 uppercase tracking-widest text-[10px]">
                PIN SELECTED • {selectedIncident.category.toUpperCase()}
              </span>
              <span className="font-bold text-[#111111] uppercase">
                STATUS: {selectedIncident.status.toUpperCase()}
              </span>
            </div>

            <h4 className="font-serif font-black text-lg text-[#111111] uppercase leading-tight mb-2">
              {selectedIncident.title}
            </h4>

            <p className="font-body text-xs text-neutral-800 line-clamp-2 mb-3">
              {selectedIncident.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-200 font-mono text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onCoSign(selectedIncident.id)}
                  className="bg-[#111111] text-white px-2.5 py-1 text-[11px] uppercase font-bold hover:bg-[#CC0000] transition-colors flex items-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" />
                  CO-SIGN ({selectedIncident.coSignersCount || 1})
                </button>
              </div>

              <button
                onClick={() => onSelectIncident(selectedIncident)}
                className="border border-[#111111] px-3 py-1 text-[11px] font-bold uppercase hover:bg-neutral-200 transition-colors flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                VIEW DISPATCH
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="bg-[#F9F9F7] p-3 border-t border-[#111111] flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-neutral-700">
        <div className="flex items-center gap-4">
          <span className="font-bold uppercase text-[#111111]">MAP LEGEND:</span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-[#CC0000] inline-block border border-[#111111]"></span>
            CRITICAL HAZARD
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-[#111111] inline-block border border-[#111111]"></span>
            HIGH / MEDIUM DISPATCH
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-neutral-300 inline-block border border-[#111111]"></span>
            RESOLVED DISPATCH
          </span>
        </div>
        <span className="uppercase text-neutral-500">
          CLICK ANY PIN TO INSPECT DISPATCH RECORD
        </span>
      </div>
    </div>
  );
};
