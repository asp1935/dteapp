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
  History,
  Eye,
  Activity,
  ArrowRight
} from 'lucide-react';
import { 
  fetchLogs, 
  verifyLog
} from '../faculty/attendanceSlice';
import { Button, Input, Select } from '../../components/common/UIComponents';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

const PrincipalWorkLogs = () => {
  const dispatch = useDispatch();
  const { logs, loading } = useSelector((state) => state.attendance);
  
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    dispatch(fetchLogs({ 
      month: filterMonth, 
      log_status: filterStatus !== 'ALL' ? filterStatus : undefined 
    }));
  }, [dispatch, filterMonth, filterStatus]);

  const filteredLogs = logs.filter(log => 
    log.faculty_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.subject_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Review and verify institutional attendance and instructional records manually.
          </p>
        </div>
      </div>

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
            </Select>
          </div>
          <div className="flex-none">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
            {filteredLogs.map((log) => (
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
                <td className="px-8 py-6 text-center">
                   <span className={cn(
                     "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                     statusColors[log.log_status] || "bg-slate-100 text-slate-500"
                   )}>
                     {log.log_status}
                   </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {(log.log_status === 'SUBMITTED' || log.log_status === 'FLAGGED') && (
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
        {filteredLogs.length === 0 && (
          <div className="py-20 text-center space-y-4">
             <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mx-auto">
                <History size={32} />
             </div>
             <p className="text-slate-400 font-bold">No work logs found for the selected period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrincipalWorkLogs;
