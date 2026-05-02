import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Briefcase, 
  Building2, 
  Calendar, 
  AlertTriangle, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Users,
  Info,
  ChevronRight
} from 'lucide-react';
import { fetchInstitutions } from './institutionSlice';
import { fetchCourses } from './courseSlice';
import { fetchVacancyAssessment, clearAssessment } from './vacancySlice';
import { Button } from '../../components/common/UIComponents';
import { cn } from '../../utils/cn';

const VacancyManagement = () => {
  const dispatch = useDispatch();
  const { institutions = [] } = useSelector((state) => state.institutions);
  const { courses = [] } = useSelector((state) => state.courses);
  const { assessment, loading, error } = useSelector((state) => state.vacancy);

  const [selectedInst, setSelectedInst] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [academicYear, setAcademicYear] = useState('2026-27');

  useEffect(() => {
    dispatch(fetchInstitutions({ page: 1, limit: 100 }));
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleLoadAssessment = () => {
    if (!selectedInst || !selectedCourse) return;
    dispatch(fetchVacancyAssessment({
      institution_id: selectedInst,
      course_id: selectedCourse,
      academic_year: academicYear
    }));
  };

  const filteredCourses = courses.filter(c => c.institution_id === parseInt(selectedInst));

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Vacancy <span className="text-indigo-600">Assessment</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Step 2: Identify and validate hiring needs based on normative compliance.</p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-end gap-6">
        <div className="flex-1 w-full space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
            <Building2 size={12} className="mr-1.5" /> Select Institution
          </label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            value={selectedInst}
            onChange={(e) => {
              setSelectedInst(e.target.value);
              setSelectedCourse('');
              dispatch(clearAssessment());
            }}
          >
            <option value="">Select Institution...</option>
            {institutions.map(inst => (
              <option key={inst.id} value={inst.id}>{inst.name} ({inst.code})</option>
            ))}
          </select>
        </div>

        <div className="flex-1 w-full space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
            <Briefcase size={12} className="mr-1.5" /> Select Course
          </label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer disabled:opacity-50"
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              dispatch(clearAssessment());
            }}
            disabled={!selectedInst}
          >
            <option value="">Select Course...</option>
            {filteredCourses.map(course => (
              <option key={course.id} value={course.id}>{course.name} ({course.level})</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-48 space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
            <Calendar size={12} className="mr-1.5" /> Academic Year
          </label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            value={academicYear}
            onChange={(e) => {
              setAcademicYear(e.target.value);
              dispatch(clearAssessment());
            }}
          >
            <option value="2026-27">2026-27</option>
            <option value="2025-26">2025-26</option>
          </select>
        </div>

        <Button 
          variant="primary" 
          onClick={handleLoadAssessment}
          disabled={!selectedInst || !selectedCourse || loading}
          className="h-[52px] px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 border-none transition-all"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <div className="flex items-center">
              <Search size={18} className="mr-2" />
              Assess Vacancies
            </div>
          )}
        </Button>
      </div>

      {assessment ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Main Assessment Stats */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <h3 className="text-lg font-black text-slate-900">Deterministic Gap Analysis</h3>
                <span className="text-[10px] font-black bg-indigo-600 text-white px-3 py-1 rounded-full uppercase tracking-widest">Live Audit</span>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Required Faculty</p>
                    <div className="flex items-center justify-between">
                      <p className="text-3xl font-black text-slate-900">{assessment.required_count}</p>
                      <TrendingUp className="text-indigo-500" size={24} />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 font-bold">Based on 1:{assessment.ratio || 20} Ratio</p>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Strength</p>
                    <div className="flex items-center justify-between">
                      <p className="text-3xl font-black text-slate-900">{assessment.effective_existing}</p>
                      <Users className="text-slate-400" size={24} />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 font-bold">{assessment.effective_existing || 0} Effective Staff</p>
                  </div>

                  <div className={cn(
                    "p-6 rounded-2xl border transition-all duration-500",
                    assessment.suggested_vacancy > 0 ? "bg-red-50 border-red-100 text-red-700" : "bg-emerald-50 border-emerald-100 text-emerald-700"
                  )}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Calculated Vacancies</p>
                    <div className="flex items-center justify-between">
                      <p className="text-3xl font-black">{assessment.suggested_vacancy}</p>
                      {assessment.suggested_vacancy > 0 ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
                    </div>
                    <p className="text-[10px] mt-2 font-bold opacity-60">Ready for Recruitment</p>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm text-white">
                    <Info size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-indigo-950">System Recommendation</h4>
                    <p className="text-sm font-medium text-indigo-900/70 mt-1">
                      Based on current admission of {assessment.actual_admitted} students and faculty strength of {assessment.effective_existing}, the system recommends hiring {assessment.suggested_vacancy} additional CHB faculty members.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights Card */}
            <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <TrendingUp size={140} className="text-white" />
              </div>
              <div className="p-8 relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-indigo-400" size={20} />
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight">AI Vacancy Insights</h3>
                </div>

                <div className="space-y-4">
                  {(assessment.ai_analysis?.insights || []).map((insight, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></div>
                      <p className="text-sm font-medium text-slate-300">{insight}</p>
                    </div>
                  ))}
                  {(!assessment.ai_analysis?.insights || assessment.ai_analysis.insights.length === 0) && (
                    <p className="text-slate-500 italic text-sm">No additional AI insights for this assessment.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Side Info / Actions */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Course Context</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-500">Approved Intake</span>
                  <span className="text-sm font-black text-slate-900">{assessment.approved_seats}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-500">Actual Admitted</span>
                  <span className="text-sm font-black text-slate-900">{assessment.actual_admitted}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-500">Last Year Vacancy</span>
                  <span className="text-sm font-black text-slate-900">{assessment.previous_vacancy || 0}</span>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <Button 
                  variant="primary" 
                  className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white flex items-center justify-center font-black tracking-tight"
                >
                  Confirm & Move to Step 3
                  <ArrowRight size={18} className="ml-2" />
                </Button>
                <button className="w-full py-4 text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">
                  Request Clarification
                </button>
              </div>
            </div>

            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-lg shadow-indigo-100 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <CheckCircle2 size={120} />
              </div>
              <div className="relative z-10">
                <h4 className="text-lg font-black mb-2">Compliance Ready</h4>
                <p className="text-sm font-medium text-indigo-100 leading-relaxed">
                  This assessment follows the latest DTE recruitment norms. Once confirmed, a draft advertisement will be generated automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-96 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
            <Search size={32} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-black text-slate-900">No Assessment Loaded</h3>
          <p className="text-slate-500 font-medium max-w-sm mt-2">Select an institution and course above to run the vacancy gap analysis and AI audit.</p>
        </div>
      )}
    </div>
  );
};

export default VacancyManagement;
