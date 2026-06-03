import React, { useState, useMemo } from 'react';
import { 
  Server, 
  Play, 
  Square, 
  RefreshCw, 
  ShieldAlert,
  Zap,
  Info,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  ArrowUpDown,
  Cpu,
  BadgeAlert,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { 
  useEC2InstancesQuery, 
  useStopInstanceMutation, 
  useRequestStopMutation 
} from '../hooks/useAWSInventory';
import { usePendingApprovalsQuery } from '../hooks/useApprovals';

export const AWSInventory: React.FC = () => {
  const { data: ec2Data, isLoading, isError, refetch } = useEC2InstancesQuery();
  const { data: pendingApprovals } = usePendingApprovalsQuery();
  
  const stopInstanceMutation = useStopInstanceMutation();
  const requestStopMutation = useRequestStopMutation();

  // State for search, filter, sort, pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedRecStatus, setSelectedRecStatus] = useState('All');
  
  const [sortField, setSortField] = useState<'instance_id' | 'instance_type' | 'state' | 'region' | 'running_cost_estimate' | 'launch_time' | null>('instance_id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State for selected instance in details drawer
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);

  // Immediate Action Dispatches
  const handleStopInstanceImmediate = async (id: string) => {
    if (confirm(`CRITICAL HYPERVISOR COMMAND: Dispatch direct shutdown instruction for instance ${id}?`)) {
      try {
        const result = await stopInstanceMutation.mutateAsync(id);
        alert(`HYPERVISOR FEEDBACK: ${result?.message || 'Shutdown requested successfully.'}`);
      } catch (e) {
        console.error(e);
        alert('Action dispatch encountered an error.');
      }
    }
  };

  const handleRequestStopApproval = async (id: string) => {
    if (confirm(`Queue cost containment approval request for instance ${id}?`)) {
      try {
        await requestStopMutation.mutateAsync(id);
        alert(`Request successfully logged! Instance ${id} is placed in the approvals queue.`);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Process data list
  const instances = ec2Data?.instances || [];

  // Regions & Rec status lists for filters
  const regions = useMemo(() => {
    const list = new Set(instances.map(i => i.region).filter(Boolean));
    return ['All', ...Array.from(list)];
  }, [instances]);

  const recStatuses = ['All', 'OPTIMIZED', 'DOWNSAMPLE_RECOMMENDED', 'STOP_RECOMMENDED'];

  // Sorting Handler
  const handleSort = (field: 'instance_id' | 'instance_type' | 'state' | 'region' | 'running_cost_estimate' | 'launch_time') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Core filter-search-sort Pipeline
  const processedInstances = useMemo(() => {
    let result = [...instances];

    // 1. Keyword Search
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(i => 
        i.instance_id.toLowerCase().includes(term) ||
        i.instance_type.toLowerCase().includes(term) ||
        (i.region && i.region.toLowerCase().includes(term))
      );
    }

    // 2. Region Filter
    if (selectedRegion !== 'All') {
      result = result.filter(i => i.region === selectedRegion);
    }

    // 3. State Filter
    if (selectedState !== 'All') {
      result = result.filter(i => i.state === selectedState);
    }

    // 4. Recommendation Status Filter
    if (selectedRecStatus !== 'All') {
      result = result.filter(i => i.recommendation_status === selectedRecStatus);
    }

    // 5. Sorting
    if (sortField) {
      result.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [instances, searchTerm, selectedRegion, selectedState, selectedRecStatus, sortField, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(processedInstances.length / itemsPerPage) || 1;
  const paginatedInstances = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return processedInstances.slice(startIdx, startIdx + itemsPerPage);
  }, [processedInstances, currentPage]);

  // Find active instance for drawer
  const activeInstance = useMemo(() => {
    return instances.find(i => i.instance_id === selectedInstanceId) || null;
  }, [instances, selectedInstanceId]);

  // Helper for matching approvals
  const instanceApproval = useMemo(() => {
    if (!selectedInstanceId || !pendingApprovals) return null;
    return pendingApprovals.find((a: any) => a.instance_id === selectedInstanceId) || null;
  }, [selectedInstanceId, pendingApprovals]);

  // HUD stats
  const runningCount = instances.filter(i => i.state === 'running').length;
  const stoppedCount = instances.filter(i => i.state === 'stopped').length;
  const totalHourlySpend = instances
    .filter(i => i.state === 'running')
    .reduce((sum, i) => sum + (i.running_cost_estimate || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in pr-2 relative">
      
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase font-sans flex items-center gap-2">
            <Server className="w-6 h-6 text-brand-cyan glow-cyan" />
            <span>Cloud Inventory</span>
          </h2>
          <p className="text-xs text-brand-muted font-mono uppercase tracking-widest mt-1">
            Real-time AWS EC2 telemetry, state analysis & hypervisor power control logs
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2 font-mono uppercase text-3xs tracking-wider">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync API</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <LoadingSpinner size="lg" />
          <span className="text-sm font-mono text-brand-cyan tracking-wider">Syncing AWS cluster telemetry...</span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <ShieldAlert className="w-12 h-12 text-brand-rose mb-3 glow-rose animate-bounce" />
          <h3 className="text-sm font-bold text-white mb-1">AWS Telemetry Link Severed</h3>
          <p className="text-xs text-brand-muted max-w-sm">
            Could not download cloud inventories. Check your AWS credentials settings in the Control Panel.
          </p>
        </div>
      ) : instances.length === 0 ? (
        <EmptyState 
          title="No AWS EC2 Allocations Found" 
          description="We couldn't locate any active compute node telemetry in the connected AWS account." 
          icon={Server}
        />
      ) : (
        <>
          {/* Environment Health Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card glow="cyan" className="flex items-center gap-4">
              <div className="p-3 bg-brand-cyan/10 border border-brand-cyan/20 rounded-xl text-brand-cyan glow-cyan">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <span className="text-3xs text-brand-muted font-mono uppercase tracking-wider block">TOTAL COMPUTE NODES</span>
                <span className="text-xl font-extrabold text-white font-mono">{instances.length} allocated</span>
              </div>
            </Card>

            <Card glow="emerald" className="flex items-center gap-4">
              <div className="p-3 bg-brand-emerald/10 border border-brand-emerald/20 rounded-xl text-brand-emerald glow-emerald">
                <Play className="w-6 h-6 fill-current" />
              </div>
              <div>
                <span className="text-3xs text-brand-muted font-mono tracking-wider block uppercase">Active / Running</span>
                <span className="text-xl font-extrabold text-white font-mono">{runningCount} active cores</span>
              </div>
            </Card>

            <Card glow="rose" className="flex items-center gap-4">
              <div className="p-3 bg-brand-rose/10 border border-brand-rose/20 rounded-xl text-brand-rose glow-rose">
                <Square className="w-6 h-6 fill-current" />
              </div>
              <div>
                <span className="text-3xs text-brand-muted font-mono tracking-wider block uppercase">Projected Loss Rate</span>
                <span className="text-xl font-extrabold text-white font-mono">${totalHourlySpend.toFixed(2)}/day run-rate</span>
              </div>
            </Card>
          </div>

          {/* Interactive HUD Filter Panel */}
          <Card className="p-4 space-y-4">
            <div className="flex items-center gap-2 text-2xs font-bold text-white uppercase font-sans border-b border-white/5 pb-2.5">
              <SlidersHorizontal className="w-4 h-4 text-brand-cyan" />
              <span>Inventory Filters</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Keyword Search */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-500" />
                </span>
                <input 
                  type="text" 
                  placeholder="Search instance ID, region, shape..." 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="glass-input w-full pl-9"
                />
              </div>

              {/* Region Filter */}
              <div className="flex items-center gap-2">
                <span className="text-3xs text-slate-400 font-mono uppercase whitespace-nowrap">REGION:</span>
                <select
                  value={selectedRegion}
                  onChange={(e) => { setSelectedRegion(e.target.value); setCurrentPage(1); }}
                  className="glass-input w-full bg-[#070a13]"
                >
                  {regions.map(reg => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>

              {/* State Filter */}
              <div className="flex items-center gap-2">
                <span className="text-3xs text-slate-400 font-mono uppercase whitespace-nowrap">STATE:</span>
                <select
                  value={selectedState}
                  onChange={(e) => { setSelectedState(e.target.value); setCurrentPage(1); }}
                  className="glass-input w-full bg-[#070a13]"
                >
                  <option value="All">All</option>
                  <option value="running">running</option>
                  <option value="stopped">stopped</option>
                </select>
              </div>

              {/* Recommendation Filter */}
              <div className="flex items-center gap-2">
                <span className="text-3xs text-slate-400 font-mono uppercase whitespace-nowrap">RECOMMENDATION:</span>
                <select
                  value={selectedRecStatus}
                  onChange={(e) => { setSelectedRecStatus(e.target.value); setCurrentPage(1); }}
                  className="glass-input w-full bg-[#070a13]"
                >
                  {recStatuses.map(status => (
                    <option key={status} value={status}>{status.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Cloud Inventory Table Ledger */}
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-white/5 text-slate-400 font-mono text-3xs tracking-wider uppercase">
                    <th className="py-4 px-6 font-semibold cursor-pointer hover:text-white" onClick={() => handleSort('instance_id')}>
                      <div className="flex items-center gap-1.5">
                        <span>Instance ID</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      </div>
                    </th>
                    <th className="py-4 px-6 font-semibold cursor-pointer hover:text-white" onClick={() => handleSort('state')}>
                      <div className="flex items-center gap-1.5">
                        <span>State</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      </div>
                    </th>
                    <th className="py-4 px-6 font-semibold cursor-pointer hover:text-white" onClick={() => handleSort('region')}>
                      <div className="flex items-center gap-1.5">
                        <span>Region</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      </div>
                    </th>
                    <th className="py-4 px-6 font-semibold cursor-pointer hover:text-white" onClick={() => handleSort('instance_type')}>
                      <div className="flex items-center gap-1.5">
                        <span>Instance Type</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      </div>
                    </th>
                    <th className="py-4 px-6 font-semibold cursor-pointer hover:text-white" onClick={() => handleSort('launch_time')}>
                      <div className="flex items-center gap-1.5">
                        <span>Launch Time</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      </div>
                    </th>
                    <th className="py-4 px-6 font-semibold cursor-pointer hover:text-white">
                      <span>Recommendation Status</span>
                    </th>
                    <th className="py-4 px-6 font-semibold text-center">Containment Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans text-xs">
                  {paginatedInstances.map((instance) => {
                    const isRunning = instance.state === 'running';
                    const isStopped = instance.state === 'stopped';
                    const recStatus = instance.recommendation_status || 'OPTIMIZED';
                    
                    return (
                      <tr 
                        key={instance.instance_id}
                        onClick={() => setSelectedInstanceId(instance.instance_id)}
                        className="hover:bg-brand-cyan/5 transition-colors duration-150 text-slate-300 hover:text-white font-mono cursor-pointer"
                      >
                        {/* Instance ID */}
                        <td className="py-4 px-6 text-white font-semibold flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                          <span>{instance.instance_id}</span>
                        </td>
                        
                        {/* State */}
                        <td className="py-4 px-6">
                          <Badge variant={isRunning ? 'emerald' : isStopped ? 'slate' : 'amber'}>
                            {instance.state}
                          </Badge>
                        </td>

                        {/* Region */}
                        <td className="py-4 px-6 font-sans text-slate-400">{instance.region}</td>
                        
                        {/* Instance Type */}
                        <td className="py-4 px-6">{instance.instance_type}</td>

                        {/* Launch Time */}
                        <td className="py-4 px-6 text-slate-400 text-2xs font-sans">{instance.launch_time || 'N/A'}</td>

                        {/* Recommendation Status */}
                        <td className="py-4 px-6">
                          <Badge variant={
                            recStatus === 'STOP_RECOMMENDED' ? 'rose' :
                            recStatus === 'DOWNSAMPLE_RECOMMENDED' ? 'amber' : 'emerald'
                          }>
                            {recStatus.replace('_', ' ')}
                          </Badge>
                        </td>

                        {/* Interactive direct actions */}
                        <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                          {isRunning ? (
                            <div className="flex items-center justify-center gap-2">
                              <Button 
                                variant="outline" 
                                size="xs"
                                onClick={() => handleRequestStopApproval(instance.instance_id)}
                                disabled={requestStopMutation.isPending}
                                className="px-2 py-0.5 text-3xs hover:border-brand-violet hover:text-brand-violet"
                              >
                                <Info className="w-3 h-3 mr-0.5" />
                                <span>Request Stop</span>
                              </Button>

                              <Button 
                                variant="rose" 
                                size="xs"
                                onClick={() => handleStopInstanceImmediate(instance.instance_id)}
                                isLoading={stopInstanceMutation.isPending && stopInstanceMutation.variables === instance.instance_id}
                                disabled={stopInstanceMutation.isPending || requestStopMutation.isPending}
                                className="px-2 py-0.5 text-3xs font-bold gap-0.5"
                              >
                                <Zap className="w-3 h-3 text-white fill-current animate-pulse-slow" />
                                <span>Power Off</span>
                              </Button>
                            </div>
                          ) : (
                            <span className="text-4xs text-slate-500 font-mono uppercase">CONTAINED</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="bg-slate-900/40 p-4 border-t border-white/5 flex justify-between items-center text-3xs font-mono text-slate-500 shrink-0">
              <span className="text-slate-400">
                SHOWING {paginatedInstances.length} OF {processedInstances.length} INSTANCE BLOCKS
              </span>
              <div className="flex items-center gap-2.5">
                <Button 
                  variant="outline" 
                  size="xs" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-2.5 py-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                <span>PAGE {currentPage} OF {totalPages}</span>
                <Button 
                  variant="outline" 
                  size="xs" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-2.5 py-1"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Dynamic Slide-out Details Drawer Overlay */}
      <AnimatePresence>
        {selectedInstanceId && activeInstance && (
          <>
            {/* Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInstanceId(null)}
              className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm pr-80"
            />
            
            {/* Slide-out Drawer Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-16 bottom-0 w-[420px] z-50 bg-[#070a13]/90 backdrop-blur-2xl border-l border-white/10 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                
                {/* Drawer Header */}
                <div className="flex justify-between items-start border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-brand-cyan" />
                      <span>{activeInstance.instance_id}</span>
                    </h3>
                    <p className="text-4xs text-slate-500 font-mono mt-1 uppercase">Instance telemetry ledger details</p>
                  </div>
                  <button 
                    onClick={() => setSelectedInstanceId(null)}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5 transition-colors duration-150"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Section 1: Metadata & Information */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-1 text-2xs font-bold text-white uppercase font-sans">
                    <Info className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>Instance Information</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3.5 text-3xs font-mono">
                    <div className="p-2.5 rounded bg-slate-950/40 border border-white/5">
                      <span className="text-slate-500 block uppercase mb-1">Instance Shape</span>
                      <span className="text-white font-semibold">{activeInstance.instance_type}</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-950/40 border border-white/5">
                      <span className="text-slate-500 block uppercase mb-1">AWS Region</span>
                      <span className="text-white font-semibold">{activeInstance.region}</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-950/40 border border-white/5 col-span-2">
                      <span className="text-slate-500 block uppercase mb-1">Launch Timestamp</span>
                      <span className="text-slate-300 font-sans">{activeInstance.launch_time || 'N/A'}</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-950/40 border border-white/5">
                      <span className="text-slate-500 block uppercase mb-1">Telemetry Status</span>
                      <Badge variant={activeInstance.state === 'running' ? 'emerald' : 'slate'}>
                        {activeInstance.state}
                      </Badge>
                    </div>
                    <div className="p-2.5 rounded bg-slate-950/40 border border-white/5">
                      <span className="text-slate-500 block uppercase mb-1">Daily Run-rate</span>
                      <span className="text-brand-rose font-bold">${activeInstance.state === 'running' ? activeInstance.running_cost_estimate?.toFixed(2) : '0.00'}</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: AI Optimization Recommendation */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-1 text-2xs font-bold text-white uppercase font-sans">
                    <BadgeAlert className="w-3.5 h-3.5 text-brand-violet glow-violet" />
                    <span>Optimization Recommendation</span>
                  </div>
                  
                  <div className="p-4 rounded-xl border border-brand-violet/20 bg-brand-violet/5 space-y-3 font-sans text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-brand-violet font-mono text-3xs font-bold uppercase tracking-wider">AI RECOMMENDATION</span>
                      <Badge variant={
                        activeInstance.recommendation_status === 'STOP_RECOMMENDED' ? 'rose' :
                        activeInstance.recommendation_status === 'DOWNSAMPLE_RECOMMENDED' ? 'amber' : 'emerald'
                      }>
                        {activeInstance.recommendation_status?.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-sans text-2xs">
                      {activeInstance.recommendation_status === 'STOP_RECOMMENDED' ? 
                        `Instance displays 0% CPU utilization over 7 days. Agent highly recommends shutdown action to avoid licensing waste.` :
                       activeInstance.recommendation_status === 'DOWNSAMPLE_RECOMMENDED' ? 
                        `Peak CPU utilization under 12%. Recommends downsizing instance to a t3.medium shape.` :
                        `Instance performance metrics are optimally scaled inside cost boundaries.`}
                    </p>
                    <div className="flex justify-between border-t border-brand-violet/10 pt-2.5 text-3xs font-mono">
                      <span className="text-slate-500">POTENTIAL SAVINGS:</span>
                      <span className="text-brand-emerald font-extrabold">${activeInstance.state === 'running' ? activeInstance.running_cost_estimate?.toFixed(2) : '0.00'}/day</span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Approval Status */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-1 text-2xs font-bold text-white uppercase font-sans">
                    <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>Approval Status</span>
                  </div>
                  
                  <div className="p-3.5 rounded-xl border border-white/5 bg-slate-950/20 text-3xs font-mono flex justify-between items-center">
                    <span className="text-slate-500">PLATFORM STATUS:</span>
                    {instanceApproval ? (
                      <span className="text-brand-rose font-bold uppercase flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        PENDING HUMAN SIGN-OFF
                      </span>
                    ) : activeInstance.state === 'stopped' ? (
                      <span className="text-brand-emerald font-bold uppercase flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        OPTIMIZED / STOPPED
                      </span>
                    ) : (
                      <span className="text-slate-400 font-bold uppercase flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5" />
                        NO ACTIVE REQUEST
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="border-t border-white/5 pt-4 space-y-3 shrink-0">
                {activeInstance.state === 'running' && (
                  <div className="grid grid-cols-2 gap-3.5">
                    <Button 
                      variant="outline" 
                      onClick={() => handleRequestStopApproval(activeInstance.instance_id)}
                      disabled={requestStopMutation.isPending || !!instanceApproval}
                      className="font-mono text-3xs uppercase tracking-wider"
                    >
                      <span>Request Stop</span>
                    </Button>
                    <Button 
                      variant="rose" 
                      onClick={() => handleStopInstanceImmediate(activeInstance.instance_id)}
                      isLoading={stopInstanceMutation.isPending && stopInstanceMutation.variables === activeInstance.instance_id}
                      disabled={stopInstanceMutation.isPending}
                      className="font-mono text-3xs uppercase tracking-wider"
                    >
                      <Zap className="w-3 h-3 mr-0.5 fill-current" />
                      <span>Power Off</span>
                    </Button>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedInstanceId(null)}
                  className="w-full font-mono text-3xs uppercase"
                >
                  <span>Close Telemetry</span>
                </Button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
export default AWSInventory;
