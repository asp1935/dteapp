import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  BarChart3, 
  PieChart, 
  Users, 
  UserCheck, 
  Award, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  Shield,
  Loader2,
  RefreshCw,
  FileText
} from 'lucide-react';
import { fetchDashboard } from './selectionSlice';
import { Button } from '../../components/common/UIComponents';
import { cn } from '../../utils/cn';

const SelectionDashboardView = ({ advertisementId, onStartSelection }) => {
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((state) => state.selection);

  useEffect(() => {
    if (advertisementId) {
      dispatch(fetchDashboard(advertisementId));
    }
  }, [dispatch, advertisementId]);

  if (loading && !dashboard) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-500 font-medium">Loading advanced dashboard...</p>
      </div>
    );
  }

  if (!dashboard) return null;

  const stats = [
    { label: 'Total Applicants', value: dashboard.total_applications, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Shortlisted', value: dashboard.shortlisted_count, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Marking Progress', value: `${Math.round((dashboard.shortlisted_count > 0 ? (dashboard.marked_count / dashboard.shortlisted_count) : 0) * 100)}%`, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'AI Audit Status', value: 'Healthy', icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-xl font-black text-slate-900">Selection <span className="text-indigo-600">Intelligence</span></h2>
          <p className="text-sm text-slate-500 font-medium">Real-time oversight of candidates, scores, and ranking integrity.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => dispatch(fetchDashboard(advertisementId))} className="p-2 border-slate-200">
            <RefreshCw size={18} className={cn(loading && "animate-spin")} />
          </Button>
          <Button onClick={onStartSelection} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100">
            Enter Selection Workflow
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Insights */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                   <TrendingUp size={20} className="text-indigo-600" />
                   Selection Funnel
                </h3>
                <span className="text-xs font-medium text-slate-400">Advertisement Lifecycle Status: <span className="text-indigo-600 font-bold uppercase">{dashboard.status}</span></span>
             </div>
             
             {/* Simple Funnel Visualization */}
             <div className="space-y-6">
                {[
                  { label: 'Applications Received', count: dashboard.total_applications, color: 'bg-slate-100', text: 'text-slate-600' },
                  { label: 'Shortlisted for Interview', count: dashboard.shortlisted_count, color: 'bg-indigo-100', text: 'text-indigo-600' },
                  { label: 'Interviews Completed', count: dashboard.marked_count, color: 'bg-emerald-100', text: 'text-emerald-600' },
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className={cn("h-16 rounded-2xl flex items-center px-8 transition-all hover:scale-[1.01]", item.color)}>
                       <div className="flex-1">
                          <span className={cn("text-[10px] font-black uppercase tracking-widest", item.text)}>{item.label}</span>
                          <p className="text-xl font-black text-slate-900">{item.count} Candidates</p>
                       </div>
                       <div className="text-slate-300">
                          <ChevronRight size={24} />
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* AI Audit Logs / Anomalies */}
        <div className="space-y-6">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200">
              <div className="flex items-center gap-2 mb-6">
                 <Shield size={20} className="text-indigo-400" />
                 <h3 className="font-black text-xs uppercase tracking-widest text-indigo-300">Integrity Log</h3>
              </div>
              
              <div className="space-y-4">
                 {(dashboard.insights || []).map((insight, i) => (
                   <div key={`insight-${i}`} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 flex-shrink-0" />
                      <div>
                         <p className="text-[11px] font-bold text-slate-200 mb-0.5">AI Selection Insight</p>
                         <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{insight}</p>
                      </div>
                   </div>
                 ))}

                 {(dashboard.bias_flags || []).map((flag, i) => (
                   <div key={`bias-${i}`} className="flex gap-4 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50 flex-shrink-0" />
                      <div>
                         <p className="text-[11px] font-bold text-amber-200 mb-0.5">Diversity Flag</p>
                         <p className="text-[10px] text-amber-400/80 leading-relaxed font-medium">{flag}</p>
                      </div>
                   </div>
                 ))}

                 {(!dashboard.insights?.length && !dashboard.bias_flags?.length) && (
                   <div className="p-8 text-center text-slate-500 text-[10px] font-medium border border-dashed border-white/10 rounded-2xl">
                     Awaiting ranking generation to run deep analysis.
                   </div>
                 )}
              </div>

              <button className="w-full mt-8 py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-white/5 transition-all">
                 View Full AI Audit Trail
              </button>
           </div>

           <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-widest mb-6">System Health</h3>
              <div className="flex items-center justify-between mb-4">
                 <span className="text-xs font-medium text-slate-600">Database Sync</span>
                 <span className="text-xs font-black text-emerald-600">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-xs font-medium text-slate-600">AI Scoring Engine</span>
                 <span className="text-xs font-black text-emerald-600">READY</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ChevronRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export default SelectionDashboardView;
