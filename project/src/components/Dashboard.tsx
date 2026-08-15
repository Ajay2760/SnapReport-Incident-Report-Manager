import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, Clock, ShieldAlert } from 'lucide-react';
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
      roman: 'I',
      label: 'TOTAL DISPATCHES',
      value: totalIncidents,
      icon: TrendingUp,
      badge: 'VOL. ALL'
    },
    {
      roman: 'II',
      label: 'OPEN INCIDENTS',
      value: openIncidents,
      icon: AlertTriangle,
      badge: 'URGENT'
    },
    {
      roman: 'III',
      label: 'IN PROGRESS',
      value: inProgressIncidents,
      icon: Clock,
      badge: 'ACTIVE'
    },
    {
      roman: 'IV',
      label: 'RESOLVED',
      value: resolvedIncidents,
      icon: CheckCircle,
      badge: 'CLOSED'
    }
  ];

  return (
    <div className="mb-12 space-y-6">
      {/* Section Header with Art Deco Centered Dividers */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gold/40 pb-3 gap-2">
        <div className="flex items-center gap-3">
          <span className="text-gold font-serif text-lg font-bold">✦</span>
          <h3 className="font-serif font-bold text-xl uppercase tracking-widest text-gold flex items-center gap-2">
            DISPATCH METRICS & GAZETTE INDEX
          </h3>
        </div>
        <span className="font-mono text-xs text-pewter uppercase tracking-widest">
          FIG. II.0 • REALTIME METRIC INDEX
        </span>
      </div>

      {/* Art Deco Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="art-deco-card art-deco-corner-wrapper p-6 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="font-serif text-gold/80 font-bold text-sm tracking-wider">
                  [{stat.roman}]
                </span>
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-pewter group-hover:text-champagne transition-colors">
                  {stat.label}
                </span>
              </div>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 border border-gold/40 bg-obsidian text-gold tracking-widest">
                {stat.badge}
              </span>
            </div>
            
            <div className="flex items-baseline justify-between pt-2">
              <span className="text-5xl font-serif font-bold tracking-tight text-gold group-hover:text-gold-light transition-colors">
                {stat.value}
              </span>
              <div className="p-2 border border-gold/30 bg-obsidian text-gold group-hover:border-gold shadow-gold-glow-sm transition-all rotate-45">
                <stat.icon className="w-4 h-4 -rotate-45" />
              </div>
            </div>

            {/* Bottom accent line */}
            <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          </div>
        ))}
      </div>

      {/* Critical Incidents Warning Banner */}
      {criticalIncidents > 0 && (
        <div className="border border-gold bg-charcoal text-champagne p-5 art-deco-corner-wrapper shadow-gold-glow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2.5 border border-gold bg-obsidian text-gold animate-pulse">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="font-serif font-bold tracking-widest uppercase text-base text-gold block">
                  CRITICAL DISPATCH WARNING: {criticalIncidents} HIGH-PRIORITY EMERGENCY FILED
                </span>
                <span className="text-pewter text-xs font-body">
                  Immediate municipal or emergency team intervention requested.
                </span>
              </div>
            </div>
            <span className="bg-gold text-obsidian px-4 py-1.5 font-serif font-bold tracking-widest uppercase text-xs shadow-gold-glow-sm">
              PRIORITY LEVEL I
            </span>
          </div>
        </div>
      )}
    </div>
  );
};