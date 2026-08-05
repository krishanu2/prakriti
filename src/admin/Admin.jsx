import { useEffect, useState } from 'react';
import { api } from './api.js';
import { ToastProvider } from './ui.jsx';
import { ConfirmProvider } from './ui.jsx';
import AdminLogin from './AdminLogin.jsx';
import AdminDashboard from './AdminDashboard.jsx';

export default function Admin() {
  const [status, setStatus] = useState('checking'); // checking | out | in
  const [username, setUsername] = useState('');

  useEffect(() => {
    api
      .me()
      .then((data) => {
        setUsername(data.username);
        setStatus('in');
      })
      .catch(() => setStatus('out'));
  }, []);

  return (
    <ToastProvider>
      <ConfirmProvider>
        {status === 'checking' && (
          <div className="min-h-screen flex items-center justify-center bg-cream">
            <p className="text-caption text-black/40">Loading admin…</p>
          </div>
        )}
        {status === 'out' && (
          <AdminLogin
            onLoggedIn={(name) => {
              setUsername(name);
              setStatus('in');
            }}
          />
        )}
        {status === 'in' && (
          <AdminDashboard
            username={username}
            onLoggedOut={() => setStatus('out')}
          />
        )}
      </ConfirmProvider>
    </ToastProvider>
  );
}
