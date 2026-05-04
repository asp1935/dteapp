import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  User, 
  Building2,
  BookOpen,
  ArrowRight,
  Filter,
  CheckCircle2,
  Edit2
} from 'lucide-react';
import { Button, Input, Select } from '../../components/common/UIComponents';
import { fetchTimetable, createTimetable, updateTimetableSlot } from '../faculty/attendanceSlice';
import { getFaculties } from './facultySlice';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const LECTURE_TYPES = [
  { value: 'THEORY', label: 'Theory' },
  { value: 'PRACTICAL', label: 'Practical/Lab' },
  { value: 'TUTORIAL', label: 'Tutorial' }
];

const TimetableManagement = () => {
  const dispatch = useDispatch();
  const { timetable, loading } = useSelector((state) => state.attendance);
  const { facultyList } = useSelector((state) => state.faculty);
  const { user } = useSelector((state) => state.auth);

  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedYear, setSelectedYear] = useState('2026-2027');
  const [slots, setSlots] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (facultyList.length === 0) {
      dispatch(getFaculties({ page: 1, limit: 100 }));
    }
  }, [dispatch, facultyList.length]);

  useEffect(() => {
    if (selectedFaculty && selectedYear) {
      dispatch(fetchTimetable({ facultyCredentialId: selectedFaculty, academicYear: selectedYear }));
    }
  }, [dispatch, selectedFaculty, selectedYear]);

  useEffect(() => {
    if (timetable) {
      setSlots(timetable.map(s => ({ ...s, id: s.id || Math.random() })));
    }
  }, [timetable]);

  const addSlot = (day) => {
    setSlots([...slots, {
      id: Math.random(),
      day,
      start_time: '09:00',
      end_time: '10:00',
      subject_name: '',
      lecture_type: 'THEORY',
      class_name: '',
      is_active: true,
      isNew: true
    }]);
  };

  const removeSlot = (id) => {
    setSlots(slots.filter(s => s.id !== id));
  };

  const handleSlotChange = (id, field, value) => {
    setSlots(slots.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSaveBulk = async () => {
    if (!selectedFaculty) return toast.error('Select a faculty first');
    
    const payload = {
      faculty_credential_id: selectedFaculty,
      institution_id: user?.institution_id || 1,
      academic_year: selectedYear,
      slots: slots.map(({ id, isNew, ...rest }) => rest)
    };

    try {
      await dispatch(createTimetable(payload)).unwrap();
      setIsEditing(false);
    } catch (err) {
      // toast handled in slice
    }
  };

  const handleUpdateSlot = async (slot) => {
    try {
      await dispatch(updateTimetableSlot({ 
        slotId: slot.id, 
        slotData: {
          start_time: slot.start_time,
          end_time: slot.end_time,
          subject_name: slot.subject_name,
          lecture_type: slot.lecture_type,
          class_name: slot.class_name,
          is_active: slot.is_active
        }
      })).unwrap();
    } catch (err) {}
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Timetable <span className="text-indigo-600">Management</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Configure weekly schedules and teaching loads for faculty members.
          </p>
        </div>
        
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-2xl font-black border-slate-200">CANCEL</Button>
              <Button onClick={handleSaveBulk} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 flex items-center px-8">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} className="mr-2" />}
                PUBLISH TIMETABLE
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-slate-900 hover:bg-black text-white rounded-2xl font-black shadow-lg shadow-slate-200 flex items-center px-8">
              <Edit2 size={18} className="mr-2" />
              MODIFY SCHEDULE
            </Button>
          )}
        </div>
      </div>

      {/* Selection Area */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <User size={28} />
          </div>
          
          <div className="flex-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Faculty Member</label>
            <div className="relative">
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm font-black outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
              >
                <option value="">Select Faculty...</option>
                {facultyList.map(f => (
                  <option key={f.id} value={f.credential_id || f.id}>{f.name} ({f.department})</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Filter size={16} className="text-slate-400" />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-48">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Academic Session</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm font-black outline-none focus:border-indigo-500 appearance-none cursor-pointer"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="2026-2027">2026-2027</option>
              <option value="2025-2026">2025-2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="grid grid-cols-1 gap-8">
        {DAYS.map(day => (
          <div key={day} className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm transition-all hover:shadow-md">
            <div className="bg-slate-900 px-8 py-4 flex items-center justify-between">
               <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs">{day}</h3>
               {isEditing && (
                 <button onClick={() => addSlot(day)} className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 flex items-center transition-colors">
                    <Plus size={14} className="mr-1" /> ADD SLOT
                 </button>
               )}
            </div>
            
            <div className="p-8">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {slots.filter(s => s.day === day).map(slot => (
                   <div key={slot.id} className={cn(
                     "p-6 rounded-3xl border transition-all relative group",
                     slot.is_active ? "bg-slate-50 border-slate-100" : "bg-slate-100/50 border-slate-200 grayscale opacity-60"
                   )}>
                      {isEditing ? (
                        <div className="space-y-4">
                           <div className="flex gap-2">
                              <Input 
                                type="time" 
                                value={slot.start_time} 
                                onChange={(e) => handleSlotChange(slot.id, 'start_time', e.target.value)}
                                className="bg-white"
                              />
                              <div className="flex items-center text-slate-300"><ArrowRight size={14} /></div>
                              <Input 
                                type="time" 
                                value={slot.end_time} 
                                onChange={(e) => handleSlotChange(slot.id, 'end_time', e.target.value)}
                                className="bg-white"
                              />
                           </div>
                           <Input 
                            placeholder="Subject Name" 
                            value={slot.subject_name} 
                            onChange={(e) => handleSlotChange(slot.id, 'subject_name', e.target.value)}
                            className="bg-white"
                           />
                           <div className="grid grid-cols-2 gap-2">
                              <select 
                                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                                value={slot.lecture_type}
                                onChange={(e) => handleSlotChange(slot.id, 'lecture_type', e.target.value)}
                              >
                                {LECTURE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                              </select>
                              <Input 
                                placeholder="Class" 
                                value={slot.class_name} 
                                onChange={(e) => handleSlotChange(slot.id, 'class_name', e.target.value)}
                                className="bg-white text-xs"
                              />
                           </div>
                           <button onClick={() => removeSlot(slot.id)} className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                              <Trash2 size={14} />
                           </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-4">
                             <div className="flex items-center text-indigo-600">
                               <Clock size={14} className="mr-2" />
                               <span className="text-xs font-black tracking-tighter">{slot.start_time} - {slot.end_time}</span>
                             </div>
                             <span className={cn(
                               "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter",
                               slot.lecture_type === 'THEORY' ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
                             )}>
                               {slot.lecture_type}
                             </span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 mb-1">{slot.subject_name || 'No Subject Set'}</h4>
                          <div className="flex items-center text-[10px] font-bold text-slate-400">
                             <Building2 size={12} className="mr-1" /> {slot.class_name || 'TBA'}
                          </div>
                        </>
                      )}
                   </div>
                 ))}
                 {slots.filter(s => s.day === day).length === 0 && (
                   <div className="col-span-full py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                      <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">No lectures scheduled</p>
                   </div>
                 )}
               </div>
            </div>
          </div>
        ))}
      </div>

      {!selectedFaculty && (
        <div className="py-20 text-center space-y-4">
           <CalendarIcon size={48} className="mx-auto text-slate-200" />
           <p className="text-slate-400 font-bold">Select a faculty member to manage their timetable.</p>
        </div>
      )}
    </div>
  );
};

export default TimetableManagement;
