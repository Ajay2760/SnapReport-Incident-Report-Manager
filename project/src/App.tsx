import { useState, useEffect } from "react";
import {
  Plus,
  Users,
  Radio,
  Map,
  LayoutList,
  PhoneCall,
  ShieldAlert,
  Zap,
  ArrowRight,
  MapPin,
  Compass,
  Landmark,
  Building2,
  Home,
  Trees,
  Warehouse,
  Waves,
  AlertCircle,
} from "lucide-react";
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

const trustLogos = [
  { name: "CivicWorks", icon: Landmark },
  { name: "Metro Co-op", icon: Building2 },
  { name: "Bloom & Daughters", icon: Home },
  { name: "CityLab", icon: Trees },
  { name: "NeighborHub", icon: Warehouse },
  { name: "HarborPoint", icon: Waves },
];

function AppContent() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [showForm, setShowForm] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [scrolled, setScrolled] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    statusFilter: "",
    categoryFilter: "",
    priorityFilter: "",
    tags: [],
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const availableTags = Array.from(
    new Set(incidents.flatMap((incident) => incident.tags || []))
  );

  const totalCoSigns = incidents.reduce(
    (sum, inc) => sum + (inc.coSignersCount || 0),
    0
  );
  const resolvedCount = incidents.filter((i) => i.status === "resolved").length;
  const inProgressCount = incidents.filter(
    (i) => i.status === "in-progress"
  ).length;

  const navigate = (mode: "list" | "map" | null, target: string) => {
    if (mode) setViewMode(mode);
    setTimeout(() => {
      document
        .getElementById(target)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

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
    navigate("list", "feed");
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
    <div className="min-h-screen bg-warm-parchment dark:bg-canvas-dark text-ink-charcoal dark:text-ink-light font-sans transition-colors duration-300">
      {/* ═══ Pill Announcement Banner — filled at the very top ═══ */}
      <div className="px-4 sm:px-6">
        <div className="announcement-pill mt-3 rounded-full max-w-page mx-auto">
          <div className="flex items-center gap-2.5 text-[13px] font-medium">
            <ShieldAlert className="w-4 h-4 text-lilac-mist shrink-0" />
            <span className="truncate">
              Life-threatening emergency? Gas leaks, fallen power lines, fire
            </span>
          </div>
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="flex items-center gap-1.5 text-[13px] font-medium border border-white/40 rounded-small px-3 py-1.5 hover:bg-white/10 transition-colors shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Call 911 / 311
          </button>
        </div>
      </div>

      {/* ═══ Live Dispatch Ticker ═══ */}
      <div className="mt-3">
        <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-3 py-2">
          <div className="flex items-center gap-3">
            <span className="app-badge bg-royal-violet text-white text-[11px]">
              <Radio className="w-3 h-3 animate-pulse" /> LIVE
            </span>
            <span className="truncate max-w-md text-body-sm text-stone-gray">
              {incidents.length > 0
                ? `Latest: ${incidents[0].title} — ${incidents[0].status}`
                : "All Municipal Services Operational"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-caption text-stone-gray uppercase tracking-widest">
            <span className="text-ink-charcoal dark:text-ink-light font-semibold">
              SnapReport
            </span>
            <span className="text-royal-violet">-</span>
            <span>Metropolitan Region</span>
          </div>
        </div>
      </div>

      {/* ═══ Navigation Header — sticky, frosted glass ═══ */}
      <header
        className={`sticky top-0 z-40 nav-glass ${scrolled ? "scrolled" : ""}`}
      >
        <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(null, "top")}
            className="flex items-center gap-2.5"
            aria-label="SnapReport home"
          >
            <div className="w-9 h-9 rounded-cards bg-midnight-wine flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="h-[1px] w-8 bg-ink-charcoal/20 dark:bg-white/20 hidden sm:block" />
            <span className="text-label-bold tracking-tight text-ink-charcoal dark:text-ink-light hidden sm:block">
              SnapReport
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: "Dashboard", id: "dashboard", mode: null },
              { label: "Reports", id: "feed", mode: "list" as const },
              { label: "Map", id: "map", mode: "map" as const },
              { label: "Community", id: "community", mode: null },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.mode, item.id)}
                className="px-3.5 py-2 text-[15px] font-medium text-ink-charcoal dark:text-ink-light rounded-small hover:bg-lilac-mist/40 hover:text-ink-charcoal transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationBell />
            <button
              onClick={() => setShowForm(true)}
              className="app-btn-primary px-4 py-2.5 text-[13px] flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Report Incident</span>
            </button>
          </div>
        </div>
      </header>

      {/* ═══ Hero — full-bleed golden-hour photography ═══ */}
      <section id="top" className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-warm-parchment" />

        <div className="relative max-w-page mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 app-badge bg-white/70 backdrop-blur-sm border border-soft-mist text-ink-charcoal text-[13px]">
              <Users className="w-3.5 h-3.5 text-royal-violet" />
              Citizen-Powered Civic Response
            </div>

            <h1 className="text-display mt-6 text-ink-charcoal">
              Report. Upvote. Track Repairs.
            </h1>

            <p className="text-subheading mt-6 max-w-xl text-ink-charcoal/90">
              A transparent platform for citizens to report potholes, outages,
              and safety hazards. Support neighboring issues, follow repairs on
              the live map, and hold the city accountable.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              <button
                onClick={() => setShowForm(true)}
                className="app-btn-primary px-6 py-3.5 text-[15px] flex items-center gap-2"
              >
                Report an Incident
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("map", "map")}
                className="app-btn-outline px-6 py-3.5 text-[15px] flex items-center gap-2"
              >
                <Map className="w-4 h-4" />
                Explore the map
              </button>
            </div>

            <div className="hidden sm:flex flex-wrap items-center gap-6 mt-10 text-body-sm text-ink-charcoal/80">
              <span className="flex items-center gap-2 font-semibold">
                <span className="w-2 h-2 rounded-full bg-midnight-wine inline-block" />
                {incidents.length} Active Reports
              </span>
              <span className="flex items-center gap-2 font-semibold">
                <span className="w-2 h-2 rounded-full bg-royal-violet inline-block" />
                {totalCoSigns} Neighbor Co-Signs
              </span>
              <span className="flex items-center gap-2 font-semibold">
                <span className="w-2 h-2 rounded-full bg-deep-lagoon inline-block" />
                {resolvedCount} Resolved by City
              </span>
            </div>
          </div>
        </div>

        {/* Floating glass product cards over the photograph */}
        {/* Always visible - stack on mobile, sit side-by-side on larger screens */}
        <div className="app-card-floating animate-float pointer-events-auto w-full md:w-1/2 md:w-auto mt-6 mb-6 mx-auto left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center justify-between">
            <span className="text-caption text-stone-gray">Live Dispatch</span>
            <Radio className="w-4 h-4 text-royal-violet animate-pulse" />
          </div>
          <div className="flex -space-x-2">
            {["JD", "SM", "MV", "+"].map((initials, idx) => (
              <div
                key={`${initials}-${idx}`}
                className="w-8 h-8 rounded-full bg-midnight-wine text-white text-[10px] font-semibold flex items-center justify-center border-2 border-white"
              >
                {initials}
              </div>
            ))}
          </div>
          <p className="text-body-sm font-medium mt-2">
            {inProgressCount} crews in the field responding to open reports.
          </p>
          <button
            onClick={() => navigate("map", "map")}
            className="mt-3 text-[13px] font-medium text-royal-violet flex items-center gap-1.5 link-learn"
          >
            Track dispatches <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="app-card-floating animate-float pointer-events-auto w-full md:w-1/2 md:w-auto mt-6 mb-6 mx-auto left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center justify-between">
            <span className="text-caption text-stone-gray">Neighbor Petition</span>
            <Compass className="w-4 h-4 text-royal-violet" />
          </div>
          <p className="text-heading-sm leading-tight mt-1">
            {totalCoSigns.toLocaleString()}
          </p>
          <p className="text-body-sm text-stone-gray mt-1">
            co-signatures gathered across the district this month.
          </p>
          <button
            onClick={() => {
              if (incidents.length > 0) handleCoSign(incidents[0].id);
            }}
            className="mt-3 app-btn-outline w-full py-2.5 text-[13px] flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            Co-sign the top report
          </button>
        </div>
      </section>

      {/* ═══ Trust Logo Band — single row of six white cells ═══ */}
      <section className="max-w-page mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-caption text-stone-gray mb-4">
          Helping neighborhoods get fixed, together
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border border-soft-mist bg-paper-white divide-x divide-soft-mist rounded-cards overflow-hidden">
          {trustLogos.map(({ name, icon: Icon }) => (
            <div
              key={name}
              className="flex flex-col items-center justify-center gap-2.5 py-7 px-4 text-center"
            >
              <Icon className="w-5 h-5 text-ink-charcoal/70" />
              <span className="text-[15px] font-semibold text-ink-charcoal tracking-tight">
                {name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Main editorial content on parchment ═══ */}
      <main id="dashboard" className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-caption text-royal-violet uppercase tracking-widest">
              The District, At a Glance
            </span>
            <h2 className="text-heading-lg mt-3">Your neighborhood, live.</h2>
          </div>
          <p className="text-body-sm text-stone-gray max-w-sm sm:text-right">
            Every report below is public record. Follow repairs end-to-end, then
            confirm the fix with photo proof.
          </p>
        </div>

        <Dashboard incidents={incidents} />

        <AdvancedSearch
          filters={filters}
          onFiltersChange={setFilters}
          availableTags={availableTags}
        />

        {/* ═══ Suite Tab Strip — List / Map ═══ */}
        <div id="feed" className="app-card p-4 sm:p-6 mb-8 scroll-mt-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-cards bg-lilac-mist flex items-center justify-center">
                <MapPin className="w-5 h-5 text-royal-violet" />
              </div>
              <h3 className="text-heading-sm">
                Community Reports ({filteredIncidents.length})
              </h3>
            </div>

            <div className="flex items-center p-1 bg-warm-parchment dark:bg-white/[0.06] rounded-tabs border border-soft-mist dark:border-white/[0.12]">
              <button
                onClick={() => setViewMode("list")}
                className={`px-5 py-2.5 rounded-tabs text-[13px] font-medium flex items-center gap-2 transition-all ${
                  viewMode === "list"
                    ? "bg-lilac-mist text-ink-charcoal"
                    : "text-stone-gray hover:text-ink-charcoal dark:hover:text-ink-light"
                }`}
              >
                <LayoutList className="w-4 h-4" />
                List
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-5 py-2.5 rounded-tabs text-[13px] font-medium flex items-center gap-2 transition-all ${
                  viewMode === "map"
                    ? "bg-lilac-mist text-ink-charcoal"
                    : "text-stone-gray hover:text-ink-charcoal dark:hover:text-ink-light"
                }`}
              >
                <Map className="w-4 h-4" />
                Map
              </button>
            </div>
          </div>
        </div>

        {/* ═══ Feed / Map ═══ */}
        {viewMode === "map" ? (
          <div id="map" className="scroll-mt-24">
            <GazetteMap
              incidents={filteredIncidents}
              onSelectIncident={handleSelectIncidentFromMap}
              onCoSign={handleCoSign}
            />
          </div>
        ) : (
          <div className="space-y-8">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-soft-mist dark:border-white/[0.12] p-8 rounded-cards bg-paper-white dark:bg-card-dark">
                <div className="w-14 h-14 rounded-full bg-lilac-mist/50 mx-auto mb-4 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-royal-violet" />
                </div>
                <h4 className="text-heading-sm mb-2">
                  No Incident Records Found
                </h4>
                <p className="text-body-sm text-stone-gray max-w-md mx-auto">
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

      {/* ═══ Dark Feature Band — Deep Lagoon ═══ */}
      <section className="surface-lagoon mt-24 overflow-hidden relative">
        <div className="max-w-page mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="relative h-80 lg:h-auto lg:min-h-[420px]">
            <div className="absolute top-6 left-0 w-56 h-56 rounded-cards bg-lilac-mist/30 rotate-[-8deg]" />
            <div className="absolute top-16 left-16 w-64 h-56 rounded-cards bg-royal-violet/40 rotate-[6deg]" />
            <div className="absolute bottom-4 right-6 w-52 h-72 rounded-cards bg-midnight-wine/50 rotate-[-4deg] overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80')",
                }}
              />
            </div>
            <span
              className="absolute bottom-2 left-8 text-lilac-mist/90 font-script text-5xl rotate-[-6deg]"
              style={{ lineHeight: 1 }}
            >
              back in service
            </span>
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-caption text-lilac-mist uppercase tracking-widest">
              Repair Transparency
            </span>
            <h2 className="text-display text-white mt-5">
              Every repair, tracked to completion.
            </h2>
            <p className="text-body text-white/80 mt-6 max-w-lg">
              From first report to photo-proof of the fix. SnapReport pairs
              citizen reports with official dispatches so the whole
              neighborhood can watch progress in the open.
            </p>

            <div className="mt-8 max-w-md">
              <div className="flex justify-between text-caption text-white/70 mb-2">
                <span>District resolution rate</span>
                <span>94%</span>
              </div>
              <div className="h-1.5 rounded-pill bg-white/20 overflow-hidden">
                <div className="h-full w-[94%] bg-lilac-mist rounded-pill" />
              </div>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("list", "feed")}
                className="app-btn-white-ghost px-6 py-3 text-[14px]"
              >
                Read our announcement
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="app-btn-primary px-6 py-3 text-[14px]"
              >
                Report an issue
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Gradient Atmospheric Banner ═══ */}
      <section className="gradient-banner mt-24">
        <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-caption text-royal-violet uppercase tracking-widest">
              The Superhuman Suite
            </span>
            <h2 className="text-heading-lg mt-4">
              The most productive way to look after your street.
            </h2>
            <p className="text-body-sm text-stone-gray mt-4 max-w-md">
              One place to report, follow, and celebrate the repairs that keep
              your neighborhood safe.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="app-btn-primary px-7 py-3.5 text-[15px] flex items-center gap-2 shrink-0"
          >
            Get SnapReport
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ═══ Report Form Modal ═══ */}
      {showForm && (
        <IncidentForm
          onSubmit={handleSubmitIncident}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* ═══ Emergency Hotline Modal ═══ */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-ink-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="app-card max-w-md w-full p-6 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-warm-parchment text-midnight-wine mx-auto flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>

            <h3 className="text-heading-sm">Emergency Hotlines</h3>

            <p className="text-body-sm text-stone-gray">
              If an incident presents immediate danger to life or property,
              call emergency services immediately:
            </p>

            <div className="space-y-3 pt-1">
              <a
                href="tel:911"
                className="block app-btn-primary py-3.5 px-4 text-[15px] font-semibold text-center flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                Call 911 — Police / Fire / Ambulance
              </a>
              <a
                href="tel:311"
                className="block app-btn-outline py-3.5 px-4 text-[15px] font-semibold text-center flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                Call 311 — Municipal Hazard Line
              </a>
            </div>

            <button
              onClick={() => setShowEmergencyModal(false)}
              className="app-btn-ghost text-caption px-4 py-2"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* ═══ Footer — Midnight Wine ═══ */}
      <footer id="community" className="surface-wine mt-24 scroll-mt-0">
        <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-cards bg-white/10 flex items-center justify-center">
                  <Zap className="w-4.5 h-4.5 text-white" />
                </div>
                <h2 className="text-heading-sm text-white">SnapReport</h2>
              </div>
              <p className="text-body-sm text-white/70 max-w-sm">
                A public citizen platform dedicated to neighborhood safety,
                municipal transparency, and rapid hazard resolution.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-2 px-5 py-2.5 text-[13px] flex items-center gap-2 bg-white text-midnight-wine font-semibold rounded-buttons hover:bg-white/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                File a report
              </button>
            </div>

            <div className="md:col-span-2 space-y-4">
              <h4 className="text-micro text-white/90">Quick Links</h4>
              <ul className="space-y-3 text-[14px]">
                {[
                  { label: "Incident Feed", action: () => navigate("list", "feed") },
                  { label: "City Map", action: () => navigate("map", "map") },
                  { label: "Citizen Petitions", action: () => navigate(null, "dashboard") },
                  { label: "Before & After", action: () => navigate(null, "top") },
                ].map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={link.action}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2 space-y-4">
              <h4 className="text-micro text-white/90">Platform</h4>
              <ul className="space-y-3 text-[14px]">
                {[
                  { label: "SnapReport v2.0", action: () => navigate(null, "top") },
                  { label: "Public API", action: () => navigate(null, "dashboard") },
                  { label: "Status Page", action: () => navigate(null, "dashboard") },
                  { label: "Open Data", action: () => navigate(null, "map") },
                ].map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={link.action}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3 space-y-4">
              <h4 className="text-micro text-white/90">Community</h4>
              <ul className="space-y-3 text-[14px]">
                {[
                  { label: "Neighbor Meetups", action: () => navigate(null, "community") },
                  { label: "Volunteer Corps", action: () => navigate(null, "community") },
                  { label: "City Council Updates", action: () => navigate(null, "community") },
                  { label: "Contact sales", action: () => { const mail = document.createElement("a"); mail.href = "mailto:hello@snapreport.app"; mail.click(); } },
                ].map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={link.action}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-[12px] text-white/50">
            <span>© 2026 SnapReport Inc. · Metropolis District</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-lilac-mist inline-block" />
              All systems operational
            </span>
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