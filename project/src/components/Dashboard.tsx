import React from 'react';
import { AlertCircle, Clock, CheckCircle2, ShieldAlert, TrendingUp } from 'lucide-react';
import { Incident } from '../types/incident';

interface DashboardProps {
  incidents: Incident[];
}

export const Dashboard: React.FC<DashboardProps> = ({ incidents }) => {
  const total = incidents.length;
  const open = incidents.filter((i) => i.status === 'open').length;
  const progress = incidents.filter((i) => i.status === 'in-progress').length;
  const resolved = incidents.filter((i) => i.status === 'resolved').length;
  const rate = total ? Math.round((resolved / total) * 100) : 0;
  const coSigns = incidents.reduce((s, i) => s + (i.coSignersCount || 0), 0);

  const stats = [
    { title: 'Total dispatches', count: total, icon: ShieldAlert, tint: 'var(--accent-glow)', fg: 'var(--accent-bright)', span: '' },
    { title: 'Open hazards', count: open, icon: AlertCircle, tint: 'rgba(245,158,11,0.14)', fg: '#d97706', span: '' },
    { title: 'Crews in repair', count: progress, icon: Clock, tint: 'var(--accent-glow)', fg: 'var(--accent-bright)', span: '' },
    { title: 'Resolved', count: resolved, icon: CheckCircle2, tint: 'rgba(16,185,129,0.14)', fg: '#059669', span: '' },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
      {stats.map((s, idx) => (
        <div key={s.title} className={`bezel reveal lg:col-span-3 ${idx === 0 ? 'sm:col-span-2 lg:col-span-3' : ''}`} style={{ transitionDelay: `${idx * 70}ms` }}>
          <div className="bezel-inner group flex items-center justify-between p-5 transition-transform duration-500 hover:-translate-y-0.5" style={{ transitionTimingFunction: 'cubic-bezier(0.32,0.72,0,1)' }}>
            <div>
              <p className="text-caption">{s.title}</p>
              <p className="stat-num tabular mt-2">{s.count}</p>
              <p className="mt-1.5 flex items-center gap-1 text-[12px] font-bold" style={{ color: s.fg }}>
                <TrendingUp className="h-3.5 w-3.5" /> live count
              </p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
              style={{ background: s.tint, color: s.fg, transitionTimingFunction: 'cubic-bezier(0.32,0.72,0,1)' }}>
              <s.icon className="h-5 w-5" />
            </span>
          </div>
        </div>
      ))}

      <div className="bezel reveal sm:col-span-2 lg:col-span-8" style={{ transitionDelay: '280ms' }}>
        <div className="bezel-inner flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[15px] font-bold">District resolution momentum</p>
              <p className="text-body-sm">{coSigns} co-signs pushing {open + progress} open cases forward</p>
            </div>
          </div>
          <div className="w-full sm:w-64">
            <div className="mb-1.5 flex justify-between text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--foreground-muted)' }}>
              <span>Resolved</span><span className="tabular">{rate}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--surface)' }}>
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${rate}%`, background: 'linear-gradient(90deg, var(--accent), #10b981)', transitionTimingFunction: 'cubic-bezier(0.32,0.72,0,1)' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="bezel reveal lg:col-span-4" style={{ transitionDelay: '340ms' }}>
        <div className="bezel-inner flex h-full items-center justify-between p-5" style={{ background: 'var(--foreground)', borderColor: 'transparent' }}>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-60" style={{ color: 'var(--background-base)' }}>Response SLA</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight tabular" style={{ color: 'var(--background-base)' }}>≤ 48 hrs</p>
          </div>
          <span className="rounded-full px-3.5 py-1.5 text-[12px] font-bold" style={{ background: 'var(--background-base)', color: 'var(--foreground)' }}>
            {open === 0 ? 'All clear' : `${open} queued`}
          </span>
        </div>
      </div>
    </div>
  );
};
