import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { request } from './api';
import './Admin.css';
export default function AdminLogin() {
  const [username, setUsername] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const navigate = useNavigate();
  async function login(e) {
    e.preventDefault(); setLoading(true); setError('');
    try { const data = await request('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ username, password }).toString() }); sessionStorage.setItem('gw_admin_token', data.access_token); localStorage.removeItem('gw_admin_token'); navigate('/admin/dashboard', { replace: true }); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  }
  return <div className="admin-loading"><form className="admin-login" onSubmit={login}><img src="/logo-full.png" alt="Growthway" width="140" /><h1>Admin sign in</h1><label htmlFor="username">Username</label><input id="username" autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required /><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required />{error && <p className="admin-error" role="alert">{error}</p>}<button disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button><Link to="/">Back to website</Link></form></div>;
}
