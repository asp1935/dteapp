import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  GraduationCap, 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Plus,
  MapPin
} from 'lucide-react';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/UIComponents';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData, setInstituteLocation } from './principalSlice';
import { Loader2 } from 'lucide-react';
import CandidateProfileModal from '../../components/CandidateProfileModal';

const PrincipalDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dashboardData, loading } = useSelector((state) => state.principal);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  React.useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const handleSetLocation = () => {
    if (!navigator.geolocation) {
      import('react-hot-toast').then(toast => toast.toast.error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const result = await dispatch(setInstituteLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        if (setInstituteLocation.fulfilled.match(result)) {
          import('react-hot-toast').then(toast => toast.toast.success('Institute location updated successfully!'));
        }
      },
      (error) => {
        import('react-hot-toast').then(toast => toast.toast.error('Unable to retrieve your location'));
      }
    );
  };

  const stats = dashboardData ? [
    { label: 'Total Faculty', value: dashboardData.stats.total_faculty.toString().padStart(2, '0'), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: dashboardData.stats.faculty_trend },
    { label: 'Vacancies Identified', value: dashboardData.stats.vacancies_identified.toString().padStart(2, '0'), icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', trend: dashboardData.stats.vacancy_trend },
    { label: 'Live Applications', value: dashboardData.stats.live_applications.toString().padStart(2, '0'), icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: dashboardData.stats.application_trend },
    { label: 'Interviews', value: dashboardData.stats.scheduled_interviews.toString().padStart(2, '0'), icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50', trend: dashboardData.stats.interview_trend },
  ] : [
    { label: 'Total Faculty', value: '--', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: 'Loading...' },
    { label: 'Vacancies Identified', value: '--', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Loading...' },
    { label: 'Live Applications', value: '--', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Loading...' },
    { label: 'Interviews', value: '--', icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Loading...' },
  ];

  const applications = dashboardData?.recent_applications || [];

  const columns = [
    { 
      key: 'name', 
      label: 'Candidate',
      render: (val, row) => (
        <div className="flex items-center space-x-3 cursor-pointer group/name" onClick={() => setSelectedCandidateId(row.id)}>
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 group-hover/name:bg-indigo-100 group-hover/name:text-indigo-600 transition-colors">
            {val.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm group-hover/name:text-indigo-600 transition-colors">{val}</p>
            <p className="text-[10px] text-slate-400 font-medium">{row.id}</p>
          </div>
        </div>
      )
    },
    { key: 'post', label: 'Applied Post' },
    { 
      key: 'score', 
      label: 'Merit Score',
      render: (val) => (
        <div className="flex items-center space-x-2">
          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: `${val}%` }} />
          </div>
          <span className="font-bold text-slate-700 text-xs">{val}%</span>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
          val === 'Shortlisted' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 
          val === 'Pending' ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' : 
          'bg-indigo-500 text-white shadow-lg shadow-indigo-100'
        )}>
          {val}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
      )}
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-[40px] bg-slate-950 p-10 text-white shadow-2xl">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-500/20 to-transparent" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/30">
                Principal Portal
              </span>
              <span className="text-slate-500 text-[10px] font-bold">AY 2026-27</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome Back, <span className="text-indigo-400">Principal</span></h1>
            <p className="text-slate-400 font-medium max-w-lg leading-relaxed">
              Your institute is currently at 85% staffing compliance. 3 vacancies are identified and pending your confirmation.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <Button 
              variant="outline" 
              onClick={handleSetLocation}
              className="px-6 rounded-xl border-indigo-500/30 text-indigo-100 hover:bg-indigo-500/20 font-bold backdrop-blur-sm"
            >
              <MapPin size={16} className="mr-2" />
              Set Institute Location
            </Button>
            <Button 
              variant="primary" 
              onClick={() => navigate('/principal/vacancies')}
              className="h-14 px-8 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold border-none shadow-lg shadow-black/10 transition-colors"
            >
              Assess Vacancies
              <ArrowUpRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="group p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-4 rounded-2xl transition-transform duration-500 group-hover:scale-110", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.trend}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Applications Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Merit List Queue</h3>
            </div>
            <Button variant="ghost" className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:bg-indigo-50">
              Full Registry <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
            <Table 
              columns={columns} 
              data={applications}
            />
          </div>
        </div>

        {/* Quick Actions & Interviews */}
        <div className="space-y-8">

          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Today's Schedule</h3>
              <Calendar size={18} className="text-slate-400" />
            </div>
            
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="group flex items-start space-x-4 cursor-pointer">
                  <div className="w-12 h-14 rounded-2xl bg-slate-50 flex flex-col items-center justify-center transition-colors group-hover:bg-indigo-50">
                    <span className="text-xs font-bold text-slate-900 leading-none">1{i}</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">AM</span>
                  </div>
                  <div className="flex-1 border-b border-slate-50 pb-4 group-hover:border-indigo-100 transition-colors">
                    <p className="font-bold text-sm text-slate-900 group-hover:text-indigo-600">Candidate #{i}04 Interview</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-1 flex items-center uppercase tracking-wider">
                      <Clock size={12} className="mr-1.5 text-indigo-400" /> Room 102 • Panel A
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="secondary" className="w-full h-12 rounded-2xl text-[10px] font-bold uppercase tracking-widest mt-4 border-slate-200 hover:bg-slate-50">
              Manage Calendar
            </Button>
          </div>
        </div>
      </div>
      {selectedCandidateId && (
        <CandidateProfileModal 
          candidateId={selectedCandidateId} 
          onClose={() => setSelectedCandidateId(null)} 
        />
      )}
    </div>
  );
};

export default PrincipalDashboard;
