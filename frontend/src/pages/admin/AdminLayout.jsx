import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import api from './api';
import './Admin.css';
export default function AdminLayout() {
  const navigate = useNavigate(); const [admin, setAdmin] = useState(null); const [error, setError] = useState(''); const [attempt, setAttempt] = useState(0);
  useEffect(() => { let active = true; api.get('/api/admin/me').then(data => { if (active) setAdmin(data); }).catch(err => { if (err.status === 401) navigate('/admin', { replace: true }); else if (active) setError(err.message); }); const expired = () => navigate('/admin', { replace: true }); window.addEventListener('gw-session-expired', expired); return () => { active = false; window.removeEventListener('gw-session-expired', expired); }; }, [navigate, attempt]);
  async function logout() { try { await api.post('/api/admin/logout', {}); sessionStorage.removeItem('gw_admin_token'); navigate('/admin'); } catch (err) { setError(err.message); } }
  if (!admin) return <div className="admin-loading">{error ? <><p role="alert">{error}</p><button onClick={() => { setError(''); setAttempt(attempt + 1); }}>Retry</button><Link to="/admin">Sign in</Link></> : 'Checking your session…'}</div>;
  const owner = admin.role === 'admin';
  const links = [['dashboard', 'Overview'], ...(owner ? [['leads', 'Enquiries']] : []), ...['projects', 'categories', 'services', 'industries', 'clients', 'testimonials', 'team'].map(key => [`content/${key}`, key[0].toUpperCase() + key.slice(1)]), ['media', 'Media'], ...(owner ? [['hero', 'Homepage video'], ['settings', 'Site settings'], ['users', 'Admin users'], ['audit', 'Activity log']] : []), ['account', 'My account']];
  return <div className="admin-app"><aside><Link className="admin-brand" to="/">Growthway <small>CMS</small></Link><nav aria-label="Admin navigation">{links.map(([path, label]) => <NavLink key={path} to={`/admin/${path}`}>{label}</NavLink>)}</nav><p>{admin.username} · {admin.role}</p><button onClick={logout}>Sign out</button><Link to="/" target="_blank" rel="noreferrer">View website ↗</Link>{error && <p role="alert">{error}</p>}</aside><div className="admin-main"><Outlet context={admin} /></div></div>;
}
