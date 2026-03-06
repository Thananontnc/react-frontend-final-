import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserProvider';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [book, setBook] = useState(null);
  const [targetDate, setTargetDate] = useState('');

  const [editForm, setEditForm] = useState({
    title: '', author: '', quantity: 1, location: ''
  });

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const res = await fetch(`${API_URL}/api/books/${id}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setBook(data);
        setEditForm({
          title: data.title,
          author: data.author,
          quantity: data.quantity,
          location: data.location
        });
      } else {
        navigate('/books');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/books/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
        credentials: "include"
      });
      if (res.ok) {
        alert('Book updated');
        fetchBook();
      } else {
        alert("Failed to update");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${API_URL}/api/books/${id}`, {
        method: 'DELETE',
        credentials: "include"
      });
      if (res.ok) {
        alert("Deleted successfully");
        navigate('/books');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBorrowRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/borrow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: id, targetDate }),
        credentials: "include"
      });
      if (res.ok) {
        alert("Borrow request submitted");
        navigate('/borrow');
      } else {
        alert("Failed to submit request");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!book) return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="skeleton skeleton-title" style={{ width: '40%' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '2rem' }}>
        <div className="glass-panel"><div className="skeleton skeleton-block" /></div>
        <div className="glass-panel"><div className="skeleton skeleton-block" /></div>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate('/books')} className="outline" style={{ padding: '0.5rem 1rem' }}>
          <svg style={{ width: '16px', marginRight: '0.5rem' }} fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path></svg>
          Back to Catalog
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '2rem', alignItems: 'start' }}>

        {/* Detail Card */}
        <div className="glass-panel" style={{ margin: 0, padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0, fontSize: '2.2rem', lineHeight: 1.2 }}>{book.title}</h2>
            {book.status === 'DELETED' && (
              <span className="badge alert" style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                DELETED
              </span>
            )}
          </div>

          <div className="flex-col" style={{ gap: '1.25rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Author</p>
              <p style={{ fontSize: '1.25rem', color: 'white', fontWeight: 500, margin: 0 }}>{book.author}</p>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Stock Quantity</p>
              <p style={{ fontSize: '1.25rem', color: 'white', fontWeight: 500, display: 'flex', alignItems: 'center', margin: 0 }}>
                {book.quantity} {book.status !== 'DELETED' && (
                  book.quantity > 0 ? (
                    <span className="badge success" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Available Item
                    </span>
                  ) : (
                    <span className="badge warning" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                      Out of Stock
                    </span>
                  )
                )}
              </p>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Location / Shelf Details</p>
              <p style={{ fontSize: '1.25rem', color: 'white', fontWeight: 500, margin: 0 }}>{book.location || 'Not assigned'}</p>
            </div>
            <div style={{ padding: '1rem', border: '1px dashed var(--glass-border)', borderRadius: '12px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, marginBottom: '0.2rem' }}>System Database ID</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontFamily: 'monospace', letterSpacing: '1px', margin: 0 }}>{book._id}</p>
            </div>
          </div>
        </div>

        {/* Actions Card */}
        <div className="flex-col" style={{ gap: '1.5rem' }}>
          {user.role === 'ADMIN' && (
            <div className="glass-panel" style={{ margin: 0, border: '1px dashed var(--primary)' }}>
              <h3 style={{ color: 'var(--primary)', margin: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg style={{ width: '20px' }} fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Administrator Tools
              </h3>
              <form onSubmit={handleUpdate} className="flex-col" style={{ gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Edit Title</label>
                  <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Edit Author</label>
                  <input value={editForm.author} onChange={e => setEditForm({ ...editForm, author: e.target.value })} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Edit Quantity</label>
                    <input type="number" value={editForm.quantity} onChange={e => setEditForm({ ...editForm, quantity: Number(e.target.value) })} required />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Edit Location</label>
                    <input value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" style={{ flex: 1 }}>Save Changes</button>
                  <button type="button" onClick={handleDelete} className="danger" disabled={book.status === 'DELETED'}>
                    {book.status === 'DELETED' ? 'Disabled' : 'Soft Delete'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {user.role === 'USER' && book.status !== 'DELETED' && (
            <div className="glass-panel" style={{ margin: 0 }}>
              <h3 style={{ margin: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg style={{ width: '20px' }} fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Request to Borrow
              </h3>
              {book.quantity > 0 ? (
                <form onSubmit={handleBorrowRequest} className="flex-col" style={{ gap: '1rem' }}>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>Target Pick-up Date</label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={e => setTargetDate(e.target.value)}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}
                    />
                  </div>
                  <button type="submit" style={{ marginTop: '0.5rem', width: '100%', height: '50px' }}>
                    Send Request Ticket
                  </button>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center', lineHeight: '1.5' }}>
                    Once submitted, you will need to await administrator approval. <br />Check your borrow requests status page periodically.
                  </p>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px' }}>
                  <p style={{ color: '#fcd34d', margin: 0, fontWeight: 500 }}>This book is currently out of stock</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>Please check back later.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}