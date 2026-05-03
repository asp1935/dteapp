import React from 'react';
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
  Plus
} from 'lucide-react';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/UIComponents';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';

const PrincipalDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Faculty', value: '42', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+2 this month' },
    { label: 'Vacancies Identified', value: '08', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Audit pending' },
    { label: 'Live Applications', value: '156', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '12 new today' },
    { label: 'Interviews', value: '04', icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Scheduled' },
  ];

  const applications = [
    { id: 'APP-001', name: 'Amit Sharma', post: 'Lecturer in Computer', status: 'Pending', score: 85 },
    { id: 'APP-002', name: 'Priya Verma', post: 'Lecturer in Mechanical', status: 'Shortlisted', score: 92 },
    { id: 'APP-003', name: 'Rahul More', post: 'Lecturer in Civil', status: 'Interviewed', score: 78 },
  ];

  const columns = [
    { 
      key: 'name', 
      label: 'Candidate',
      render: (val, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
            {val.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm">{val}</p>
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
          <span className="font-black text-slate-700 text-xs">{val}%</span>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className={cn(
          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
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
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-[40px] bg-slate-950 p-10 text-white shadow-2xl">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-500/20 to-transparent" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
                Principal Portal
              </span>
              <span className="text-slate-500 text-[10px] font-bold">AY 2026-27</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Welcome Back, <span className="text-indigo-400">Principal</span></h1>
            <p className="text-slate-400 font-medium max-w-lg leading-relaxed">
              Your institute is currently at 85% staffing compliance. 3 vacancies are identified and pending your confirmation.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="primary" 
              onClick={() => navigate('/principal/vacancies')}
              className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black border-none shadow-lg shadow-indigo-500/20"
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
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.trend}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
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
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Merit List Queue</h3>
            </div>
            <Button variant="ghost" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50">
              Full Registry <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
            <Table 
              columns={columns} 
              data={applications}
              actions={(row) => (
                <div className="flex justify-end space-x-2">
                  <Button variant="secondary" className="h-9 px-4 rounded-xl text-[10px] font-black border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100">Review</Button>
                  <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-slate-50 flex items-center justify-center">
                    <ArrowUpRight size={16} className="text-slate-400" />
                  </Button>
                </div>
              )}
            />
          </div>
        </div>

        {/* Quick Actions & Interviews */}
        <div className="space-y-8">
          <div className="bg-indigo-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
            <TrendingUp size={120} className="absolute -right-6 -bottom-6 opacity-10" />
            <h4 className="text-lg font-black mb-4">Quick Tasks</h4>
            <div className="space-y-3">
              <button className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-between transition-all group border border-white/10">
                <div className="flex items-center">
                  <Plus size={18} className="mr-3 text-indigo-200" />
                  <span className="text-sm font-bold">New Interview Panel</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-between transition-all group border border-white/10">
                <div className="flex items-center">
                  <CheckCircle2 size={18} className="mr-3 text-indigo-200" />
                  <span className="text-sm font-bold">Verify Documents</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Today's Schedule</h3>
              <Calendar size={18} className="text-slate-400" />
            </div>
            
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="group flex items-start space-x-4 cursor-pointer">
                  <div className="w-12 h-14 rounded-2xl bg-slate-50 flex flex-col items-center justify-center transition-colors group-hover:bg-indigo-50">
                    <span className="text-xs font-black text-slate-900 leading-none">1{i}</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase mt-1">AM</span>
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
            <Button variant="secondary" className="w-full h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-4 border-slate-200 hover:bg-slate-50">
              Manage Calendar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalDashboard;
