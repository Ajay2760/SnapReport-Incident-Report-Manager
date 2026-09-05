import React, { useRef, useState, useEffect, useLayoutEffect, useMemo } from 'react';
import {
  MapPin,
  Plus,
  Minus,
  Layers,
  Focus,
  LocateFixed,
  ArrowRight,
  ThumbsUp,
  X,
} from 'lucide-react';
import { Incident } from '../types/incident';

interface GazetteMapProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onCoSign?: (incidentId: string) => void;
}

const CITY_CENTER = { lat: 40.7282, lng: -73.9941 };
const MIN_SCALE = 1400;
const MAX_SCALE = 60000;

const STATUS_META: Record<
  Incident['status'],
  { label: string; dot: string; pin: string }
> = {
  open: {
    label: 'Open',
    dot: 'bg-midnight-wine',
    pin: 'bg-midnight-wine text-white',
  },
  'in-progress': {
    label: 'In Repair',
    dot: 'bg-royal-violet',
    pin: 'bg-royal-violet text-white',
  },
  resolved: {
    label: 'Resolved',
    dot: 'bg-deep-lagoon',
    pin: 'bg-deep-lagoon text-white',
  },
};

export const GazetteMap: React.FC<GazetteMapProps> = ({
  incidents,
  onSelectIncident,
  onCoSign,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 440 });

  const defaultCenter = useMemo(() => {
    if (incidents.length === 0) return CITY_CENTER;
    const lats = incidents.map((i) => i.coordinates?.lat ?? CITY_CENTER.lat);
    const lngs = incidents.map((i) => i.coordinates?.lng ?? CITY_CENTER.lng);
    return {
      lat: (Math.min(...lats) + Math.max(...lats)) / 2,
      lng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
    };
  }, [incidents]);

  const [center, setCenter] = useState(defaultCenter);
  const [scale, setScale] = useState(4200);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<Incident | null>(null);
  const [activeStatuses, setActiveStatuses] = useState<
    Record<Incident['status'], boolean>
  >({ open: true, 'in-progress': true, resolved: true });
  const [showDecor, setShowDecor] = useState(true);

  const dragState = useRef<{
    dragging: boolean;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  }>({ dragging: false, startX: 0, startY: 0, originX: 0, originY: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () =>
      setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fitBounds = () => {
    if (incidents.length === 0) {
      setCenter(CITY_CENTER);
      setScale(4200);
      setOffset({ x: 0, y: 0 });
      return;
    }
    const hasCoords = incidents.filter((i) => i.coordinates);
    if (hasCoords.length === 0) return;
    const lats = hasCoords.map((i) => i.coordinates!.lat);
    const lngs = hasCoords.map((i) => i.coordinates!.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const cLat = (minLat + maxLat) / 2;
    const cLng = (minLng + maxLng) / 2;
    const cos = Math.cos((cLat * Math.PI) / 180) || 1;
    const spanLat = Math.max(maxLat - minLat, 0.012);
    const spanLng = Math.max(maxLng - minLng, 0.012);
    const nextScale = Math.max(
      MIN_SCALE,
      Math.min(
        (size.w * 0.6) / (spanLng * cos),
        (size.h * 0.58) / spanLat,
        MAX_SCALE
      )
    );
    setCenter({ lat: cLat, lng: cLng });
    setScale(nextScale);
    setOffset({ x: 0, y: 0 });
  };

  useLayoutEffect(() => {
    fitBounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.w, size.h]);

  const clampScale = (value: number) =>
    Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));

  const project = (lat: number, lng: number) => {
    const cos = Math.cos((center.lat * Math.PI) / 180) || 1;
    return {
      x: size.w / 2 + (lng - center.lng) * scale * cos + offset.x,
      y: size.h / 2 - (lat - center.lat) * scale + offset.y,
    };
  };

  const zoomBy = (factor: number) => {
    setScale((prev) => clampScale(prev * factor));
    setOffset((prev) => ({
      x: prev.x * factor,
      y: prev.y * factor,
    }));
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.24 : 0.81;
    const next = clampScale(scale * factor);
    const k = next / scale;
    setOffset({
      x: px - (px - offset.x) * k,
      y: py - (py - offset.y) * k,
    });
    setScale(next);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setOffset({
      x: dragState.current.originX + dx,
      y: dragState.current.originY + dy,
    });
  };

  const endDrag = () => {
    dragState.current.dragging = false;
  };

  const toggleStatus = (status: Incident['status']) => {
    setActiveStatuses((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  const visibleIncidents = incidents.filter(
    (i) => i.coordinates && activeStatuses[i.status]
  );

  const metersPerPixel = 111320 / scale;
  const scaleLabel =
    metersPerPixel >= 1000
      ? (metersPerPixel / 1000).toFixed(1) + ' km'
      : (Math.round(metersPerPixel / 10) * 10) + ' m';

  return (
    <div className="app-card overflow-hidden mb-8">
      {/* Control Bar */}
      <div className="p-4 sm:p-5 border-b border-soft-mist dark:border-white/[0.12] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-cards bg-lilac-mist flex items-center justify-center">
            <MapPin className="w-5 h-5 text-royal-violet" />
          </div>
          <div>
            <h3 className="text-heading-sm">City Incident Map</h3>
            <p className="text-caption">
              {visibleIncidents.length} pins in view Â· drag to pan Â· scroll to
              zoom {visibleIncidents.length === 0 && (
                <span className="text-stone-gray/60 text-xs">
                  No pins match current filters. Adjust status/range.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Legend / layer toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(STATUS_META) as Incident['status'][]).map((status) => {
            const meta = STATUS_META[status];
            const count = incidents.filter((i) => i.status === status).length;
            const active = activeStatuses[status];
            return (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                title={"Toggle " + meta.label + " layer"}
                className={`px-4 py-2 rounded-xl text-[13px] font-medium flex items-center gap-2 transition-all border ${
                  active
                    ? 'bg-lilac-mist text-ink-charcoal border-soft-mist dark:border-white/[0.12]'
                    : 'bg-transparent border-transparent text-stone-gray opacity-50'}
                  style={{
                    minHeight: '44px',
                    minWidth: '120px'
                  }}
                }
              >
                <span
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: '999px',
                    backgroundColor:
                      meta.dot === 'bg-midnight-wine'
                        ? '#421d24'
                        : meta.dot === 'bg-royal-violet'
                        ? '#714cb6'
                        : '#0c4243',
                }}
                />
                {meta.label} Â· {count}
              </button>
            );
          })}
          <button
            onClick={() => setShowDecor((v) => !v)}
            title="Toggle streets & labels"
            className="px-4 py-2 rounded-xl text-[13px] font-medium flex items-center gap-2 transition-all border " + (showDecor ? "bg-lilac-mist text-ink-charcoal border-soft-mist dark:border-white/[0.12]" : "bg-transparent border-transparent text-stone-gray opacity-50")
                style={{
                  minHeight: '44px',
                  minWidth: '100px'
                }}
          >
            <Layers className="w-4 h-4" />
            Streets
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div
        ref={containerRef}
        className="relative h-[360px] sm:h-[400px] lg:h-[480px] bg-warm-parchment dark:bg-canvas-dark overflow-hidden cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onWheel={handleWheel}
      >
        {/* Decor layer */}
        {showDecor && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e3e3e2_1px,transparent_1px),linear-gradient(to_bottom,#e3e3e2_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            <div className="absolute left-[12%] right-[8%] top-[36%] h-[2px] bg-soft-mist dark:bg-white/[0.05] rotate-[-5deg]" />
            <div className="absolute left-[6%] right-[16%] top-[64%] h-[2px] bg-soft-mist dark:bg-white/[0.05] rotate-[3deg]" />
            <div className="absolute left-[28%] top-[8%] bottom-[10%] w-[2px] bg-soft-mist dark:bg-white/[0.05] rotate-[7deg]" />
            <div className="absolute left-[58%] top-[6%] bottom-[14%] w-[2px] bg-soft-mist dark:bg-white/[0.05] rotate-[-6deg]" />
            <div className="absolute top-4 left-4 text-caption text-stone-gray uppercase tracking-widest">
              Metropolitan Grid Â· Sector 04-A
            </div>
            <div className="absolute top-4 right-44 text-caption text-stone-gray font-mono">
              {center.lat.toFixed(4)}Â°, {center.lng.toFixed(4)}Â°
            </div>
          </div>
        )}

        {/* Pins */}
        {visibleIncidents.map((incident) => {
          const coord = incident.coordinates!;
          const pos = project(coord.lat, coord.lng);
          if (pos.x < -60 || pos.x > size.w + 60 || pos.y < -60 || pos.y > size.h + 60)
            return null;
          const meta = STATUS_META[incident.status];
          const isSelected = selected?.id === incident.id;
          return (
            <div
              key={incident.id}
              className="absolute -translate-x-1/2 -translate-y-full group"
              style={{ left: pos.x, top: pos.y }}
            >
              {incident.status === 'open' && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-midnight-wine/60 animate-ping" />
              )}
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setSelected(incident)}
                title={incident.title}
                className="relative p-2.5 rounded-pill " + meta.pin + " shadow-subtle flex items-center justify-center transition-transform duration-200 hover:scale-110 " + (isSelected ? "scale-110 ring-2 ring-lilac-mist" : "")
              >
                <MapPin className="w-5 h-5" />
              </button>
              <span className="absolute left-1/2 top-full -translate-x-1/2 mt-1 hidden group-hover:block bg-ink-charcoal dark:bg-white text-white dark:text-ink-charcoal text-[11px] font-semibold py-1.5 px-3 rounded-pill whitespace-nowrap z-20 shadow-subtle">
                {incident.title}
              </span>
            </div>
          );
        })}

        {/* Selected Popover */}
        {selected && (
          <div className="absolute bottom-4 right-4 left-4 sm:left-auto sm:w-[340px] app-card-floating p-5 z-30 space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full inline-block " + STATUS_META[selected.status].dot />
                <span className="text-caption text-stone-gray uppercase tracking-wide">
                  {STATUS_META[selected.status].label} Â· {selected.category}
                </span>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-stone-gray hover:text-ink-charcoal dark:hover:text-white transition-colors"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h4 className="text-heading-sm leading-snug">{selected.title}</h4>
            <p className="text-body-sm text-stone-gray line-clamp-2">
              {selected.description}
            </p>

            <div className="flex items-center gap-1.5 text-[13px] text-stone-gray">
              <MapPin className="w-3.5 h-3.5 text-royal-violet shrink-0" />
              <span className="truncate">{selected.location}</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-soft-mist dark:border-white/[0.12] gap-2">
              <button
                onClick={() => {
                  if (onCoSign) onCoSign(selected.id);
                }}
                className="app-btn-outline px-3.5 py-2 text-[13px] flex items-center gap-1.5"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                Co-sign ({selected.coSignersCount || 0})
              </button>
              <button
                onClick={() => onSelectIncident(selected)}
                className="app-btn-primary px-3.5 py-2 text-[13px] flex items-center gap-1.5"
              >
                View report
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute right-3 top-14 flex flex-col gap-1.5">
          <button
            onClick={() => zoomBy(1.5)}
            title="Zoom in"
            className="w-9 h-9 bg-paper-white dark:bg-card-dark border border-soft-mist dark:border-white/[0.14] rounded-xl text-ink-charcoal dark:text-ink-light flex items-center justify-center hover:bg-warm-parchment dark:hover:bg-white/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => zoomBy(0.67)}
            title="Zoom out"
            className="w-9 h-9 bg-paper-white dark:bg-card-dark border border-soft-mist dark:border-white/[0.14] rounded-xl text-ink-charcoal dark:text-ink-light flex items-center justify-center hover:bg-warm-parchment dark:hover:bg-white/10 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={fitBounds}
            title="Fit to reports"
            className="w-9 h-9 bg-paper-white dark:bg-card-dark border border-soft-mist dark:border-white/[0.14] rounded-xl text-ink-charcoal dark:text-ink-light flex items-center justify-center hover:bg-warm-parchment dark:hover:bg-white/10 transition-colors"
          >
            <Focus className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setCenter(CITY_CENTER);
              setOffset({ x: 0, y: 0 });
              setScale(5200);
            }}
            title="My city"
            className="w-9 h-9 bg-paper-white dark:bg-card-dark border border-soft-mist dark:border-white/[0.14] rounded-xl text-ink-charcoal dark:text-ink-light flex items-center justify-center hover:bg-warm-parchment dark:hover:bg-white/10 transition-colors"
          >
            <LocateFixed className="w-4 h-4" />
          </button>
        </div>

        {/* Scale bar */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[11px] font-medium text-stone-gray">
          <span className="w-10 h-[3px] bg-royal-violet/70 rounded-pill inline-block" />
          {scaleLabel}
          <span>Â· {Math.round((scale / MAX_SCALE) * 100)}% zoom</span>
        </div>
      </div>
    </div>
  );
};
