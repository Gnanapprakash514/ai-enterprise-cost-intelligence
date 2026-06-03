import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  AlertTriangle, 
  Brain, 
  CheckSquare, 
  Server, 
  FileText, 
  Sliders, 
  Cpu, 
  Database 
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const navItems = [
    { name: 'Operations Center', path: '/', icon: LayoutDashboard },
    { name: 'Cloud Inventory', path: '/aws-inventory', icon: Server },
    { name: 'AI Recommendation Center', path: '/ai-insights', icon: Brain, badge: 'AI' },
    { name: 'Approval Center', path: '/approvals', icon: CheckSquare, badge: '4' },
    { name: 'Execution History', path: '/audit-logs', icon: FileText },
    { name: 'Cost Intelligence', path: '/cost-analysis', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-[#070a13]/85 backdrop-blur-xl border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-30 shrink-0">
      {/* Platform Branding */}
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-cyan to-brand-violet flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-pulse-slow">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-wider uppercase font-sans">
            AI Operations
          </h1>
          <span className="text-3xs text-brand-cyan font-mono tracking-widest font-semibold uppercase">
            Cost Intelligence
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative
              ${isActive 
                ? 'bg-brand-cyan/10 text-white border-l-2 border-brand-cyan shadow-[inset_4px_0_12px_rgba(6,182,212,0.05)]' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'}
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              <span>{item.name}</span>
            </div>
            
            {item.badge && (
              <span className={`
                text-3xs px-2 py-0.5 rounded-full font-mono font-bold
                ${item.badge === 'New' 
                  ? 'bg-brand-violet/20 border border-brand-violet/40 text-brand-violet glow-violet' 
                  : 'bg-brand-rose/20 border border-brand-rose/40 text-brand-rose glow-rose'}
              `}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Agent Autonomy Telemetry Overlay */}
      <div className="p-4 border-t border-white/5 bg-slate-950/40">
        <div className="glass-panel p-3 bg-[#0a0f21]/80 border-slate-900 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-3xs text-brand-muted">
            <span className="font-mono">AGENT STATUS:</span>
            <span className="flex items-center text-brand-emerald font-semibold font-mono uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-ping mr-1" />
              Active
            </span>
          </div>
          
          <div className="scanner-container h-1 bg-slate-800 rounded-full overflow-hidden relative">
            <div className="scanner-beam h-full bg-gradient-to-r from-brand-cyan to-brand-violet animate-pulse" style={{ width: '75%' }} />
          </div>

          <div className="flex items-center gap-2 text-3xs font-mono text-brand-muted mt-1.5">
            <Database className="w-3.5 h-3.5 text-brand-cyan" />
            <span>DB PING: 4ms</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
