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
      accentColor: 'text-royal-violet',
    },
    {
      title: 'Open Hazards',
      count: openIncidents,
      icon: AlertCircle,
      accentColor: 'text-midnight-wine',
    },
    {
      title: 'In Repair',
      count: inProgressIncidents,
      icon: Clock,
      accentColor: 'text-royal-violet',
    },
    {
      title: 'Resolved',
      count: resolvedIncidents,
      icon: CheckCircle2,
      accentColor: 'text-deep-lagoon',
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
              <span className="text-caption text-stone-gray block mb-1.5">
                {stat.title}
              </span>
              <span className="text-4xl font-normal text-ink-charcoal dark:text-ink-light tracking-tight" style={{ fontWeight: 460 }}>
                {stat.count}
              </span>
            </div>

            <div className="w-12 h-12 rounded-cards bg-lilac-mist/50 flex items-center justify-center">
              <Icon className={`w-5 h-5 ${stat.accentColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};