import { useState, useEffect } from 'react';
import { Trash2, Eye, X, MessageSquare, Loader2, Filter } from 'lucide-react';
import { inquiriesAPI } from '../../services/api';

interface InquiryNote {
  content: string;
  createdBy: string;
  createdAt: string;
}

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  package?: string;
  packageName?: string;
  travelers: number;
  travelDate?: string;
  message?: string;
  status: 'new' | 'contacted' | 'confirmed' | 'cancelled' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes: InquiryNote[];
  source: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [formError, setFormError] = useState<string>('');

  useEffect(() => {
    loadInquiries();
  }, [statusFilter]);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const response = await inquiriesAPI.getAll(params);
      setInquiries(response.data || []);
    } catch (error) {
      console.error('Failed to load inquiries:', error);
      setFormError('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    try {
      setUpdatingStatus(inquiryId);
      await inquiriesAPI.update(inquiryId, { status: newStatus });
      await loadInquiries();
    } catch (error: any) {
      console.error('Failed to update status:', error);
      setFormError(error.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleAddNote = async () => {
    if (!selectedInquiry || !noteContent.trim()) return;

    try {
      setAddingNote(true);
      await inquiriesAPI.addNote(selectedInquiry._id, noteContent.trim());
      setNoteContent('');
      // Reload the selected inquiry details
      const response = await inquiriesAPI.getById(selectedInquiry._id);
      setSelectedInquiry(response.data);
      // Reload the list
      await loadInquiries();
    } catch (error: any) {
      console.error('Failed to add note:', error);
      setFormError(error.message || 'Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this inquiry? This action cannot be undone.')) {
      return;
    }

    try {
      await inquiriesAPI.delete(id);
      await loadInquiries();
      if (selectedInquiry?._id === id) {
        setSelectedInquiry(null);
      }
    } catch (error: any) {
      console.error('Failed to delete inquiry:', error);
      setFormError(error.message || 'Failed to delete inquiry');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'contacted': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-purple-100 text-purple-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        <span className="ml-2 text-slate-600">Loading inquiries...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Booking Inquiries</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="bg-orange-50 px-4 py-2 rounded-full text-sm font-semibold text-orange-700">
            Total: {inquiries.length}
          </div>
        </div>
      </div>

      {formError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm font-semibold">
          {formError}
        </div>
      )}

      {inquiries.length === 0 ? (
        <div className="bg-slate-50 rounded-[24px] p-12 text-center">
          <p className="text-slate-600 text-lg">
            {statusFilter === 'all' ? 'No inquiries yet' : `No ${statusFilter} inquiries`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Phone</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Package</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Priority</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Submitted</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry._id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-medium text-slate-900">{inquiry.name}</td>
                  <td className="px-4 py-3 text-slate-600 text-sm">{inquiry.email}</td>
                  <td className="px-4 py-3 text-slate-600 text-sm">{inquiry.phone || '-'}</td>
                  <td className="px-4 py-3 text-slate-600 text-sm">{inquiry.packageName || 'Custom'}</td>
                  <td className="px-4 py-3 text-slate-600 text-sm">
                    {inquiry.travelDate ? new Date(inquiry.travelDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={inquiry.status}
                      onChange={(e) => handleStatusChange(inquiry._id, e.target.value)}
                      disabled={updatingStatus === inquiry._id}
                      className={`px-2 py-1 rounded-full text-xs font-semibold border-0 ${getStatusColor(inquiry.status)} disabled:opacity-50`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(inquiry.priority)}`}>
                      {inquiry.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                    <br />
                    {new Date(inquiry.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 text-center space-x-2 flex justify-center">
                    <button
                      onClick={() => setSelectedInquiry(inquiry)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(inquiry._id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-orange-600 text-white p-6 flex justify-between items-center rounded-t-[32px]">
              <h2 className="text-2xl font-bold">Inquiry Details</h2>
              <button onClick={() => setSelectedInquiry(null)} className="text-white hover:text-orange-100">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase text-slate-500 font-semibold">Full Name</p>
                  <p className="text-lg font-semibold text-slate-900">{selectedInquiry.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500 font-semibold">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedInquiry.status)}`}>
                    {selectedInquiry.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500 font-semibold">Email</p>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-orange-600 hover:text-orange-700 break-all">
                    {selectedInquiry.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500 font-semibold">Priority</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(selectedInquiry.priority)}`}>
                    {selectedInquiry.priority}
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500 font-semibold">Phone</p>
                  <a href={`tel:${selectedInquiry.phone}`} className="text-orange-600 hover:text-orange-700">
                    {selectedInquiry.phone || 'Not provided'}
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500 font-semibold">Travelers</p>
                  <p className="text-slate-900">{selectedInquiry.travelers}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase text-slate-500 font-semibold">Package</p>
                  <p className="text-slate-900">{selectedInquiry.packageName || 'Custom Package'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500 font-semibold">Preferred Date</p>
                  <p className="text-slate-900">
                    {selectedInquiry.travelDate ? new Date(selectedInquiry.travelDate).toLocaleDateString() : 'Not specified'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500 font-semibold">Special Requirements</p>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg min-h-24">
                  {selectedInquiry.message || '(None)'}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500 font-semibold">Submitted At</p>
                <p className="text-sm text-slate-600">
                  {new Date(selectedInquiry.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Notes Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  <p className="text-xs uppercase text-slate-500 font-semibold">Internal Notes ({selectedInquiry.notes.length})</p>
                </div>
                
                {selectedInquiry.notes.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {selectedInquiry.notes.map((note, index) => (
                      <div key={index} className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-sm text-slate-700">{note.content}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {note.createdBy} • {new Date(note.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Add a note about this inquiry..."
                    rows={2}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={addingNote || !noteContent.trim()}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg font-semibold transition flex items-center gap-2"
                  >
                    {addingNote && <Loader2 className="w-4 h-4 animate-spin" />}
                    Add Note
                  </button>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-slate-100 p-6 border-t border-slate-200 rounded-b-[32px]">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-full font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
