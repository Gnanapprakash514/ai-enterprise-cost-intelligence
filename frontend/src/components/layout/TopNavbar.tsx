import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  User, 
  ShieldCheck, 
  ChevronDown, 
  TrendingUp, 
  Sparkles,
  Zap
} from 'lucide-react';

export const TopNavbar: React.FC = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [profileOpen, setProfileOpen] = useState(false);

  // Simulated notifications feed representing live cost telemetry events
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Cost Anomaly Detected',
      description: 'Snowflake Warehouse spiked by +$12,450.00.',
      time: '12m ago',
      type: 'critical',
      icon: TrendingUp,
      unread: true,
    },
    {
      id: 2,
      title: 'AI Recommendation Issued',
      description: 'Right-size 5 underutilized EC2 instances in us-east-1.',
      time: '1h ago',
      type: 'ai',
      icon: Sparkles,
      unread: true,
    },
    {
      id: 3,
      title: 'Autonomous Stop Dispatched',
      description: 'Instance i-0bb314ab52fe80f4f stopped successfully.',
      time: '2h ago',
      type: 'success',
      icon: Zap,
      unread: false,
    }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 bg-[#070a13]/70 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-20">
      
      {/* Brand & AWS Connection Info */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold text-white tracking-widest uppercase font-sans border-r border-white/10 pr-4">
          Enterprise Cost Intelligence
        </span>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald font-mono text-4xs font-bold tracking-wider uppercase shadow-[0_0_10px_rgba(16,185,129,0.1)]">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
          <span>AWS CONNECTED</span>
        </div>
      </div>

      {/* Search Terminal */}
      <div className="relative w-72">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4.5 w-4.5 text-slate-500" />
        </span>
        <input 
          type="text" 
          placeholder="Telemetry search (instance ID, dept, cost code)..." 
          className="glass-input w-full pl-9 h-8.5 text-2xs"
        />
      </div>

      {/* Control Actions Row */}
      <div className="flex items-center gap-6">
        
        {/* Theme Toggle (Visual HUD element) */}
        <button 
          onClick={() => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors duration-200"
          title="Toggle System Holograms"
        >
          {themeMode === 'dark' ? (
            <Moon className="w-4.5 h-4.5 text-brand-cyan" />
          ) : (
            <Sun className="w-4.5 h-4.5 text-brand-amber" />
          )}
        </button>

        {/* Dynamic Notification Center */}
        <div className="relative">
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200 relative"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-rose rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 glass-panel bg-[#0d1426]/95 border-brand-cyan/20 shadow-2xl p-4 space-y-3 animate-slide-in">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-semibold text-white tracking-wider">Telemetry Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead}
                    className="text-4xs text-brand-cyan hover:underline uppercase font-mono tracking-wider font-semibold"
                  >
                    Ack All
                  </button>
                )}
              </div>
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-2.5 rounded-lg flex items-start gap-3 transition-colors duration-200 ${notif.unread ? 'bg-brand-cyan/5 border border-brand-cyan/10' : 'bg-slate-900/30'}`}
                  >
                    <div className={`p-1.5 rounded-md mt-0.5 ${notif.type === 'critical' ? 'bg-brand-rose/10 text-brand-rose' : notif.type === 'ai' ? 'bg-brand-violet/10 text-brand-violet' : 'bg-brand-emerald/10 text-brand-emerald'}`}>
                      <notif.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-2xs font-semibold text-white truncate">{notif.title}</p>
                      <p className="text-3xs text-slate-400 mt-0.5 leading-relaxed">{notif.description}</p>
                      <span className="text-4xs text-slate-500 font-mono mt-1 block">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Operator Profile */}
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-200"
          >
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <User className="w-4 h-4 text-brand-cyan glow-cyan" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-2xs font-semibold text-white leading-none">Command Operator</div>
              <div className="text-3xs text-brand-muted font-mono leading-none mt-1">FinOps Administrator</div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {/* Profile HUD Overlay */}
          {profileOpen && (
            <div className="absolute right-0 mt-3 w-48 glass-panel bg-[#0d1426]/95 border-brand-cyan/20 p-3 space-y-2.5 text-center">
              <div className="border-b border-white/5 pb-2">
                <p className="text-2xs font-bold text-white">Gnanapprakash A.</p>
                <p className="text-3xs font-mono text-brand-cyan uppercase tracking-widest mt-0.5">ADMIN SECURITY</p>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-3xs text-brand-emerald bg-brand-emerald/5 border border-brand-emerald/10 py-1 rounded">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Level-3 Auth Granted</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
export default TopNavbar;
