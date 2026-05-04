import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Trophy, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  User,
  ShieldCheck,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/common/UIComponents';
import { fetchRankedList } from './selectionSlice';
import { cn } from '../../utils/cn';

const RankedList = ({ advertisementId, onConfirm, onBack }) => {
  const dispatch = useDispatch();
  const { rankedList, loading } = useSelector((state) => state.selection);

  useEffect(() => {
    if (advertisementId) {
      dispatch(fetchRankedList(advertisementId));
    }
  }, [dispatch, advertisementId]);

  const [remarks, setRemarks] = React.useState('Panel approved the final ranking.');

  const handleConfirmClick = () => {
    onConfirm(remarks);
  };

  const handleRefresh = () => {
    dispatch(fetchRankedList(advertisementId));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            AI-Powered <span className="text-indigo-600">Selection Matrix</span>
            <Sparkles size={20} className="text-amber-400 fill-amber-400" />
          </h2>
          <p className="text-sm text-slate-500 font-medium">Results generated based on academic scores, experience, and interview performance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={loading} className="p-2 border-slate-200">
            <RefreshCw size={18} className={cn(loading && "animate-spin")} />
          </Button>
          <Button variant="outline" onClick={onBack} className="border-slate-200">
            Back to Marking
          </Button>
          <Button onClick={handleConfirmClick} className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100">
            <ShieldCheck size={18} className="mr-2" />
            Lock & Confirm Selection
          </Button>
        </div>
      </div>

      {/* Confirmation Remarks Bar */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-4 flex items-center gap-4">
        <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
           <Award size={20} />
        </div>
        <div className="flex-1">
           <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">Confirmation Remarks</p>
           <input 
             type="text" 
             value={remarks}
             onChange={(e) => setRemarks(e.target.value)}
             className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-emerald-900 placeholder:text-emerald-300"
             placeholder="Add final panel remarks here..."
           />
        </div>
      </div>

      {loading && rankedList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <p className="text-slate-500 font-medium">Recalculating AI rankings...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rank List Column */}
        <div className="lg:col-span-2 space-y-4">
          {rankedList.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 italic font-medium">
              Rank list is currently empty.
            </div>
          ) : (
            rankedList.map((cand, idx) => (
              <div 
                key={cand.application_id}
                className={cn(
                  "relative overflow-hidden p-6 border rounded-[2rem] flex items-center justify-between transition-all hover:scale-[1.01]",
                  cand.result_status === 'SELECTED' ? "border-emerald-200 bg-emerald-50/30 ring-1 ring-emerald-100 shadow-sm" : 
                  cand.result_status === 'WAITLISTED' ? "border-amber-200 bg-amber-50/20" : "border-slate-100 bg-white"
                )}
              >
                {/* Status Indicator Bar */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1.5",
                  cand.result_status === 'SELECTED' ? "bg-emerald-500" : 
                  cand.result_status === 'WAITLISTED' ? "bg-amber-400" : "bg-slate-200"
                )} />

                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm transition-transform",
                    idx === 0 ? "bg-amber-400 text-white rotate-3" : 
                    idx === 1 ? "bg-slate-300 text-white -rotate-3" : 
                    idx === 2 ? "bg-orange-300 text-white rotate-2" : "bg-slate-50 text-slate-400"
                  )}>
                    {idx === 0 ? <Trophy size={28} /> : cand.rank}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                       <h3 className="font-bold text-slate-900 text-lg">{cand.candidate_name}</h3>
                       {idx === 0 && <span className="bg-amber-100 text-amber-700 text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest">Topper</span>}
                    </div>
                    <div className="text-xs text-slate-500 font-medium flex items-center gap-3">
                       <span>Score: <span className="text-slate-900 font-black">{cand.final_score}</span></span>
                       <span className="w-1 h-1 bg-slate-300 rounded-full" />
                       <span>APP #{cand.application_id.slice(0,6).toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1.5">
                  <span className={cn(
                    "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                    cand.result_status === 'SELECTED' ? "bg-emerald-500 text-white" : 
                    cand.result_status === 'WAITLISTED' ? "bg-amber-400 text-white" : "bg-slate-100 text-slate-500"
                  )}>
                    {cand.result_status}
                  </span>
                  {cand.waitlist_position && (
                    <span className="text-[10px] font-bold text-amber-600">Position #{cand.waitlist_position}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar: AI Insights */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
             {/* Decorative Background Icon */}
            <Sparkles className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 rotate-12" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-500/20 rounded-xl">
                <Sparkles size={20} className="text-indigo-400" />
              </div>
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-indigo-300">AI Selection Audit</h3>
            </div>
            
            <div className="space-y-5 relative z-10">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <p className="text-[11px] leading-relaxed font-medium text-slate-300 italic">
                  "Candidate <span className="text-white font-bold">Jane Smith</span> demonstrates an exceptional balance between academic rigor and practical teaching skills. No statistical anomalies found."
                </p>
              </div>

              <div className="p-5 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={14} className="text-amber-400" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">Bias Check Passed</span>
                </div>
                <p className="text-[11px] leading-relaxed font-medium text-amber-100/80">
                  Diversity and gender balance metrics are within recommended ranges for this course.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
               <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                  <span>Audit Confidence</span>
                  <span className="text-emerald-400">99.2%</span>
               </div>
               <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[99%]" />
               </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
             <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-6">Weightage Mix</h3>
             <div className="space-y-4">
                {[
                  { label: 'Quals', val: 30, color: 'bg-indigo-500' },
                  { label: 'Exp', val: 20, color: 'bg-emerald-500' },
                  { label: 'Interview', val: 35, color: 'bg-amber-500' },
                  { label: 'Other', val: 15, color: 'bg-slate-400' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-[10px] font-bold mb-1.5">
                      <span className="text-slate-600 uppercase tracking-tighter">{item.label}</span>
                      <span className="text-slate-900">{item.val}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-50 rounded-full">
                      <div className={cn("h-full rounded-full transition-all duration-1000", item.color)} style={{ width: `${item.val}%` }} />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default RankedList;
