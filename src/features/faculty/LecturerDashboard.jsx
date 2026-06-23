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
  X,
  Camera,
  MapPin
} from 'lucide-react';
import { fetchLogs, fetchMonthlySummary, createLog, fetchTimetable, bulkSubmit } from './attendanceSlice';
import attendanceService from '../../services/attendanceService';
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
    hours: 1,
    attendance_count: '',
    latitude: null,
    longitude: null
  });

  const [isCountingFaces, setIsCountingFaces] = useState(false);
  const [isPinningLocation, setIsPinningLocation] = useState(false);
  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);

  const [logPage, setLogPage] = useState(1);
  const logsPerPage = 5;

  const academicYear = '2026-27';
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchMonthlySummary({ academicYear, month: currentMonth }));
      dispatch(fetchLogs({ month: currentMonth }));
      dispatch(fetchTimetable({ academicYear }));
      setFormData(prev => ({ ...prev, faculty_credential_id: '' }));
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
      dispatch(fetchLogs({ month: currentMonth }));
      dispatch(fetchMonthlySummary({ academicYear, month: currentMonth }));
    }
  };

  const handleBulkSubmit = async () => {
    const draftIds = logs.filter(log => (log.log_status || log.status) === 'DRAFT').map(log => log.id);
    if (draftIds.length === 0) return;
    
    if (window.confirm(`Submit all ${draftIds.length} draft entries for verification?`)) {
      const result = await dispatch(bulkSubmit(draftIds));
      if (bulkSubmit.fulfilled.match(result)) {
        dispatch(fetchLogs({ month: currentMonth }));
      }
    }
  };

  const handleImageCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsCountingFaces(true);
    try {
      const response = await attendanceService.countFaces(file);
      if (response.status === 'success') {
        setFormData(prev => ({ ...prev, attendance_count: response.data.face_count }));
        import('react-hot-toast').then(toast => toast.toast.success(`AI counted ${response.data.face_count} students`));
      } else {
        import('react-hot-toast').then(toast => toast.toast.error(response.message || 'Failed to process image'));
      }
    } catch (error) {
      import('react-hot-toast').then(toast => toast.toast.error('Error counting faces'));
    } finally {
      setIsCountingFaces(false);
    }
  };

  const handlePinLocation = () => {
    if (!navigator.geolocation) {
      import('react-hot-toast').then(toast => toast.toast.error('Geolocation is not supported by your browser'));
      return;
    }
    
    setIsPinningLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({ 
          ...prev, 
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        setIsPinningLocation(false);
        import('react-hot-toast').then(toast => toast.toast.success('Location pinned successfully!'));
      },
      (error) => {
        setIsPinningLocation(false);
        import('react-hot-toast').then(toast => toast.toast.error('Unable to retrieve your location'));
      }
    );
  };

  const statusColors = {
    'DRAFT': 'bg-slate-100 text-slate-600',
    'SUBMITTED': 'bg-amber-100 text-amber-600',
    'VERIFIED': 'bg-emerald-100 text-emerald-600',
    'REJECTED': 'bg-rose-100 text-rose-600'
  };

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const todaysSlots = timetable?.[todayStr] || [];

  const paginatedLogs = logs.slice((logPage - 1) * logsPerPage, logPage * logsPerPage);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-[40px] bg-slate-900 p-10 text-white shadow-2xl">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/30">
                Lecturer Portal
              </span>
              <span className="text-slate-400 text-[10px] font-bold">AY 2026-27</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome, <span className="text-indigo-400">{user?.full_name || 'Lecturer'}</span></h1>
            <p className="text-slate-400 font-medium max-w-lg leading-relaxed">
              Track your teaching hours and manage your monthly honorarium logs.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="primary" 
              onClick={() => setIsModalOpen(true)}
              className="h-14 px-8 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold border-none shadow-lg shadow-black/10 transition-colors"
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
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">This Month</span>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Total Hours</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{summary?.total_hours || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified</span>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Approved Hours</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{summary?.verified_hours || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <AlertCircle size={24} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending</span>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Draft/Pending</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {(summary?.total_hours || 0) - (summary?.verified_hours || 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expected</span>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Est. Honorarium</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">₹ {summary?.verified_amount || 0}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Logs Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Activity</h3>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleBulkSubmit}
                disabled={!logs.some(l => l.status === 'DRAFT')}
                className="text-[10px] font-bold uppercase tracking-widest h-10 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all"
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
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Topic</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Hours</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading && logs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center">
                        <Loader2 className="animate-spin mx-auto text-indigo-500" size={32} />
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-medium italic">
                        No logs found for this period.
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((log) => (
                      <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <p className="text-sm font-bold text-slate-900">{log.lecture_date ? new Date(log.lecture_date).toLocaleDateString() : 'N/A'}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{log.lecture_type}</p>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-medium text-slate-600 line-clamp-1">{log.topic_covered}</p>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="text-sm font-bold text-slate-900">{log.hours}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            statusColors[log.status] || 'bg-slate-100 text-slate-600'
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
            
            {/* Pagination Controls */}
            {!loading && logs.length > 0 && (
              <div className="flex items-center justify-between px-8 py-4 bg-slate-50 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Showing {(logPage - 1) * logsPerPage + 1} to {Math.min(logPage * logsPerPage, logs.length)} of {logs.length}
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={logPage === 1}
                    onClick={() => setLogPage(p => p - 1)}
                    className="h-8 px-4 text-[10px] font-bold uppercase tracking-widest border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={logPage >= Math.ceil(logs.length / logsPerPage)}
                    onClick={() => setLogPage(p => p + 1)}
                    className="h-8 px-4 text-[10px] font-bold uppercase tracking-widest border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timetable / Quick Info */}
        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 relative overflow-hidden shadow-sm">
            <BookOpen size={120} className="absolute -right-6 -bottom-6 opacity-5 text-indigo-600" />
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-slate-900 tracking-tight relative z-10">Today's Schedule</h4>
              <Button 
                variant="outline" 
                onClick={() => setIsTimetableModalOpen(true)}
                className="text-[10px] font-bold uppercase tracking-widest border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 relative z-10"
              >
                View Weekly
              </Button>
            </div>
            
            <div className="space-y-4 relative z-10">
              {todaysSlots.length > 0 ? todaysSlots.map((slot, i) => (
                <div key={i} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center font-bold text-xs text-indigo-600 shrink-0">
                    {slot.start_time?.split(':')[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">{slot.lecture_type}</p>
                    <p className="text-sm font-bold text-slate-700">{slot.subject_name || 'Subject'}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-6 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
                  <p className="text-slate-500 text-sm font-medium">No classes scheduled for today.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-6">Reminders</h3>
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
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Log Teaching Hour</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateLog} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Log Date</label>
                  <input 
                    type="date"
                    required
                    value={formData.log_date}
                    onChange={(e) => setFormData({...formData, log_date: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Lecture Type</label>
                  <select 
                    value={formData.lecture_type}
                    onChange={(e) => setFormData({...formData, lecture_type: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold"
                  >
                    <option value="THEORY">Theory</option>
                    <option value="PRACTICAL">Practical</option>
                    <option value="TUTORIAL">Tutorial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Timetable Slot</label>
                  <select 
                    required
                    value={formData.timetable_slot_id}
                    onChange={(e) => setFormData({...formData, timetable_slot_id: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold"
                  >
                  <option value="">Select Slot...</option>
                  {timetable.filter(s => s.day_of_week === new Date(formData.lecture_date).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()).map(slot => (
                    <option key={slot.id} value={slot.id}>{slot.start_time} - {slot.subject_name || 'Class'}</option>
                  ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Duration (Hours)</label>
                  <input 
                    type="number"
                    min="0.5"
                    step="0.5"
                    required
                    value={formData.hours}
                    onChange={(e) => setFormData({...formData, hours: parseFloat(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Topic Covered</label>
                <textarea 
                  required
                  value={formData.topic_covered}
                  onChange={(e) => setFormData({...formData, topic_covered: e.target.value})}
                  placeholder="Describe the topics taught in this session..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium h-16"
                />
              </div>

              <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Student Attendance</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Capture an image to automatically count students using AI, or enter manually.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 items-end">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest ml-1">AI Face Count Capture</label>
                    <div className="relative">
                      <input 
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageCapture}
                        disabled={isCountingFaces}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <div className={`w-full bg-white border border-indigo-200 hover:border-indigo-400 rounded-xl px-4 py-2 flex items-center justify-center gap-2 transition-colors ${isCountingFaces ? 'opacity-50' : ''}`}>
                        {isCountingFaces ? <Loader2 size={16} className="text-indigo-500 animate-spin" /> : <Camera size={16} className="text-indigo-500" />}
                        <span className="text-xs font-bold text-indigo-600">
                          {isCountingFaces ? 'Counting...' : 'Capture Image'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Manual Count</label>
                    <input 
                      type="number"
                      min="0"
                      value={formData.attendance_count}
                      onChange={(e) => setFormData({...formData, attendance_count: e.target.value ? parseInt(e.target.value) : ''})}
                      placeholder="e.g. 45"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Pin Location UI */}
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-amber-900">Lecture Location</h4>
                  <p className="text-[11px] text-amber-700/70 mt-0.5">You must pin your location to log this lecture.</p>
                </div>
                <Button 
                  type="button"
                  onClick={handlePinLocation}
                  disabled={isPinningLocation || (formData.latitude !== null)}
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all",
                    formData.latitude !== null 
                      ? "bg-emerald-100 text-emerald-700 border-none opacity-100 cursor-default" 
                      : "bg-amber-500 hover:bg-amber-600 text-white border-none shadow-md shadow-amber-500/20"
                  )}
                >
                  {isPinningLocation ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : formData.latitude !== null ? (
                    <>
                      <CheckCircle2 size={14} className="mr-1.5" />
                      Pinned
                    </>
                  ) : (
                    <>
                      <MapPin size={14} className="mr-1.5" />
                      Pin Location
                    </>
                  )}
                </Button>
              </div>

              <div className="pt-4 border-t border-slate-50 flex gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl text-sm font-bold border-slate-200">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting || formData.latitude === null} className="flex-1 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700">
                  {submitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Save Log Entry'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Weekly Timetable Modal */}
      {isTimetableModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Weekly Timetable</h3>
                <p className="text-sm text-slate-500 mt-1">Your assigned classes for the current academic year</p>
              </div>
              <button onClick={() => setIsTimetableModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto bg-slate-50/30">
              {Object.keys(timetable || {}).length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium text-lg">No timetable assigned yet.</p>
                  <p className="text-slate-400 text-sm mt-2">Contact your principal to set up your schedule.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'].map(day => {
                    const slots = timetable[day] || [];
                    if (slots.length === 0) return null;
                    return (
                      <div key={day} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="bg-indigo-50/50 border-b border-indigo-100 px-6 py-4">
                          <h4 className="font-bold text-indigo-900">{day}</h4>
                          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mt-0.5">{slots.length} Classes</p>
                        </div>
                        <div className="p-4 space-y-3 flex-1">
                          {slots.map(slot => (
                            <div key={slot.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-500">
                                  Slot {slot.slot_number}
                                </span>
                                <span className="text-xs font-bold text-indigo-600">
                                  {slot.start_time.substring(0,5)} - {slot.end_time.substring(0,5)}
                                </span>
                              </div>
                              <h5 className="font-bold text-slate-800 text-sm line-clamp-1">{slot.subject_name}</h5>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{slot.lecture_type}</span>
                                {slot.class_name && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{slot.class_name}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;
