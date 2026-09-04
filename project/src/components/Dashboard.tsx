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
      title: 'Total Dispatches',
      count: totalIncidents,
      icon: ShieldAlert,
      accentColor: 'text-signal-blue',
      bgIcon: 'bg-signal-blue/10 dark:bg-signal-blue/20',
    },
    {
      title: 'Open Hazards',
      count: openIncidents,
      icon: AlertCircle,
      accentColor: 'text-amber-alert',
      bgIcon: 'bg-amber-alert/10 dark:bg-amber-alert/20',
    },
    {
      title: 'In Repair',
      count: inProgressIncidents,
      icon: Clock,
      accentColor: 'text-signal-blue',
      bgIcon: 'bg-signal-blue/10 dark:bg-signal-blue/20',
    },
    {
      title: 'Resolved',
      count: resolvedIncidents,
      icon: CheckCircle2,
      accentColor: 'text-emerald-500',
      bgIcon: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="app-card p-5 flex items-center justify-between animate-in"
            style={{ animationDelay: `${idx * 0.08}s` }}
          >
            <div>
              <span className="text-micro text-steel block mb-1.5">
                {stat.title}
              </span>
              <span className="text-3xl font-bold text-black dark:text-white tracking-tight">
                {stat.count}
              </span>
            </div>

            <div className={`w-12 h-12 rounded-card flex items-center justify-center ${stat.bgIcon}`}>
              <Icon className={`w-5 h-5 ${stat.accentColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};