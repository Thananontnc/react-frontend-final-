import { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserProvider';
import { Link } from 'react-router-dom';

export default function Books() {
  const { user } = useUser();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');

  const titleRef = useRef();
  const authorRef = useRef();
  const quantityRef = useRef();
  const locationRef = useRef();

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchBooks = async () => {
    setIsLoading(true);
    let url = `${API_URL}/api/books?`;
    if (searchTitle) url += `title=${encodeURIComponent(searchTitle)}&`;
    if (searchAuthor) url += `author=${encodeURIComponent(searchAuthor)}`;

    try {
      const res = await fetch(url, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchTitle, searchAuthor]);

  const handleCreateBook = async (e) => {
    e.preventDefault();
    const newBook = {
      title: titleRef.current.value,
      author: authorRef.current.value,
      quantity: Number(quantityRef.current.value) || 1,
      location: locationRef.current.value
    };

    try {
      const res = await fetch(`${API_URL}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
        credentials: "include"
      });
      if (res.ok) {
        fetchBooks();
        titleRef.current.value = '';
        authorRef.current.value = '';
        quantityRef.current.value = '';
        locationRef.current.value = '';
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Library Catalog</h2>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Search & Filter</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) minmax(150px, 1fr)', gap: '1rem' }}>
          <input
            placeholder="Search by Title..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <input
            placeholder="Search by Author..."
            value={searchAuthor}
            onChange={(e) => setSearchAuthor(e.target.value)}
          />
        </div>
      </div>

      {user.role === 'ADMIN' && (
        <div className="glass-panel" style={{ padding: '1.5rem', border: '1px dashed rgba(129, 140, 248, 0.4)' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Add New Book</h4>
          <form onSubmit={handleCreateBook} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Title</label>
              <input placeholder="A Brief History of Time" ref={titleRef} required />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Author</label>
              <input placeholder="Stephen Hawking" ref={authorRef} required />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Quantity</label>
              <input type="number" placeholder="1" ref={quantityRef} required />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Location Area</label>
              <input placeholder="Science, Shelf A1" ref={locationRef} />
            </div>
            <button type="submit" style={{ height: '44px' }}>Add to System</button>
          </form>
        </div>
      )}

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-panel" style={{ padding: '1.5rem', margin: 0, minHeight: '180px' }}>
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" style={{ width: '50%', marginTop: '1rem' }} />
              <div className="skeleton skeleton-text" style={{ width: '100%', marginTop: '2rem', height: '40px' }} />
            </div>
          ))}
        </div>
      ) : books.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {books.map(b => (
            <div key={b._id} className="glass-panel glass-card" style={{ padding: '1.5rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                {b.status === 'DELETED' ? (
                  <span className="badge alert" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    DELETED
                  </span>
                ) : (
                  b.quantity > 0 ? (
                    <span className="badge success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      In Stock
                    </span>
                  ) : (
                    <span className="badge warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                      Empty Stock
                    </span>
                  )
                )}
              </div>

              <div style={{ paddingRight: '6.5rem', minHeight: '60px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'white', lineHeight: '1.3' }}>{b.title}</h3>
                <p style={{ margin: '0.4rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>by {b.author}</p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                <Link to={`/books/${b._id}`} style={{ width: '100%' }}>
                  <button className="outline" style={{ width: '100%' }}>View & Interact</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path>
          </svg>
          <h3 style={{ color: 'white' }}>No Books Found</h3>
          <p>We couldn't find any books matching your search criteria. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}