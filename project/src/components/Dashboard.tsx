import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Incident } from '../types/incident';

interface DashboardProps {
  incidents: Incident[];
}

export const Dashboard: React.FC<DashboardProps> = ({ incidents }) => {
  const totalIncidents = incidents.length;
  const openIncidents = incidents.filter(i => i.status === 'open').length;
  const inProgressIncidents = incidents.filter(i => i.status === 'in-progress').length;
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved').length;
  const criticalIncidents = incidents.filter(i => i.priority === 'critical').length;

  const stats = [
    {
      label: 'Total Incidents',
      value: totalIncidents,
      icon: TrendingUp,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      label: 'Open',
      value: openIncidents,
      icon: AlertTriangle,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      label: 'In Progress',
      value: inProgressIncidents,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      label: 'Resolved',
      value: resolvedIncidents,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-full`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
      
      {criticalIncidents > 0 && (
        <div className="md:col-span-2 lg:col-span-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="font-medium text-red-800 dark:text-red-300">
                {criticalIncidents} Critical incident{criticalIncidents > 1 ? 's' : ''} requiring immediate attention
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};