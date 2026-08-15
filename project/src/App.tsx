import React, { useState } from "react";
import { Plus, Users, Camera, TrendingUp, AlertCircle, Radio, Newspaper, Map, LayoutList, PhoneCall, ShieldAlert, X } from "lucide-react";
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
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* Citizen Feature: 🚨 Emergency SOS Quick-Dial Top Banner */}
      <div className="bg-rose-600 dark:bg-rose-700 text-white text-xs font-sans py-2.5 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldAlert className="w-4 h-4 animate-bounce text-amber-300" />
            <span>🚨 LIFE-THREATENING EMERGENCY? (GAS LEAKS, FALLEN POWER LINES, FIRE)</span>
          </div>

          <button
            onClick={() => setShowEmergencyModal(true)}
            className="bg-amber-400 text-slate-950 px-3.5 py-1 rounded-lg font-bold hover:bg-white transition-all flex items-center gap-1.5 shadow-sm text-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            CALL EMERGENCY HOTLINE (911 / 311)
          </button>
        </div>
      </div>

      {/* Live Ticker Header */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-indigo-600 text-white px-2.5 py-0.5 rounded-full font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Radio className="w-3 h-3 animate-pulse" /> LIVE DISPATCH
            </span>
            <span className="truncate max-w-md hidden sm:inline text-slate-300">
              {incidents.length > 0
                ? `Latest Issue: ${incidents[0].title} — Status: ${incidents[0].status.toUpperCase()}`
                : "All Municipal Services Operational"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px] font-mono">
            <span>SNAPREPORT CIVIC HUB</span>
            <span className="hidden sm:inline text-indigo-400">•</span>
            <span>METROPOLITAN REGION</span>
          </div>
        </div>
      </div>

      {/* Main Header Marquee */}
      <header className="bg-white dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 shadow-sm backdrop-blur-md sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
                <span>SnapReport</span>
                <span>•</span>
                <span>Community Incident Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
                City Incident Manager
              </h1>
            </div>

            {/* Header Controls: Theme Toggle, Notifications, New Report */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <ThemeToggle />
              <NotificationBell />

              <button
                onClick={() => setShowForm(true)}
                className="app-btn-primary px-5 py-2.5 text-xs flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                REPORT INCIDENT
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Community Banner */}
      <section className="bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/20 dark:to-transparent py-10 border-b border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Main Hero Story */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold">
                <Users className="w-3.5 h-3.5" />
                <span>CITIZEN-POWERED CIVIC RESPONSE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Report Hazards. Upvote Local Issues. Track Municipal Repairs.
              </h2>

              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                A simple, transparent platform for citizens to report potholes, outages, and safety hazards, support neighboring issues, and track official repair progress step by step.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-6 font-mono text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  {incidents.length} Active Reports
                </span>
                <span>•</span>
                <span>100% Public Record</span>
                <span>•</span>
                <span>Verified City Response</span>
              </div>
            </div>

            {/* Quick Feature Pillars */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                How It Works
              </h3>

              <div className="space-y-3 font-sans text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">1. Snap & Report</h4>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">Upload a photo and details of the hazard in your area.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-slate-100 dark:border-slate-700/50 pt-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">2. Support Neighbors</h4>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">Click "Affects Me Too" to prioritize urgent issues.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-slate-100 dark:border-slate-700/50 pt-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">3. Track Progress</h4>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">Follow the 4-step repair status until fixed.</p>
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

        {/* Advanced Search Desk */}
        <div className="mt-8">
          <AdvancedSearch
            filters={filters}
            onFiltersChange={setFilters}
            availableTags={availableTags}
          />
        </div>

        {/* View Switcher & Feed Header Bar */}
        <div className="app-card p-4 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Community Reports ({filteredIncidents.length})
            </h3>
          </div>

          {/* List View vs. Gazette Map View Switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                viewMode === "list"
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <LayoutList className="w-4 h-4" />
              <span>List View</span>
            </button>

            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                viewMode === "map"
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Map View</span>
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
              <div className="text-center py-16 border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 rounded-2xl bg-white dark:bg-slate-800">
                <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 mx-auto mb-4 flex items-center justify-center text-slate-400">
                  <AlertCircle className="w-8 h-8 text-indigo-500" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  No Incident Records Found
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {filters.searchTerm ||
                  filters.statusFilter ||
                  filters.categoryFilter ||
                  filters.priorityFilter
                    ? "No reports match your active search filters. Try resetting your search parameters."
                    : "No incident reports have been submitted yet. Be the first neighbor to file a report."}
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

      {/* Emergency Hotline Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 border border-rose-500/50 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
              Emergency Hotlines
            </h3>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If an incident presents an immediate danger to human life or property, call local emergency services immediately:
            </p>

            <div className="space-y-3 text-xs font-bold pt-2">
              <a
                href="tel:911"
                className="block bg-rose-600 hover:bg-rose-700 text-white py-3 px-4 rounded-xl transition-all shadow-sm"
              >
                📞 CALL 911 (POLICE / FIRE / AMBULANCE)
              </a>
              <a
                href="tel:311"
                className="block bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl transition-all shadow-sm"
              >
                📞 CALL 311 (MUNICIPAL HAZARD LINE)
              </a>
            </div>

            <button
              onClick={() => setShowEmergencyModal(false)}
              className="mt-4 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 mt-20 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-slate-100 dark:border-slate-800 pb-10">
            <div className="md:col-span-6 space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                SnapReport Incident Manager
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-md">
                A public citizen platform dedicated to neighborhood safety, municipal transparency, and rapid hazard resolution.
              </p>
            </div>

            <div className="md:col-span-3 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Quick Links
              </h4>
              <ul className="space-y-1.5">
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Incident Feed</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Gazette Map</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Citizen Petitions</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Before & After Repairs</a></li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Portal Information
              </h4>
              <p>SnapReport Platform v2.0</p>
              <p>Copyright © 2026 SnapReport Inc.</p>
            </div>
          </div>

          <div className="pt-6 text-center text-slate-400 dark:text-slate-500 text-[11px]">
            SnapReport Community Incident Manager • Built for Citizens
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
