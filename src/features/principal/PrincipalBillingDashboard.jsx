import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CreditCard, 
  ReceiptText, 
  Plus, 
  Filter, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Search,
  Calendar,
  Building2,
  FileText,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Button, Input } from '../../components/common/UIComponents';
import { Table } from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import { 
  fetchBills, 
  generateBill, 
  submitBill, 
  resetBillingStatus, 
  setPage 
} from '../admin/billingSlice';
import toast from 'react-hot-toast';

const PrincipalBillingDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { bills, totalBills, page, limit, loading, fetching, success, error } = useSelector((state) => state.billing);

  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [genData, setGenData] = useState({
    faculty_credential_id: '',
    period_start: '',
    period_end: '',
    academic_year: '2026-2027'
  });

  // Fetch bills on load and when page changes
  useEffect(() => {
    if (user?.institution_id) {
      dispatch(fetchBills({ 
        institution_id: user.institution_id,
        page,
        limit
      }));
    }
  }, [dispatch, user, page, limit]);

  useEffect(() => {
    if (success) {
      toast.success('Action completed successfully!');
      dispatch(fetchBills({ institution_id: user.institution_id, page: 1, limit }));
      setIsGenModalOpen(false);
      dispatch(resetBillingStatus());
    }
    if (error) {
      toast.error(error);
      dispatch(resetBillingStatus());
    }
  }, [success, error, dispatch, user, limit]);

  const handleGenerate = (e) => {
    e.preventDefault();
    dispatch(generateBill(genData));
  };

  const handleSubmitBill = (billId) => {
    dispatch(submitBill(billId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT': return 'bg-slate-100 text-slate-600';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-600';
      case 'PRINCIPAL_APPROVED': return 'bg-emerald-100 text-emerald-600';
      case 'REJECTED': return 'bg-red-100 text-red-600';
      default: return 'bg-indigo-100 text-indigo-600';
    }
  };

  const columns = [
    { 
      key: 'faculty_name', 
      label: 'Faculty',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.faculty_name || 'N/A'}</span>
          <span className="text-[10px] text-slate-400 font-medium">{row.academic_year}</span>
        </div>
      )
    },
    { 
      key: 'period', 
      label: 'Period',
      render: (_, row) => (
        <span className="text-xs font-medium text-slate-600">
          {row.period_start} to {row.period_end}
        </span>
      )
    },
    { 
      key: 'total_amount', 
      label: 'Amount',
      render: (val) => <span className="font-black text-indigo-600">₹{val}</span>
    },
    { 
      key: 'bill_status', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(val)}`}>
          {(val || '').replace('_', ' ')}
        </span>
      )
    }
  ];

  const totalPages = Math.ceil(totalBills / limit);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Bill <span className="text-indigo-600">Generation</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage honorarium claims and payment workflows for your faculty.
          </p>
        </div>
        
        <Button 
          onClick={() => setIsGenModalOpen(true)}
          className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-slate-200 flex items-center transition-all active:scale-95"
        >
          <Plus size={20} className="mr-2" />
          GENERATE BILL
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pending Submission</p>
          <p className="text-4xl font-black text-slate-900">{bills.filter(b => b.bill_status === 'DRAFT').length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">In Process</p>
          <p className="text-4xl font-black text-blue-600">{bills.filter(b => b.bill_status === 'SUBMITTED').length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm border-l-4 border-l-emerald-500">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Approved</p>
          <p className="text-4xl font-black text-emerald-600">{bills.filter(b => b.bill_status?.includes('APPROVED')).length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm border-l-4 border-l-indigo-500">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Treasury Processed</p>
          <p className="text-4xl font-black text-indigo-600">0</p>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col min-h-[500px]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mr-4">
              <ReceiptText size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900">Recent Claims</h3>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search faculty..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500 w-64"
              />
            </div>
            <button className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1">
          {fetching ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-4">
              <Loader2 size={40} className="animate-spin text-indigo-500" />
              <p className="text-sm font-bold text-slate-400 animate-pulse">Fetching billing records...</p>
            </div>
          ) : bills.length > 0 ? (
            <Table 
              columns={columns} 
              data={bills} 
              className="border-none shadow-none"
              actions={(row) => (
                <div className="flex justify-end space-x-2">
                  {row.bill_status === 'DRAFT' && (
                    <Button 
                      variant="ghost" 
                      className="p-2 h-auto text-emerald-600 hover:bg-emerald-50 rounded-xl flex items-center text-[10px] font-black uppercase tracking-tighter"
                      onClick={() => handleSubmitBill(row.id)}
                    >
                      <Send size={14} className="mr-1" /> Submit
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    className="p-2 h-auto text-slate-400 hover:bg-slate-50 rounded-xl"
                    title="View Details"
                  >
                    <ChevronRight size={18} />
                  </Button>
                </div>
              )}
            />
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-200">
                <ReceiptText size={32} />
              </div>
              <p className="text-slate-400 font-bold">No billing records found</p>
              <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest mt-1">Generate your first bill to get started</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => dispatch(setPage(page - 1))}
                disabled={page === 1}
                className="rounded-xl px-3 border-slate-200"
              >
                <ChevronLeft size={18} />
              </Button>
              <div className="flex items-center space-x-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => dispatch(setPage(i + 1))}
                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                      page === i + 1 ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'hover:bg-slate-100 text-slate-500'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => dispatch(setPage(page + 1))}
                disabled={page === totalPages}
                className="rounded-xl px-3 border-slate-200"
              >
                <ChevronRight size={18} />
              </Button>
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Page {page} of {totalPages}
            </div>
          </div>
        )}
      </div>

      {/* Generation Modal */}
      <Modal
        isOpen={isGenModalOpen}
        onClose={() => setIsGenModalOpen(false)}
        title="Generate Faculty Bill"
        size="md"
      >
        <form onSubmit={handleGenerate} className="space-y-6 p-1">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Faculty Member (UUID)</label>
            <Input 
              placeholder="Enter Faculty UUID" 
              value={genData.faculty_credential_id}
              onChange={(e) => setGenData({...genData, faculty_credential_id: e.target.value})}
              required
              className="bg-slate-50 border-slate-200 rounded-xl py-3 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
              <Input 
                type="date"
                value={genData.period_start}
                onChange={(e) => setGenData({...genData, period_start: e.target.value})}
                required
                className="bg-slate-50 border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
              <Input 
                type="date"
                value={genData.period_end}
                onChange={(e) => setGenData({...genData, period_end: e.target.value})}
                required
                className="bg-slate-50 border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Year</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500"
              value={genData.academic_year}
              onChange={(e) => setGenData({...genData, academic_year: e.target.value})}
            >
              <option value="2026-2027">2026-2027</option>
              <option value="2025-2026">2025-2026</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsGenModalOpen(false)}
              className="flex-1 rounded-xl font-black text-slate-500"
            >
              CANCEL
            </Button>
            <Button 
              disabled={loading}
              className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black shadow-lg shadow-indigo-100"
            >
              {loading ? <Loader2 size={20} className="animate-spin mx-auto" /> : 'GENERATE NOW'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PrincipalBillingDashboard;
