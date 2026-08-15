import React, { useState } from "react";
import { Plus, Zap, Users, Camera, TrendingUp, AlertCircle, Radio, Newspaper, Map, LayoutList, PhoneCall, ShieldAlert, X } from "lucide-react";
import {
  Incident,
  Solution,
  IncidentFormData,
  SearchFilters,
} from "./types/incident";
import { IncidentForm } from "./components/IncidentForm";
import { IncidentCard } from "./components/IncidentCard";
import { AdvancedSearch } from "./components/AdvancedSearch";
import { Dashboard } from "./components/Dashboard";
import { GazetteMap } from "./components/GazetteMap";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationBell } from "./components/NotificationBell";
import { ThemeToggle } from "./components/ThemeToggle";

// Realistic Mock Incidents with Coordinates & Before/After Proof Photos
const mockIncidents: Incident[] = [
  {
    id: "1",
    title: "Pothole on Main Street Causing Hazardous Travel",
    description:
      "Large pothole causing vehicle damage near the intersection of Main St and Oak Ave. Multiple motor vehicles have suffered tire blowouts. Urgent municipal road repair required.",
    category: "infrastructure",
    priority: "high",
    status: "open",
    location: "Main Street & Oak Avenue",
    coordinates: { lat: 40.7128, lng: -74.006 },
    reportedBy: "John Smith",
    reportedAt: new Date("2024-01-15T10:30:00"),
    coSignersCount: 14,
    affectsMeCount: 42,
    eta: "Within 24 Hours",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg",
    isVerified: true,
    tags: ["road", "damage", "urgent"],
    solutions: [
      {
        id: "1",
        author: "City Engineer Dept.",
        content:
          "Dispatched inspection team. Temporary safety cones placed today; full asphalt resurfacing scheduled for next Tuesday.",
        createdAt: new Date("2024-01-15T14:00:00"),
        helpful: 8,
        unhelpful: 0,
      },
    ],
    imageUrl:
      "https://i.postimg.cc/52dvv590/download-3.jpg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "2",
    title: "Streetlight Outage Spans Full Elm Street Corridor",
    description:
      "Primary overhead illumination is non-functional on Elm Street between 5th and 6th, presenting nighttime safety hazards for pedestrians and cyclists.",
    category: "safety",
    priority: "medium",
    status: "in-progress",
    location: "Elm Street between 5th and 6th",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    reportedBy: "Sarah Johnson",
    reportedAt: new Date("2024-01-14T18:45:00"),
    coSignersCount: 8,
    affectsMeCount: 24,
    eta: "Within 48 Hours",
    isVerified: true,
    tags: ["lighting", "safety", "night"],
    solutions: [
      {
        id: "2",
        author: "District Maintenance",
        content:
          "Transformer fuse replacement in progress. Crew dispatched on site.",
        createdAt: new Date("2024-01-14T20:15:00"),
        helpful: 4,
        unhelpful: 0,
      },
    ],
    imageUrl:
      "https://i.postimg.cc/tgdsF8Sv/istockphoto-1076480852-612x612.jpg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "3",
    title: "Water Main Leak Repaired on Broadway & 4th St",
    description:
      "Subsurface water leak causing road erosion near Broadway crossing. Full repair executed by Municipal Utilities Division with fresh concrete seal.",
    category: "infrastructure",
    priority: "low",
    status: "resolved",
    location: "Broadway & 4th Street",
    coordinates: { lat: 40.7306, lng: -73.9921 },
    reportedBy: "Michael Vance",
    reportedAt: new Date("2024-01-10T09:15:00"),
    resolvedAt: new Date("2024-01-12T16:00:00"),
    coSignersCount: 22,
    affectsMeCount: 65,
    eta: "Resolved",
    isVerified: true,
    tags: ["water", "repaired", "utility"],
    solutions: [
      {
        id: "3",
        author: "Water Authority Dispatch",
        content:
          "Subsurface pipe replaced and high-grade concrete patch completed.",
        createdAt: new Date("2024-01-12T15:30:00"),
        helpful: 15,
        unhelpful: 0,
      },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80",
    resolvedImageUrl:
      "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
  },
];

function AppContent() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [showForm, setShowForm] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    statusFilter: "",
    categoryFilter: "",
    priorityFilter: "",
    tags: [],
  });

  const availableTags = Array.from(
    new Set(incidents.flatMap((incident) => incident.tags || []))
  );

  const handleSubmitIncident = (formData: IncidentFormData) => {
    const newIncident: Incident = {
      id: Date.now().toString(),
      ...formData,
      status: "open",
      reportedAt: new Date(),
      coSignersCount: 1,
      affectsMeCount: 1,
      solutions: [],
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setShowForm(false);
  };

  const handleAddSolution = (
    incidentId: string,
    solution: Omit<Solution, "id" | "createdAt" | "helpful" | "unhelpful">
  ) => {
    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === incidentId
          ? {
              ...incident,
              solutions: [
                ...incident.solutions,
                {
                  ...solution,
                  id: Date.now().toString(),
                  createdAt: new Date(),
                  helpful: 0,
                  unhelpful: 0,
                },
              ],
            }
          : incident
      )
    );
  };

  const handleRateSolution = (
    incidentId: string,
    solutionId: string,
    type: "helpful" | "unhelpful"
  ) => {
    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === incidentId
          ? {
              ...incident,
              solutions: incident.solutions.map((solution) =>
                solution.id === solutionId
                  ? { ...solution, [type]: solution[type] + 1 }
                  : solution
              ),
            }
          : incident
      )
    );
  };

  const handleUpdateStatus = (
    incidentId: string,
    status: Incident["status"]
  ) => {
    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === incidentId ? { ...incident, status } : incident
      )
    );
  };

  const handleCoSign = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              coSignersCount: (inc.coSignersCount || 1) + 1,
              affectsMeCount: (inc.affectsMeCount || 1) + 1,
              isVerified: true,
            }
          : inc
      )
    );
  };

  const handleSelectIncidentFromMap = (incident: Incident) => {
    setViewMode("list");
    setTimeout(() => {
      const el = document.getElementById(`incident-${incident.id}`);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      incident.description
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase()) ||
      incident.location
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());

    const matchesStatus =
      !filters.statusFilter || incident.status === filters.statusFilter;
    const matchesCategory =
      !filters.categoryFilter || incident.category === filters.categoryFilter;
    const matchesPriority =
      !filters.priorityFilter || incident.priority === filters.priorityFilter;

    const matchesDateRange =
      (!filters.dateFrom || incident.reportedAt >= filters.dateFrom) &&
      (!filters.dateTo || incident.reportedAt <= filters.dateTo);

    const matchesTags =
      !filters.tags?.length ||
      filters.tags.some((tag) => incident.tags?.includes(tag));

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory &&
      matchesPriority &&
      matchesDateRange &&
      matchesTags
    );
  });

  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).toUpperCase();

  return (
    <div className="min-h-screen bg-obsidian text-champagne font-body selection:bg-gold selection:text-obsidian">
      
      {/* Citizen Feature: 🚨 Emergency SOS Quick-Dial Top Banner */}
      <div className="bg-red-700 text-white text-xs font-mono py-2.5 px-4 border-b border-red-500 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-bold tracking-widest uppercase">
            <ShieldAlert className="w-4 h-4 animate-bounce text-yellow-300" />
            <span>🚨 LIFE-THREATENING EMERGENCY? (GAS LEAKS, FALLEN POWER LINES, FIRE)</span>
          </div>

          <button
            onClick={() => setShowEmergencyModal(true)}
            className="bg-yellow-400 text-black px-3.5 py-1 font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center gap-1.5 shadow"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            CALL EMERGENCY HOTLINE (911 / 311)
          </button>
        </div>
      </div>

      {/* Top Edition & Live Ticker Header */}
      <div className="bg-charcoal text-champagne text-xs font-mono py-2 px-4 border-b border-gold/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-gold text-obsidian px-2.5 py-0.5 font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-gold-glow-sm">
              <Radio className="w-3.5 h-3.5 animate-pulse text-obsidian" /> LIVE TELEGRAM
            </span>
            <span className="truncate max-w-md hidden sm:inline text-pewter tracking-wider">
              {incidents.length > 0
                ? `LATEST DISPATCH: ${incidents[0].title} — STATUS: ${incidents[0].status.toUpperCase()}`
                : "ALL MUNICIPAL SYSTEMS OPERATIONAL"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-pewter tracking-widest text-[11px]">
            <span>VOL. XXIV NO. 104</span>
            <span className="hidden sm:inline text-gold">✦</span>
            <span>METROPOLITAN EDITION</span>
            <span className="hidden sm:inline text-gold">✦</span>
            <span>ATMOSPHERE: CLEAR</span>
          </div>
        </div>
      </div>

      {/* Main Art Deco Marquee Header Banner */}
      <header className="border-b border-gold/40 bg-charcoal art-deco-sunburst relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center border-b border-gold/30 pb-6 mb-4">
            <div className="flex items-center justify-center gap-3 text-xs font-mono uppercase tracking-[0.3em] text-gold/80 mb-3">
              <span>EST. MMXXIV</span>
              <span className="text-gold">✦</span>
              <span>THE PUBLICATION OF RECORD FOR CIVIC INCIDENT DISPATCHES</span>
              <span className="text-gold">✦</span>
              <span>PRICE: PUBLIC RECORD</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-bold tracking-widest text-gold uppercase leading-none my-2 drop-shadow-[0_2px_15px_rgba(212,175,55,0.3)]">
              The SnapReport Gazette
            </h1>
            
            <p className="text-sm sm:text-base font-serif italic text-gold-light tracking-widest mt-2">
              "All the News & Community Dispatches Fit to Print and Resolve"
            </p>
          </div>

          {/* Subheader Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-3 border-y border-gold/40 font-mono text-xs">
            <div className="flex items-center gap-3 font-bold tracking-widest text-gold">
              <Newspaper className="w-4 h-4 text-gold" />
              <span>{currentDateFormatted}</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <ThemeToggle />
              <NotificationBell />

              <button
                onClick={() => setShowForm(true)}
                className="art-deco-btn-solid px-6 py-2.5 text-xs font-bold flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 text-obsidian" />
                FILE INCIDENT DISPATCH
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Editorial Feature */}
      <section className="border-b border-gold/40 py-12 bg-obsidian relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Main Lead Story (8 Columns) */}
            <div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-gold/40 pb-8 lg:pb-0 lg:pr-10 art-deco-corner-wrapper">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-gold text-obsidian text-[10px] font-mono font-bold px-2.5 py-0.5 uppercase tracking-widest shadow-gold-glow-sm">
                  EDITORIAL LEAD
                </span>
                <span className="text-xs font-mono text-pewter uppercase tracking-widest">
                  SECTION I • PAGE 1
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight tracking-wider text-gold mb-5">
                COMMUNITY VIGILANCE: CITIZENS & OFFICIALS UNITE TO RESTORE LOCAL INFRASTRUCTURE
              </h2>

              <p className="text-base sm:text-lg leading-relaxed font-body text-champagne mb-6">
                Reporting municipal hazards instantly, sharing verified solutions collaboratively, and ensuring swift public resolution. The SnapReport Gazette provides an unyielding, high-contrast record of civic issues demanding immediate community action.
              </p>

              <div className="p-4 border border-gold/40 bg-charcoal flex flex-col sm:flex-row items-center justify-between font-mono text-xs gap-2">
                <span className="font-bold uppercase tracking-widest text-gold">
                  ✦ GAZETTE METRICS: {incidents.length} TOTAL DISPATCHES FILED TODAY
                </span>
                <span className="text-gold-light font-bold uppercase tracking-wider">
                  100% PUBLIC VERIFIED
                </span>
              </div>
            </div>

            {/* Feature Pillars (4 Columns) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="border-b border-gold/40 pb-3">
                <h3 className="font-serif font-bold text-xl uppercase tracking-widest text-gold flex items-center justify-between">
                  <span>DISPATCH PILLARS</span>
                  <span className="text-xs font-mono text-pewter">FIG. I.0</span>
                </h3>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="border border-gold p-2.5 bg-charcoal text-gold shadow-gold-glow-sm shrink-0 rotate-45">
                    <Camera className="w-4 h-4 -rotate-45" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm uppercase text-gold tracking-wider">
                      I. SNAP & DOCUMENT
                    </h4>
                    <p className="text-xs font-body text-champagne/80 leading-relaxed mt-0.5">
                      Capture photo evidence and catalog coordinates with precise metadata.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-t border-gold/20 pt-4">
                  <div className="border border-gold p-2.5 bg-charcoal text-gold shadow-gold-glow-sm shrink-0 rotate-45">
                    <Users className="w-4 h-4 -rotate-45" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm uppercase text-gold tracking-wider">
                      II. CO-SIGN PETITIONS
                    </h4>
                    <p className="text-xs font-body text-champagne/80 leading-relaxed mt-0.5">
                      Co-sign dispatches to elevate urgency to Official Citizen Verification status.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-t border-gold/20 pt-4">
                  <div className="border border-gold p-2.5 bg-charcoal text-gold shadow-gold-glow-sm shrink-0 rotate-45">
                    <TrendingUp className="w-4 h-4 -rotate-45" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm uppercase text-gold tracking-wider">
                      III. BEFORE & AFTER PROOF
                    </h4>
                    <p className="text-xs font-body text-champagne/80 leading-relaxed mt-0.5">
                      Inspect interactive repair photo comparisons for full public accountability.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Broadside Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Dashboard Stat Cards */}
        <Dashboard incidents={incidents} />

        {/* Art Deco Ornamental Divider */}
        <div className="py-6 text-center font-serif text-xl text-gold tracking-[1.5em] select-none opacity-80">
          ✦ ✦ ✦
        </div>

        {/* Advanced Search Desk */}
        <AdvancedSearch
          filters={filters}
          onFiltersChange={setFilters}
          availableTags={availableTags}
        />

        {/* View Switcher & Feed Header Bar */}
        <div className="art-deco-card p-5 mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-mono text-xs art-deco-corner-wrapper">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-serif font-bold uppercase tracking-widest text-gold">
              COMMUNITY DISPATCHES ({filteredIncidents.length})
            </h3>
          </div>

          {/* List View vs. Gazette Map View Switcher */}
          <div className="flex items-center border border-gold bg-obsidian font-bold">
            <button
              onClick={() => setViewMode("list")}
              className={`px-5 py-2.5 uppercase font-serif text-xs tracking-widest flex items-center gap-2 transition-colors border-r border-gold ${
                viewMode === "list"
                  ? "bg-gold text-obsidian shadow-gold-glow-sm"
                  : "text-gold hover:bg-gold/10"
              }`}
            >
              <LayoutList className="w-4 h-4" />
              <span>📰 BROADSHEET LIST VIEW</span>
            </button>

            <button
              onClick={() => setViewMode("map")}
              className={`px-5 py-2.5 uppercase font-serif text-xs tracking-widest flex items-center gap-2 transition-colors ${
                viewMode === "map"
                  ? "bg-gold text-obsidian shadow-gold-glow-sm"
                  : "text-gold hover:bg-gold/10"
              }`}
            >
              <Map className="w-4 h-4" />
              <span>🗺️ GAZETTE MAP VIEW</span>
            </button>
          </div>
        </div>

        {/* Conditional Rendering: Gazette Map View vs. Broadsheet List Feed */}
        {viewMode === "map" ? (
          <GazetteMap
            incidents={filteredIncidents}
            onSelectIncident={handleSelectIncidentFromMap}
            onCoSign={handleCoSign}
          />
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-gold/40 p-8 bg-charcoal art-deco-corner-wrapper">
                <div className="border border-gold w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-obsidian text-gold shadow-gold-glow-sm rotate-45">
                  <AlertCircle className="w-8 h-8 -rotate-45" />
                </div>
                <h4 className="text-2xl font-serif font-bold text-gold uppercase tracking-widest mb-2 mt-4">
                  NO GAZETTE RECORDS FOUND
                </h4>
                <p className="text-sm font-body text-champagne/80 max-w-md mx-auto">
                  {filters.searchTerm ||
                  filters.statusFilter ||
                  filters.categoryFilter ||
                  filters.priorityFilter
                    ? "No incidents match your specific search parameters. Try clearing your filters."
                    : "No community dispatches have been registered yet. Be the first citizen reporter to file a record."}
                </p>
              </div>
            ) : (
              filteredIncidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  onAddSolution={handleAddSolution}
                  onUpdateStatus={handleUpdateStatus}
                  onRateSolution={handleRateSolution}
                  onCoSign={handleCoSign}
                />
              ))
            )}
          </div>
        )}
      </main>

      {/* Modal Form */}
      {showForm && (
        <IncidentForm
          onSubmit={handleSubmitIncident}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Citizen Feature: Emergency SOS Hotline Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-obsidian/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-charcoal border-2 border-red-500 shadow-gold-glow-lg max-w-md w-full p-6 text-center space-y-4 art-deco-corner-wrapper">
            <div className="border-2 border-red-500 w-16 h-16 mx-auto flex items-center justify-center bg-red-950 text-red-400 rotate-45">
              <ShieldAlert className="w-8 h-8 -rotate-45 animate-pulse" />
            </div>
            
            <h3 className="font-serif font-bold text-2xl text-red-400 uppercase tracking-widest mt-4">
              EMERGENCY SOS HOTLINES
            </h3>
            
            <p className="font-mono text-xs text-champagne leading-relaxed">
              If an incident presents an immediate danger to human life, call local emergency services immediately:
            </p>

            <div className="space-y-3 font-mono text-xs font-bold pt-2">
              <a
                href="tel:911"
                className="block bg-red-600 text-white py-3 px-4 uppercase tracking-widest hover:bg-red-500 transition-all border border-red-400"
              >
                📞 CALL 911 (POLICE / FIRE / AMBULANCE)
              </a>
              <a
                href="tel:311"
                className="block bg-gold text-obsidian py-3 px-4 uppercase tracking-widest hover:bg-gold-light transition-all border border-gold"
              >
                📞 CALL 311 (CITY HAZARD HOTLINE)
              </a>
            </div>

            <button
              onClick={() => setShowEmergencyModal(false)}
              className="mt-4 border border-gold/40 text-pewter px-4 py-2 text-xs font-mono uppercase tracking-widest hover:text-gold"
            >
              ✕ CLOSE EMERGENCY BANNER
            </button>
          </div>
        </div>
      )}

      {/* Gazette Colophon Footer */}
      <footer className="border-t border-gold/40 bg-charcoal text-champagne mt-24 font-mono text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-gold/30 pb-12">
            <div className="md:col-span-6 space-y-4">
              <h2 className="text-3xl font-serif font-bold tracking-widest text-gold uppercase">
                THE SNAPREPORT GAZETTE
              </h2>
              <p className="text-champagne/80 font-body text-sm leading-relaxed max-w-md">
                An authoritative digital broadsheet dedicated to civic transparency, community safety, and rapid municipal problem resolution.
              </p>
              <div className="text-gold font-mono text-xs font-bold uppercase tracking-widest">
                ✦ PRINTED IN METROPOLIS • DISTRIBUTED GLOBALLY ✦
              </div>
            </div>

            <div className="md:col-span-3 space-y-3">
              <h4 className="font-serif font-bold text-gold uppercase tracking-widest border-b border-gold/30 pb-2 mb-3">
                SECTIONS
              </h4>
              <ul className="space-y-2 text-champagne/80">
                <li><a href="#" className="hover:text-gold hover:underline">Front Page Dispatches</a></li>
                <li><a href="#" className="hover:text-gold hover:underline">Interactive Gazette Map</a></li>
                <li><a href="#" className="hover:text-gold hover:underline">Verified Citizen Petitions</a></li>
                <li><a href="#" className="hover:text-gold hover:underline">Before & After Repairs</a></li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-3">
              <h4 className="font-serif font-bold text-gold uppercase tracking-widest border-b border-gold/30 pb-2 mb-3">
                PUBLICATION INFO
              </h4>
              <p className="text-champagne/80">Edition: Vol. XXIV No. 104</p>
              <p className="text-champagne/80">ISSN: 2026-9041-SRG</p>
              <p className="text-champagne/80">Copyright © 2026 SnapReport Inc.</p>
            </div>
          </div>

          <div className="pt-8 text-center text-pewter text-[11px] uppercase tracking-widest">
            "All the News That's Fit to Print & Resolve" • SnapReport Incident Manager
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
