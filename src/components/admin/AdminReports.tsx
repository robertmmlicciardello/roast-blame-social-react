
import { useState } from 'react';
import { Search, Filter, Eye, Check, X, Calendar, Flag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const AdminReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // Mock reports data
  const [reports, setReports] = useState([
    {
      id: 'report_1',
      postId: 'post_2',
      postContent: "Taylor Swift probably has a song about her morning coffee by now. 'We Are Never Ever Getting Back Together (With Decaf)' coming to streaming platforms soon! ☕",
      postAuthor: 'Anonymous User #A1B2',
      celebrityName: 'Taylor Swift',
      reportedBy: 'concerned_user@example.com',
      reason: 'Inappropriate content',
      customReason: null,
      reportedAt: new Date('2024-01-15T12:30:00'),
      status: 'pending',
      reviewedBy: null,
      reviewedAt: null,
      adminNotes: null
    },
    {
      id: 'report_2',
      postId: 'post_4',
      postContent: "This is clearly spam content that violates community guidelines and should be removed immediately.",
      postAuthor: 'spammer@test.com',
      celebrityName: 'Various',
      reportedBy: 'moderator_user@example.com',
      reason: 'Spam',
      customReason: null,
      reportedAt: new Date('2024-01-15T10:15:00'),
      status: 'resolved',
      reviewedBy: 'admin@roastblame.com',
      reviewedAt: new Date('2024-01-15T11:00:00'),
      adminNotes: 'Post removed and user warned'
    },
    {
      id: 'report_3',
      postId: 'post_5',
      postContent: "Some concerning content that might cross the line into harassment territory.",
      postAuthor: 'questionable_user@example.com',
      celebrityName: 'Celebrity Name',
      reportedBy: 'safety_advocate@example.com',
      reason: 'Harassment or bullying',
      customReason: null,
      reportedAt: new Date('2024-01-14T16:45:00'),
      status: 'dismissed',
      reviewedBy: 'moderator@roastblame.com',
      reviewedAt: new Date('2024-01-15T09:30:00'),
      adminNotes: 'Content reviewed - does not violate guidelines'
    }
  ]);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.postContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.celebrityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || report.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleReviewReport = (report: any) => {
    setSelectedReport(report);
    setShowReviewModal(true);
  };

  const updateReportStatus = (reportId: string, status: 'resolved' | 'dismissed', notes: string) => {
    setReports(reports.map(r => 
      r.id === reportId 
        ? { 
            ...r, 
            status, 
            reviewedBy: 'admin@roastblame.com',
            reviewedAt: new Date(),
            adminNotes: notes
          }
        : r
    ));
    
    toast({ 
      title: "Report updated", 
      description: `Report has been ${status}` 
    });
    setShowReviewModal(false);
    setSelectedReport(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">Pending</span>;
      case 'resolved':
        return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">Resolved</span>;
      case 'dismissed':
        return <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full text-xs">Dismissed</span>;
      default:
        return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'Harassment or bullying':
        return 'text-red-400';
      case 'Hate speech':
        return 'text-red-500';
      case 'Inappropriate content':
        return 'text-orange-400';
      case 'Spam':
        return 'text-yellow-400';
      default:
        return 'text-purple-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Report Management</h1>
        <p className="text-gray-400">Review and manage user reports to maintain community standards</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-yellow-400">{reports.filter(r => r.status === 'pending').length}</div>
          <div className="text-gray-400 text-sm">Pending Reports</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-green-400">{reports.filter(r => r.status === 'resolved').length}</div>
          <div className="text-gray-400 text-sm">Resolved</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-gray-400">{reports.filter(r => r.status === 'dismissed').length}</div>
          <div className="text-gray-400 text-sm">Dismissed</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">{reports.length}</div>
          <div className="text-gray-400 text-sm">Total Reports</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search reports by content, celebrity, or reporter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-8 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none min-w-[150px]"
            >
              <option value="all">All Reports</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            Reports ({filteredReports.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-700">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-750 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Report Header */}
                  <div className="flex items-center space-x-3 mb-3">
                    <Flag className="h-5 w-5 text-red-400" />
                    <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
                      Roasting: {report.celebrityName}
                    </span>
                    {getStatusBadge(report.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReasonColor(report.reason)} bg-current bg-opacity-20`}>
                      {report.reason}
                    </span>
                  </div>

                  {/* Reported Content */}
                  <div className="bg-gray-700 p-4 rounded-lg mb-3">
                    <p className="text-white mb-2">{report.postContent}</p>
                    <p className="text-gray-400 text-sm">by {report.postAuthor}</p>
                  </div>

                  {/* Report Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-gray-400 text-sm">Reported by:</div>
                      <div className="text-white">{report.reportedBy}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Reported at:</div>
                      <div className="text-white">{report.reportedAt.toLocaleString()}</div>
                    </div>
                    {report.reviewedBy && (
                      <>
                        <div>
                          <div className="text-gray-400 text-sm">Reviewed by:</div>
                          <div className="text-white">{report.reviewedBy}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-sm">Reviewed at:</div>
                          <div className="text-white">{report.reviewedAt?.toLocaleString()}</div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Admin Notes */}
                  {report.adminNotes && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <div className="text-blue-400 text-sm font-medium mb-1">Admin Notes:</div>
                      <div className="text-white text-sm">{report.adminNotes}</div>
                    </div>
                  )}

                  {/* Custom Reason */}
                  {report.customReason && (
                    <div className="mt-2">
                      <span className="text-gray-400 text-sm">Additional details: </span>
                      <span className="text-white text-sm">{report.customReason}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleReviewReport(report)}
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Review Report"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  
                  {report.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateReportStatus(report.id, 'resolved', 'Action taken')}
                        className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Mark as Resolved"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => updateReportStatus(report.id, 'dismissed', 'No action needed')}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Dismiss Report"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-2">No reports found</div>
            <div className="text-gray-500 text-sm">Try adjusting your search or filter criteria</div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedReport && (
        <ReviewReportModal
          report={selectedReport}
          onUpdate={updateReportStatus}
          onCancel={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
};

const ReviewReportModal = ({ report, onUpdate, onCancel }: any) => {
  const [action, setAction] = useState('');
  const [notes, setNotes] = useState('');

  const handleUpdate = () => {
    if (!action) {
      toast({ title: "Please select an action", variant: "destructive" });
      return;
    }

    if (!notes.trim()) {
      toast({ title: "Please provide notes for this decision", variant: "destructive" });
      return;
    }

    onUpdate(report.id, action, notes);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Review Report</h3>
        
        {/* Report Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Report Details</h4>
            <div class="space-y-2">
              <div><span className="text-gray-400">Reason:</span> <span className="text-white">{report.reason}</span></div>
              <div><span className="text-gray-400">Reported by:</span> <span className="text-white">{report.reportedBy}</span></div>
              <div><span className="text-gray-400">Reported at:</span> <span className="text-white">{report.reportedAt.toLocaleString()}</span></div>
              <div><span className="text-gray-400">Celebrity:</span> <span className="text-white">{report.celebrityName}</span></div>
              <div><span className="text-gray-400">Post author:</span> <span className="text-white">{report.postAuthor}</span></div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Reported Content</h4>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-white">{report.postContent}</p>
            </div>
          </div>
        </div>

        {/* Action Selection */}
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Action to take:
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="action"
                value="resolved"
                checked={action === 'resolved'}
                onChange={(e) => setAction(e.target.value)}
                className="text-green-500 focus:ring-green-500"
              />
              <span className="text-gray-300">Resolve (Take action on the reported content)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="action"
                value="dismissed"
                checked={action === 'dismissed'}
                onChange={(e) => setAction(e.target.value)}
                className="text-gray-500 focus:ring-gray-500"
              />
              <span className="text-gray-300">Dismiss (No action needed)</span>
            </label>
          </div>
        </div>

        {/* Admin Notes */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">
            Admin notes (required):
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Explain your decision and any actions taken..."
            rows={4}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Update Report
          </button>
        </div>
      </div>
    </div>
  );
};
