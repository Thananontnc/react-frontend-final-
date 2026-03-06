import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserProvider';

export default function BookBorrow() {
  const { user } = useUser();
  const [requests, setRequests] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/borrow`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/borrow?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include"
      });
      if (res.ok) {
        fetchRequests();
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED': return 'badge success';
      case 'CANCEL-ADMIN':
      case 'CANCEL-USER':
      case 'CLOSE-NO-AVAILABLE-BOOK': return 'badge alert';
      default: return 'badge primary';
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Borrow Operations</h2>
      </div>

      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '2rem' }}>
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text" style={{ marginTop: '1rem' }} />
            <div className="skeleton skeleton-text" style={{ marginTop: '1rem' }} />
          </div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 style={{ color: 'white' }}>No Operations Found</h3>
            <p>There are currently no borrow requests visible on your account axis.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Book Ref</th>
                  {user.role === 'ADMIN' && <th>Requesting User</th>}
                  <th>Target Date</th>
                  <th>Created At</th>
                  <th>Execution Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{req._id.substring(req._id.length - 6)}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>{req.bookId.substring(req.bookId.length - 6)}</td>
                    {user.role === 'ADMIN' && (
                      <td style={{ fontSize: '0.9rem', opacity: 0.8 }}>{req.userId}</td>
                    )}
                    <td style={{ fontWeight: 500, color: 'white' }}>{req.targetDate}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(req.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    <td>
                      <span className={getStatusBadge(req.status)}>{req.status}</span>
                    </td>
                    <td>
                      {user.role === 'ADMIN' && req.status === 'INIT' ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleStatusChange(req._id, 'ACCEPTED')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#22c55e' }}>
                            Accept
                          </button>
                          <button onClick={() => handleStatusChange(req._id, 'CLOSE-NO-AVAILABLE-BOOK')} className="danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                            Reject
                          </button>
                        </div>
                      ) : user.role === 'USER' && req.status === 'INIT' ? (
                        <button
                          onClick={() => handleStatusChange(req._id, 'CANCEL-USER')}
                          className="outline"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                        >
                          Cancel Request
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No action</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}