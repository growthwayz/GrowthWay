import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      // Use native fetch to handle url-encoded form data easily
      const res = await fetch('http://localhost:8000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });

      if (!res.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await res.json();
      localStorage.setItem('gw_admin_token', data.access_token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gw-canvas flex items-center justify-center p-4">
      <div className="bg-gw-white p-8 rounded-lg shadow-sm border border-gw-line max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo-full.png" alt="Growth Way" className="w-32 h-32 rounded-lg object-contain mb-1 shadow-sm" />
          <h1 className="font-display text-xl font-bold text-gw-ink uppercase tracking-tight">Admin Console</h1>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              className="w-full p-3 border border-gw-line rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 border border-gw-line rounded"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gw-ink text-gw-white p-3 rounded mt-2 uppercase text-sm font-bold tracking-wider hover:bg-gw-charcoal disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
