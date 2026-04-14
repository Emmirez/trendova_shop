import { useState, useEffect } from 'react';
import {
  MessageCircle, Plus, Trash2, Eye, X,
  Send, Clock, CheckCheck, AlertCircle, ChevronDown
} from 'lucide-react';
import { ticketService } from '../../services/apiService';
import { toast } from 'react-hot-toast';

const statusColors = {
  Open: 'text-blue-500 bg-blue-50 border-blue-200',
  'In Progress': 'text-yellow-600 bg-yellow-50 border-yellow-200',
  Resolved: 'text-green-600 bg-green-50 border-green-200',
  Closed: 'text-obsidian/40 bg-obsidian/5 border-obsidian/10',
};

const priorityColors = {
  Low: 'text-green-600 bg-green-50 border-green-200',
  Medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  High: 'text-red-500 bg-red-50 border-red-200',
};

const categories = [
  'Order Issue',
  'Return & Refund',
  'Product Inquiry',
  'Payment Issue',
  'Shipping Query',
  'Other',
];

// Custom Select Component
const CustomSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors rounded-lg flex items-center justify-between"
        style={{ backgroundColor: 'var(--input-bg)' }}
      >
        <span className={!value ? 'theme-text-muted' : 'theme-text'}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} className={`theme-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 border theme-border rounded-lg z-20 max-h-48 overflow-y-auto" style={{ backgroundColor: 'var(--bg-card)' }}>
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 font-body text-sm hover:bg-gold/10 transition-colors ${
                  value === option ? 'text-gold bg-gold/5' : 'theme-text-secondary'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const UserMessages = () => {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [reply, setReply] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: 'Medium',
    message: '',
  });

  // Fetch tickets from API
  const fetchTickets = async (page = 1, status = '') => {
    setLoading(true);
    try {
      const response = await ticketService.getTickets({ 
        page, 
        limit: 20, 
        status: status === 'All' ? '' : status,
        search: ''
      });
      setTickets(response.tickets);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to fetch tickets:', err.message);
      toast.error(err.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(1, filter);
  }, [filter]);

  const filteredTickets = tickets; // API already filters by status

  const handleCreate = async () => {
    if (!newTicket.subject || !newTicket.category || !newTicket.message) return;
    
    try {
      const response = await ticketService.createTicket({
        subject: newTicket.subject,
        category: newTicket.category,
        priority: newTicket.priority,
        message: newTicket.message,
      });
      
      setTickets(prev => [response.ticket, ...prev]);
      setNewTicket({ subject: '', category: '', priority: 'Medium', message: '' });
      setShowNew(false);
      toast.success('Ticket created successfully!');
    } catch (err) {
      console.error('Failed to create ticket:', err.message);
      toast.error(err.message || 'Failed to create ticket');
    }
  };

  const handleDelete = async (id) => {
    try {
      await ticketService.deleteTicket(id);
      setTickets(prev => prev.filter(t => t._id !== id));
      if (selected?._id === id) setSelected(null);
      setConfirmDelete(null);
      toast.success('Ticket deleted successfully');
    } catch (err) {
      console.error('Failed to delete ticket:', err.message);
      toast.error(err.message || 'Failed to delete ticket');
    }
  };

  const handleReply = async () => {
    if (!reply.trim() || !selected) return;
    
    try {
      const response = await ticketService.addReply(selected._id, reply);
      const updatedTicket = response.ticket;
      
      setTickets(prev => prev.map(t => 
        t._id === updatedTicket._id ? updatedTicket : t
      ));
      setSelected(updatedTicket);
      setReply('');
      toast.success('Reply sent successfully');
    } catch (err) {
      console.error('Failed to send reply:', err.message);
      toast.error(err.message || 'Failed to send reply');
    }
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex flex-wrap gap-2">
          {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] uppercase border transition-all rounded-lg ${
                filter === f
                  ? 'bg-gold text-obsidian border-gold'
                  : 'theme-border theme-text-muted hover:border-gold/40 hover:text-gold'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-obsidian font-mono text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors rounded-lg"
        >
          <Plus size={13} />
          New Ticket
        </button>
      </div>

      {/* Tickets list */}
      <div className="border theme-border rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
          <h3 className="font-mono text-[11px] tracking-[0.3em] theme-text-muted uppercase">
            Support Tickets
          </h3>
          <span className="font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase">
            {pagination.total} tickets
          </span>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-4 rounded-lg">
            <MessageCircle size={36} className="theme-text-muted opacity-20" />
            <p className="font-body theme-text-muted text-sm">No tickets found</p>
            <button
              onClick={() => setShowNew(true)}
              className="px-6 py-2 bg-gold text-obsidian font-mono text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors rounded-lg"
            >
              Create Your First Ticket
            </button>
          </div>
        ) : (
          <div className="divide-y theme-border">
            {filteredTickets.map(ticket => (
              <div key={ticket._id} className="flex items-start gap-4 px-6 py-4 transition-colors">
                {/* Icon */}
                <div className="w-8 h-8 bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5 rounded-lg">
                  <MessageCircle size={13} className="text-gold" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-display font-semibold theme-text text-sm">{ticket.subject}</p>
                      <span className={`font-mono text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 border rounded-lg ${statusColors[ticket.status]}`}>
                        {ticket.status}
                      </span>
                      <span className={`font-mono text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 border rounded-lg ${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="font-mono text-[9px] theme-text-muted flex-shrink-0">{ticket.date}</p>
                  </div>
                  <p className="font-body theme-text-secondary text-xs leading-snug mb-1 truncate">
                    {ticket.message}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-mono text-[9px] theme-text-muted">{ticket.ticketId}</span>
                    <span className="font-mono text-[9px] theme-text-muted">·</span>
                    <span className="font-mono text-[9px] theme-text-muted">{ticket.category}</span>
                    {ticket.replies?.length > 0 && (
                      <>
                        <span className="font-mono text-[9px] theme-text-muted">·</span>
                        <span className="font-mono text-[9px] text-gold">{ticket.replies.length} {ticket.replies.length === 1 ? 'reply' : 'replies'}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setSelected(ticket)}
                    className="w-7 h-7 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all rounded-lg"
                    title="View details"
                  >
                    <Eye size={12} />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(ticket)}
                    className="w-7 h-7 flex items-center justify-center border theme-border theme-text-muted hover:border-red-400/40 hover:text-red-400 transition-all rounded-lg"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 px-6 py-4">
          <button
            onClick={() => fetchTickets(pagination.page - 1, filter)}
            disabled={pagination.page === 1}
            className="px-4 py-2 border theme-border theme-text-muted font-mono text-[10px] tracking-[0.2em] uppercase disabled:opacity-30 hover:border-gold/40 transition-colors rounded-lg"
          >
            Previous
          </button>
          <span className="px-4 py-2 font-mono text-[11px] theme-text-secondary">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => fetchTickets(pagination.page + 1, filter)}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 border theme-border theme-text-muted font-mono text-[10px] tracking-[0.2em] uppercase disabled:opacity-30 hover:border-gold/40 transition-colors rounded-lg"
          >
            Next
          </button>
        </div>
      )}

      {/* New Ticket Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-12 overflow-y-auto">
          <div className="w-full max-w-lg border theme-border shadow-2xl rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
              <h3 className="font-display font-bold theme-text text-lg">New Support Ticket</h3>
              <button
                onClick={() => setShowNew(false)}
                className="w-8 h-8 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all rounded-lg"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Subject */}
              <div>
                <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                  style={{ backgroundColor: 'var(--input-bg)' }}
                />
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    Category
                  </label>
                  <CustomSelect
                    value={newTicket.category}
                    onChange={(value) => setNewTicket({ ...newTicket, category: value })}
                    options={categories}
                    placeholder="Select category"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    Priority
                  </label>
                  <CustomSelect
                    value={newTicket.priority}
                    onChange={(value) => setNewTicket({ ...newTicket, priority: value })}
                    options={['Low', 'Medium', 'High']}
                    placeholder="Select priority"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                  placeholder="Describe your issue in detail..."
                  className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors resize-none rounded-lg"
                  style={{ backgroundColor: 'var(--input-bg)' }}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowNew(false)}
                  className="flex-1 py-3 border theme-border theme-text-secondary font-mono text-[11px] tracking-[0.2em] uppercase hover:border-gold/30 transition-colors rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newTicket.subject || !newTicket.category || !newTicket.message}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 rounded-lg"
                >
                  <Send size={13} />
                  Submit Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-12 overflow-y-auto">
          <div className="w-full max-w-lg border theme-border shadow-2xl rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-display font-bold theme-text text-base">{selected.subject}</h3>
                  <span className={`font-mono text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 border rounded-lg ${statusColors[selected.status]}`}>
                    {selected.status}
                  </span>
                </div>
                <p className="font-mono text-[9px] theme-text-muted">{selected.ticketId} · {selected.category} · {selected.date}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all rounded-lg"
              >
                <X size={14} />
              </button>
            </div>

            {/* Original message */}
            <div className="px-6 py-4 border-b theme-border">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 rounded-lg">
                  <span className="font-mono text-[9px] text-gold">You</span>
                </div>
                <p className="font-mono text-[9px] theme-text-muted">{selected.date}</p>
              </div>
              <p className="font-body theme-text-secondary text-sm leading-relaxed">
                {selected.message}
              </p>
            </div>

            {/* Replies */}
            {selected.replies?.length > 0 && (
              <div className="divide-y theme-border max-h-48 overflow-y-auto">
                {selected.replies.map((r, i) => (
                  <div key={i} className={`px-6 py-4 ${r.from !== 'You' ? 'bg-gold/3' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 border flex items-center justify-center flex-shrink-0 rounded-lg ${
                        r.from !== 'You' ? 'bg-gold/10 border-gold/20' : 'theme-border'
                      }`}>
                        <span className={`font-mono text-[8px] ${r.from !== 'You' ? 'text-gold' : 'theme-text-muted'}`}>
                          {r.from !== 'You' ? 'T' : 'Y'}
                        </span>
                      </div>
                      <p className="font-mono text-[9px] theme-text-muted">{r.from} · {r.time}</p>
                    </div>
                    <p className="font-body theme-text-secondary text-sm leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply box — only if not closed/resolved */}
            {!['Resolved', 'Closed'].includes(selected.status) && (
              <div className="px-6 py-4 border-t theme-border">
                <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                  Add Reply
                </label>
                <textarea
                  rows={3}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors resize-none mb-3 rounded-lg"
                  style={{ backgroundColor: 'var(--input-bg)' }}
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelected(null)}
                    className="flex-1 py-2 border theme-border theme-text-secondary font-mono text-[10px] tracking-[0.2em] uppercase hover:border-gold/30 transition-colors rounded-lg"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleReply}
                    disabled={!reply.trim()}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-gold text-obsidian font-mono text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 rounded-lg"
                  >
                    <Send size={12} />
                    Send Reply
                  </button>
                </div>
              </div>
            )}

            {['Resolved', 'Closed'].includes(selected.status) && (
              <div className="px-6 py-4 border-t theme-border flex items-center gap-2">
                <CheckCheck size={14} className="text-green-500" />
                <p className="font-mono text-[10px] tracking-[0.2em] text-green-500 uppercase">
                  This ticket is {selected.status.toLowerCase()}
                </p>
                <button
                  onClick={() => setSelected(null)}
                  className="ml-auto px-4 py-2 border theme-border theme-text-secondary font-mono text-[10px] tracking-[0.2em] uppercase hover:border-gold/30 transition-colors rounded-lg"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm z-50 flex items-center justify-center px-6">
          <div className="w-full max-w-sm border theme-border p-6 shadow-xl rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
              <h3 className="font-display font-bold theme-text text-lg">Delete Ticket</h3>
            </div>
            <p className="font-body theme-text-secondary text-sm mb-6">
              Are you sure you want to delete ticket <span className="theme-text font-semibold">{confirmDelete.ticketId}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 border theme-border theme-text-secondary font-mono text-[10px] tracking-[0.2em] uppercase hover:border-gold/30 transition-colors rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete._id)}
                className="flex-1 py-3 bg-red-500 text-white font-mono text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-red-600 transition-colors rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMessages;