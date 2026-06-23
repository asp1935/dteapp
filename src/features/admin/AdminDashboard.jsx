import { useState, useEffect } from 'react';
import { Users, Building2, FileText, Briefcase } from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [liveStats, setLiveStats] = useState({
    advertisements: 0,
    vacancies: 0,
    users: 0,
    bills: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/requirements/dashboard/admin-stats');
        if (res.data && res.data.status === 'success') {
          setLiveStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Actual Advertisements', value: liveStats.advertisements, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Vacancy Generated', value: liveStats.vacancies, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Registered Users', value: liveStats.users, icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Bills Passed', value: liveStats.bills, icon: Briefcase, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>
        <p className="text-secondary">Manage institutions, courses, recruitment norms, and advertisements.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-background rounded-xl border border-border shadow-sm flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
