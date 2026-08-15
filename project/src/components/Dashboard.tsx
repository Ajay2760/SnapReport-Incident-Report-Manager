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
      label: 'TOTAL DISPATCHES',
      value: totalIncidents,
      icon: TrendingUp,
      accent: 'border-l-4 border-l-[#111111]',
      badge: 'VOL. ALL'
    },
    {
      label: 'OPEN INCIDENTS',
      value: openIncidents,
      icon: AlertTriangle,
      accent: 'border-l-4 border-l-[#CC0000]',
      badge: 'URGENT'
    },
    {
      label: 'IN PROGRESS',
      value: inProgressIncidents,
      icon: Clock,
      accent: 'border-l-4 border-l-[#111111]',
      badge: 'ACTIVE'
    },
    {
      label: 'RESOLVED',
      value: resolvedIncidents,
      icon: CheckCircle,
      accent: 'border-l-4 border-l-neutral-400',
      badge: 'CLOSED'
    }
  ];

  return (
    <div className="mb-10 space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#111111] pb-2">
        <h3 className="font-serif font-black text-xl uppercase tracking-tight text-[#111111] flex items-center gap-2">
          <span>DISPATCH METRICS & GAZETTE INDEX</span>
        </h3>
        <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
          FIG. 2.0 • REALTIME COUNTS
        </span>
      </div>

      {/* Grid Collapsed Cells */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`border border-[#111111] bg-white p-5 ${stat.accent} hard-shadow-hover transition-all`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-600">
                {stat.label}
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 border border-[#111111] bg-[#F9F9F7] text-[#111111]">
                {stat.badge}
              </span>
            </div>
            
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-black font-mono tracking-tight text-[#111111]">
                {stat.value}
              </span>
              <stat.icon className="w-5 h-5 text-[#111111] opacity-80" />
            </div>
          </div>
        ))}
      </div>

      {/* Critical Incidents Warning Banner */}
      {criticalIncidents > 0 && (
        <div className="border-2 border-[#CC0000] bg-[#CC0000] text-white p-4 font-mono text-xs hard-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
              <div>
                <span className="font-bold tracking-widest uppercase text-sm block">
                  CRITICAL DISPATCH WARNING: {criticalIncidents} HIGH-PRIORITY EMERGENCY FILED
                </span>
                <span className="text-red-100 text-xs">
                  Immediate municipal or emergency team intervention requested.
                </span>
              </div>
            </div>
            <span className="bg-white text-[#CC0000] px-3 py-1 font-bold tracking-widest uppercase hidden sm:inline">
              PRIORITY LEVEL 1
            </span>
          </div>
        </div>
      )}
    </div>
  );
};