import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FileText, 
  Sparkles, 
  Search, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Download,
  Languages,
  ArrowRight,
  Save,
  Loader2,
  Trash2
} from 'lucide-react';
import { fetchInstitutions } from './institutionSlice';
import { generateAdAI, saveAd, clearAdStatus, fetchAds } from './advertisementSlice';
import { cn } from '../../utils/cn';

const AdGenerationDashboard = () => {
  const dispatch = useDispatch();
  const institutions = useSelector(state => state.institutions?.institutions || []);
  const { preview, aiLoading, success, error, list, loading } = useSelector(state => state.ads);
  
  const [selectedInst, setSelectedInst] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [vacancyCount, setVacancyCount] = useState(1);
  const [deadline, setDeadline] = useState('');
  const [applicationMode, setApplicationMode] = useState('Walk-in');
  const [venue, setVenue] = useState('Institution Campus');
  const [activeTab, setActiveTab] = useState('EN'); // EN or MR

  useEffect(() => {
    dispatch(fetchInstitutions({ page: 1, limit: 100 }));
    dispatch(fetchAds());
  }, [dispatch]);

  const handleGenerate = () => {
    if (!selectedInst || !selectedCourse || !deadline) return;
    dispatch(generateAdAI({
      institution_id: parseInt(selectedInst),
      course_id: parseInt(selectedCourse),
      vacancy_count: vacancyCount,
      deadline,
      application_mode: applicationMode
    }));
  };

  const handleSave = () => {
    // In a real scenario, we'd need an assessment_id. 
    // For now, this interactive UI uses the generate-ai logic.
    // If we want to SAVE, we normally do it from a confirmed assessment.
    // But we'll implement the save logic as requested.
  };

  const currentCourses = institutions.find(i => i.id === parseInt(selectedInst))?.courses || [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Advertisement Generation</h1>
          <p className="text-slate-500 mt-1">AI-powered recruitment notice creation with bilingual support.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2 border border-blue-100">
            <Sparkles size={16} />
            Step 3: Ad Content
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Search size={20} />
              </div>
              <h2 className="font-semibold text-slate-800">Recruitment Context</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Institution</label>
                <select 
                  value={selectedInst}
                  onChange={(e) => {
                    setSelectedInst(e.target.value);
                    setSelectedCourse('');
                  }}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                >
                  <option value="">Select Institution</option>
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Department / Course</label>
                <select 
                  disabled={!selectedInst}
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm disabled:opacity-50"
                >
                  <option value="">Select Course</option>
                  {currentCourses.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.level})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Vacancies</label>
                  <input 
                    type="number"
                    min="1"
                    value={vacancyCount}
                    onChange={(e) => setVacancyCount(parseInt(e.target.value))}
                    className="w-full bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Deadline</label>
                  <input 
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Application Mode</label>
                <div className="flex gap-2">
                  {['Walk-in', 'Online', 'Email'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setApplicationMode(mode)}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all border",
                        applicationMode === mode 
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100" 
                          : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={aiLoading || !selectedInst || !selectedCourse || !deadline}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none group"
              >
                {aiLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                )}
                Generate Content
              </button>
            </div>
          </div>

          {/* Quick Stats or Tips */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
            <div className="relative z-10 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <AlertCircle size={18} className="text-blue-400" />
                AI Content Tips
              </h3>
              <ul className="text-sm text-slate-400 space-y-2 list-disc ml-4">
                <li>Bilingual output is auto-generated.</li>
                <li>Verify Marathi terminology for accuracy.</li>
                <li>Qualification is pulled from DTE norms.</li>
              </ul>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Languages size={80} />
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-8 space-y-6">
          {!preview && !aiLoading ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 h-[600px] flex flex-col items-center justify-center text-center p-12 space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <FileText size={32} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">No Content Generated</h3>
                <p className="text-slate-500 max-w-xs mx-auto">Fill in the recruitment context on the left and click 'Generate' to see the AI output here.</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[700px] overflow-hidden">
              {/* Preview Header */}
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                    <button 
                      onClick={() => setActiveTab('EN')}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                        activeTab === 'EN' ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      English
                    </button>
                    <button 
                      onClick={() => setActiveTab('MR')}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                        activeTab === 'MR' ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      मराठी (Marathi)
                    </button>
                  </div>
                  {preview?.confidence_score && (
                    <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 bg-green-50 text-green-700 rounded-lg border border-green-100">
                      <CheckCircle2 size={14} />
                      {Math.round(preview.confidence_score * 100)}% Confident
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                    <Download size={18} />
                  </button>
                  <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all">
                    <Save size={18} />
                    Finalize
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4 animate-pulse">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                      <Loader2 className="animate-spin" size={24} />
                    </div>
                    <p className="text-slate-500 font-medium">AI is crafting your bilingual advertisement...</p>
                  </div>
                ) : (
                  <div className="bg-white shadow-xl rounded-xl border border-slate-200 min-h-full p-10 font-serif prose prose-slate max-w-none shadow-indigo-100/20">
                    <div dangerouslySetInnerHTML={{ 
                      __html: activeTab === 'EN' ? preview.english : preview.marathi 
                    }} />
                  </div>
                )}
              </div>

              {/* Issues/Flags Footer */}
              {preview?.issues?.length > 0 && (
                <div className="bg-amber-50 border-t border-amber-100 p-4">
                  <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm mb-2">
                    <AlertCircle size={16} />
                    AI Compliance Flags
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {preview.issues.map((issue, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white border border-amber-200 text-amber-700 rounded text-[10px] font-bold tracking-wider uppercase">
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* History / Recent Ads Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Recent Advertisements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map(ad => (
            <div key={ad.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <FileText size={20} />
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase",
                  ad.status === 'PUBLISHED' ? "bg-green-100 text-green-700" :
                  ad.status === 'APPROVED' ? "bg-blue-100 text-blue-700" :
                  "bg-slate-100 text-slate-600"
                )}>
                  {ad.status}
                </div>
              </div>
              <h3 className="font-semibold text-slate-800 truncate">{ad.course_name}</h3>
              <p className="text-xs text-slate-500 mt-1">{ad.institution_name}</p>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 uppercase">
                  <Calendar size={12} />
                  {new Date(ad.created_at).toLocaleDateString()}
                </span>
                <button className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold flex items-center gap-1 group/btn">
                  View Details
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdGenerationDashboard;
