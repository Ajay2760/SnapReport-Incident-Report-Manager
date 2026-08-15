import React, { useState } from "react";
import { Plus, Zap, Users, Camera, TrendingUp, AlertCircle, Radio, Newspaper, Map, LayoutList } from "lucide-react";
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
          ? { ...inc, coSignersCount: (inc.coSignersCount || 1) + 1, isVerified: true }
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
    <div className="min-h-screen bg-[#F9F9F7] text-[#111111] font-body selection:bg-[#111111] selection:text-[#F9F9F7]">
      {/* Top Edition & Breaking Ticker Header */}
      <div className="bg-[#111111] text-[#F9F9F7] text-xs font-mono py-1.5 px-4 border-b border-[#111111]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="bg-[#CC0000] text-white px-2 py-0.5 font-bold tracking-widest uppercase flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" /> LIVE BULLETIN
            </span>
            <span className="truncate max-w-md hidden sm:inline text-neutral-300">
              {incidents.length > 0
                ? `LATEST DISPATCH: ${incidents[0].title} — Status: ${incidents[0].status.toUpperCase()}`
                : "ALL SYSTEMS OPERATIONAL"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-neutral-300">
            <span>VOL. XXIV NO. 104</span>
            <span className="hidden sm:inline">•</span>
            <span>NEW YORK EDITION</span>
            <span className="hidden sm:inline">•</span>
            <span>WEATHER: CLEAR</span>
          </div>
        </div>
      </div>

      {/* Main Newspaper Header Banner */}
      <header className="border-b-4 border-[#111111] bg-[#F9F9F7] newsprint-texture">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center border-b border-[#111111] pb-4 mb-3">
            <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-neutral-600 mb-2">
              <span>Est. 2024</span>
              <span>—</span>
              <span>The Publication of Record for Community Incident Response</span>
              <span>—</span>
              <span>Price: Free</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-serif tracking-tight text-[#111111] uppercase leading-none my-1">
              The SnapReport Gazette
            </h1>
            
            <p className="text-sm font-serif italic text-neutral-700 tracking-wider">
              "All the News & Community Dispatches Fit to Print and Resolve"
            </p>
          </div>

          {/* Subheader Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-2 border-y border-[#111111] font-mono text-xs">
            <div className="flex items-center gap-2 font-bold tracking-widest text-[#111111]">
              <Newspaper className="w-4 h-4 text-[#CC0000]" />
              <span>{currentDateFormatted}</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <NotificationBell />

              <button
                onClick={() => setShowForm(true)}
                className="bg-[#111111] text-[#F9F9F7] border border-[#111111] px-5 py-2.5 uppercase font-mono text-xs tracking-widest font-bold hover:bg-white hover:text-[#111111] transition-all duration-200 hard-shadow-hover flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 text-[#CC0000]" />
                FILE INCIDENT DISPATCH
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Editorial Feature */}
      <section className="border-b-2 border-[#111111] py-10 bg-[#F9F9F7] relative newsprint-texture">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Lead Story (8 Columns) */}
            <div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-[#111111] pb-8 lg:pb-0 lg:pr-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-[#111111] text-white text-[10px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest">
                  EDITORIAL LEAD
                </span>
                <span className="text-xs font-mono text-neutral-500 uppercase">
                  SECTION A • PAGE 1
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif leading-none tracking-tight text-[#111111] mb-4">
                COMMUNITY VIGILANCE: CITIZENS & OFFICIALS UNITE TO RESTORE LOCAL INFRASTRUCTURE
              </h2>

              <p className="text-base sm:text-lg leading-relaxed font-body text-neutral-900 drop-cap mb-4">
                Reporting municipal hazards instantly, sharing verified solutions collaboratively, and ensuring swift public resolution. The SnapReport Gazette provides an unyielding, high-contrast record of civic issues demanding immediate community action.
              </p>

              <div className="p-4 border border-[#111111] bg-neutral-100 flex items-center justify-between font-mono text-xs">
                <span className="font-bold uppercase tracking-wider">
                  ✦ GAZETTE METRICS: {incidents.length} TOTAL DISPATCHES FILED TODAY
                </span>
                <span className="text-[#CC0000] font-bold uppercase">
                  100% PUBLIC VERIFIED
                </span>
              </div>
            </div>

            {/* Feature Pillars (4 Columns) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="border-b border-[#111111] pb-2">
                <h3 className="font-serif font-bold text-xl uppercase tracking-tight text-[#111111] flex items-center justify-between">
                  <span>DISPATCH PILLARS</span>
                  <span className="text-xs font-mono text-neutral-500">FIG. 1.0</span>
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="border border-[#111111] p-2 bg-white hard-shadow-sm shrink-0">
                    <Camera className="w-4 h-4 text-[#111111]" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm uppercase text-[#111111]">
                      1. SNAP & DOCUMENT
                    </h4>
                    <p className="text-xs font-body text-neutral-700 leading-relaxed">
                      Capture photo evidence and catalog coordinates with precise metadata.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-neutral-300 pt-3">
                  <div className="border border-[#111111] p-2 bg-white hard-shadow-sm shrink-0">
                    <Users className="w-4 h-4 text-[#111111]" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm uppercase text-[#111111]">
                      2. CO-SIGN PETITIONS
                    </h4>
                    <p className="text-xs font-body text-neutral-700 leading-relaxed">
                      Co-sign dispatches to elevate urgency to Official Citizen Verification status.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-neutral-300 pt-3">
                  <div className="border border-[#111111] p-2 bg-white hard-shadow-sm shrink-0">
                    <TrendingUp className="w-4 h-4 text-[#111111]" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm uppercase text-[#111111]">
                      3. BEFORE & AFTER PROOF
                    </h4>
                    <p className="text-xs font-body text-neutral-700 leading-relaxed">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Dashboard Stat Cards */}
        <Dashboard incidents={incidents} />

        {/* Ornamental Divider */}
        <div className="py-4 text-center font-serif text-xl text-neutral-400 tracking-[1.5em] select-none">
          ✦ ✦ ✦
        </div>

        {/* Advanced Search Desk */}
        <AdvancedSearch
          filters={filters}
          onFiltersChange={setFilters}
          availableTags={availableTags}
        />

        {/* View Switcher & Feed Header Bar */}
        <div className="border-2 border-[#111111] bg-white p-4 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hard-shadow font-mono text-xs">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black font-serif uppercase tracking-tight text-[#111111]">
              COMMUNITY DISPATCHES ({filteredIncidents.length})
            </h3>
          </div>

          {/* List View vs. Gazette Map View Switcher */}
          <div className="flex items-center border-2 border-[#111111] bg-[#F9F9F7] font-bold">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 uppercase flex items-center gap-1.5 transition-colors border-r border-[#111111] ${
                viewMode === "list"
                  ? "bg-[#111111] text-white"
                  : "text-[#111111] hover:bg-neutral-200"
              }`}
            >
              <LayoutList className="w-4 h-4" />
              <span>📰 BROADSHEET LIST VIEW</span>
            </button>

            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-2 uppercase flex items-center gap-1.5 transition-colors ${
                viewMode === "map"
                  ? "bg-[#CC0000] text-white"
                  : "text-[#111111] hover:bg-neutral-200"
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
          <div className="grid grid-cols-1 gap-8">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-[#111111] p-8 bg-white">
                <div className="border border-[#111111] w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-[#F9F9F7]">
                  <AlertCircle className="w-8 h-8 text-[#CC0000]" />
                </div>
                <h4 className="text-xl font-serif font-bold text-[#111111] uppercase mb-2">
                  NO GAZETTE RECORDS FOUND
                </h4>
                <p className="text-sm font-body text-neutral-600 max-w-md mx-auto">
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

      {/* Gazette Colophon Footer */}
      <footer className="border-t-4 border-[#111111] bg-[#111111] text-[#F9F9F7] mt-20 font-mono text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-neutral-800 pb-12">
            <div className="md:col-span-6 space-y-4">
              <h2 className="text-3xl font-serif font-black tracking-tight text-white uppercase">
                THE SNAPREPORT GAZETTE
              </h2>
              <p className="text-neutral-400 font-body text-sm leading-relaxed max-w-md">
                An authoritative digital broadsheet dedicated to civic transparency, community safety, and rapid municipal problem resolution.
              </p>
              <div className="text-[#CC0000] font-mono text-xs font-bold uppercase tracking-widest">
                • PRINTED IN NYC • DISTRIBUTED GLOBALLY •
              </div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <h4 className="font-bold text-white uppercase tracking-widest border-b border-neutral-800 pb-2 mb-3">
                SECTIONS
              </h4>
              <ul className="space-y-1.5 text-neutral-400">
                <li><a href="#" className="hover:text-white hover:underline">Front Page Dispatches</a></li>
                <li><a href="#" className="hover:text-white hover:underline">Interactive Gazette Map</a></li>
                <li><a href="#" className="hover:text-white hover:underline">Verified Citizen Petitions</a></li>
                <li><a href="#" className="hover:text-white hover:underline">Before & After Repairs</a></li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-2">
              <h4 className="font-bold text-white uppercase tracking-widest border-b border-neutral-800 pb-2 mb-3">
                PUBLICATION INFO
              </h4>
              <p className="text-neutral-400">Edition: Vol. XXIV No. 104</p>
              <p className="text-neutral-400">ISSN: 2026-9041-SRG</p>
              <p className="text-neutral-400">Copyright © 2026 SnapReport Inc.</p>
            </div>
          </div>

          <div className="pt-6 text-center text-neutral-500 text-[11px] uppercase tracking-widest">
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
