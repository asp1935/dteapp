import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Briefcase, FileText, CheckCircle, Clock, Search, MapPin, User, UserCircle, Loader2 } from 'lucide-react';
import { Table } from '../../components/common/Table';
import { Button, Input } from '../../components/common/UIComponents';
import CandidateProfile from './CandidateProfile';
import JobApplicationFlow from './JobApplicationFlow';
import { fetchPublishedAds } from '../admin/advertisementSlice';
import { getMyApplications } from './applicationSlice';
import { cn } from '../../utils/cn';

const CandidateDashboard = () => {
  const dispatch = useDispatch();
  const { publishedList = [], loading: adsLoading } = useSelector(state => state.ads);
  const { myApplications = [], loading: appsLoading } = useSelector(state => state.application);
  const [activeView, setActiveView] = useState('dashboard');
  const [showApplyFlow, setShowApplyFlow] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  useEffect(() => {
    dispatch(fetchPublishedAds({}));
    dispatch(getMyApplications({ skip: 0, limit: 10 }));
  }, [dispatch]);

  const loading = adsLoading || appsLoading;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Candidate Portal</h1>
          <p className="text-secondary">Explore teaching opportunities and track your application status.</p>
        </div>
        <div className="flex bg-background border border-border rounded-lg p-1">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-all",
              activeView === 'dashboard' ? "bg-muted shadow-sm" : "text-secondary hover:text-foreground"
            )}
          >
            My Dashboard
          </button>
          <button 
            onClick={() => setActiveView('profile')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-all",
              activeView === 'profile' ? "bg-muted shadow-sm" : "text-secondary hover:text-foreground"
            )}
          >
            Manage Profile
          </button>
        </div>
      </div>

      {activeView === 'profile' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CandidateProfile />
        </div>
      ) : (
        
        <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="lg:col-span-2 space-y-8">
          {/* Active Ads */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Latest Advertisements</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={14} />
                <input type="text" placeholder="Filter by subject..." className="pl-9 pr-4 py-1.5 bg-background border border-border rounded-md text-xs outline-none" />
              </div>
            </div>
            
            <div className="grid gap-4">
              {loading && (
                <div className="flex flex-col items-center justify-center py-12 bg-background border border-border border-dashed rounded-xl">
                  <Loader2 className="animate-spin text-accent mb-2" />
                  <p className="text-xs text-secondary font-medium">Fetching latest opportunities...</p>
                </div>
              )}
              
              {!loading && publishedList.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 bg-background border border-border border-dashed rounded-xl">
                  <Briefcase className="text-muted mb-2" size={32} />
                  <p className="text-xs text-secondary font-medium">No active advertisements at the moment.</p>
                </div>
              )}

              {!loading && publishedList.map((ad) => (
                <div key={ad.id} className="p-5 bg-background border border-border rounded-xl hover:border-accent transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-foreground group-hover:text-accent transition-colors">
                      Lecturer in {ad.course_name}
                    </h4>
                    <div className="flex items-center space-x-4 text-xs text-secondary">
                      <span className="flex items-center font-medium"><MapPin size={12} className="mr-1" /> {ad.institution_name}</span>
                      <span className="flex items-center"><Clock size={12} className="mr-1" /> Closes: {new Date(ad.application_end_date).toLocaleDateString()}</span>
                      <span className="flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold uppercase tracking-wider">{ad.vacancy_count} Openings</span>
                    </div>
                  </div>
                  <Button variant="accent" size="sm" onClick={() => {
                    setSelectedAd(ad);
                    setShowApplyFlow(true);
                  }}>Apply Now</Button>
                </div>
              ))}
            </div>
          </div>

          {/* My Applications */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Your Applications</h3>
            <div className="bg-background rounded-xl border border-border overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Post</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {myApplications.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center text-secondary text-xs italic">
                        No applications submitted yet.
                      </td>
                    </tr>
                  )}
                  {myApplications.map((app) => (
                    <tr key={app.application_id}>
                      <td className="px-6 py-4">
                        <p className="font-medium">{app.advertisement_name}</p>
                        <p className="text-xs text-secondary">{app.institution_name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          app.status === 'SUBMITTED' ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                        )}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-accent hover:underline font-medium">View Detail</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Profile Sidebar */}
        <div className="space-y-6">
          <div className="bg-primary text-white rounded-2xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Complete Your Profile</h3>
              <p className="text-white/70 text-sm mb-4">Complete profiles have a 40% higher chance of being shortlisted.</p>
              <div className="w-full bg-white/20 h-2 rounded-full mb-6">
                <div className="bg-accent h-full rounded-full w-[65%]"></div>
              </div>
              <Button variant="accent" className="w-full bg-white text-primary hover:bg-white/90">Edit Profile</Button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <UserCircle size={120} />
            </div>
          </div>

          <div className="bg-background border border-border rounded-2xl p-6 space-y-4">
            <h4 className="font-bold flex items-center"><CheckCircle size={18} className="mr-2 text-emerald-500" /> Documents Verified</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center text-secondary"><CheckCircle size={14} className="mr-2 text-emerald-500" /> SSC Certificate</li>
              <li className="flex items-center text-secondary"><CheckCircle size={14} className="mr-2 text-emerald-500" /> HSC/Diploma Marksheet</li>
              <li className="flex items-center text-secondary"><Clock size={14} className="mr-2 text-amber-500" /> Degree Certificate (Pending)</li>
            </ul>
          </div>
        </div>
        </div>
      )}

      {/* Job Application Flow Overlay */}
      {showApplyFlow && selectedAd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <JobApplicationFlow 
            advertisementId={selectedAd.id} 
            advertisementTitle={selectedAd.title}
            onClose={() => {
              setShowApplyFlow(false);
              setSelectedAd(null);
            }} 
          />
        </div>
      )}
    </div>
  );
};


export default CandidateDashboard;
