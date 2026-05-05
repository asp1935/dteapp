import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Clock, 
  Plus, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp,
  FileText,
  User,
  LogOut,
  ChevronRight,
  MoreVertical,
  Search,
  Filter,
  Loader2,
  X
} from 'lucide-react';
import { fetchLogs, fetchMonthlySummary, createLog, fetchTimetable, bulkSubmit, submitLog } from './attendanceSlice';
import { Button } from '../../components/common/UIComponents';
import { cn } from '../../utils/cn';

const LecturerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { logs, summary, timetable, loading, submitting } = useSelector((state) => state.attendance);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    faculty_credential_id: user?.id || '',
    timetable_slot_id: '',
    lecture_date: new Date().toISOString().split('T')[0],
    lecture_type: 'THEORY',
    topic_covered: '',
    attendance_count: 0,
    slot_number: 1,
    subject_name: ''
  });

  const academicYear = '2026-27';
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    if (user) {
      const credId = user.faculty_credential_id || user.id;
      dispatch(fetchMonthlySummary({ academicYear, month: currentMonth, facultyCredentialId: credId }));
      dispatch(fetchLogs({ month: currentMonth, faculty_credential_id: credId }));
      dispatch(fetchTimetable({ isMy: true, academicYear }));
      setFormData(prev => ({ ...prev, faculty_credential_id: credId }));
    }
  }, [dispatch, user]);

  const handleCreateLog = async (e) => {
    e.preventDefault();
    
    // Find the selected slot to get the correct slot_number and subject_name if applicable
    const selectedSlot = timetable.find(s => s.id === formData.timetable_slot_id);
    
    const payload = {
      ...formData,
      slot_number: selectedSlot ? selectedSlot.slot_number : formData.slot_number,
      subject_name: selectedSlot ? selectedSlot.subject_name : formData.subject_name,
      is_extra: !formData.timetable_slot_id
    };

    const result = await dispatch(createLog(payload));
    if (createLog.fulfilled.match(result)) {
      setIsModalOpen(false);
      const credId = user?.faculty_credential_id || user?.id;
      dispatch(fetchLogs({ faculty_credential_id: credId, month: currentMonth }));
      dispatch(fetchMonthlySummary({ facultyCredentialId: credId, academicYear, month: currentMonth }));
      // Reset form
      setFormData({
        ...formData,
        topic_covered: '',
        attendance_count: 0
      });
    }
  };

  const handleBulkSubmit = async () => {
    const draftIds = logs.filter(log => (log.log_status || log.status) === 'DRAFT').map(log => log.id);
    if (draftIds.length === 0) return;
    
    if (window.confirm(`Submit all ${draftIds.length} draft entries for verification?`)) {
      const result = await dispatch(bulkSubmit(draftIds));
      if (bulkSubmit.fulfilled.match(result)) {
        const credId = user?.faculty_credential_id || user?.id;
        dispatch(fetchLogs({ faculty_credential_id: credId, month: currentMonth }));
        dispatch(fetchMonthlySummary({ facultyCredentialId: credId, academicYear, month: currentMonth }));
      }
    }
  };

  const statusColors = {
    'DRAFT': 'bg-slate-100 text-slate-600',
    'SUBMITTED': 'bg-amber-100 text-amber-600',
    'VERIFIED': 'bg-emerald-100 text-emerald-600',
    'REJECTED': 'bg-red-100 text-red-600',
    'FLAGGED': 'bg-rose-100 text-rose-600'
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-[40px] bg-slate-950 p-10 text-white shadow-2xl">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                Lecturer Portal
              </span>
              <span className="text-slate-500 text-[10px] font-bold">AY 2026-27</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Welcome, <span className="text-emerald-400">{user?.full_name || 'Lecturer'}</span></h1>
            <p className="text-slate-400 font-medium max-w-lg leading-relaxed">
              Track your teaching hours and manage your monthly honorarium logs.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="primary" 
              onClick={() => setIsModalOpen(true)}
              className="h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black border-none shadow-lg shadow-emerald-500/20"
            >
              <Plus size={18} className="mr-2" />
              Log Lecture
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Clock size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">This Month</span>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Total Hours</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{summary?.total_conducted || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified</span>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Billable Hours</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{summary?.total_billable || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <AlertCircle size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</span>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Anomalies</p>
          <p className="text-3xl font-black text-slate-900 mt-1">
            {summary?.anomaly_count || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scheduled</span>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Monthly Target</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{summary?.total_scheduled || 0}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Logs Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleBulkSubmit}
                disabled={!logs.some(l => (l.log_status || l.status) === 'DRAFT')}
                className="text-[10px] font-black uppercase tracking-widest h-10 border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-all"
              >
                Submit All Drafts
              </Button>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Topic</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Hours</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading && logs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center">
                        <Loader2 className="animate-spin mx-auto text-emerald-500" size={32} />
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-medium italic">
                        No logs found for this period.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <p className="text-sm font-bold text-slate-900">{log.lecture_date ? new Date(log.lecture_date).toLocaleDateString() : 'N/A'}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{log.lecture_type}</p>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-medium text-slate-600 line-clamp-1">{log.topic_covered}</p>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="text-sm font-black text-slate-900">{log.hours || 1}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                            statusColors[log.log_status || log.status] || 'bg-slate-100 text-slate-600'
                          )}>
                            {log.log_status || log.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            {(log.log_status || log.status) === 'DRAFT' && (
                              <button 
                                onClick={async () => {
                                  const result = await dispatch(submitLog(log.id));
                                  if (submitLog.fulfilled.match(result)) {
                                    const credId = user?.faculty_credential_id || user?.id;
                                    dispatch(fetchLogs({ faculty_credential_id: credId, month: currentMonth }));
                                    dispatch(fetchMonthlySummary({ facultyCredentialId: credId, academicYear, month: currentMonth }));
                                  }
                                }}
                                className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-xl transition-all"
                                title="Submit for verification"
                              >
                                <CheckCircle2 size={18} />
                              </button>
                            )}
                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-white border-transparent">
                              <MoreVertical size={16} className="text-slate-400" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Timetable / Quick Info */}
        <div className="space-y-8">
          <div className="bg-emerald-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-100">
            <BookOpen size={120} className="absolute -right-6 -bottom-6 opacity-10" />
            <h4 className="text-lg font-black mb-4">Your Schedule</h4>
            <div className="space-y-4">
              {timetable.filter(s => s.is_active).length > 0 ? timetable.filter(s => s.is_active).map((slot, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-xs">
                    {slot.start_time?.split(':')[0]}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-200">{slot.day_of_week}</p>
                    <p className="text-sm font-bold">{slot.subject_name || 'Subject'}</p>
                  </div>
                </div>
              )) : (
                <p className="text-emerald-200 text-sm italic">No timetable slots assigned yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6">Reminders</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Submission Due</p>
                  <p className="text-xs text-slate-500 mt-1">Submit all logs by 30th May for timely processing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Log Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900">Log Teaching Hour</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateLog} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Log Date</label>
                  <input 
                    type="date"
                    required
                    value={formData.lecture_date}
                    onChange={(e) => setFormData({...formData, lecture_date: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lecture Type</label>
                  <select 
                    value={formData.lecture_type}
                    onChange={(e) => setFormData({...formData, lecture_type: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold"
                  >
                    <option value="THEORY">Theory</option>
                    <option value="PRACTICAL">Practical</option>
                    <option value="TUTORIAL">Tutorial</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Timetable Slot</label>
                <select 
                  required
                  value={formData.timetable_slot_id}
                  onChange={(e) => setFormData({...formData, timetable_slot_id: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold"
                >
                  <option value="">Select Slot...</option>
                  {timetable.filter(s => s.day_of_week === new Date(formData.lecture_date).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()).map(slot => (
                    <option key={slot.id} value={slot.id}>{slot.start_time} - {slot.subject_name || 'Class'}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Topic Covered</label>
                <textarea 
                  required
                  value={formData.topic_covered}
                  onChange={(e) => setFormData({...formData, topic_covered: e.target.value})}
                  placeholder="Describe the topics taught in this session..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-medium h-32"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Students Present</label>
                  <input 
                    type="number"
                    min="0"
                    value={formData.attendance_count}
                    onChange={(e) => setFormData({...formData, attendance_count: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold"
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    type="submit"
                    disabled={submitting}
                    className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black"
                  >
                    {submitting ? <Loader2 className="animate-spin" /> : 'Save Log Entry'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;
