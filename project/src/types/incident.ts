export interface Incident {
  id: string;
  title: string;
  description: string;
  category: 'safety' | 'infrastructure' | 'environmental' | 'security' | 'maintenance' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved';
  location: string;
  coordinates?: { lat: number; lng: number };
  reportedBy: string;
  reportedAt: Date;
  solutions: Solution[];
  imageUrl?: string;
  resolvedImageUrl?: string;
  resolvedAt?: Date;
  coSignersCount?: number;
  isVerified?: boolean;
  tags?: string[];
  // Citizen-focused Feature Additions
  stepProgress?: 'reported' | 'review' | 'dispatched' | 'resolved';
  eta?: string;
  affectsMeCount?: number;
  audioUrl?: string;
  audioDuration?: number;
}

export interface Solution {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  helpful: number;
  unhelpful: number;
}

export interface IncidentFormData {
  title: string;
  description: string;
  category: Incident['category'];
  priority: Incident['priority'];
  location: string;
  coordinates?: { lat: number; lng: number };
  reportedBy: string;
  tags?: string[];
  eta?: string;
  audioUrl?: string;
}

export interface SearchFilters {
  searchTerm: string;
  statusFilter: string;
  categoryFilter: string;
  priorityFilter: string;
  dateFrom?: Date;
  dateTo?: Date;
  locationRadius?: number;
  tags?: string[];
}