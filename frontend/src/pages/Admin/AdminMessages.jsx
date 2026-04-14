/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import {
  MessageCircle, Eye, X, Send,
  CheckCheck, AlertCircle, Search,
  Clock, User
} from 'lucide-react';
import { ticketService } from '../../services/apiService';

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

const filters = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];

const AdminMessages = () => {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 });
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch tickets from API
  const fetchTickets = async (page = 1, status = '', searchQuery = '') => {
    setLoading(true);
    try {
      const response = await ticketService.getTickets({ 
        page, 
        limit: 20, 
        status: status === 'All' ? '' : status,
        search: searchQuery
      });
      setTickets(response.tickets);
      setPagination(response.pagination);
      if (response.stats) {
        setStats(response.stats);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(1, filter, debouncedSearch);
  }, [filter, debouncedSearch]);

  const filtered = tickets; // API already filters

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
      
      // Refresh stats
      const statsResponse = await ticketService.getStats();
      setStats(statsResponse);
    } catch (err) {
      console.error('Failed to send reply:', err.message);
      alert(err.message || 'Failed to send reply');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await ticketService.updateStatus(id, newStatus);
      const updatedTicket = response.ticket;
      
      setTickets(prev => prev.map(t => 
        t._id === updatedTicket._id ? updatedTicket : t
      ));
      if (selected?._id === id) {
        setSelected(updatedTicket);
      }
      
      // Refresh stats
      const statsResponse = await ticketService.getStats();
      setStats(statsResponse);
    } catch (err) {
      console.error('Failed to update status:', err.message);
      alert(err.message || 'Failed to update status');
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tickets', value: stats.total, color: 'theme-text' },
          { label: 'Open', value: stats.open, color: 'text-blue-500' },
          { label: 'In Progress', value: stats.inProgress, color: 'text-yellow-600' },
          { label: 'Resolved', value: stats.resolved, color: 'text-green-600' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="p-5 border theme-border rounded-lg"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <p className="font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase mb-2">{label}</p>
            <p className={`font-display font-black text-3xl ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="border theme-border rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b theme-border">
          <h3 className="font-mono text-[11px] tracking-[0.3em] theme-text-muted uppercase">
            Support Tickets
            {stats.open > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white font-mono text-[9px] rounded-full">
                {stats.open} open
              </span>
            )}
          </h3>
          <div className="flex flex-wrap gap-2">
            {/* Search */}
            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tickets..."
                className="pl-8 pr-3 py-2 border theme-border theme-text font-body text-xs focus:outline-none focus:border-gold/40 transition-colors w-40 rounded-lg"
                style={{ backgroundColor: 'var(--input-bg)' }}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 px-6 py-3 border-b theme-border">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 font-mono text-[9px] tracking-[0.2em] uppercase border transition-all rounded-lg ${
                filter === f
                  ? 'bg-gold text-obsidian border-gold'
                  : 'theme-border theme-text-muted hover:border-gold/40 hover:text-gold'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="px-6 py-2 border-b theme-border">
          <p className="font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase">
            Showing {filtered.length} of {pagination.total} tickets
          </p>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-4">
            <MessageCircle size={36} className="theme-text-muted opacity-20" />
            <p className="font-body theme-text-muted text-sm">No tickets found</p>
          </div>
        ) : (
          <div className="divide-y theme-border">
            {filtered.map(ticket => (
              <div
                key={ticket._id}
                className={`flex items-start gap-4 px-6 py-4 transition-colors ${
                  ticket.status === 'Open' ? 'bg-gold/2' : ''
                }`}
              >
                {/* Avatar */}
                <div className="w-8 h-8 bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5 rounded-lg">
                  <span className="font-display font-bold text-gold text-sm">
                    {ticket.userName?.charAt(0) || '?'}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-display font-semibold theme-text text-sm ">{ticket.subject}</p>
                      <span className={`font-mono text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 border rounded-lg ${statusColors[ticket.status]}`}>
                        {ticket.status}
                      </span>
                      <span className={`font-mono text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 border rounded-lg ${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="font-mono text-[9px] theme-text-muted flex-shrink-0">{ticket.date}</p>
                  </div>
                  <p className="font-body theme-text-muted text-xs leading-snug truncate mb-1">
                    {ticket.message}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <User size={10} className="theme-text-muted" />
                      <span className="font-mono text-[9px] theme-text-muted">{ticket.userName}</span>
                    </div>
                    <span className="font-mono text-[9px] theme-text-muted">·</span>
                    <span className="font-mono text-[9px] theme-text-muted">{ticket.ticketId}</span>
                    <span className="font-mono text-[9px] theme-text-muted">·</span>
                    <span className="font-mono text-[9px] theme-text-muted">{ticket.category}</span>
                    {ticket.replies?.length > 0 && (
                      <>
                        <span className="font-mono text-[9px] theme-text-muted">·</span>
                        <span className="font-mono text-[9px] text-gold">
                          {ticket.replies.length} {ticket.replies.length === 1 ? 'reply' : 'replies'}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setSelected(ticket)}
                    className="w-7 h-7 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all rounded-lg"
                    title="View & Reply"
                  >
                    <Eye size={12} />
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
            onClick={() => fetchTickets(pagination.page - 1, filter, debouncedSearch)}
            disabled={pagination.page === 1}
            className="px-4 py-2 border theme-border theme-text-muted font-mono text-[10px] tracking-[0.2em] uppercase disabled:opacity-30 hover:border-gold/40 transition-colors rounded-lg"
          >
            Previous
          </button>
          <span className="px-4 py-2 font-mono text-[11px] theme-text-secondary">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => fetchTickets(pagination.page + 1, filter, debouncedSearch)}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 border theme-border theme-text-muted font-mono text-[10px] tracking-[0.2em] uppercase disabled:opacity-30 hover:border-gold/40 transition-colors rounded-lg"
          >
            Next
          </button>
        </div>
      )}

      {/* Ticket Detail & Reply Modal */}
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
                <div className="flex items-center gap-2">
                  <User size={10} className="theme-text-muted" />
                  <p className="font-mono text-[9px] theme-text-muted">
                    {selected.userName} · {selected.userEmail} · {selected.ticketId} · {selected.date}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setSelected(null); setReply(''); }}
                className="w-8 h-8 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all flex-shrink-0 rounded-lg"
              >
                <X size={14} />
              </button>
            </div>

            {/* Status change */}
            <div className="px-6 py-3 border-b theme-border flex items-center gap-3 flex-wrap">
              <p className="font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase flex-shrink-0">
                Change Status:
              </p>
              <div className="flex flex-wrap gap-2">
                {['Open', 'In Progress', 'Resolved', 'Closed'].map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(selected._id, s)}
                    className={`px-2 py-1 font-mono text-[9px] tracking-[0.1em] uppercase border transition-all rounded-lg ${
                      selected.status === s
                        ? 'bg-gold text-obsidian border-gold'
                        : 'theme-border theme-text-muted hover:border-gold/40 hover:text-gold'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Original message */}
            <div className="px-6 py-4 border-b theme-border">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 rounded-lg">
                  <span className="font-mono text-[8px] text-gold ">{selected.userName?.charAt(0) || '?'}</span>
                </div>
                <p className="font-mono text-[9px] theme-text-muted">{selected.userName} · {selected.date}</p>
              </div>
              <p className="font-body theme-text-secondary text-sm leading-relaxed">{selected.message}</p>
            </div>

            {/* Replies */}
            {selected.replies?.length > 0 && (
              <div className="divide-y theme-border max-h-48 overflow-y-auto">
                {selected.replies.map((r, i) => (
                  <div key={i} className={`px-6 py-4 ${r.from === 'Trendova Support' ? 'bg-gold/3' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 border flex items-center justify-center flex-shrink-0 rounded-lg ${
                        r.from === 'Trendova Support' ? 'bg-gold/10 border-gold/20' : 'theme-border'
                      }`}>
                        <span className={`font-mono text-[8px] ${r.from === 'Trendova Support' ? 'text-gold' : 'theme-text-muted'}`}>
                          {r.from === 'Trendova Support' ? 'T' : r.from.charAt(0)}
                        </span>
                      </div>
                      <p className="font-mono text-[9px] theme-text-muted">{r.from} · {r.time}</p>
                    </div>
                    <p className="font-body theme-text-secondary text-sm leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply box */}
            {!['Closed'].includes(selected.status) ? (
              <div className="px-6 py-4 border-t theme-border">
                <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                  Reply to {selected.userName}
                </label>
                <textarea
                  rows={3}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder={`Write your reply to ${selected.userName}...`}
                  className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors resize-none mb-3 rounded-lg"
                  style={{ backgroundColor: 'var(--input-bg)' }}
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => { setSelected(null); setReply(''); }}
                    className="flex-1 py-3 border theme-border theme-text-secondary font-mono text-[10px] tracking-[0.2em] uppercase hover:border-gold/30 transition-colors rounded-lg"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleReply}
                    disabled={!reply.trim()}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold text-obsidian font-mono text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 rounded-lg"
                  >
                    <Send size={12} />
                    Send Reply
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-6 py-4 border-t theme-border flex items-center gap-2">
                <CheckCheck size={14} className="text-green-500" />
                <p className="font-mono text-[10px] tracking-[0.2em] text-green-500 uppercase">
                  This ticket is closed
                </p>
                <button
                  onClick={() => { setSelected(null); setReply(''); }}
                  className="ml-auto px-4 py-2 border theme-border theme-text-secondary font-mono text-[10px] tracking-[0.2em] uppercase hover:border-gold/30 transition-colors rounded-lg"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;