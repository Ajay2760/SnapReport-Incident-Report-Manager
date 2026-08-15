import React, { useState } from 'react';
import { MapPin, Navigation, Tag, Users, Eye, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
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

    const minLat = 40.70;
    const maxLat = 40.80;
    const minLng = -74.05;
    const maxLng = -73.90;

    const x = Math.min(90, Math.max(10, ((coords.lng - minLng) / (maxLng - minLng)) * 100));
    const y = Math.min(90, Math.max(10, 100 - ((coords.lat - minLat) / (maxLat - minLat)) * 100));
    return { x, y };
  };

  const getMarkerColor = (priority: Incident['priority'], status: Incident['status']) => {
    if (status === 'resolved') return 'bg-obsidian border-pewter text-pewter';
    if (priority === 'critical') return 'bg-gold text-obsidian border-gold animate-pulse shadow-gold-glow-lg';
    if (priority === 'high') return 'bg-midnight text-champagne border-gold/60';
    return 'bg-obsidian text-gold border-gold';
  };

  return (
    <div className="border border-gold bg-charcoal shadow-gold-glow-lg mb-10 overflow-hidden art-deco-corner-wrapper">
      {/* Map Control Header */}
      <div className="bg-obsidian text-champagne p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-mono text-xs border-b border-gold/40">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-gold" />
          <span className="font-serif font-bold tracking-widest uppercase text-gold">
            MUNICIPAL DISTRICT GAZETTE MAP (SECTOR 40.71° N, 74.00° W)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Zoom Controls */}
          <div className="flex items-center border border-gold/40 bg-obsidian text-gold">
            <button
              onClick={() => setZoomLevel(Math.min(1.4, zoomLevel + 0.15))}
              className="p-1.5 hover:bg-gold/20 border-r border-gold/40 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.15))}
              className="p-1.5 hover:bg-gold/20 border-r border-gold/40 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 hover:bg-gold/20 transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="bg-gold text-obsidian px-3 py-1 font-serif font-bold uppercase tracking-widest text-[11px] shadow-gold-glow-sm">
            {filteredIncidents.length} DISPATCH PINS PLOTTED
          </span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap border-b border-gold/30 bg-obsidian font-mono text-xs">
        {['all', 'safety', 'infrastructure', 'environmental', 'security', 'maintenance'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 uppercase font-bold tracking-wider border-r border-gold/30 transition-colors ${
              activeCategory === cat
                ? 'bg-gold text-obsidian shadow-gold-glow-sm'
                : 'text-pewter hover:text-gold hover:bg-gold/10'
            }`}
          >
            {cat === 'all' ? '✦ ALL SECTORS' : cat}
          </button>
        ))}
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="relative min-h-[420px] sm:min-h-[500px] bg-obsidian overflow-hidden select-none">
        
        {/* Art Deco Survey Grid Lines Background */}
        <div
          className="absolute inset-0 transition-transform duration-300"
          style={{
            transform: `scale(${zoomLevel})`,
            backgroundImage: `
              linear-gradient(to right, rgba(212, 175, 55, 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(212, 175, 55, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        >
          {/* Compass Rose Overlay */}
          <div className="absolute top-4 right-4 border border-gold/40 bg-obsidian/90 p-3 font-mono text-[10px] uppercase font-bold text-center tracking-widest text-gold shadow-gold-glow-sm">
            <div>N ▲</div>
            <div>W ◄ ✦ ► E</div>
            <div>S ▼</div>
          </div>

          {/* District Grid Labels */}
          <div className="absolute bottom-2 left-4 font-mono text-[10px] text-pewter uppercase tracking-widest">
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
                  className={`border p-2 flex items-center justify-center shadow-gold-glow-sm font-mono text-xs font-bold rotate-45 ${getMarkerColor(
                    incident.priority,
                    incident.status
                  )} ${isSelected ? 'ring-2 ring-gold-light' : ''}`}
                >
                  <MapPin className="w-4 h-4 -rotate-45" />
                </div>

                {/* Hover Label */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap border border-gold bg-obsidian text-gold font-serif text-[11px] uppercase px-3 py-1 z-20 pointer-events-none tracking-wider shadow-gold-glow-sm">
                  {incident.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Incident Popover Card Drawer (Bottom Left) */}
        {selectedIncident && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md border border-gold bg-charcoal p-5 shadow-gold-glow-lg z-40 art-deco-corner-wrapper">
            <div className="flex items-start justify-between gap-2 border-b border-gold/30 pb-2 mb-2 font-mono text-xs">
              <span className="bg-gold text-obsidian font-bold px-2 py-0.5 uppercase tracking-widest text-[10px]">
                PIN SELECTED • {selectedIncident.category.toUpperCase()}
              </span>
              <span className="font-bold text-gold uppercase tracking-wider">
                STATUS: {selectedIncident.status.toUpperCase()}
              </span>
            </div>

            <h4 className="font-serif font-bold text-lg text-gold uppercase leading-tight mb-2 tracking-wider">
              {selectedIncident.title}
            </h4>

            <p className="font-body text-xs text-champagne line-clamp-2 mb-4">
              {selectedIncident.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gold/30 font-mono text-xs">
              <button
                onClick={() => onCoSign(selectedIncident.id)}
                className="art-deco-btn-solid px-3 py-1 text-[11px] font-bold tracking-widest flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-obsidian" />
                CO-SIGN ({selectedIncident.coSignersCount || 1})
              </button>

              <button
                onClick={() => onSelectIncident(selectedIncident)}
                className="art-deco-btn-gold px-3 py-1 text-[11px] font-bold tracking-widest flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-gold" />
                VIEW DISPATCH
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="bg-obsidian p-4 border-t border-gold/40 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-champagne">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-serif font-bold uppercase text-gold tracking-widest">MAP LEGEND:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-gold inline-block border border-gold shadow-gold-glow-sm rotate-45"></span>
            CRITICAL HAZARD
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-midnight inline-block border border-gold/60 rotate-45"></span>
            HIGH / MEDIUM DISPATCH
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-obsidian inline-block border border-pewter rotate-45"></span>
            RESOLVED DISPATCH
          </span>
        </div>
        <span className="uppercase text-pewter tracking-wider">
          CLICK ANY PIN TO INSPECT DISPATCH RECORD
        </span>
      </div>
    </div>
  );
};
