import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { 
  fetchLogs, 
  verifyLog, 
  fetchAnomalies 
} from '../faculty/attendanceSlice';
import { Button, Input, Select } from '../../components/common/UIComponents';

const PrincipalWorkLogs = () => {
  const dispatch = useDispatch();
  const { logs, anomalies, loading } = useSelector((state) => state.attendance);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterStatus, setFilterStatus] = useState('SUBMITTED');
  const [remarks, setRemarks] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    dispatch(fetchLogs({ month: filterMonth, log_status: filterStatus !== 'ALL' ? filterStatus : undefined }));
    dispatch(fetchAnomalies({ month: filterMonth, is_acknowledged: false }));
  }, [dispatch, filterMonth, filterStatus]);

  const handleVerify = async (logId, action) => {
    if (action === 'REJECT' && !remarks) {
      alert('Remarks are required for rejection');
      return;
    }
    
    if (window.confirm(`Are you sure you want to ${action} this log?`)) {
      await dispatch(verifyLog({ logId, action, remarks }));
      setRemarks('');
      setSelectedLog(null);
      dispatch(fetchLogs({ month: filterMonth, log_status: filterStatus !== 'ALL' ? filterStatus : undefined }));
    }
  };

  const statusColors = {
    'SUBMITTED': 'bg-amber-100 text-amber-800',
    'VERIFIED': 'bg-emerald-100 text-emerald-800',
    'REJECTED': 'bg-red-100 text-red-800',
    'FLAGGED': 'bg-rose-100 text-rose-800'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Work Logs Verification</h2>
          <p className="text-gray-500">Review and verify faculty attendance and lecture logs.</p>
        </div>
      </div>

      {anomalies?.length > 0 && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-rose-800">
                Action Required: {anomalies.length} Unacknowledged Anomalies
              </h3>
              <div className="mt-2 text-sm text-rose-700">
                <p>Please review the anomalies section to acknowledge flagged logs before verification.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
        <div className="w-48">
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Month</label>
          <Select 
            value={filterMonth} 
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i+1} value={i+1}>
                {new Date(2000, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </Select>
        </div>
        <div className="w-48">
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Status</label>
          <Select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Pending Verification</option>
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected</option>
            <option value="FLAGGED">Flagged</option>
          </Select>
        </div>
        <Button variant="outline" onClick={() => dispatch(fetchLogs({ month: filterMonth, log_status: filterStatus !== 'ALL' ? filterStatus : undefined }))}>
          <Filter size={16} className="mr-2" />
          Apply Filters
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center text-gray-400">
            <Loader2 className="animate-spin h-8 w-8" />
          </div>
        ) : logs?.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No work logs found for the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-semibold text-gray-500">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Topic / Subject</th>
                  <th className="px-6 py-4">Class</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {new Date(log.lecture_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        <div className="text-xs text-gray-500 mt-1 font-normal">
                          {log.start_time.slice(0,5)} - {log.end_time.slice(0,5)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">{log.subject_name}</div>
                        <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">{log.topic_covered}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{log.class_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {log.lecture_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[log.log_status] || 'bg-gray-100 text-gray-800'}`}>
                          {log.log_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {log.log_status === 'SUBMITTED' && (
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => setSelectedLog(selectedLog === log.id ? null : log.id)}
                          >
                            Review
                          </Button>
                        )}
                      </td>
                    </tr>
                    {selectedLog === log.id && (
                      <tr className="bg-blue-50/30">
                        <td colSpan="6" className="px-6 py-4 border-b border-blue-100">
                          <div className="flex gap-4 items-start">
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-700 mb-1">Remarks (Optional for Verify, Required for Reject)</label>
                              <Input 
                                placeholder="Enter remarks..." 
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                              />
                            </div>
                            <div className="flex gap-2 mt-6">
                              <Button 
                                variant="outline" 
                                className="border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => handleVerify(log.id, 'REJECT')}
                              >
                                <XCircle size={16} className="mr-2" />
                                Reject
                              </Button>
                              <Button 
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => handleVerify(log.id, 'VERIFY')}
                              >
                                <CheckCircle size={16} className="mr-2" />
                                Verify
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrincipalWorkLogs;
