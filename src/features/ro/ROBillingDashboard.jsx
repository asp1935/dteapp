import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter, 
  Eye, 
  Loader2, 
  Building2,
  FileText,
  Search,
  MessageSquare,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Button, Input, Select } from '../../components/common/UIComponents';
import { Table } from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import { 
  fetchBills, 
  fetchBillDetails, 
  fetchBillApprovals, 
  fetchAIReadiness,
  approveBill,
  resetBillingStatus 
} from '../admin/billingSlice';
import { fetchInstitutions } from '../admin/institutionSlice';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

const ROBillingDashboard = () => {
  const dispatch = useDispatch();
  const { bills, selectedBill, selectedBillApprovals, selectedBillReadiness, loading, fetching, success, error } = useSelector((state) => state.billing);
  const { institutions } = useSelector((state) => state.institutions);

  const [filterInst, setFilterInst] = useState('');
  const [filterStatus, setFilterStatus] = useState('PRINCIPAL_APPROVED');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (institutions.length === 0) {
      dispatch(fetchInstitutions({ page: 1, limit: 100 }));
    }
  }, [dispatch, institutions.length]);

  useEffect(() => {
    dispatch(fetchBills({ 
      institution_id: filterInst || undefined, 
      bill_status: filterStatus !== 'ALL' ? filterStatus : undefined 
    }));
  }, [dispatch, filterInst, filterStatus]);

  useEffect(() => {
    if (success) {
      toast.success('Action processed successfully');
      setIsDetailsModalOpen(false);
      setRemarks('');
      dispatch(resetBillingStatus());
      dispatch(fetchBills({ institution_id: filterInst || undefined, bill_status: filterStatus !== 'ALL' ? filterStatus : undefined }));
    }
    if (error) {
      toast.error(typeof error === 'string' ? error : (error?.message || JSON.stringify(error)));
      dispatch(resetBillingStatus());
    }
  }, [success, error, dispatch, filterInst, filterStatus]);

  const handleViewDetails = (billId) => {
    dispatch(fetchBillDetails(billId));
    dispatch(fetchBillApprovals(billId));
    dispatch(fetchAIReadiness(billId));
    setIsDetailsModalOpen(true);
  };

  const handleAction = (action) => {
    if (action === 'REJECT' && !remarks) {
      return toast.error('Please provide remarks for rejection');
    }
    if (window.confirm(`Are you sure you want to ${action.toLowerCase()} this bill?`)) {
      dispatch(approveBill({ billId: selectedBill.id, action, remarks }));
    }
  };

  const handleDirectAction = (billId, action) => {
    if (action === 'REJECT') {
      const reason = window.prompt('Please provide a reason for rejection:');
      if (!reason) return;
      dispatch(approveBill({ billId, action, remarks: reason }));
    } else {
      if (window.confirm('Are you sure you want to accept and forward this bill to Treasury?')) {
        dispatch(approveBill({ billId, action, remarks: 'Directly endorsed by RO.' }));
      }
    }
  };

  const columns = [
    { key: 'institution_name', label: 'Institution' },
    { key: 'faculty_name', label: 'Faculty' },
    { key: 'academic_year', label: 'Year' },
    { key: 'total_amount', label: 'Amount', render: (val) => <span className="font-black text-indigo-600">₹{val}</span> },
    { key: 'bill_status', label: 'Status', render: (val) => (
      <span className={cn(
        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
        val === 'PRINCIPAL_APPROVED' ? "bg-amber-100 text-amber-600" : 
        val === 'RO_APPROVED' ? "bg-indigo-100 text-indigo-600" : 
        val === 'TREASURY_PROCESSED' ? "bg-emerald-100 text-emerald-600" : 
        val === 'REJECTED' ? "bg-rose-100 text-rose-600" :
        "bg-slate-100 text-slate-500"
      )}>
        {val?.replace('_', ' ')}
      </span>
    )}
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            RO <span className="text-indigo-600">Billing Panel</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Review and endorse institutional honorarium claims for regional verification.
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                 <Clock size={24} />
              </div>
              <div>
                 <p className="text-2xl font-black text-slate-900">14</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Endorsement</p>
              </div>
           </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                 <ShieldCheck size={24} />
              </div>
              <div>
                 <p className="text-2xl font-black text-slate-900">128</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processed This Month</p>
              </div>
           </div>
        </div>
        <div className="bg-slate-900 rounded-[2rem] p-6 shadow-lg shadow-slate-200">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center">
                 <Building2 size={24} />
              </div>
              <div>
                 <p className="text-2xl font-black text-white italic">08</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Institutes</p>
              </div>
           </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
        <div className="flex flex-wrap gap-6 items-end">
          <div className="flex-1 min-w-[250px]">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Institute Scoping</label>
             <select 
               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm font-black outline-none focus:border-indigo-500 cursor-pointer appearance-none"
               value={filterInst}
               onChange={(e) => setFilterInst(e.target.value)}
             >
               <option value="">All Regional Institutes</option>
               {institutions.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
             </select>
          </div>
          <div className="flex-1 min-w-[200px]">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Endorsement Status</label>
             <select 
               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm font-black outline-none focus:border-indigo-500 cursor-pointer appearance-none"
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
             >
                <option value="PRINCIPAL_APPROVED">Pending My Review</option>
                <option value="RO_APPROVED">My Approved Bills</option>
                <option value="REJECTED">Rejected Bills</option>
                <option value="TREASURY_PROCESSED">Disbursed (Final)</option>
                <option value="ALL">All Bills</option>
             </select>
          </div>
          <div className="flex-none">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Search bill ID..." className="pl-11 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500 w-64" />
             </div>
          </div>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-1 shadow-sm overflow-hidden">
        {fetching ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-4">
             <Loader2 size={48} className="animate-spin text-indigo-500" />
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Retrieving Regional Claims...</p>
          </div>
        ) : (
          <Table 
            columns={columns} 
            data={bills} 
            actions={(row) => (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => handleViewDetails(row.id)} 
                  className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-xl"
                  title="View Details"
                >
                  <Eye size={16} />
                </Button>
                
                {row.bill_status === 'PRINCIPAL_APPROVED' && (
                  <>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleDirectAction(row.id, 'REJECT')} 
                      className="text-rose-600 hover:bg-rose-50 font-black text-[10px] uppercase tracking-widest px-3"
                    >
                      <XCircle size={14} className="mr-1" /> REJECT
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleDirectAction(row.id, 'APPROVE')} 
                      className="text-emerald-600 hover:bg-emerald-50 font-black text-[10px] uppercase tracking-widest px-3"
                    >
                      <CheckCircle2 size={14} className="mr-1" /> ACCEPT
                    </Button>
                  </>
                )}
              </div>
            )}
          />
        )}
      </div>

      {/* Details & Approval Modal */}
      <Modal 
        isOpen={isDetailsModalOpen} 
        onClose={() => setIsDetailsModalOpen(false)} 
        title="Bill Endorsement Details"
        size="lg"
      >
        {selectedBill && (
          <div className="space-y-8 p-1">
             {/* Summary Stats */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Bill Amount</p>
                   <p className="text-lg font-black text-indigo-600">₹{selectedBill.total_amount}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Sessions</p>
                   <p className="text-lg font-black text-slate-900">{selectedBill.total_lectures || 0}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Faculty Rank</p>
                   <p className="text-sm font-black text-slate-700">{selectedBill.designation?.replace('_', ' ')}</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                   <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">AI Trust Score</p>
                   <p className="text-lg font-black text-emerald-600">
                      {selectedBillReadiness ? `${Math.round(selectedBillReadiness.approval_probability * 100)}%` : '...'}
                   </p>
                </div>
             </div>

             {/* Approval History */}
             <div className="space-y-4">
                <div className="flex items-center gap-2 ml-1">
                   <FileText size={16} className="text-slate-400" />
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Approval Audit Trail</h4>
                </div>
                <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
                   {Array.isArray(selectedBillApprovals) && selectedBillApprovals.map((app, idx) => (
                     <div key={idx} className="flex items-start gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                           <CheckCircle2 size={16} />
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center justify-between">
                              <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{app.level.replace('_', ' ')}</p>
                              <span className="text-[10px] font-medium text-slate-400">{new Date(app.created_at).toLocaleDateString()}</span>
                           </div>
                           <p className="text-xs text-slate-500 font-medium mt-0.5">{app.remarks || 'No remarks provided'}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* RO Action Area */}
             {selectedBill.bill_status === 'PRINCIPAL_APPROVED' && (
               <div className="bg-indigo-50/50 border border-indigo-100 rounded-[2rem] p-8 space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <MessageSquare size={20} />
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-slate-900">Regional Endorsement Remarks</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Final review before treasury submission</p>
                     </div>
                  </div>
                  
                  <textarea 
                    className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-indigo-500 min-h-[100px] shadow-sm"
                    placeholder="Provide detailed feedback or audit findings..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />

                  <div className="flex gap-4">
                     <Button 
                       onClick={() => handleAction('REJECT')}
                       disabled={loading}
                       className="flex-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl font-black text-xs uppercase tracking-widest py-4 transition-all"
                     >
                       <XCircle size={18} className="mr-2" /> REJECT CLAIM
                     </Button>
                     <Button 
                       onClick={() => handleAction('APPROVE')}
                       disabled={loading}
                       className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest py-4 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center"
                     >
                       {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} className="mr-2" />}
                       ENDORSE & FORWARD
                     </Button>
                  </div>
               </div>
             )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ROBillingDashboard;
