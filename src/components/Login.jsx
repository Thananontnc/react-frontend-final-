import { useRef, useState } from "react";
import { useUser } from "../contexts/UserProvider";
import { Navigate } from "react-router-dom";

export default function Login() {

  const [controlState, setControlState] = useState({
    isLoggingIn: false,
    isLoginError: false,
    isLoginOk: false
  });

  const emailRef = useRef();
  const passRef = useRef();
  const { user, login } = useUser();

  async function onLogin(e) {
    if (e) e.preventDefault();

    setControlState((prev) => {
      return {
        ...prev,
        isLoggingIn: true,
        isLoginError: false
      }
    });

    const email = emailRef.current.value;
    const pass = passRef.current.value;

    const result = await login(email, pass);

    setControlState((prev) => {
      return {
        isLoggingIn: false,
        isLoginError: !result,
        isLoginOk: result
      }
    });
  }

  if (!user.isLoggedIn)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }} className="page-container">
        <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '3.5rem 2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          <div style={{ background: 'rgba(129, 140, 248, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem', border: '1px solid rgba(129, 140, 248, 0.2)' }}>
            <svg style={{ width: '40px', color: 'var(--primary)' }} fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path></svg>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2.5rem', width: '100%' }}>
            <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Library Management System</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '0.95rem' }}>Enter credentials to access databanks</p>
          </div>

          <form onSubmit={onLogin} className="flex-col" style={{ width: '100%' }}>
            <div className="flex-col" style={{ gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Email Allocation</label>
              <input type="email" placeholder="john@example.com" id="email" ref={emailRef} required style={{ width: '100%' }} />
            </div>

            <div className="flex-col" style={{ gap: '0.5rem', marginTop: '0.75rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Passkey</label>
              <input type="password" placeholder="••••••••" id="password" ref={passRef} required style={{ width: '100%' }} />
            </div>

            <button type="submit" disabled={controlState.isLoggingIn} style={{ marginTop: '2rem', width: '100%', height: '50px' }}>
              {controlState.isLoggingIn ? "Authenticating node..." : "Initialize Session"}
            </button>

            {controlState.isLoginError && (
              <div className="badge alert" style={{ width: '100%', textAlign: 'center', marginTop: '1.25rem', padding: '0.8rem', fontSize: '0.85rem' }}>
                Access Denied: Invalid credentials
              </div>
            )}
            {user.isLoggedIn && (
              <div className="badge success" style={{ width: '100%', textAlign: 'center', marginTop: '1.25rem', padding: '0.8rem', fontSize: '0.85rem' }}>
                Handshake Established
              </div>
            )}
          </form>
        </div>
      </div>
    );
  else
    return (
      <Navigate to="/books" replace />
    );
}