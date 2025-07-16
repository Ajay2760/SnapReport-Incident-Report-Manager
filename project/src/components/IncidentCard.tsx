import React, { useState } from 'react';
import { MapPin, User, Clock, MessageSquare, Send, Tag } from 'lucide-react';
import { Incident, Solution } from '../types/incident';
import { SolutionRating } from './SolutionRating';

interface IncidentCardProps {
  incident: Incident;
  onAddSolution: (incidentId: string, solution: Omit<Solution, 'id' | 'createdAt' | 'helpful' | 'unhelpful'>) => void;
  onUpdateStatus: (incidentId: string, status: Incident['status']) => void;
  onRateSolution: (incidentId: string, solutionId: string, type: 'helpful' | 'unhelpful') => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ 
  incident, 
  onAddSolution, 
  onUpdateStatus,
  onRateSolution
}) => {
  const [showSolutions, setShowSolutions] = useState(false);
  const [newSolution, setNewSolution] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [userRatings, setUserRatings] = useState<Record<string, 'helpful' | 'unhelpful'>>({});

  const getPriorityColor = (priority: Incident['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: Incident['status']) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: Incident['category']) => {
    switch (category) {
      case 'safety': return '🛡️';
      case 'infrastructure': return '🏗️';
      case 'environmental': return '🌱';
      case 'security': return '🔒';
      case 'maintenance': return '🔧';
      default: return '📋';
    }
  };

  const handleSubmitSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSolution.trim() && authorName.trim()) {
      onAddSolution(incident.id, {
        author: authorName,
        content: newSolution,
      });
      setNewSolution('');
      setAuthorName('');
    }
  };

  const handleRating = (solutionId: string, type: 'helpful' | 'unhelpful') => {
    // Prevent multiple ratings from same user (in real app, this would be handled by backend)
    if (userRatings[solutionId]) return;
    
    setUserRatings(prev => ({ ...prev, [solutionId]: type }));
    onRateSolution(incident.id, solutionId, type);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getCategoryIcon(incident.category)}</span>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{incident.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{incident.category}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(incident.priority)}`}>
            {incident.priority.toUpperCase()}
          </span>
          <select
            value={incident.status}
            onChange={(e) => onUpdateStatus(incident.id, e.target.value as Incident['status'])}
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)} border-0 cursor-pointer`}
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4">{incident.description}</p>

      {/* Image */}
      {incident.imageUrl && (
        <div className="mb-4">
          <img
            src={incident.imageUrl}
            alt="Incident"
            className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
          />
        </div>
      )}

      {/* Tags */}
      {incident.tags && incident.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {incident.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          {incident.location}
        </div>
        <div className="flex items-center gap-1">
          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          {incident.reportedBy}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          {formatDate(incident.reportedAt)}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setShowSolutions(!showSolutions)}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          {incident.solutions.length} Solutions
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Status: <span className="font-medium">{incident.status.replace('-', ' ')}</span>
          </span>
        </div>
      </div>

      {showSolutions && (
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="space-y-3 mb-4">
            {incident.solutions.map((solution) => (
              <div key={solution.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{solution.author}</span>
                  <div className="flex items-center gap-2">
                    <SolutionRating
                      helpful={solution.helpful}
                      unhelpful={solution.unhelpful}
                      onRate={(type) => handleRating(solution.id, type)}
                      userRating={userRatings[solution.id]}
                    />
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formatDate(solution.createdAt)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{solution.content}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmitSolution} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your name"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <textarea
                value={newSolution}
                onChange={(e) => setNewSolution(e.target.value)}
                placeholder="Share your solution or suggestion..."
                rows={3}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={!newSolution.trim() || !authorName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};