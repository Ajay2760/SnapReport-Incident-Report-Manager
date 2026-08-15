import React from 'react';
import { AlertCircle, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Incident } from '../types/incident';

interface DashboardProps {
  incidents: Incident[];
}

export const Dashboard: React.FC<DashboardProps> = ({ incidents }) => {
  const totalIncidents = incidents.length;
  const openIncidents = incidents.filter(i => i.status === 'open').length;
  const inProgressIncidents = incidents.filter(i => i.status === 'in-progress').length;
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved').length;

  const stats = [
    {
      title: 'TOTAL DISPATCHES',
      count: totalIncidents,
      icon: ShieldAlert,
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400',
      border: 'border-indigo-200 dark:border-indigo-800',
    },
    {
      title: 'OPEN HAZARDS',
      count: openIncidents,
      icon: AlertCircle,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
    },
    {
      title: 'IN REPAIR',
      count: inProgressIncidents,
      icon: Clock,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
    },
    {
      title: 'RESOLVED & FIXED',
      count: resolvedIncidents,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className={`app-card p-5 border ${stat.border} flex items-center justify-between`}
          >
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                {stat.title}
              </span>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {stat.count}
              </span>
            </div>

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
};