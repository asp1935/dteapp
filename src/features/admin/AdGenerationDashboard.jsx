import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FileText, Sparkles, Search, Calendar, CheckCircle2, AlertCircle,
  Download, Languages, Save, Loader2, Building2, Briefcase,
  ArrowRight, Lock, Shield, TrendingUp, Users, XCircle
} from 'lucide-react';
import { fetchInstitutions } from './institutionSlice';
import { fetchCourses } from './courseSlice';
import { generateAdAI, clearAdStatus, fetchAds, fetchRecruitmentContext, clearRecruitmentContext } from './advertisementSlice';
import { cn } from '../../utils/cn';

const StatusBadge = ({ status }) => {
  const map = {
    complete: { bg: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2, label: 'Complete' },
    CONFIRMED: { bg: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2, label: 'Confirmed' },
    AI_SUGGESTED: { bg: 'bg-indigo-100 text-indigo-700', icon: Sparkles, label: 'Suggested' },
    DRAFT: { bg: 'bg-slate-100 text-slate-600', icon: FileText, label: 'Draft' },
    pending: { bg: 'bg-amber-100 text-amber-700', icon: AlertCircle, label: 'Pending' },
  };
  const s = map[status] || map.pending;
  const Icon = s.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", s.bg)}>
      <Icon size={12} />{s.label}
    </span>
  );
};

const AdGenerationDashboard = () => {
  const dispatch = useDispatch();
  const { institutions = [] } = useSelector(state => state.institutions);
  const { courses = [] } = useSelector(state => state.courses);
  const { preview, aiLoading, list, loading, recruitmentContext, contextLoading } = useSelector(state => state.ads);

  const [selectedInst, setSelectedInst] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [deadline, setDeadline] = useState('');
  const [applicationMode, setApplicationMode] = useState('Walk-in');
  const [activeTab, setActiveTab] = useState('EN');

  useEffect(() => {
    dispatch(fetchInstitutions({ page: 1, limit: 100 }));
    dispatch(fetchCourses({}));
    dispatch(fetchAds());
  }, [dispatch]);

  // Auto-fetch recruitment context when institution + course selected
  useEffect(() => {
    if (selectedInst && selectedCourse) {
      dispatch(fetchRecruitmentContext({
        institution_id: parseInt(selectedInst),
        course_id: parseInt(selectedCourse),
        academic_year: academicYear
      }));
    } else {
      dispatch(clearRecruitmentContext());
    }
  }, [dispatch, selectedInst, selectedCourse, academicYear]);

  const ctx = recruitmentContext;
  const canGenerate = ctx?.can_generate_ad === true;
  const vacancyCount = ctx?.vacancy_count || 0;

  const handleGenerate = () => {
    if (!canGenerate || !deadline) return;
    dispatch(generateAdAI({
      institution_id: parseInt(selectedInst),
      course_id: parseInt(selectedCourse),
      vacancy_count: vacancyCount,
      deadline,
      application_mode: applicationMode,
      academic_year: academicYear
    }));
  };

  const filteredCourses = courses.filter(c => c.institution_id === parseInt(selectedInst));

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Advertisement <span className="text-indigo-600">Generation</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Step 3: AI-powered recruitment notice creation with bilingual support.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl">
          <Shield size={16} className="text-indigo-600" />
          <span className="text-xs font-black text-indigo-700 uppercase tracking-wider">Admin Panel</span>
        </div>
      </div>

      {/* Selector Panel */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-end gap-6">
        <div className="flex-1 w-full space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
            <Building2 size={12} className="mr-1.5" /> Institution
          </label>
          <select value={selectedInst} onChange={(e) => { setSelectedInst(e.target.value); setSelectedCourse(''); dispatch(clearAdStatus()); }}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer">
            <option value="">Select Institution...</option>
            {institutions.map(inst => <option key={inst.id} value={inst.id}>{inst.name} ({inst.code})</option>)}
          </select>
        </div>
        <div className="flex-1 w-full space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
            <Briefcase size={12} className="mr-1.5" /> Course
          </label>
          <select disabled={!selectedInst} value={selectedCourse} onChange={(e) => { setSelectedCourse(e.target.value); dispatch(clearAdStatus()); }}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer disabled:opacity-50">
            <option value="">Select Course...</option>
            {filteredCourses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.level})</option>)}
          </select>
        </div>
        <div className="w-full md:w-48 space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
            <Calendar size={12} className="mr-1.5" /> Year
          </label>
          <select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer">
            <option value="2026-27">2026-27</option>
            <option value="2025-26">2025-26</option>
          </select>
        </div>
      </div>

      {/* Recruitment Pipeline Status */}
      {contextLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
          <span className="ml-3 text-slate-500 font-bold">Loading recruitment pipeline...</span>
        </div>
      )}

      {ctx && !contextLoading && (
        <div className="space-y-8">
          {/* Pipeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-[10px] font-black">1</div>
                  Faculty Requirement
                </h3>
                <StatusBadge status={ctx.step1_requirement?.status} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs"><span className="text-slate-500 font-bold">Approved Seats</span><span className="font-black text-slate-900">{ctx.step1_requirement?.approved_seats ?? '—'}</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-500 font-bold">Actual Admitted</span><span className="font-black text-slate-900">{ctx.step1_requirement?.actual_admitted ?? '—'}</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-500 font-bold">Required Faculty</span><span className="font-black text-indigo-600">{ctx.step1_requirement?.computed_required_count ?? '—'}</span></div>
              </div>
            </div>
            {/* Step 2 Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-[10px] font-black">2</div>
                  Vacancy Assessment
                </h3>
                <StatusBadge status={ctx.step2_vacancy?.status} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs"><span className="text-slate-500 font-bold">Existing Faculty</span><span className="font-black text-slate-900">{ctx.step2_vacancy?.effective_existing ?? '—'}</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-500 font-bold">Suggested Vacancy</span><span className="font-black text-slate-900">{ctx.step2_vacancy?.suggested_vacancy ?? '—'}</span></div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-bold">Confirmed Vacancy</span>
                  <span className="font-black text-emerald-600">{ctx.step2_vacancy?.confirmed_vacancy ?? '—'}</span>
                </div>
              </div>
            </div>
            {/* Norms Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <div className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black">N</div>
                  Qualification Norms
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs"><span className="text-slate-500 font-bold">Min Qualification</span><span className="font-black text-slate-900 text-right max-w-[160px] truncate">{ctx.norms?.min_qualification || '—'}</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-500 font-bold">F:S Ratio</span><span className="font-black text-slate-900">1:{ctx.norms?.faculty_student_ratio || '—'}</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-500 font-bold">Max Age</span><span className="font-black text-slate-900">{ctx.norms?.max_age || '—'}</span></div>
              </div>
            </div>
          </div>

          {/* Warning or Generate Section */}
          {!canGenerate ? (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shrink-0">
                <XCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-amber-900 mb-1">Cannot Generate Advertisement</h3>
                <p className="text-sm font-medium text-amber-800/70">
                  The Principal of <span className="font-black">{ctx.institution?.name}</span> must first complete and <strong>confirm</strong> the Vacancy Assessment (Step 2) for <span className="font-black">{ctx.course?.name}</span> before an advertisement can be generated.
                </p>
                <p className="text-xs text-amber-600 mt-2 font-bold">Current Step 2 Status: {ctx.step2_vacancy?.status || 'Not Started'}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Config Panel */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-6">
                  <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 size={20} /></div>
                    <h2 className="font-bold text-slate-800">Ready to Generate</h2>
                  </div>

                  {/* Auto-populated summary */}
                  <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between text-xs"><span className="text-slate-500 font-bold">Institution</span><span className="font-black text-slate-900">{ctx.institution?.name}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-500 font-bold">Course</span><span className="font-black text-slate-900">{ctx.course?.name}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-500 font-bold">Qualification</span><span className="font-black text-indigo-600 text-right max-w-[180px]">{ctx.norms?.min_qualification}</span></div>
                    <div className="flex justify-between text-xs items-center">
                      <span className="text-slate-500 font-bold">Vacancy Count</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-emerald-600">{vacancyCount}</span>
                        <Lock size={12} className="text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deadline</label>
                      <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mode</label>
                      <select value={applicationMode} onChange={(e) => setApplicationMode(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20">
                        <option>Walk-in</option><option>Online</option><option>Email</option>
                      </select>
                    </div>
                  </div>

                  <button onClick={handleGenerate} disabled={aiLoading || !deadline}
                    className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-2xl font-black shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 group">
                    {aiLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />}
                    Generate Bilingual Ad
                  </button>
                </div>

                <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
                  <div className="relative z-10 space-y-3">
                    <h3 className="font-bold flex items-center gap-2"><AlertCircle size={18} className="text-blue-400" />AI Content Tips</h3>
                    <ul className="text-sm text-slate-400 space-y-2 list-disc ml-4">
                      <li>Bilingual output is auto-generated.</li>
                      <li>Verify Marathi terminology for accuracy.</li>
                      <li>Qualification is pulled from DTE norms.</li>
                    </ul>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Languages size={80} /></div>
                </div>
              </div>

              {/* Preview Panel */}
              <div className="lg:col-span-8 space-y-6">
                {!preview && !aiLoading ? (
                  <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 h-[600px] flex flex-col items-center justify-center text-center p-12 space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300"><FileText size={32} /></div>
                    <div>
                      <h3 className="text-lg font-black text-slate-800">No Content Generated</h3>
                      <p className="text-slate-500 max-w-xs mx-auto font-medium">Set the deadline and click 'Generate' to create the AI-powered bilingual advertisement.</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col h-[700px] overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                          {['EN', 'MR'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                              className={cn("px-3 py-1.5 rounded-md text-xs font-bold transition-all", activeTab === tab ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50")}>
                              {tab === 'EN' ? 'English' : 'मराठी (Marathi)'}
                            </button>
                          ))}
                        </div>
                        {preview?.data?.ai_generated_ad?.confidence_score && (
                          <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 bg-green-50 text-green-700 rounded-lg border border-green-100">
                            <CheckCircle2 size={14} />{Math.round(preview.data.ai_generated_ad.confidence_score * 100)}% Confident
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"><Download size={18} /></button>
                        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all"><Save size={18} />Finalize</button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                      {aiLoading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-4 animate-pulse">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600"><Loader2 className="animate-spin" size={24} /></div>
                          <p className="text-slate-500 font-bold">AI is crafting your bilingual advertisement...</p>
                        </div>
                      ) : (
                        <div className="bg-white shadow-xl rounded-xl border border-slate-200 min-h-full p-10 font-serif prose prose-slate max-w-none shadow-indigo-100/20">
                          <div dangerouslySetInnerHTML={{ __html: activeTab === 'EN' ? (preview?.data?.ai_generated_ad?.english || preview?.english || '') : (preview?.data?.ai_generated_ad?.marathi || preview?.marathi || '') }} />
                        </div>
                      )}
                    </div>
                    {preview?.data?.ai_generated_ad?.issues?.length > 0 && (
                      <div className="bg-amber-50 border-t border-amber-100 p-4">
                        <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2"><AlertCircle size={16} />AI Compliance Flags</div>
                        <div className="flex flex-wrap gap-2">
                          {preview.data.ai_generated_ad.issues.map((issue, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white border border-amber-200 text-amber-700 rounded text-[10px] font-bold tracking-wider uppercase">{issue}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!ctx && !contextLoading && !selectedInst && (
        <div className="h-96 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6"><FileText size={32} className="text-slate-300" /></div>
          <h3 className="text-xl font-black text-slate-900">Select Institution & Course</h3>
          <p className="text-slate-500 font-medium max-w-sm mt-2">Choose an institution and course above to view the recruitment pipeline status and generate advertisements.</p>
        </div>
      )}

      {/* Recent Ads */}
      {list.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-800">Recent Advertisements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map(ad => (
              <div key={ad.id} className="bg-white rounded-3xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all"><FileText size={20} /></div>
                  <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase",
                    ad.status === 'PUBLISHED' ? "bg-green-100 text-green-700" : ad.status === 'APPROVED' ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                  )}>{ad.status}</div>
                </div>
                <h3 className="font-bold text-slate-800 truncate">{ad.course_name}</h3>
                <p className="text-xs text-slate-500 mt-1">{ad.institution_name}</p>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase"><Calendar size={12} />{new Date(ad.created_at).toLocaleDateString()}</span>
                  <button className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center gap-1 group/btn">View<ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdGenerationDashboard;
