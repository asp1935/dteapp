import { useState } from 'react';
import { Building2, Users, FileText, GraduationCap, Calendar, Plus, Clock } from 'lucide-react';
import { Table } from '../../components/common/Table';
import { Button, Input } from '../../components/common/UIComponents';

const PrincipalDashboard = () => {
  const stats = [
    { label: 'Total Faculty', value: '42', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Open Positions', value: '12', icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Applications', value: '156', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Interviews Today', value: '4', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  const applications = [
    { id: 'APP-001', name: 'Amit Sharma', post: 'Lecturer in Computer', status: 'Pending', score: 85 },
    { id: 'APP-002', name: 'Priya Verma', post: 'Lecturer in Mechanical', status: 'Shortlisted', score: 92 },
    { id: 'APP-003', name: 'Rahul More', post: 'Lecturer in Civil', status: 'Interviewed', score: 78 },
  ];

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Candidate' },
    { key: 'post', label: 'Post' },
    { 
      key: 'score', 
      label: 'Score',
      render: (val) => <span className="font-semibold">{val}%</span>
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          val === 'Shortlisted' ? 'bg-emerald-500/10 text-emerald-500' : 
          val === 'Pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
        }`}>
          {val}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Principal Dashboard</h1>
          <p className="text-secondary">Manage your institute, faculty intake, and recruitment process.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-background rounded-xl border border-border shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Recent Applications</h3>
            <Button variant="ghost" className="text-xs text-accent">View All</Button>
          </div>
          <Table 
            columns={columns} 
            data={applications}
            actions={(row) => (
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" className="text-xs text-accent">Review</Button>
                <Button variant="ghost" className="text-xs">Schedule</Button>
              </div>
            )}
          />
        </div>

        {/* Upcoming Interviews */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Today's Interviews</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-background border border-border rounded-xl flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-muted flex flex-col items-center justify-center text-xs font-bold text-secondary">
                  <span>10</span>
                  <span>AM</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Interview with Candidate #{i}04</p>
                  <p className="text-xs text-secondary mt-1 flex items-center">
                    <Clock size={12} className="mr-1" /> Room 102 • Panel A
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full text-xs py-2 mt-2">Manage Calendar</Button>
        </div>
      </div>

      {/* Norms/Intake Form Preview */}
      <div className="bg-background rounded-xl border border-border shadow-sm p-6">
        <h3 className="text-lg font-bold mb-6">Branch-wise Intake & Norms</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <Input label="Branch" placeholder="e.g. Computer Engineering" />
          <Input label="Required Intake" type="number" placeholder="5" />
          <Input label="Qualification Norms" placeholder="ME/M.Tech First Class" />
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="primary">Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default PrincipalDashboard;
