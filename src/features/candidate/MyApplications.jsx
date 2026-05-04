import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FileText, 
  Search, 
  Clock, 
  ExternalLink, 
  Trash2, 
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { Button } from '../../components/common/UIComponents';
import applicationService from '../../services/applicationService';
import { getMyApplications } from './applicationSlice';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

const MyApplications = () => {
  const dispatch = useDispatch();
  const { myApplications = [], loading, total } = useSelector(state => state.application);
  const [page, setPage] = useState(1);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    dispatch(getMyApplications({ skip: (page - 1) * 10, limit: 10 }));
  }, [dispatch, page]);

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      return;
    }

    setIsWithdrawing(true);
    try {
      await applicationService.withdrawApplication(appId);
      toast.success('Application withdrawn successfully');
      dispatch(getMyApplications({ skip: (page - 1) * 10, limit: 10 }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to withdraw application');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'SHORTLISTED':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'WITHDRAWN':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'UNDER_REVIEW':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-muted text-secondary border-border';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
          <p className="text-secondary text-sm">Track the status of all your teaching position applications.</p>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-background rounded-3xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-bold text-secondary uppercase tracking-wider text-[10px]">Reference / Post</th>
              <th className="px-6 py-4 font-bold text-secondary uppercase tracking-wider text-[10px]">Institution & Academic Year</th>
              <th className="px-6 py-4 font-bold text-secondary uppercase tracking-wider text-[10px]">Status</th>
              <th className="px-6 py-4 font-bold text-secondary uppercase tracking-wider text-[10px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-accent mb-2" size={24} />
                    <p className="text-xs text-secondary font-medium">Loading your applications...</p>
                  </div>
                </td>
              </tr>
            ) : myApplications.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-2">
                      <FileText className="text-secondary/50" size={24} />
                    </div>
                    <p className="text-sm font-bold text-foreground">No applications yet</p>
                    <p className="text-xs text-secondary">Your submitted applications will appear here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              myApplications.map((app) => (
                <tr key={app.application_id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded text-secondary tracking-tight">
                          {app.application_number}
                        </span>
                      </div>
                      <p className="font-bold text-foreground leading-tight">{app.advertisement_name || app.course_name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-secondary">
                    <div className="space-y-0.5">
                      <p className="font-medium text-xs text-foreground/80">{app.institution_name}</p>
                      <p className="text-[10px] flex items-center">
                        <Clock size={10} className="mr-1" /> AY {app.academic_year}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                      getStatusStyle(app.status)
                    )}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-border hover:border-accent">
                        <ExternalLink size={12} className="mr-1" /> View Detail
                      </Button>
                      {(app.status === 'DRAFT' || app.status === 'SUBMITTED') && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 border-none"
                          onClick={() => handleWithdraw(app.application_id)}
                          disabled={isWithdrawing}
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination or Footer info */}
      {!loading && myApplications.length > 0 && (
        <div className="flex items-center justify-between text-xs text-secondary font-medium px-2">
          <p>Showing {myApplications.length} of {total} applications</p>
          <div className="flex space-x-2">
             <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="h-8 px-3 rounded-lg border-border"
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={myApplications.length < 10}
                onClick={() => setPage(p => p + 1)}
                className="h-8 px-3 rounded-lg border-border"
              >
                Next
              </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
