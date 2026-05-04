import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter,
  AlertTriangle,
  Loader2,
  ScanSearch,
  Cpu,
  Zap,
  ShieldCheck,
  History,
  Eye,
  Camera,
  Activity,
  ArrowRight
} from 'lucide-react';
import { 
  fetchLogs, 
  verifyLog, 
  fetchAnomalies,
  aiCheckLog,
  fetchAISnapshot,
  fetchAIAnalysis
} from '../faculty/attendanceSlice';
import { Button, Input, Select } from '../../components/common/UIComponents';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

const PrincipalWorkLogs = () => {
  const dispatch = useDispatch();
  const { logs, anomalies, aiSnapshot, aiAnalysis, loading } = useSelector((state) => state.attendance);
  
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterStatus, setFilterStatus] = useState('SUBMITTED');
  const [remarks, setRemarks] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const [activeFacultyId, setActiveFacultyId] = useState(null);

  useEffect(() => {
    dispatch(fetchLogs({ month: filterMonth, log_status: filterStatus !== 'ALL' ? filterStatus : undefined }));
    dispatch(fetchAnomalies({ month: filterMonth, is_acknowledged: false }));
  }, [dispatch, filterMonth, filterStatus]);

  const handleVerify = async (logId, action) => {
    if (action === 'REJECT' && !remarks) {
      toast.error('Please provide remarks for rejection', {
        icon: '⚠️',
        className: 'font-black text-xs uppercase tracking-tighter'
      });
      return;
    }
    
    if (window.confirm(`Are you sure you want to ${action.toLowerCase()} this log?`)) {
      try {
        await dispatch(verifyLog({ logId, action, remarks })).unwrap();
        setRemarks('');
        setSelectedLog(null);
        dispatch(fetchLogs({ month: filterMonth, log_status: filterStatus !== 'ALL' ? filterStatus : undefined }));
      } catch (err) {
        // toast already handled in slice
      }
    }
  };

  const handleAICheck = async (logId) => {
    await dispatch(aiCheckLog(logId));
    dispatch(fetchLogs({ month: filterMonth, log_status: filterStatus !== 'ALL' ? filterStatus : undefined }));
  };

  const handleViewInsights = (facultyId) => {
    setActiveFacultyId(facultyId);
    dispatch(fetchAISnapshot(facultyId));
    dispatch(fetchAIAnalysis(facultyId));
    setIsInsightModalOpen(true);
  };

  const statusColors = {
    'SUBMITTED': 'bg-amber-100 text-amber-800',
    'VERIFIED': 'bg-emerald-100 text-emerald-800',
    'REJECTED': 'bg-red-100 text-red-800',
    'FLAGGED': 'bg-rose-100 text-rose-800'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Work Log <span className="text-indigo-600">Verification</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Review and verify institutional attendance and instructional records.
          </p>
        </div>
      </div>

      {/* Anomaly Alert */}
      {anomalies?.length > 0 && (
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] flex items-center justify-between animate-in slide-in-from-top-4">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
                <AlertTriangle size={24} />
             </div>
             <div>
                <h3 className="text-lg font-black text-rose-900 leading-none">Action Required</h3>
                <p className="text-rose-700/70 text-sm font-bold mt-1">
                  {anomalies.length} unacknowledged anomalies detected in current period.
                </p>
             </div>
          </div>
          <Button className="bg-rose-900 hover:bg-black text-white px-6 rounded-xl font-black text-xs uppercase tracking-widest">
            REVIEW FLAGS
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
        <div className="flex flex-wrap gap-6 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Period Selection</label>
            <Select 
              value={filterMonth} 
              onChange={(e) => setFilterMonth(e.target.value)}
              icon={Clock}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={i+1}>
                  {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Log Status</label>
            <Select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              icon={Activity}
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">Pending Verification</option>
              <option value="VERIFIED">Approved Logs</option>
              <option value="REJECTED">Rejected Logs</option>
              <option value="FLAGGED">AI Flagged</option>
            </Select>
          </div>
          <div className="flex-none">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search faculty..." 
                  className="pl-11 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500 w-64 transition-all"
                />
             </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest opacity-60">Faculty</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest opacity-60">Session Details</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest opacity-60">Duration</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest opacity-60 text-center">Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest opacity-60 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs">
                        {log.faculty_name?.split(' ').map(n => n[0]).join('')}
                     </div>
                     <div>
                        <p className="font-black text-slate-900 text-sm leading-tight">{log.faculty_name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{log.subject_name}</p>
                     </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <p className="text-sm font-bold text-slate-600">{new Date(log.lecture_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                   <p className="text-[10px] font-black text-slate-400 uppercase mt-1">{log.lecture_type}</p>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center text-slate-500 font-bold text-xs gap-2">
                      <Clock size={14} className="text-indigo-400" />
                      <span>{log.start_time} - {log.end_time}</span>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex justify-center">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                        statusColors[log.log_status] || "bg-slate-100 text-slate-500"
                      )}>
                        {log.log_status}
                      </span>
                   </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleAICheck(log.id)}
                      className="p-2.5 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all"
                      title="Run AI Check"
                    >
                      <ScanSearch size={20} />
                    </button>
                    <button 
                      onClick={() => handleViewInsights(log.faculty_credential_id)}
                      className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
                      title="Faculty AI Insights"
                    >
                      <Zap size={20} />
                    </button>
                    {log.log_status === 'SUBMITTED' && (
                      <>
                        <button 
                          onClick={() => handleVerify(log.id, 'VERIFY')}
                          className="p-2.5 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                          title="Verify Log"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button 
                          onClick={() => handleVerify(log.id, 'REJECT')}
                          className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="Reject Log"
                        >
                          <XCircle size={20} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
          <div className="py-20 text-center space-y-4">
             <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mx-auto">
                <History size={32} />
             </div>
             <p className="text-slate-400 font-bold">No work logs found for the selected period.</p>
          </div>
        )}
      </div>

      {/* AI Insights Modal */}
      <Modal 
        isOpen={isInsightModalOpen} 
        onClose={() => setIsInsightModalOpen(false)} 
        title="Faculty Attendance Intelligence"
        size="lg"
      >
        {loading ? (
          <div className="h-64 flex items-center justify-center"><Loader2 size={40} className="animate-spin text-indigo-500" /></div>
        ) : (
          <div className="space-y-8 p-1">
             {/* Snapshot Area */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center"><Camera size={12} className="mr-1" /> Snapshot State</p>
                   <p className="text-lg font-black text-slate-900">{aiSnapshot?.overall_status || 'STABLE'}</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                   <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1 flex items-center"><Zap size={12} className="mr-1" /> Precision Score</p>
                   <p className="text-lg font-black text-indigo-600">{aiSnapshot?.precision_score || '98'}%</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                   <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1 flex items-center"><ShieldCheck size={12} className="mr-1" /> Trust Rating</p>
                   <p className="text-lg font-black text-emerald-600">{aiSnapshot?.trust_rating || 'HIGH'}</p>
                </div>
             </div>

             {/* Deep Analysis */}
             <div className="space-y-4">
                <div className="flex items-center gap-2 ml-1 text-slate-400">
                   <Cpu size={16} />
                   <h4 className="text-[10px] font-black uppercase tracking-widest">Deep Pattern Analysis</h4>
                </div>
                <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
                   {aiAnalysis?.patterns?.map((pattern, idx) => (
                     <div key={idx} className="flex items-start gap-4">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2" />
                        <div className="flex-1">
                           <p className="text-sm font-bold text-slate-800">{pattern.title}</p>
                           <p className="text-xs text-slate-500 mt-1">{pattern.description}</p>
                        </div>
                        <span className="text-[10px] font-black text-indigo-600 uppercase whitespace-nowrap">{pattern.impact_level}</span>
                     </div>
                   ))}
                   {!aiAnalysis?.patterns && (
                     <div className="py-10 text-center">
                        <p className="text-xs font-bold text-slate-400 italic">No significant patterns detected in recent history.</p>
                     </div>
                   )}
                </div>
             </div>

             <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button onClick={() => setIsInsightModalOpen(false)} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black">ACKNOWLEDGE</Button>
             </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PrincipalWorkLogs;
