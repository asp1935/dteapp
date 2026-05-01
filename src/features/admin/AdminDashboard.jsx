import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Building2, FileText, Search } from 'lucide-react';
import { Table } from '../../components/common/Table';
import { Button, Input } from '../../components/common/UIComponents';
import InstitutionManagement from './InstitutionManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('institutes');
  const { institutions } = useSelector((state) => state.institutions);

  const stats = [
    { label: 'Total Principals', value: '124', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active ROs', value: '8', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Institutes', value: institutions.length || '0', icon: Building2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Live Ads', value: '12', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>
        <p className="text-secondary">Manage regional officers, principals, and institute recruitment advertisements.</p>
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

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        {['institutes', 'principals', 'ros', 'advertisements'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 text-sm font-semibold rounded-md transition-all capitalize ${
              activeTab === tab ? 'bg-background text-foreground shadow-sm' : 'text-secondary hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div>
        {activeTab === 'institutes' && <InstitutionManagement />}
        
        {activeTab !== 'institutes' && activeTab !== 'advertisements' && (
          <div className="bg-background border border-border rounded-xl p-20 text-center text-secondary italic">
            Management UI for {activeTab} is coming soon.
          </div>
        )}

        {/* Advertisement Generation UI */}
        {activeTab === 'advertisements' && (
          <div className="bg-background rounded-xl border border-border shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Generate Advertisement</h3>
              <div className="flex items-center bg-muted p-1 rounded-lg">
                <button className="px-3 py-1 text-xs font-semibold bg-background rounded shadow-sm">English</button>
                <button className="px-3 py-1 text-xs font-semibold text-secondary">Marathi</button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input label="Advertisement Title" placeholder="e.g. Recruitment for Faculty Positions 2026" />
                <Input label="Reference Number" placeholder="DTE/RECRUIT/2026/01" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Opening Date" type="date" />
                  <Input label="Closing Date" type="date" />
                </div>
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center space-y-4 bg-muted/20">
                <FileText className="text-secondary/40" size={48} />
                <div>
                  <p className="font-medium text-secondary">Ad Content Preview</p>
                  <p className="text-xs text-secondary/60 mt-1">Configure parameters to see the generated content.</p>
                </div>
                <Button variant="outline" size="sm">Download PDF Draft</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
