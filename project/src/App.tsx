import { useState, useEffect } from "react";
import {
  Plus,
  Users,
  Radio,
  Map,
  LayoutList,
  PhoneCall,
  ShieldAlert,
  ArrowUpRight,
  ArrowRight,
  MapPin,
  Landmark,
  Building2,
  Home,
  Trees,
  Warehouse,
  Waves,
  AlertCircle,
  Zap,
  Siren,
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
import { useReveal } from "./hooks/useReveal";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    statusFilter: "",
    categoryFilter: "",
    priorityFilter: "",
    tags: [],
  });

  useReveal(incidents.length + viewMode);

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
    setMenuOpen(false);
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
    <div className="bg-canvas grain min-h-screen font-sans" style={{ color: "var(--foreground)" }}>
      {/* ═══ Emergency strip ═══ */}
      <div className="container-inline pt-5">
        <div className="reveal mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-2.5 rounded-full border px-4 py-2 text-[13px]"
          style={{ background: "var(--surface)", borderColor: "var(--border-default)" }}>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f43f5e]/15 text-[#f43f5e]">
            <Siren className="h-3.5 w-3.5" />
          </span>
          <span className="font-medium" style={{ color: "var(--foreground-muted)" }}>
            Life-threatening emergency? Gas leaks, fallen power lines, fire
          </span>
          <button onClick={() => setShowEmergencyModal(true)} className="font-bold underline decoration-[#f43f5e]/50 underline-offset-4 hover:decoration-[#f43f5e]">
            Call 911 / 311
          </button>
        </div>
      </div>

      {/* ═══ Live ticker ═══ */}
      <div className="container-inline mt-4">
        <div className="reveal flex flex-col items-center justify-between gap-2 py-1 sm:flex-row">
          <div className="flex items-center gap-3 text-[13px]">
            <span className="badge-live badge">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </span>
            <span className="truncate font-medium" style={{ color: "var(--foreground-muted)" }}>
              {incidents.length > 0
                ? `Latest: ${incidents[0].title} — ${incidents[0].status}`
                : "All Municipal Services Operational"}
            </span>
          </div>
          <div className="hidden items-center gap-2 text-[13px] font-semibold sm:flex" style={{ color: "var(--foreground-muted)" }}>
            <span style={{ color: "var(--foreground)" }}>SnapReport</span>
            <span aria-hidden>·</span>
            <span>Metropolitan Region</span>
          </div>
        </div>
      </div>

      {/* ═══ Floating island nav ═══ */}
      <div className="sticky top-3.5 z-40 px-4">
        <header className={`nav-island ${scrolled ? "scrolled" : ""}`}>
          <button onClick={() => navigate(null, "top")} className="group flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3" aria-label="SnapReport home">
            <span className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ background: "var(--accent)", boxShadow: "0 8px 20px -6px var(--accent-glow)" }}>
              <Zap className="h-4 w-4" />
            </span>
            <span className="hidden text-[15px] font-800 font-extrabold tracking-tight sm:inline" style={{ color: "var(--foreground)" }}>
              SnapReport
            </span>
          </button>

          <nav className="hidden items-center gap-0.5 md:flex">
            {[
              { label: "Dashboard", id: "dashboard", mode: null },
              { label: "Reports", id: "feed", mode: "list" as const },
              { label: "Map", id: "map", mode: "map" as const },
              { label: "Community", id: "community", mode: null },
            ].map((item) => (
              <button key={item.label} onClick={() => navigate(item.mode, item.id)} className="nav-link">
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <NotificationBell />
            <button onClick={() => setShowForm(true)} className="btn btn-primary group ml-1 !min-h-[40px] !py-2 text-[13.5px]">
              <Plus className="h-4 w-4 transition-transform duration-500 group-hover:rotate-90" style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }} />
              <span className="hidden sm:inline">Report incident</span>
              <span className="btn-icon-circle hidden sm:inline-flex"><ArrowUpRight className="h-4 w-4" /></span>
            </button>
            <button onClick={() => setMenuOpen((v) => !v)} className="btn btn-ghost !min-h-[40px] !px-3 md:hidden" aria-label="Menu">
              <span className="relative block h-4 w-5">
                <span className={`absolute left-0 top-0 h-[2px] w-full rounded transition-all duration-500 ${menuOpen ? "top-[7px] rotate-45" : ""}`} style={{ background: "var(--foreground)" }} />
                <span className={`absolute left-0 top-[7px] h-[2px] w-full rounded transition-all duration-500 ${menuOpen ? "opacity-0" : ""}`} style={{ background: "var(--foreground)" }} />
                <span className={`absolute left-0 top-[14px] h-[2px] w-full rounded transition-all duration-500 ${menuOpen ? "top-[7px] -rotate-45" : ""}`} style={{ background: "var(--foreground)" }} />
              </span>
            </button>
          </div>
        </header>

        {menuOpen && (
          <div className="surface-glass mx-auto mt-2 w-fit max-w-full rounded-3xl p-2 md:hidden">
            {[
              { label: "Dashboard", id: "dashboard", mode: null },
              { label: "Reports", id: "feed", mode: "list" as const },
              { label: "Map", id: "map", mode: "map" as const },
              { label: "Community", id: "community", mode: null },
            ].map((item, i) => (
              <button key={item.label} onClick={() => navigate(item.mode, item.id)}
                className="reveal is-visible flex w-56 items-center justify-between rounded-2xl px-5 py-3.5 text-[15px] font-semibold hover:bg-[var(--surface)]"
                style={{ transitionDelay: `${i * 60}ms`, color: "var(--foreground)" }}>
                {item.label}
                <ArrowRight className="h-4 w-4 opacity-50" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ═══ Hero — editorial split ═══ */}
      <section id="top" className="container-inline pt-12 sm:pt-16 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="reveal">
            <span className="eyebrow"><span className="dot" /> Citizen-powered civic response</span>
            <h1 className="text-display mt-6 text-balance">
              Report. Rally.
              <br />
              <span className="text-display-serif font-normal">Track repairs</span>{" "}
              <span className="text-gradient">to done.</span>
            </h1>
            <p className="text-lead mt-6 max-w-xl">
              A transparent operations console for potholes, outages and safety
              hazards. Co-sign your neighbor's issue, follow crews on the live
              map, and close the loop with photo proof.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button onClick={() => setShowForm(true)} className="btn btn-primary group px-6 py-3.5 text-[15px]">
                Report an incident
                <span className="btn-icon-circle"><ArrowUpRight className="h-4 w-4" /></span>
              </button>
              <button onClick={() => navigate("map", "map")} className="btn btn-secondary group px-6 py-3.5 text-[15px]">
                <Map className="h-4 w-4" />
                Explore the map
              </button>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t pt-7" style={{ borderColor: "var(--border-default)" }}>
              {[
                { v: incidents.length, l: "Active reports" },
                { v: totalCoSigns, l: "Neighbor co-signs" },
                { v: resolvedCount, l: "Resolved by city" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="order-2 mt-1.5 block text-[12.5px] font-medium" style={{ color: "var(--foreground-muted)" }}>{s.l}</dt>
                  <dd className="stat-num tabular">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Bento visual */}
          <div className="reveal grid gap-3 sm:grid-cols-2" style={{ transitionDelay: "120ms" }}>
            <div className="bezel sm:col-span-2">
              <div className="bezel-inner relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1400&q=80"
                  alt="City at golden hour" className="h-60 w-full object-cover sm:h-72" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, rgba(2,2,4,0.72) 100%)" }} />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">Live dispatch</p>
                    <p className="mt-1 text-lg font-bold text-white">{inProgressCount} crews in the field right now</p>
                  </div>
                  <button onClick={() => navigate("map", "map")} className="btn group bg-white/12 !min-h-[40px] text-[13px] text-white backdrop-blur-xl hover:bg-white/20" style={{ background: "rgba(255,255,255,0.14)" }}>
                    Track <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-[12px] font-bold text-white backdrop-blur-xl">
                  <Radio className="h-3.5 w-3.5" /> SECTOR 04-A · LIVE
                </div>
              </div>
            </div>

            <div className="bezel">
              <div className="bezel-inner p-5">
                <div className="flex items-center justify-between">
                  <span className="text-caption">Neighbor petition</span>
                  <Users className="h-4 w-4" style={{ color: "var(--accent-bright)" }} />
                </div>
                <p className="stat-num tabular mt-3">{totalCoSigns.toLocaleString()}</p>
                <p className="text-body-sm mt-1">co-signatures this month across the district.</p>
                <div className="mt-3 flex -space-x-2">
                  {["JD", "SM", "MV", "+"].map((t, i) => (
                    <span key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 text-[10px] font-bold text-white"
                      style={{ background: "var(--accent)", borderColor: "var(--background-elevated)" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bezel">
              <div className="bezel-inner flex h-full flex-col justify-between p-5" style={{ background: "var(--accent)", borderColor: "transparent" }}>
                <div className="flex items-center justify-between text-white">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/75">Resolution rate</span>
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <p className="mt-4 text-5xl font-extrabold tracking-tight text-white tabular">94%</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/25">
                  <div className="h-full w-[94%] rounded-full bg-white" />
                </div>
                <button onClick={() => { if (incidents.length) handleCoSign(incidents[0].id); }}
                  className="btn mt-4 w-full bg-white !min-h-[42px] text-[13.5px] font-bold text-[#2b2f9e] hover:bg-white/90">
                  Co-sign top report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="reveal mt-14 flex flex-col items-center gap-5 border-y py-7" style={{ borderColor: "var(--border-default)" }}>
          <p className="text-caption">Helping neighborhoods get fixed — together</p>
          <div className="flex flex-wrap items-center justify-center gap-x-9 gap-y-3 opacity-70">
            {trustLogos.map(({ name, icon: Icon }) => (
              <span key={name} className="flex items-center gap-2 text-[14.5px] font-bold tracking-tight" style={{ color: "var(--foreground-muted)" }}>
                <Icon className="h-[18px] w-[18px]" /> {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Operations ═══ */}
      <main id="dashboard" className="container-inline section-pad scroll-mt-24 !pb-8">
        <div className="reveal flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow"><span className="dot" /> The district, at a glance</span>
            <h2 className="text-heading-1 mt-4">Your neighborhood, <span className="text-display-serif font-normal">live.</span></h2>
          </div>
          <p className="text-body-sm max-w-sm sm:text-right">
            Every report is public record. Follow repairs end-to-end, then confirm the fix with photo proof.
          </p>
        </div>

        <div className="reveal mt-8"><Dashboard incidents={incidents} /></div>
        <div className="reveal mt-4"><AdvancedSearch filters={filters} onFiltersChange={setFilters} availableTags={availableTags} /></div>

        {/* Feed header */}
        <div id="feed" className="bezel reveal mt-4 scroll-mt-32">
          <div className="bezel-inner flex flex-col justify-between gap-4 p-4 sm:p-5 md:flex-row md:items-center">
            <div className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: "var(--accent-glow)", color: "var(--accent-bright)" }}>
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-heading-3">Community reports</h3>
                <p className="text-body-sm">{filteredIncidents.length} in view · sorted by recent activity</p>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full border p-1" style={{ borderColor: "var(--border-default)", background: "var(--surface)" }}>
              {([
                { k: "list", label: "List", icon: LayoutList },
                { k: "map", label: "Map", icon: Map },
              ] as const).map((t) => (
                <button key={t.k} onClick={() => setViewMode(t.k)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-bold transition-all duration-500 ${viewMode === t.k ? "text-white shadow-lg" : ""}`}
                  style={viewMode === t.k ? { background: "var(--accent)", transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" } : { color: "var(--foreground-muted)" }}>
                  <t.icon className="h-4 w-4" /> {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {viewMode === "map" ? (
          <div id="map" className="reveal is-visible mt-4 scroll-mt-32">
            <GazetteMap incidents={filteredIncidents} onSelectIncident={handleSelectIncidentFromMap} onCoSign={handleCoSign} />
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {filteredIncidents.length === 0 ? (
              <div className="bezel reveal is-visible">
                <div className="bezel-inner flex flex-col items-center p-12 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "var(--accent-glow)", color: "var(--accent-bright)" }}>
                    <AlertCircle className="h-7 w-7" />
                  </span>
                  <h4 className="text-heading-2 mt-4">No incident records found</h4>
                  <p className="text-body-sm mt-2 max-w-md">
                    {filters.searchTerm || filters.statusFilter || filters.categoryFilter || filters.priorityFilter
                      ? "No reports match your active filters. Try resetting your search."
                      : "No incident reports yet. Be the first neighbor to file one."}
                  </p>
                </div>
              </div>
            ) : (
              filteredIncidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident}
                  onAddSolution={handleAddSolution} onUpdateStatus={handleUpdateStatus}
                  onRateSolution={handleRateSolution} onCoSign={handleCoSign} />
              ))
            )}
          </div>
        )}
      </main>

      {/* ═══ Feature band ═══ */}
      <section className="container-inline mt-8">
        <div className="bezel reveal">
          <div className="bezel-inner grid overflow-hidden lg:grid-cols-2" style={{ background: "#0a0a0d", borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="relative min-h-[340px] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1000&q=80"
                alt="Repair site" className="absolute inset-0 h-full w-full object-cover opacity-70" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(10,10,13,0.2) 0%, rgba(10,10,13,0.85) 88%)" }} />
              <span className="absolute bottom-6 left-6 font-display text-4xl italic text-white/90" style={{ fontFamily: "var(--font-display)" }}>
                back in service.
              </span>
              <span className="absolute left-6 top-6 rounded-full bg-white/12 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-xl" style={{ background: "rgba(255,255,255,0.14)" }}>
                Repair transparency
              </span>
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <h2 className="text-display !text-[clamp(2rem,4vw,3.2rem)] text-white">Every repair,<br />tracked to completion.</h2>
              <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-white/65">
                From first report to photo-proof of the fix. SnapReport pairs citizen reports with official dispatches so the whole neighborhood watches progress in the open.
              </p>
              <div className="mt-7 max-w-md">
                <div className="mb-2 flex justify-between text-[12px] font-bold uppercase tracking-widest text-white/55">
                  <span>District resolution rate</span><span className="text-white">94%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/12"><div className="h-full w-[94%] rounded-full" style={{ background: "var(--accent-bright)" }} /></div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => navigate("list", "feed")} className="btn group bg-white/10 px-6 py-3 text-sm text-white backdrop-blur hover:bg-white/16" style={{ background: "rgba(255,255,255,0.1)" }}>
                  Read announcement <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </button>
                <button onClick={() => setShowForm(true)} className="btn btn-primary group px-6 py-3 text-sm">
                  Report an issue <span className="btn-icon-circle"><ArrowUpRight className="h-4 w-4" /></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA banner ═══ */}
      <section className="container-inline mt-4">
        <div className="bezel reveal">
          <div className="bezel-inner relative overflow-hidden p-8 sm:p-12" style={{ background: "linear-gradient(120deg, var(--accent-glow), transparent 55%), var(--background-elevated)" }}>
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl" style={{ background: "var(--accent-glow)" }} />
            <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <span className="text-caption" style={{ color: "var(--accent-bright)" }}>The SnapReport suite</span>
                <h2 className="text-heading-1 mt-3">The most productive way to look after your street.</h2>
                <p className="text-body-sm mt-3 max-w-md text-[15px]">One place to report, follow, and celebrate the repairs that keep your neighborhood safe.</p>
              </div>
              <button onClick={() => setShowForm(true)} className="btn btn-primary group shrink-0 px-7 py-3.5 text-[15px]">
                Get SnapReport <span className="btn-icon-circle"><ArrowUpRight className="h-4 w-4" /></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {showForm && <IncidentForm onSubmit={handleSubmitIncident} onCancel={() => setShowForm(false)} />}

      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/65 backdrop-blur-md" onClick={() => setShowEmergencyModal(false)} />
          <div className="bezel relative w-full max-w-md">
            <div className="bezel-inner p-7 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f43f5e]/12 text-[#f43f5e]">
                <ShieldAlert className="h-7 w-7 animate-pulse" />
              </span>
              <h3 className="text-heading-2 mt-4">Emergency hotlines</h3>
              <p className="text-body-sm mt-2">Immediate danger to life or property? Call now:</p>
              <div className="mt-5 space-y-2.5">
                <a href="tel:911" className="btn w-full bg-[#f43f5e] py-3.5 text-[15px] font-bold text-white hover:bg-[#e11d48]">
                  <PhoneCall className="h-4 w-4" /> Call 911 — Police / Fire / Ambulance
                </a>
                <a href="tel:311" className="btn btn-secondary w-full py-3.5 text-[15px]">
                  <PhoneCall className="h-4 w-4" /> Call 311 — Municipal Hazard Line
                </a>
              </div>
              <button onClick={() => setShowEmergencyModal(false)} className="btn btn-ghost mx-auto mt-3 text-[13px]">Close window</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Footer ═══ */}
      <footer id="community" className="container-inline mt-16 scroll-mt-24 pb-10">
        <div className="bezel reveal">
          <div className="bezel-inner p-8 sm:p-12">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="space-y-4 md:col-span-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ background: "var(--accent)" }}>
                    <Zap className="h-4 w-4" />
                  </span>
                  <span className="text-lg font-extrabold tracking-tight">SnapReport</span>
                </div>
                <p className="text-body-sm max-w-sm text-[14.5px]">A public citizen platform for neighborhood safety, municipal transparency, and rapid hazard resolution.</p>
                <button onClick={() => setShowForm(true)} className="btn btn-secondary text-sm">
                  <Plus className="h-4 w-4" /> File a report
                </button>
              </div>
              {[
                { h: "Explore", links: [
                  { label: "Incident feed", action: () => navigate("list", "feed") },
                  { label: "City map", action: () => navigate("map", "map") },
                  { label: "Citizen petitions", action: () => navigate(null, "dashboard") },
                  { label: "Before & after", action: () => navigate(null, "top") },
                ]},
                { h: "Platform", links: [
                  { label: "SnapReport v2.0", action: () => navigate(null, "top") },
                  { label: "Public API", action: () => navigate(null, "dashboard") },
                  { label: "Status page", action: () => navigate(null, "dashboard") },
                  { label: "Open data", action: () => navigate(null, "map") },
                ]},
                { h: "Community", links: [
                  { label: "Neighbor meetups", action: () => navigate(null, "community") },
                  { label: "Volunteer corps", action: () => navigate(null, "community") },
                  { label: "Council updates", action: () => navigate(null, "community") },
                  { label: "Contact — hello@snapreport.app", action: () => { const m = document.createElement("a"); m.href = "mailto:hello@snapreport.app"; m.click(); } },
                ]},
              ].map((col) => (
                <div key={col.h} className="space-y-4 md:col-span-2">
                  <h4 className="text-caption">{col.h}</h4>
                  <ul className="space-y-2.5 text-[14px] font-medium" style={{ color: "var(--foreground-muted)" }}>
                    {col.links.map((l) => (
                      <li key={l.label}><button onClick={l.action} className="transition-colors hover:text-[var(--foreground)]" style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}>{l.label}</button></li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="md:col-span-1" />
            </div>
            <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t pt-6 text-[12.5px] md:flex-row" style={{ borderColor: "var(--border-default)", color: "var(--foreground-muted)" }}>
              <span>© 2026 SnapReport Inc. · Metropolis District</span>
              <span className="flex items-center gap-2 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> All systems operational
              </span>
            </div>
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
