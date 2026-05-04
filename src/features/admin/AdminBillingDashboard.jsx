import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CreditCard, 
  ReceiptText, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Plus, 
  Trash2, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowLeft,
  X,
  Edit,
  Building2,
  Info,
  Activity,
  ShieldCheck,
  Search
} from 'lucide-react';
import { Button, Input } from '../../components/common/UIComponents';
import { Table } from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import { 
  createBillingRate, 
  updateBillingRate, 
  fetchBillingRates, 
  resetBillingStatus, 
  setPage,
  fetchAIMonitor
} from './billingSlice';
import { fetchInstitutions } from './institutionSlice';
import toast from 'react-hot-toast';

// Enum Constants for Backend Compatibility (MUST be uppercase snake_case for backend)
const DESIGNATIONS = {
  'ASSISTANT_PROFESSOR': 'Assistant Professor',
  'ASSOCIATE_PROFESSOR': 'Associate Professor',
  'PROFESSOR': 'Professor',
  'VISITING_FACULTY': 'Visiting Faculty',
  'GUEST_FACULTY': 'Guest Faculty'
};

const LECTURE_TYPES = {
  'THEORY': 'Theory',
  'LAB': 'Lab',
  'TUTORIAL': 'Tutorial'
};

const AdminBillingDashboard = () => {
  const dispatch = useDispatch();
  const { rates, totalRates, page, limit, loading, fetching, error, success } = useSelector((state) => state.billing);
  const { institutions } = useSelector((state) => state.institutions);

  const [activeTab, setActiveTab] = useState('rates'); 
  const [selectedInstituteId, setSelectedInstituteId] = useState("");
  const [selectedYear, setSelectedYear] = useState("2026-2027");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRateId, setEditingRateId] = useState(null);
  
  const initialFormState = {
    academic_year: '2026-2027',
    rates: [
      {
        designation: 'ASSISTANT_PROFESSOR',
        lecture_type: 'THEORY',
        rate_per_lecture: 800,
        effective_from: "2025-06-01",
        effective_to: null,
        is_active: true
      }
    ]
  };

  const [formData, setFormData] = useState(initialFormState);

  // Fetch institutions on load
  useEffect(() => {
    if (institutions.length === 0) {
      dispatch(fetchInstitutions({ page: 1, limit: 100 }));
    }
  }, [dispatch, institutions.length]);

  // Fetch billing rates when institute, year or page changes
  useEffect(() => {
    if (activeTab === 'rates' && selectedInstituteId) {
      dispatch(fetchBillingRates({ 
        page, 
        limit, 
        institution_id: parseInt(selectedInstituteId),
        academic_year: selectedYear
      }));
    } else if (activeTab === 'ai-monitor') {
      dispatch(fetchAIMonitor());
    }
  }, [dispatch, selectedInstituteId, selectedYear, page, limit, activeTab]);

  useEffect(() => {
    if (success) {
      toast.success(editingRateId ? 'Billing rate updated successfully!' : 'Billing rates submitted successfully!');
      // Refresh list with current filters
      dispatch(fetchBillingRates({ 
        page: 1, 
        limit, 
        institution_id: parseInt(selectedInstituteId),
        academic_year: selectedYear
      }));
      // Close Modal and Reset
      closeModal();
      dispatch(resetBillingStatus());
    }
    if (error) {
      toast.error(error);
      dispatch(resetBillingStatus());
    }
  }, [success, error, dispatch, selectedInstituteId, selectedYear, limit, editingRateId]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRateId(null);
    setFormData(initialFormState);
  };

  const handleEdit = (rate) => {
    setEditingRateId(rate.id);
    setFormData({
      academic_year: rate.academic_year,
      rates: [
        {
          designation: rate.designation,
          lecture_type: rate.lecture_type,
          rate_per_lecture: rate.rate_per_lecture,
          effective_from: rate.effective_from,
          effective_to: rate.effective_to,
          is_active: rate.is_active
        }
      ]
    });
    setIsModalOpen(true);
  };

  const handleRateChange = (index, field, value) => {
    const newRates = [...formData.rates];
    if (field === 'is_active') {
      newRates[index][field] = value === 'true';
    } else {
      newRates[index][field] = field === 'rate_per_lecture' ? parseInt(value) || 0 : value;
    }
    setFormData({ ...formData, rates: newRates });
  };

  const addRate = () => {
    if (editingRateId) return; 
    setFormData({
      ...formData,
      rates: [
        ...formData.rates,
        {
          designation: 'ASSISTANT_PROFESSOR',
          lecture_type: 'THEORY',
          rate_per_lecture: 0,
          effective_from: new Date().toISOString().split('T')[0],
          effective_to: null,
          is_active: true
        }
      ]
    });
  };

  const removeRate = (index) => {
    if (formData.rates.length === 1 || editingRateId) return;
    const newRates = formData.rates.filter((_, i) => i !== index);
    setFormData({ ...formData, rates: newRates });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedInstituteId) {
      toast.error('Please select an institute first');
      return;
    }

    // Ensure all numeric IDs are integers to prevent backend 500 errors
    const instId = parseInt(selectedInstituteId);

    if (editingRateId) {
      const rateToUpdate = formData.rates[0];
      const payload = {
        institution_id: instId,
        academic_year: formData.academic_year,
        designation: rateToUpdate.designation,
        lecture_type: rateToUpdate.lecture_type,
        rate_per_lecture: parseInt(rateToUpdate.rate_per_lecture) || 0,
        effective_from: rateToUpdate.effective_from,
        effective_to: rateToUpdate.effective_to || null,
        is_active: rateToUpdate.is_active
      };
      dispatch(updateBillingRate({ id: editingRateId, data: payload }));
    } else {
      // For POST, the rates array must contain clean data
      const cleanedRates = formData.rates.map(rate => ({
        ...rate,
        rate_per_lecture: parseInt(rate.rate_per_lecture) || 0,
        effective_to: rate.effective_to || null
      }));

      const payload = {
        institution_id: instId,
        academic_year: formData.academic_year,
        rates: cleanedRates
      };
      dispatch(createBillingRate(payload));
    }
  };

  const columns = [
    { key: 'academic_year', label: 'Academic Year' },
    { 
      key: 'designation', 
      label: 'Designation',
      render: (val) => DESIGNATIONS[val] || val
    },
    { 
      key: 'lecture_type', 
      label: 'Type',
      render: (val) => LECTURE_TYPES[val] || val
    },
    { 
      key: 'rate_per_lecture', 
      label: 'Rate (₹)',
      render: (val) => <span className="font-bold text-indigo-600">₹{val}</span>
    },
    { key: 'effective_from', label: 'From' },
    { 
      key: 'is_active', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${val ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
          {val ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  const totalPages = Math.ceil(totalRates / limit);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Institutional <span className="text-indigo-600">Billing Control</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Global management of billing rates across all institutes.
          </p>
        </div>
        
        {activeTab === 'rates' && (
          <Button 
            onClick={() => setIsModalOpen(true)}
            disabled={!selectedInstituteId}
            className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-slate-200 flex items-center transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            <Plus size={20} className="mr-2" />
            CREATE RATE
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('rates')}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'rates' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Rate Management
        </button>
        <button 
          onClick={() => setActiveTab('ai-monitor')}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'ai-monitor' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          AI Monitor
        </button>
      </div>

      {activeTab === 'rates' ? (
        <>
          {/* Institute Selector Dropdown */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Building2 size={28} />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Target Institution</label>
                <div className="relative">
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm font-black outline-none focus:border-indigo-500 transition-all cursor-pointer appearance-none pr-10"
                    value={selectedInstituteId}
                    onChange={(e) => setSelectedInstituteId(e.target.value)}
                  >
                    <option value="">Choose an Institute to manage rates...</option>
                    {institutions.map(inst => (
                      <option key={inst.id} value={inst.id}>{inst.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Filter size={16} className="text-slate-400" />
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-48">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Academic Year</label>
                <div className="relative">
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm font-black outline-none focus:border-indigo-500 transition-all cursor-pointer appearance-none pr-10"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="2026-2027">2026-2027</option>
                    <option value="2025-2026">2025-2026</option>
                    <option value="2024-2025">2024-2025</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Calendar size={16} className="text-slate-400" />
                  </div>
                </div>
              </div>

              {!selectedInstituteId && (
                <div className="flex items-center text-amber-600 bg-amber-50 px-4 py-2 rounded-xl animate-pulse">
                  <Info size={16} className="mr-2" />
                  <span className="text-xs font-black uppercase tracking-wider whitespace-nowrap">Select Institute</span>
                </div>
              )}
            </div>
          </div>

          {selectedInstituteId ? (
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col min-h-[500px] animate-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mr-4">
                    <Filter size={20} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Institute Billing Records</h3>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                  {totalRates} Records Found
                </div>
              </div>

              <div className="flex-1">
                {fetching ? (
                  <div className="h-64 flex flex-col items-center justify-center space-y-4">
                    <Loader2 size={40} className="animate-spin text-indigo-500" />
                    <p className="text-sm font-bold text-slate-400 animate-pulse text-center">Syncing institutional billing data...<br/><span className="text-[10px] font-black uppercase tracking-widest">Please Wait</span></p>
                  </div>
                ) : rates.length > 0 ? (
                  <Table 
                    columns={columns} 
                    data={rates} 
                    className="border-none shadow-none"
                    actions={(row) => (
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          className="p-2 h-auto text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          onClick={() => handleEdit(row)}
                          title="Edit Rate"
                        >
                          <Edit size={18} />
                        </Button>
                      </div>
                    )}
                  />
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-10">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-4 text-slate-200">
                      <CreditCard size={40} />
                    </div>
                    <h4 className="text-lg font-black text-slate-900">No Records Found</h4>
                    <p className="text-slate-400 text-sm font-medium">No billing rates defined for {selectedYear} in this institution.</p>
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
          ) : (
            <div className="h-96 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-10 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 text-slate-300">
                <Building2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">No Institute Selected</h3>
              <p className="text-slate-500 font-medium max-w-sm mb-8">Please select an institution from the dropdown above to manage its billing rates and audit logs.</p>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Bills Scanned</p>
              <p className="text-4xl font-black text-slate-900">0</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm border-l-4 border-l-amber-500">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Anomalies Detected</p>
              <p className="text-4xl font-black text-amber-600">0</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm border-l-4 border-l-emerald-500">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">AI Confidence</p>
              <p className="text-4xl font-black text-emerald-600">98%</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mb-6">
              <Activity size={40} className="animate-pulse" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">AI Monitoring Active</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">The AI engine is currently scanning attendance logs and lecture records for anomalies. Reports will appear here as bills are submitted.</p>
            <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <ShieldCheck size={14} className="text-emerald-500" /> All systems operational
            </div>
          </div>
        </div>
      )}

      {/* Popup Form (Modal) */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingRateId ? "Update Billing Rate" : "Create New Billing Rate"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-8 p-1">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
              <Calendar size={14} className="mr-2 text-indigo-500" /> Academic Session
            </label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500 transition-all cursor-pointer appearance-none disabled:opacity-50"
              value={formData.academic_year}
              onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
              disabled={!!editingRateId}
            >
              <option value="2026-2027">2026-2027</option>
              <option value="2025-2026">2025-2026</option>
              <option value="2024-2025">2024-2025</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {editingRateId ? "Rate Configuration" : "Entries List"}
              </label>
              {!editingRateId && (
                <button 
                  type="button" 
                  onClick={addRate} 
                  className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 flex items-center"
                >
                  <Plus size={12} className="mr-1" /> Add More
                </button>
              )}
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {formData.rates.map((rate, index) => (
                <div key={index} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 relative group hover:border-indigo-100 hover:bg-white transition-all duration-300 shadow-sm">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">Designation</label>
                        <select 
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
                          value={rate.designation}
                          onChange={(e) => handleRateChange(index, 'designation', e.target.value)}
                          disabled={!!editingRateId}
                        >
                          <option value="">Select Designation...</option>
                          {Object.entries(DESIGNATIONS).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">Lecture Type</label>
                        <select 
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
                          value={rate.lecture_type}
                          onChange={(e) => handleRateChange(index, 'lecture_type', e.target.value)}
                          disabled={!!editingRateId}
                        >
                          {Object.entries(LECTURE_TYPES).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">Rate (₹)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                          <Input 
                            type="number"
                            placeholder="Rate"
                            value={rate.rate_per_lecture}
                            onChange={(e) => handleRateChange(index, 'rate_per_lecture', e.target.value)}
                            className="bg-white rounded-xl pl-8 border-slate-200 py-2.5 font-bold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">Effective From</label>
                        <Input 
                          type="date"
                          value={rate.effective_from}
                          onChange={(e) => handleRateChange(index, 'effective_from', e.target.value)}
                          className="bg-white rounded-xl border-slate-200 py-2.5 font-bold disabled:opacity-50"
                          disabled={!!editingRateId}
                        />
                      </div>
                    </div>

                    {editingRateId && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">Status</label>
                          <select 
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500 transition-colors"
                            value={rate.is_active ? 'true' : 'false'}
                            onChange={(e) => handleRateChange(index, 'is_active', e.target.value)}
                          >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">Effective To</label>
                          <Input 
                            type="date"
                            value={rate.effective_to || ''}
                            onChange={(e) => handleRateChange(index, 'effective_to', e.target.value)}
                            className="bg-white rounded-xl border-slate-200 py-2.5 font-bold"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {formData.rates.length > 1 && !editingRateId && (
                    <button 
                      type="button" 
                      onClick={() => removeRate(index)} 
                      className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full shadow-md p-1.5 border border-red-50 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button 
              type="button"
              variant="outline"
              onClick={closeModal}
              className="flex-1 py-3 rounded-xl font-black text-slate-500 border-slate-200 hover:bg-slate-50"
            >
              CANCEL
            </Button>
            <Button 
              disabled={loading}
              className="flex-[2] bg-slate-900 hover:bg-black text-white py-3 rounded-xl font-black shadow-lg shadow-slate-200 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin mx-auto" />
              ) : (
                editingRateId ? 'UPDATE RATE' : 'SUBMIT RATES'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminBillingDashboard;
