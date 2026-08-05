import { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from './api.js';

export default function AdminLogin({ onLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Enter your username and password.');
      return;
    }
    setLoading(true);
    try {
      await api.login(username.trim(), password);
      const me = await api.me();
      onLoggedIn(me.username);
    } catch (err) {
      setError(err.message || 'Incorrect username or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[400px]"
      >
        <div className="text-center mb-8">
          <p className="font-archivo font-extrabold text-lg tracking-wide text-ink">STAYSTRONGSTAYWILD</p>
          <p className="text-caption text-black/50 mt-1">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-black/[0.1] rounded-lg p-7">
          <p className="text-h3 text-ink mb-1">Welcome back</p>
          <p className="text-body text-[13px] mb-6">Log in to manage enquiries and site content.</p>

          <label className="text-caption text-black/60 block mb-1.5">Username</label>
          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="field-input mb-4"
            placeholder="Username"
          />

          <label className="text-caption text-black/60 block mb-1.5">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field-input mb-2"
            placeholder="Password"
          />

          {error && <p className="text-[13px] mt-3" style={{ color: '#a13d2e' }}>{error}</p>}

          <button type="submit" disabled={loading} className="btn-outline w-full mt-5 !py-3.5">
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <p className="text-caption text-black/40 text-center mt-6">
          <a href="/" className="underline decoration-1 underline-offset-2">← Back to the site</a>
        </p>
      </motion.div>
    </div>
  );
}
