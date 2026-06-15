import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Layers, PlusCircle, ClipboardList, Briefcase, User, Activity, MessageSquare, Send, ShieldAlert } from 'lucide-react';

interface DesignTask {
  _id: string;
  moduleName: string;
  category: 'Retail' | 'Project';
  workflowStatus: string;
  assignedTo: string;
  chatter: { sender: string; message: string; createdAt: string }[];
}

function App() {
  const [tasks, setTasks] = useState<DesignTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewFilter, setViewFilter] = useState<'All' | 'Retail' | 'Project'>('All');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // RBAC Identity Switcher
  const [currentUserRole, setCurrentUserRole] = useState<'Designer' | 'HOD'>('Designer');

  // Form Nodes
  const [form, setForm] = useState({ moduleName: '', category: 'Retail', workflowStatus: 'Design Task New', assignedTo: '' });
  const [chat, setChat] = useState({ sender: '', message: '' });

  const fetchTasks = () => {
    axios.get('http://localhost:3000/products')
      .then(res => { setTasks(res.data); setLoading(false); })
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.moduleName || !form.assignedTo) return alert('Please satisfy all parameters.');
    try {
      await axios.post('http://localhost:3000/products', form);
      setForm({ moduleName: '', category: 'Retail', workflowStatus: 'Design Task New', assignedTo: '' });
      fetchTasks();
    } catch (err: any) { alert('Failure creating task.'); }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await axios.patch(`http://localhost:3000/products/${id}/status`, {
        status: newStatus,
        userRole: currentUserRole
      });
      fetchTasks();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status stream configuration.');
      fetchTasks();
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chat.sender || !chat.message) return alert('Fill name and message.');
    try {
      await axios.post(`http://localhost:3000/products/${selectedTaskId}/chatter`, chat);
      setChat({ ...chat, message: '' });
      fetchTasks();
    } catch (err) { alert('Failed to send chat.'); }
  };

  const filtered = tasks.filter(t => viewFilter === 'All' || t.category === viewFilter);
  const activeTask = tasks.find(t => t._id === selectedTaskId);

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#F8FAFC', minHeight: '100vh', padding: '40px', color: '#1E293B', boxSizing: 'border-box' }}>
      
      {/* HEADER SECTION WITH IDENTITY SELECTOR */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', borderBottom: '1px solid #E2E8F0', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: '#1E3A8A', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={28} color="#FFF" />
          </div>
          <div>
            <h1 style={{ margin: 0, color: '#1E3A8A', fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px' }}>Design Module Control Matrix</h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '14px', fontWeight: 500 }}>Enterprise Resource Planning & Lifecycle Scheduling</p>
          </div>
        </div>

        {/* Global RBAC Simulation Selector Switch */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#FFF', padding: '10px 18px', borderRadius: '12px', border: '1px solid #CBD5E1', gap: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E3A8A', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={16} color="#EA580C" /> Identity Scope:
          </span>
          <select 
            value={currentUserRole} 
            onChange={e => setCurrentUserRole(e.target.value as any)}
            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 600, color: '#1E3A8A', background: '#F8FAFC', cursor: 'pointer', outline: 'none' }}
          >
            <option value="Designer">Designer Workspace</option>
            <option value="HOD">Head of Department (HOD)</option>
          </select>
        </div>
      </header>

      {/* ANALYTICS CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '35px' }}>
        <div style={{ background: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', borderLeft: '6px solid #1E3A8A', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '14px', fontWeight: 600 }}><span>Active Modules</span><Briefcase size={18} color="#1E3A8A" /></div>
          <h2 style={{ margin: '12px 0 0 0', fontSize: '32px', fontWeight: 700, color: '#0F172A' }}>{tasks.length}</h2>
        </div>
        <div style={{ background: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', borderLeft: '6px solid #EA580C', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '14px', fontWeight: 600 }}><span>In-Flight Adjustments</span><Activity size={18} color="#EA580C" /></div>
          <h2 style={{ margin: '12px 0 0 0', fontSize: '32px', fontWeight: 700, color: '#0F172A' }}>{tasks.filter(t => t.workflowStatus === 'In Progress').length}</h2>
        </div>
        <div style={{ background: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', borderLeft: '6px solid #EF4444', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '14px', fontWeight: 600 }}><span>Rework & Errors</span><MessageSquare size={18} color="#EF4444" /></div>
          <h2 style={{ margin: '12px 0 0 0', fontSize: '32px', fontWeight: 700, color: '#0F172A' }}>{tasks.filter(t => t.workflowStatus === 'Rework/Error').length}</h2>
        </div>
      </div>

      {/* WORKSPACE CONTENT GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* DISPATCH MODULE FORM BLOCK */}
        <div style={{ background: '#FFF', padding: '25px', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#1E3A8A', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 700 }}>
            <PlusCircle size={20} color="#EA580C" /> Dispatch Module
          </h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input type="text" placeholder="Module Name" value={form.moduleName} onChange={e => setForm({...form, moduleName: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', width: '100%', boxSizing: 'border-box', fontSize: '14px' }} />
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', width: '100%', boxSizing: 'border-box', fontSize: '14px', background: '#FFF' }}>
              <option value="Retail">Retail Stream</option>
              <option value="Project">Internal Project Stream</option>
            </select>
            <select value={form.workflowStatus} onChange={e => setForm({...form, workflowStatus: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', width: '100%', boxSizing: 'border-box', fontSize: '14px', background: '#FFF' }}>
              <option value="Design Task New">Design Task New</option>
              <option value="In Progress">In Progress</option>
              <option value="Design Completed">Design Completed</option>
              <option value="Rework/Error">Rework/Error</option>
            </select>
            <input type="text" placeholder="Assigned Designer" value={form.assignedTo} onChange={e => setForm({...form, assignedTo: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', width: '100%', boxSizing: 'border-box', fontSize: '14px' }} />
            <button type="submit" style={{ background: '#1E3A8A', color: '#FFF', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px', marginTop: '5px' }}>Commit to Cluster</button>
          </form>
        </div>

        {/* REGISTRY AND CHATTER SECTION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div style={{ background: '#FFF', padding: '25px', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#1E3A8A', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 700 }}><ClipboardList size={22} color="#1E3A8A" /> Master Design Registry</h3>
              <div style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '8px', gap: '4px' }}>
                {(['All', 'Retail', 'Project'] as const).map(type => (
                  <button key={type} onClick={() => setViewFilter(type)} style={{ padding: '6px 14px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', background: viewFilter === type ? '#1E3A8A' : 'transparent', color: viewFilter === type ? '#FFF' : '#64748B', transition: 'all 0.2s' }}>{type}</button>
                ))}
              </div>
            </div>

            {loading ? <p style={{ padding: '20px', color: '#64748B' }}>Loading database contents...</p> : (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', fontSize: '14px' }}>
                <thead>
                  <tr style={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>
                    <th style={{ borderBottom: '2px solid #F1F5F9', color: '#64748B', padding: '12px 10px', textAlign: 'left' }}>Identification</th>
                    <th style={{ borderBottom: '2px solid #F1F5F9', color: '#64748B', padding: '12px 10px', textAlign: 'left' }}>Stream</th>
                    <th style={{ borderBottom: '2px solid #F1F5F9', color: '#64748B', padding: '12px 10px', textAlign: 'left' }}>Lifecycle Status</th>
                    <th style={{ borderBottom: '2px solid #F1F5F9', color: '#64748B', padding: '12px 10px', textAlign: 'left' }}>Assignment</th>
                    <th style={{ borderBottom: '2px solid #F1F5F9', color: '#64748B', padding: '12px 10px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#94A3B8' }}>No records logged inside this node parameters.</td></tr>
                  ) : filtered.map(t => (
                    <tr key={t._id} style={{ transition: 'background 0.15s' }}>
                      <td style={{ borderBottom: '1px solid #F1F5F9', padding: '14px 10px' }}><strong style={{ color: '#0F172A' }}>{t.moduleName}</strong><br/><small style={{ color: '#94A3B8', fontSize: '11px' }}>ID: {t._id.slice(-6).toUpperCase()}</small></td>
                      <td style={{ borderBottom: '1px solid #F1F5F9', padding: '14px 10px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, background: t.category === 'Retail' ? '#E0F2FE' : '#F1F5F9', color: t.category === 'Retail' ? '#0369A1' : '#475569' }}>{t.category}</span>
                      </td>
                      <td style={{ borderBottom: '1px solid #F1F5F9', padding: '14px 10px' }}>
                        <select value={t.workflowStatus} onChange={e => handleStatusChange(t._id, e.target.value)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', background: '#FFF', fontWeight: 500, color: '#334155', outline: 'none' }}>
                          <option value="Design Task New">Design Task New</option>
                          <option value="Design Planned">Design Planned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Design Completed">Design Completed</option>
                          <option value="HOD Reviewed">HOD Reviewed</option>
                          <option value="Sales Review">Sales Review</option>
                          <option value="Rework/Error">Rework/Error</option>
                        </select>
                      </td>
                      <td style={{ borderBottom: '1px solid #F1F5F9', padding: '14px 10px', color: '#475569', fontWeight: 500 }}><User size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> {t.assignedTo}</td>
                      <td style={{ borderBottom: '1px solid #F1F5F9', padding: '14px 10px', textAlign: 'right' }}>
                        <button onClick={() => setSelectedTaskId(t._id)} style={{ background: 'none', border: '1px solid #1E3A8A', color: '#1E3A8A', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <MessageSquare size={13} /> Chatter ({t.chatter?.length || 0})
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* CHATTER STREAM PANEL */}
          {activeTask && (
            <div style={{ background: '#FFF', padding: '25px', borderRadius: '20px', border: '1px solid #CBD5E1', borderTop: '4px solid #EA580C', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px', marginBottom: '15px' }}>
                <h4 style={{ margin: 0, color: '#0F172A', fontSize: '15px', fontWeight: 700 }}>💬 Chatter Stream: <span style={{ color: '#1E3A8A' }}>{activeTask.moduleName}</span></h4>
                <button onClick={() => setSelectedTaskId(null)} style={{ border: 'none', background: 'transparent', color: '#EF4444', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>Close Feed</button>
              </div>
              <div style={{ background: '#F8FAFC', padding: '15px', borderRadius: '12px', maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeTask.chatter?.length === 0 ? <p style={{ fontSize: '13px', color: '#94A3B8', textAlign: 'center', margin: '10px 0' }}>No local designer notes logged.</p> : activeTask.chatter?.map((msg, i) => (
                  <div key={i} style={{ background: '#FFF', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><strong style={{ color: '#1E3A8A' }}>{msg.sender}</strong><small style={{ color: '#94A3B8' }}>{new Date(msg.createdAt).toLocaleTimeString()}</small></div>
                    <p style={{ margin: 0, color: '#334155', fontSize: '13px', lineHeight: '1.4' }}>{msg.message}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <input type="text" placeholder="Your Name" value={chat.sender} onChange={e => setChat({...chat, sender: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', width: '130px' }} />
                <input type="text" placeholder="Type design log updates..." value={chat.message} onChange={e => setChat({...chat, message: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }} />
                <button type="submit" style={{ background: '#EA580C', color: '#FFF', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}><Send size={12} /> Send</button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;