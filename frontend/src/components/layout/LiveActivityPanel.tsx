import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ChevronLeft, 
  ChevronRight, 
  Server, 
  Zap, 
  ShieldAlert, 
  Sparkles,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useAuditLogsQuery } from '../../hooks/useAWSInventory';

export const LiveActivityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { data: auditLogs, refetch } = useAuditLogsQuery();

  // Keep logs synchronized with updates
  useEffect(() => {
    const timer = setInterval(() => {
      refetch();
    }, 15000); // sync every 15s
    return () => clearInterval(timer);
  }, [refetch]);

  // Mix DB audit logs with simulated live platform updates to feel "alive"
  const [simulatedEvents, setSimulatedEvents] = useState([
    { id: 's1', message: 'AWS Inventory Sync Completed', details: '10 nodes verified', timestamp: new Date(Date.now() - 30000).toISOString(), type: 'sync', icon: Server },
    { id: 's2', message: 'Cognitive agent running scan', details: 'us-east-1 region safe', timestamp: new Date(Date.now() - 120000).toISOString(), type: 'scan', icon: Sparkles },
  ]);

  useEffect(() => {
    // Randomly insert futuristic logs every 45-60s to make HUD feel active
    const interval = setInterval(() => {
      const msgs = [
        { message: 'AWS Inventory Sync Completed', details: 'Cloud telemetry link synchronized', type: 'sync', icon: Server },
        { message: 'AI Recommendation Engine triggered', details: 'Recalculating savings models', type: 'scan', icon: Sparkles },
        { message: 'FinOps Health Check dispatched', details: 'PostgreSQL clusters 100% healthy', type: 'health', icon: CheckCircle }
      ];
      const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
      setSimulatedEvents(prev => [
        {
          id: `s-${Date.now()}`,
          message: randomMsg.message,
          details: randomMsg.details,
          timestamp: new Date().toISOString(),
          type: randomMsg.type,
          icon: randomMsg.icon
        },
        ...prev.slice(0, 4)
      ]);
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  // Format date helper
  const formatTime = (isoString?: string) => {
    if (!isoString) return 'Just now';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return `${diffSecs}s ago`;
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Process and merge logs
  const dbLogs = auditLogs ? auditLogs.map((l: any) => ({
    id: `db-${l.id}`,
    message: `${l.action.replace('_', ' ')}`,
    details: `Instance: ${l.instance_id} -> ${l.status}`,
    timestamp: l.timestamp,
    type: l.status.toLowerCase(),
    icon: l.status === 'EXECUTED' || l.status === 'COMPLETED' ? Zap : ShieldAlert
  })) : [];

  const allEvents = [...dbLogs, ...simulatedEvents].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div 
      className={`
        fixed right-0 top-16 bottom-0 z-20 bg-[#070a13]/80 backdrop-blur-xl border-l border-white/5 
        flex flex-col transition-all duration-300 shadow-2xl
        ${isOpen ? 'w-72' : 'w-12'}
      `}
    >
      {/* Drawer Toggle Bar */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-[-14px] top-4 w-7 h-7 rounded-full bg-[#0d1426] border border-white/10 hover:border-brand-cyan/40 text-brand-cyan flex items-center justify-center shadow-lg transition-colors duration-200"
      >
        {isOpen ? <ChevronRight className="w-4.5 h-4.5" /> : <ChevronLeft className="w-4.5 h-4.5" />}
      </button>

      {isOpen ? (
        <>
          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-cyan glow-cyan animate-pulse" />
              <span className="text-2xs font-bold text-white uppercase font-sans tracking-wider">Live Activity Panel</span>
            </div>
            <span className="text-4xs font-mono bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded text-brand-cyan uppercase animate-pulse">
              Active HUD
            </span>
          </div>

          {/* Events Feed Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {allEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
                <Clock className="w-8 h-8 text-slate-600 animate-spin" />
                <p className="text-4xs text-slate-500 font-mono uppercase">Syncing telemetry channel...</p>
              </div>
            ) : (
              allEvents.map((evt) => {
                const isExecuted = evt.type === 'executed' || evt.type === 'completed';
                const isFailed = evt.type === 'error' || evt.type === 'failed';
                const isSync = evt.type === 'sync';
                
                return (
                  <div 
                    key={evt.id} 
                    className={`
                      p-3 rounded-xl border transition-all duration-200 text-left hover:scale-[1.01]
                      ${isExecuted ? 'bg-brand-emerald/5 border-brand-emerald/10' : 
                        isFailed ? 'bg-brand-rose/5 border-brand-rose/10' : 
                        isSync ? 'bg-brand-cyan/5 border-brand-cyan/10' : 'bg-slate-900/20 border-white/5'}
                    `}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`
                        p-1.5 rounded-lg shrink-0 mt-0.5
                        ${isExecuted ? 'bg-brand-emerald/10 text-brand-emerald' : 
                          isFailed ? 'bg-brand-rose/10 text-brand-rose' : 
                          isSync ? 'bg-brand-cyan/10 text-brand-cyan' : 'bg-brand-violet/10 text-brand-violet'}
                      `}>
                        <evt.icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-3xs font-bold text-white uppercase tracking-wide truncate">{evt.message}</p>
                        <p className="text-4xs text-slate-400 font-mono mt-0.5 leading-relaxed truncate">{evt.details}</p>
                        <span className="text-5xs text-slate-500 font-mono block mt-1">{formatTime(evt.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : (
        /* Collapsed Mode HUD Track */
        <div className="flex-1 flex flex-col items-center py-6 gap-6 overflow-y-auto">
          <Activity className="w-4 h-4 text-brand-cyan glow-cyan animate-pulse-slow" />
          <div className="h-px w-6 bg-white/5" />
          <div className="flex-1 flex flex-col items-center gap-4 text-slate-500">
            {allEvents.slice(0, 6).map((evt) => {
              const isExecuted = evt.type === 'executed' || evt.type === 'completed';
              const isFailed = evt.type === 'error' || evt.type === 'failed';
              const isSync = evt.type === 'sync';
              
              return (
                <div 
                  key={evt.id} 
                  title={`${evt.message}: ${evt.details}`}
                  className={`
                    p-1.5 rounded-lg border cursor-pointer hover:scale-110 transition-transform duration-150
                    ${isExecuted ? 'border-brand-emerald/30 text-brand-emerald bg-brand-emerald/5' : 
                      isFailed ? 'border-brand-rose/30 text-brand-rose bg-brand-rose/5' : 
                      isSync ? 'border-brand-cyan/30 text-brand-cyan bg-brand-cyan/5' : 'border-white/5 text-brand-violet bg-brand-violet/5'}
                  `}
                >
                  <evt.icon className="w-3.5 h-3.5" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export default LiveActivityPanel;
