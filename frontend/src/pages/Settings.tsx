import React, { useState } from 'react';
import { 
  Sliders, 
  Brain, 
  ShieldAlert, 
  Save, 
  Bell, 
  Globe,
  Settings2,
  Lock,
  Unlock
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Settings: React.FC = () => {
  // Local state for configuration adjustments
  const [autonomyMode, setAutonomyMode] = useState<'semi' | 'full'>('semi');
  const [confidenceRate, setConfidenceRate] = useState<number>(85);
  
  const [monitoredRegions, setMonitoredRegions] = useState({
    'us-east-1': true,
    'us-west-2': true,
    'eu-west-1': true,
    'ap-southeast-1': false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailSpikes: true,
    slackApprovals: true,
    autonomousLogs: false,
  });

  const [saving, setSaving] = useState(false);

  const handleRegionChange = (region: keyof typeof monitoredRegions) => {
    setMonitoredRegions(prev => ({
      ...prev,
      [region]: !prev[region],
    }));
  };

  const handleNotificationChange = (field: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSaveSettings = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('FinOps configuration successfully synchronized with AI Agent clusters.');
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-fade-in pr-2">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase font-sans flex items-center gap-2">
            <Sliders className="w-6 h-6 text-brand-cyan" />
            <span>Agent Control Panel</span>
          </h2>
          <p className="text-xs text-brand-muted font-mono uppercase tracking-widest mt-1">
            Configure optimization engine parameters & AWS monitor scopes
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleSaveSettings} isLoading={saving} className="gap-2 font-mono uppercase text-2xs tracking-wider">
          <Save className="w-4 h-4 text-white" />
          <span>Sync Settings</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: AI Operations Autonomy & Confidence Threshold */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Autonomy Selector */}
          <Card className="space-y-4" glow={autonomyMode === 'full' ? 'rose' : 'cyan'}>
            <div className="flex items-center gap-2 text-2xs font-bold text-white uppercase font-sans border-b border-white/5 pb-2.5">
              <Brain className="w-4.5 h-4.5 text-brand-cyan" />
              <span>AI Agent Autonomy Mode</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {/* Semi-autonomous */}
              <button 
                onClick={() => setAutonomyMode('semi')}
                className={`p-4 rounded-xl text-left border transition-all duration-200 ${autonomyMode === 'semi' ? 'bg-brand-cyan/5 border-brand-cyan/40 shadow-glow-cyan' : 'bg-slate-950/20 border-white/5 hover:border-white/10'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-bold text-white uppercase font-mono">Semi-Autonomous</span>
                  <Lock className="w-4 h-4 text-brand-cyan glow-cyan" />
                </div>
                <p className="text-3xs text-slate-400 mt-2 leading-relaxed">
                  Recommended. Agent scans anomalies and logs approvals, but requires human operators to verify and dispatch optimization scripts.
                </p>
              </button>

              {/* Fully autonomous */}
              <button 
                onClick={() => setAutonomyMode('full')}
                className={`p-4 rounded-xl text-left border transition-all duration-200 ${autonomyMode === 'full' ? 'bg-brand-rose/5 border-brand-rose/40 shadow-glow-rose' : 'bg-slate-950/20 border-white/5 hover:border-white/10'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-bold text-brand-rose uppercase font-mono">Fully Autonomous</span>
                  <Unlock className="w-4 h-4 text-brand-rose glow-rose animate-pulse" />
                </div>
                <p className="text-3xs text-slate-400 mt-2 leading-relaxed">
                  Self-Optimizing. Agent immediately dispatches stop and rightsize scripts on compute servers upon anomaly detection, bypassing approvals queue.
                </p>
              </button>
            </div>

            {/* Warning callout for Full Autonomy */}
            {autonomyMode === 'full' && (
              <div className="flex gap-3 p-3 bg-brand-rose/10 border border-brand-rose/20 rounded-lg mt-3 text-3xs text-brand-rose leading-relaxed font-mono">
                <ShieldAlert className="w-5 h-5 shrink-0 animate-bounce text-brand-rose" />
                <div>
                  <span className="font-bold">CRITICAL WARNING VECTOR:</span> Fully Autonomous mode gives hypervisor power control scripts permission to power down compute servers without human verification. Ensure cluster tags are perfectly aligned.
                </div>
              </div>
            )}
          </Card>

          {/* Slider for Confidence thresholds */}
          <Card className="space-y-4">
            <div className="flex items-center gap-2 text-2xs font-bold text-white uppercase font-sans border-b border-white/5 pb-2.5">
              <Settings2 className="w-4.5 h-4.5 text-brand-cyan" />
              <span>Agent Confidence threshold</span>
            </div>

            <div className="space-y-4 py-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300">MINIMUM RECOMMENDATION ACCURACY:</span>
                <span className="text-brand-cyan font-bold font-mono text-sm">{confidenceRate}% accuracy</span>
              </div>
              <input 
                type="range" 
                min={70} 
                max={98} 
                value={confidenceRate}
                onChange={(e) => setConfidenceRate(Number(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-brand-cyan"
              />
              <div className="flex justify-between text-4xs font-mono text-slate-500">
                <span>70% (AGGRESSIVE SAVINGS)</span>
                <span>85% (STANDARD COGNITION)</span>
                <span>98% (CONSERVATIVE SPEND)</span>
              </div>
            </div>
          </Card>

        </div>

        {/* Right column: Regional monitors & Notification controls */}
        <div className="space-y-6">
          
          {/* AWS region scope monitored checkboxes */}
          <Card className="space-y-3.5">
            <div className="flex items-center gap-2 text-2xs font-bold text-white uppercase font-sans border-b border-white/5 pb-2">
              <Globe className="w-4 h-4 text-brand-cyan" />
              <span>AWS regional Monitor scope</span>
            </div>

            <div className="space-y-3 mt-2 text-2xs font-sans">
              {Object.keys(monitoredRegions).map((reg) => {
                const checked = monitoredRegions[reg as keyof typeof monitoredRegions];
                
                return (
                  <label key={reg} className="flex items-center justify-between cursor-pointer group">
                    <span className="text-slate-300 group-hover:text-white font-mono">{reg}</span>
                    <input 
                      type="checkbox" 
                      checked={checked}
                      onChange={() => handleRegionChange(reg as keyof typeof monitoredRegions)}
                      className="rounded bg-slate-900 border-white/10 text-brand-cyan focus:ring-brand-cyan/20 w-4.5 h-4.5"
                    />
                  </label>
                );
              })}
            </div>
          </Card>

          {/* Notifications toggles */}
          <Card className="space-y-3.5">
            <div className="flex items-center gap-2 text-2xs font-bold text-white uppercase font-sans border-b border-white/5 pb-2">
              <Bell className="w-4 h-4 text-brand-cyan" />
              <span>Notification Dispatch matrix</span>
            </div>

            <div className="space-y-4 mt-2 text-2xs font-sans">
              {/* Toggle 1 */}
              <label className="flex items-start justify-between cursor-pointer">
                <div className="pr-4">
                  <span className="text-slate-300 font-semibold block">Email Anomaly Spikes</span>
                  <span className="text-4xs text-slate-500 font-mono block uppercase mt-0.5">When z-score exceeds 2.0</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={notificationSettings.emailSpikes}
                  onChange={() => handleNotificationChange('emailSpikes')}
                  className="rounded bg-slate-900 border-white/10 text-brand-cyan focus:ring-brand-cyan/20 w-4.5 h-4.5"
                />
              </label>

              {/* Toggle 2 */}
              <label className="flex items-start justify-between cursor-pointer">
                <div className="pr-4">
                  <span className="text-slate-300 font-semibold block">Slack Approval Webhooks</span>
                  <span className="text-4xs text-slate-500 font-mono block uppercase mt-0.5">Instant alerts when queue populates</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={notificationSettings.slackApprovals}
                  onChange={() => handleNotificationChange('slackApprovals')}
                  className="rounded bg-slate-900 border-white/10 text-brand-cyan focus:ring-brand-cyan/20 w-4.5 h-4.5"
                />
              </label>

              {/* Toggle 3 */}
              <label className="flex items-start justify-between cursor-pointer">
                <div className="pr-4">
                  <span className="text-slate-300 font-semibold block">Autonomous execution logs</span>
                  <span className="text-4xs text-slate-500 font-mono block uppercase mt-0.5">Daily reports summary</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={notificationSettings.autonomousLogs}
                  onChange={() => handleNotificationChange('autonomousLogs')}
                  className="rounded bg-slate-900 border-white/10 text-brand-cyan focus:ring-brand-cyan/20 w-4.5 h-4.5"
                />
              </label>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};
export default Settings;
