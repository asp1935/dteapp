import { useState } from 'react';
import { Briefcase, FileText, CheckCircle, Clock, Search, MapPin, User, UserCircle } from 'lucide-react';
import { Table } from '../../components/common/Table';
import { Button, Input } from '../../components/common/UIComponents';
import CandidateProfile from './CandidateProfile';
import { cn } from '../../utils/cn';

const CandidateDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [showApplyForm, setShowApplyForm] = useState(false);

  const ads = [
    { id: 'AD/2026/01', title: 'Lecturer in Computer Engineering', institute: 'G.P. Pune', date: '2026-05-15', status: 'Live' },
    { id: 'AD/2026/04', title: 'Lecturer in Information Technology', institute: 'G.P. Mumbai', date: '2026-05-20', status: 'Live' },
    { id: 'AD/2026/07', title: 'Lecturer in Civil Engineering', institute: 'G.P. Nagpur', date: '2026-05-25', status: 'Live' },
  ];

  const applications = [
    { id: 'APP-9982', title: 'Lecturer in Computer', institute: 'G.P. Pune', date: '2026-04-20', status: 'Under Review' },
    { id: 'APP-8821', title: 'Lecturer in Mechanical', institute: 'G.P. Nashik', date: '2026-03-12', status: 'Interview Scheduled' },
  ];

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
              {ads.map((ad) => (
                <div key={ad.id} className="p-5 bg-background border border-border rounded-xl hover:border-accent transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-foreground group-hover:text-accent transition-colors">{ad.title}</h4>
                    <div className="flex items-center space-x-4 text-xs text-secondary">
                      <span className="flex items-center"><MapPin size={12} className="mr-1" /> {ad.institute}</span>
                      <span className="flex items-center"><Clock size={12} className="mr-1" /> Closes: {ad.date}</span>
                    </div>
                  </div>
                  <Button variant="accent" size="sm" onClick={() => setShowApplyForm(true)}>Apply Now</Button>
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
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-6 py-4">
                        <p className="font-medium">{app.title}</p>
                        <p className="text-xs text-secondary">{app.institute}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          app.status.includes('Interview') ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
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

      {/* Mock Application Form (Overlay) */}
      {showApplyForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-background w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-border animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-bold">Job Application Form</h3>
              <button onClick={() => setShowApplyForm(false)} className="text-secondary hover:text-foreground">✕</button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Full Name" placeholder="John Doe" />
                <Input label="Mobile Number" placeholder="+91 9876543210" />
              </div>
              <Input label="Highest Qualification" placeholder="M.Tech in CS" />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-secondary">Upload Resume (PDF)</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-accent transition-colors">
                  <FileText className="mx-auto text-secondary mb-2" size={32} />
                  <p className="text-sm text-secondary">Click to upload or drag and drop</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-muted/30 border-t border-border flex justify-end space-x-3">
              <Button variant="ghost" onClick={() => setShowApplyForm(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setShowApplyForm(false)}>Submit Application</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default CandidateDashboard;
