import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserProvider';

export default function Navbar() {
    const { user } = useUser();
    const location = useLocation();

    return (
        <nav style={{
            padding: '1.25rem 2rem',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--glass-border)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <svg style={{ width: '28px', color: 'var(--primary)' }} fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path></svg>
                    <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'white' }}>Library Management <span style={{ color: 'var(--primary)' }}>System</span></h1>
                </div>

                <ul style={{ display: 'flex', listStyle: 'none', gap: '2rem', margin: 0, padding: 0, alignItems: 'center' }}>
                    {user.isLoggedIn ? (
                        <>
                            <li>
                                <Link to="/books" style={{
                                    fontWeight: 500,
                                    color: location.pathname.includes('/books') ? 'white' : 'var(--text-secondary)',
                                    transition: 'color 0.2s',
                                    borderBottom: location.pathname === '/books' ? '2px solid var(--primary)' : 'none',
                                    paddingBottom: '4px'
                                }}>Catalog</Link>
                            </li>
                            <li>
                                <Link to="/borrow" style={{
                                    fontWeight: 500,
                                    color: location.pathname.includes('/borrow') ? 'white' : 'var(--text-secondary)',
                                    transition: 'color 0.2s',
                                    borderBottom: location.pathname === '/borrow' ? '2px solid var(--primary)' : 'none',
                                    paddingBottom: '4px'
                                }}>Operations</Link>
                            </li>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginLeft: '1rem', paddingLeft: '2rem', borderLeft: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user.email}</span>
                                    <span className="badge primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem', marginTop: '0.2rem' }}>{user.role}</span>
                                </div>
                                <Link to="/logout" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s' }}>
                                    Logout
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to="/login" style={{ background: 'var(--primary)', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 600 }}>Login Port</Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}
