import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
export default function AdminAccounts({ mode }) {
 if (mode === 'users') return <AdminUsers />;
 if (mode === 'audit') return <AdminAudit />;
 return <AdminAccount />;
}
export function AdminAccount() {
 const [currentPassword, setCurrent] = useState(''); const [newPassword, setNew] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const navigate = useNavigate();
 async function change(e) { e.preventDefault(); setBusy(true); setError(''); try { await api.post('/api/admin/password', { currentPassword, newPassword }); sessionStorage.removeItem('gw_admin_token'); navigate('/admin'); } catch (err) { setError(err.message); } finally { setBusy(false); } }
 return <section><h1>My account</h1><p>Changing your password signs out all your sessions.</p>{error && <p role="alert" className="admin-error">{error}</p>}<form className="admin-editor" onSubmit={change}><label>Current password<input type="password" autoComplete="current-password" value={currentPassword} onChange={e => setCurrent(e.target.value)} required /></label><label>New password (12+ characters)<input type="password" autoComplete="new-password" value={newPassword} onChange={e => setNew(e.target.value)} minLength={12} maxLength={200} required /></label><div className="admin-actions"><button disabled={busy}>Change password</button></div></form></section>;
}
export function AdminUsers() {
 const [users, setUsers] = useState([]); const [form, setForm] = useState({ username: '', password: '', role: 'editor' }); const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const [refresh, setRefresh] = useState(0);
 useEffect(() => { api.get('/api/admin/users').then(setUsers).catch(err => setError(err.message)); }, [refresh]);
 async function create(e) { e.preventDefault(); setBusy(true); setError(''); try { await api.post('/api/admin/users', form); setForm({ username: '', password: '', role: 'editor' }); setRefresh(v => v + 1); } catch (err) { setError(err.message); } finally { setBusy(false); } }
 async function toggle(user) { setBusy(true); setError(''); try { await api.patch(`/api/admin/users/${user.id}`, { active: !user.active }); setRefresh(v => v + 1); } catch (err) { setError(err.message); } finally { setBusy(false); } }
 return <section><h1>Admin users</h1><p>Editors manage content and media. Administrators also manage enquiries, settings, accounts and activity logs.</p>{error && <p role="alert" className="admin-error">{error}</p>}<form className="admin-editor" onSubmit={create}><h2>Add an account</h2><div className="admin-grid"><label>Username<input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required /></label><label>Initial password<input type="password" autoComplete="new-password" value={form.password} minLength={12} onChange={e => setForm({ ...form, password: e.target.value })} required /></label><label>Role<select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option value="editor">Editor</option><option value="admin">Administrator</option></select></label></div><div className="admin-actions"><button disabled={busy}>Create account</button></div></form><div className="admin-scroll"><table className="admin-table"><thead><tr><th>Username</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>{users.map(user => <tr key={user.id}><td>{user.username}</td><td>{user.role}</td><td>{user.active ? 'Active' : 'Disabled'}</td><td><button disabled={busy} onClick={() => toggle(user)}>{user.active ? 'Disable' : 'Enable'}</button></td></tr>)}</tbody></table></div></section>;
}
export function AdminAudit() {
 const [data, setData] = useState({ items: [], total: 0 }); const [offset, setOffset] = useState(0); const [error, setError] = useState('');
 useEffect(() => { api.get(`/api/admin/audit?offset=${offset}`).then(setData).catch(err => setError(err.message)); }, [offset]);
 return <section><h1>Activity log</h1>{error && <p role="alert" className="admin-error">{error}</p>}<div className="admin-scroll"><table className="admin-table"><thead><tr><th>When</th><th>Who</th><th>Action</th><th>Content</th><th>Changes</th></tr></thead><tbody>{data.items.map(item => <tr key={item.id}><td>{new Date(item.createdAt).toLocaleString()}</td><td>{item.actor}</td><td>{item.action.replaceAll('_', ' ')}</td><td>{item.collection}</td><td>{item.changes.fields?.join(', ') || item.changes.note || (item.changes.from ? `${item.changes.from} → ${item.changes.to}` : '')}</td></tr>)}</tbody></table></div><div className="admin-pager"><span>{data.total} actions</span><button disabled={!offset} onClick={() => setOffset(offset - 50)}>Previous</button><button disabled={offset + 50 >= data.total} onClick={() => setOffset(offset + 50)}>Next</button></div></section>;
}
