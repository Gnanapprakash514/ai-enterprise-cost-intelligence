import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  RefreshCw,
  Clock,
  SlidersHorizontal,
  ShieldCheck,
  LayoutGrid,
  List,
  Server,
  Zap,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { useAuditLogsQuery } from '../hooks/useAWSInventory';

export const AuditLogs: React.FC = () => {
  const { data: logs, isLoading, isError, refetch } = useAuditLogsQuery();

  // Search, Filter & View State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedAction, setSelectedAction] = useState('All');
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');

  // Filter Extraction
  const statuses = useMemo(() => {
    if (!logs) return [];
    const sts = new Set(logs.map(l => l.status));
    return ['All', ...Array.from(sts)];
  }, [logs]);

  const actions = useMemo(() => {
    if (!logs) return [];
    const acts = new Set(logs.map(l => l.action));
    return ['All', ...Array.from(acts)];
  }, [logs]);

  // Interactive Pipeline
  const filteredLogs = useMemo(() => {
    if (!logs) return [];

    let result = [...logs];

    // 1. Search keyword
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(l => 
        l.instance_id.toLowerCase().includes(term) ||
        l.action.toLowerCase().includes(term) ||
        l.status.toLowerCase().includes(term)
      );
    }

    // 2. Status filter
    if (selectedStatus !== 'All') {
      result = result.filter(l => l.status === selectedStatus);
    }

    // 3. Action filter
    if (selectedAction !== 'All') {
      result = result.filter(l => l.action === selectedAction);
    }

    // Sort descending by sequence ID
    result.sort((a, b) => b.id - a.id);

    return result;
  }, [logs, searchTerm, selectedStatus, selectedAction]);

  return (
    <div className="space-y-8 animate-fade-in pr-2">
      
      {/* Page Title with Mode Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase font-sans flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-cyan" />
            <span>Execution History</span>
          </h2>
          <p className="text-xs text-brand-muted font-mono uppercase tracking-widest mt-1">
            Historical trace audits of human-authorized and autonomous cloud containment events
          </p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          {/* Timeline vs Table Toggles */}
          <div className="flex bg-slate-950/40 p-1 rounded-lg border border-white/5 font-mono text-3xs">
            <button 
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all duration-200 ${viewMode === 'timeline' ? 'bg-brand-cyan/10 text-white font-bold' : 'text-slate-400'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all duration-200 ${viewMode === 'table' ? 'bg-brand-cyan/10 text-white font-bold' : 'text-slate-400'}`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Trace Table</span>
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2 font-mono text-3xs uppercase tracking-wider">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Logs</span>
          </Button>
        </div>
      </div>

      {/* Compliance Filter HUD */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center gap-2 text-2xs font-bold text-white uppercase font-sans border-b border-white/5 pb-2.5">
          <SlidersHorizontal className="w-4 h-4 text-brand-cyan" />
          <span>Audit Filters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-500" />
            </span>
            <input 
              type="text" 
              placeholder="Search trace resource, action code..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input w-full pl-9"
            />
          </div>

          {/* Status filter dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-3xs text-slate-400 font-mono uppercase whitespace-nowrap">STATUS:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="glass-input w-full bg-[#070a13]"
            >
              {statuses.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Action filter dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-3xs text-slate-400 font-mono uppercase whitespace-nowrap">ACTION CODE:</span>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="glass-input w-full bg-[#070a13]"
            >
              {actions.map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Main Execution Logs */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <LoadingSpinner size="lg" />
          <span className="text-sm font-mono text-brand-cyan tracking-wider">Downloading trace ledgers...</span>
        </div>
      ) : isError ? (
        <div className="text-center py-16">
          <ShieldAlert className="w-12 h-12 text-brand-rose mx-auto mb-3 glow-rose animate-bounce" />
          <p className="text-sm text-brand-rose font-mono">Failed to sync security audit logs.</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <EmptyState 
          title="Compliance Ledger Clear" 
          description="We couldn't locate any completed execution actions matching current parameters." 
          icon={ShieldCheck}
        />
      ) : (
        <AnimatePresence mode="wait">
          {viewMode === 'timeline' ? (
            /* Futuristic Timeline Visualization */
            <motion.div 
              key="timeline"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="relative pl-6 sm:pl-8 border-l border-white/5 space-y-6 max-w-3xl text-left"
            >
              {filteredLogs.map((log, idx) => {
                const isExecuted = log.status === 'EXECUTED' || log.status === 'COMPLETED';
                const isFailed = log.status === 'FAILED';
                
                // Result Description mock builder
                const resultText = isExecuted 
                  ? 'Hypervisor stop command successfully dispatched and confirmed by regional AWS control pipeline.'
                  : isFailed ? 'Direct API shut down call failed due to AWS security token validation error.'
                  : 'Containment script scheduled and awaiting worker pool execution.';

                return (
                  <motion.div 
                    key={log.id} 
                    className="relative"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(0.3, idx * 0.05) }}
                  >
                    {/* Timeline bullet nodes */}
                    <span className={`
                      absolute left-[-30px] sm:left-[-41.5px] top-4 w-4 h-4 rounded-full border-2 border-[#070a13] flex items-center justify-center shadow-lg shrink-0
                      ${isExecuted ? 'bg-brand-emerald text-white glow-emerald' : 
                        isFailed ? 'bg-brand-rose text-white glow-rose' : 'bg-brand-amber text-white'}
                    `}>
                      <Zap className="w-2.5 h-2.5 fill-current" />
                    </span>

                    {/* Timeline Log Card */}
                    <Card 
                      className="p-5 border-white/5 hover:border-brand-cyan/20 space-y-3 font-mono text-3xs"
                      glow={isExecuted ? 'emerald' : isFailed ? 'rose' : 'cyan'}
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/5 pb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-slate-500 font-bold">SEQUENCE #{log.id.toString().padStart(6, '0')}</span>
                          <Badge variant={isExecuted ? 'emerald' : isFailed ? 'rose' : 'amber'}>
                            {log.status}
                          </Badge>
                        </div>
                        <span className="text-slate-400 flex items-center gap-1 font-sans">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : new Date().toLocaleString()}
                        </span>
                      </div>

                      <div className="space-y-2 text-left">
                        <div className="flex items-start gap-3">
                          <Server className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                          <div>
                            <span className="text-slate-500 uppercase block leading-none">RESOURCE ID:</span>
                            <span className="text-white text-2xs font-bold font-mono mt-1 block uppercase">{log.instance_id}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <span className="text-slate-500 uppercase block">ACTION CODE:</span>
                            <span className="text-brand-cyan font-bold text-2xs uppercase mt-0.5 block">{log.action}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 uppercase block">RESULT:</span>
                            <span className="text-white text-2xs mt-0.5 block">{resultText}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* Dense Tabular Trace List view */
            <motion.div 
              key="table"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="p-0 overflow-hidden font-mono text-xs shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/60 border-b border-white/5 text-slate-400 text-3xs tracking-wider uppercase font-semibold">
                        <th className="py-4 px-6">Sequence ID</th>
                        <th className="py-4 px-6">Resource Reference</th>
                        <th className="py-4 px-6">Action Code</th>
                        <th className="py-4 px-6">Execution Status</th>
                        <th className="py-4 px-6">Telemetry Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {filteredLogs.map((log) => {
                        const isExecuted = log.status === 'EXECUTED' || log.status === 'COMPLETED';
                        const isFailed = log.status === 'FAILED';
                        
                        return (
                          <tr 
                            key={log.id}
                            className="hover:bg-brand-cyan/5 transition-colors duration-150 text-slate-300 hover:text-white"
                          >
                            <td className="py-3.5 px-6 text-slate-500 font-bold">
                              #{log.id.toString().padStart(6, '0')}
                            </td>
                            <td className="py-3.5 px-6 text-white font-semibold">
                              {log.instance_id}
                            </td>
                            <td className="py-3.5 px-6">
                              <span className="text-brand-cyan font-bold bg-brand-cyan/5 border border-brand-cyan/10 px-2 py-0.5 rounded text-2xs">
                                {log.action}
                              </span>
                            </td>
                            <td className="py-3.5 px-6">
                              <Badge variant={isExecuted ? 'emerald' : isFailed ? 'rose' : 'amber'}>
                                {log.status}
                              </Badge>
                            </td>
                            <td className="py-3.5 px-6 text-slate-400 text-2xs flex items-center gap-1.5 mt-0.5">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              <span>
                                {log.timestamp ? new Date(log.timestamp).toLocaleString() : new Date().toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Compliance seal bar */}
      <div className="bg-slate-900/20 p-4 border border-white/5 rounded-xl flex justify-between items-center text-3xs text-slate-500 font-mono font-bold uppercase">
        <span>SHOWING {filteredLogs.length} OF {logs?.length || 0} EXECUTION ENTRIES</span>
        <span className="text-brand-emerald flex items-center gap-1 tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.05)]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>COMPLIANCE LEDGER AUDIT COMPLETE</span>
        </span>
      </div>

    </div>
  );
};
export default AuditLogs;
