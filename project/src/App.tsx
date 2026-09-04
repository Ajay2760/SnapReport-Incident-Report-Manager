import React, { useState } from "react";
import { Plus, Users, Camera, TrendingUp, AlertCircle, Radio, Map, LayoutList, PhoneCall, ShieldAlert, X, Zap } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-white dark:bg-deep-indigo text-black dark:text-white font-sans transition-colors duration-300">
      
      {/* ═══ Announcement Bar — Deep Indigo control-room strip ═══ */}
      <div className="section-darkest py-2.5 px-4">
        <div className="max-w-page mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-white text-[13px] font-medium">
            <ShieldAlert className="w-4 h-4 text-amber-alert animate-pulse" />
            <span>🚨 Life-threatening emergency? Gas leaks, fallen power lines, fire</span>
          </div>

          <button
            onClick={() => setShowEmergencyModal(true)}
            className="app-btn-amber px-4 py-1.5 text-[13px] flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Call Emergency (911 / 311)
          </button>
        </div>
      </div>

      {/* ═══ Live Dispatch Ticker ═══ */}
      <div className="section-dark py-2 px-4 border-b border-white/[0.06]">
        <div className="max-w-page mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="app-badge bg-signal-blue text-white text-[11px]">
              <Radio className="w-3 h-3 animate-pulse" /> LIVE
            </span>
            <span className="truncate max-w-md hidden sm:inline text-silver text-[13px]">
              {incidents.length > 0
                ? `Latest: ${incidents[0].title} — ${incidents[0].status.toUpperCase()}`
                : "All Municipal Services Operational"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-steel text-[11px] font-medium tracking-wider uppercase">
            <span>SnapReport</span>
            <span className="text-signal-blue">•</span>
            <span>Metropolitan Region</span>
          </div>
        </div>
      </div>

      {/* ═══ Floating Navigation Pill ═══ */}
      <header className="sticky top-0 z-30 py-3 px-4">
        <div className="max-w-page mx-auto">
          <nav className="nav-pill px-4 py-2.5 flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-pill bg-signal-blue flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-[15px] font-bold text-black dark:text-white tracking-tight-sm">SnapReport</span>
              </div>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {['Dashboard', 'Reports', 'Map', 'Community'].map((item) => (
                <button key={item} className="px-3 py-1.5 text-[15px] font-medium text-carbon dark:text-silver hover:text-black dark:hover:text-white rounded-pill hover:bg-black/[0.03] dark:hover:bg-white/[0.06] transition-all">
                  {item}
                </button>
              ))}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <NotificationBell />
              <button
                onClick={() => setShowForm(true)}
                className="app-btn-primary px-4 py-2 text-[13px] flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Report Incident</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* ═══ Hero Section — White Departure Board ═══ */}
      <section className="section-light dark:section-dark py-16 sm:py-20">
        <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 app-badge bg-linen dark:bg-white/[0.06] text-carbon dark:text-silver">
              <Users className="w-3.5 h-3.5" />
              <span>Citizen-Powered Civic Response</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-display text-black dark:text-white">
              Report. Upvote. Track Repairs.
            </h1>

            {/* Subtext */}
            <p className="text-body text-carbon dark:text-silver max-w-xl mx-auto">
              A transparent platform for citizens to report potholes, outages, and safety hazards — support neighboring issues and track official repair progress.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-[13px] font-medium text-steel">
              <span className="flex items-center gap-1.5 text-black dark:text-white font-bold">
                <span className="w-2 h-2 rounded-full bg-signal-blue inline-block"></span>
                {incidents.length} Active Reports
              </span>
              <span>•</span>
              <span>100% Public Record</span>
              <span>•</span>
              <span>Verified City Response</span>
            </div>

            {/* How It Works — Inline Pills */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {[
                { icon: Camera, label: "1. Snap & Report" },
                { icon: Users, label: "2. Support Neighbors" },
                { icon: TrendingUp, label: "3. Track Progress" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 px-4 py-2.5 rounded-pill bg-linen dark:bg-white/[0.04] border border-silver/30 dark:border-white/[0.08] text-[13px] font-medium text-carbon dark:text-silver">
                  <Icon className="w-4 h-4 text-signal-blue" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Main Content ═══ */}
      <main className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Dashboard Stat Cards */}
        <Dashboard incidents={incidents} />

        {/* Advanced Search */}
        <div className="mt-8">
          <AdvancedSearch
            filters={filters}
            onFiltersChange={setFilters}
            availableTags={availableTags}
          />
        </div>

        {/* View Switcher */}
        <div className="app-card p-4 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-heading-sm text-black dark:text-white">
            Community Reports ({filteredIncidents.length})
          </h3>

          <div className="flex items-center p-1 bg-linen dark:bg-white/[0.04] rounded-pill border border-silver/30 dark:border-white/[0.08]">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-pill text-[13px] font-semibold flex items-center gap-2 transition-all ${
                viewMode === "list"
                  ? "bg-white dark:bg-white/[0.10] text-black dark:text-white shadow-subtle"
                  : "text-steel hover:text-black dark:hover:text-white"
              }`}
            >
              <LayoutList className="w-4 h-4" />
              List
            </button>

            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-2 rounded-pill text-[13px] font-semibold flex items-center gap-2 transition-all ${
                viewMode === "map"
                  ? "bg-white dark:bg-white/[0.10] text-black dark:text-white shadow-subtle"
                  : "text-steel hover:text-black dark:hover:text-white"
              }`}
            >
              <Map className="w-4 h-4" />
              Map
            </button>
          </div>
        </div>

        {/* Feed */}
        {viewMode === "map" ? (
          <GazetteMap
            incidents={filteredIncidents}
            onSelectIncident={handleSelectIncidentFromMap}
            onCoSign={handleCoSign}
          />
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-silver/50 dark:border-white/[0.08] p-8 rounded-card bg-linen dark:bg-midnight-ink/40">
                <div className="w-14 h-14 rounded-full bg-linen dark:bg-white/[0.06] mx-auto mb-4 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-signal-blue" />
                </div>
                <h4 className="text-heading-sm text-black dark:text-white mb-2">
                  No Incident Records Found
                </h4>
                <p className="text-body-sm text-steel max-w-md mx-auto">
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

      {/* ═══ Report Form Modal ═══ */}
      {showForm && (
        <IncidentForm
          onSubmit={handleSubmitIncident}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* ═══ Emergency Hotline Modal ═══ */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-deep-indigo/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-midnight-ink border border-silver/30 dark:border-white/[0.08] rounded-floating max-w-md w-full p-6 text-center space-y-5" style={{ boxShadow: 'var(--shadow-floating)' }}>
            <div className="w-14 h-14 rounded-full bg-alert-red/10 text-alert-red mx-auto flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            
            <h3 className="text-heading-sm text-black dark:text-white">
              Emergency Hotlines
            </h3>
            
            <p className="text-body-sm text-steel">
              If an incident presents immediate danger to life or property, call emergency services immediately:
            </p>

            <div className="space-y-3 pt-1">
              <a
                href="tel:911"
                className="block app-btn-amber py-3.5 px-4 text-[15px] font-bold text-center"
              >
                📞 Call 911 — Police / Fire / Ambulance
              </a>
              <a
                href="tel:311"
                className="block app-btn-primary py-3.5 px-4 text-[15px] font-bold text-center"
              >
                📞 Call 311 — Municipal Hazard Line
              </a>
            </div>

            <button
              onClick={() => setShowEmergencyModal(false)}
              className="text-[13px] font-medium text-steel hover:text-black dark:hover:text-white transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* ═══ Footer — Deep Indigo Control Room ═══ */}
      <footer className="section-dark mt-20">
        <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-white/[0.08] pb-10">
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-pill bg-signal-blue flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-heading-sm text-white">
                  SnapReport
                </h2>
              </div>
              <p className="text-body-sm text-steel max-w-md">
                A public citizen platform dedicated to neighborhood safety, municipal transparency, and rapid hazard resolution.
              </p>
            </div>

            <div className="md:col-span-3 space-y-3">
              <h4 className="text-micro text-silver">Quick Links</h4>
              <ul className="space-y-2 text-[13px]">
                {['Incident Feed', 'City Map', 'Citizen Petitions', 'Before & After'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-steel hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3 space-y-3">
              <h4 className="text-micro text-silver">Platform</h4>
              <div className="space-y-2 text-[13px] text-steel">
                <p>SnapReport v2.0</p>
                <p>© 2026 SnapReport Inc.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 text-center text-[11px] text-steel tracking-wider">
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
