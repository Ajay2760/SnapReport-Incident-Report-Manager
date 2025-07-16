import React, { useState, useEffect } from "react";
import { Plus, Zap, Users, Camera, TrendingUp } from "lucide-react";
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
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";
import { NotificationBell } from "./components/NotificationBell";

// Mock data for demonstration
const mockIncidents: Incident[] = [
  {
    id: "1",
    title: "Pothole on Main Street",
    description:
      "Large pothole causing vehicle damage near the intersection of Main St and Oak Ave. Multiple cars have been affected.",
    category: "infrastructure",
    priority: "high",
    status: "open",
    location: "Main Street & Oak Avenue",
    coordinates: { lat: 40.7128, lng: -74.006 },
    reportedBy: "John Smith",
    reportedAt: new Date("2024-01-15T10:30:00"),
    tags: ["road", "damage", "urgent"],
    solutions: [
      {
        id: "1",
        author: "City Engineer",
        content:
          "We've scheduled this for repair next week. Temporary cones will be placed today.",
        createdAt: new Date("2024-01-15T14:00:00"),
        helpful: 5,
        unhelpful: 0,
      },
    ],
    imageUrl:
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "2",
    title: "Broken Streetlight",
    description:
      "Streetlight is out on Elm Street, making the area unsafe at night.",
    category: "safety",
    priority: "medium",
    status: "in-progress",
    location: "Elm Street between 5th and 6th",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    reportedBy: "Sarah Johnson",
    reportedAt: new Date("2024-01-14T18:45:00"),
    tags: ["lighting", "safety", "night"],
    solutions: [],
    imageUrl: "https://ibb.co/fVxdhc1b",
  },
];

function App() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [showForm, setShowForm] = useState(false);
  const [currentView, setCurrentView] = useState<"list">("list");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  );
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    statusFilter: "",
    categoryFilter: "",
    priorityFilter: "",
    tags: [],
  });

  // Get all available tags
  const availableTags = Array.from(
    new Set(incidents.flatMap((incident) => incident.tags || []))
  );

  const handleSubmitIncident = (formData: IncidentFormData) => {
    const newIncident: Incident = {
      id: Date.now().toString(),
      ...formData,
      status: "open",
      reportedAt: new Date(),
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
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    SnapReport
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Report fast, resolve faster
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <NotificationBell />
                <ThemeToggle />
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  Report Incident
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Making Our Community Safer Together
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Report incidents instantly, share solutions collaboratively, and
              build a safer community for everyone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="bg-white bg-opacity-20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Snap & Report</h3>
                <p className="text-blue-100">
                  Quick photo-based incident reporting with smart categorization
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Community Solutions
                </h3>
                <p className="text-blue-100">
                  Collaborate with neighbors to find and share effective
                  solutions
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Real-time Tracking
                </h3>
                <p className="text-blue-100">
                  Live updates and progress tracking with instant notifications
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Dashboard incidents={incidents} />

          <AdvancedSearch
            filters={filters}
            onFiltersChange={setFilters}
            availableTags={availableTags}
          />

          <div className="grid gap-6">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No incidents found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {filters.searchTerm ||
                  filters.statusFilter ||
                  filters.categoryFilter ||
                  filters.priorityFilter
                    ? "Try adjusting your search filters"
                    : "Be the first to report an incident in your community"}
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
                />
              ))
            )}
          </div>
        </main>

        {/* Form Modal */}
        {showForm && (
          <IncidentForm
            onSubmit={handleSubmitIncident}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
