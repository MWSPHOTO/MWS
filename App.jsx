import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wjebqtzjcaptyekflljg.supabase.co";
const SUPABASE_KEY = "sb_publishable_RSjUJLmDivRzXXYrif63Vw_qIu3i0ht";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================
// STYLES
// ============================================================
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0d0f14; --surface: #151821; --surface2: #1c2030; --border: #252a3a;
    --accent: #4f8ef7; --accent2: #7c5cfc; --green: #22c77a; --yellow: #f5a623;
    --red: #f04438; --text: #e8eaf0; --text2: #8892a4; --text3: #545e72;
    --radius: 12px; --radius-sm: 8px;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
  .app { display: flex; height: 100vh; overflow: hidden; }
  .sidebar { width: 220px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; overflow-y: auto; }
  .sidebar-logo { padding: 20px 16px 16px; font-size: 18px; font-weight: 800; color: var(--accent); border-bottom: 1px solid var(--border); }
  .sidebar-logo span { color: var(--text2); font-weight: 400; font-size: 12px; display: block; margin-top: 2px; }
  .sidebar-user { margin: 12px; background: var(--surface2); border-radius: var(--radius-sm); padding: 10px 12px; display: flex; align-items: center; gap: 10px; }
  .avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .sidebar-user-info { flex: 1; min-width: 0; }
  .sidebar-user-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .role-badge { font-size: 10px; color: var(--accent); background: rgba(79,142,247,0.15); padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 3px; }
  .sidebar-nav { padding: 8px; flex: 1; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: var(--radius-sm); cursor: pointer; font-size: 13px; color: var(--text2); transition: all 0.15s; margin-bottom: 2px; }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(79,142,247,0.15); color: var(--accent); font-weight: 600; }
  .nav-item .badge { margin-left: auto; background: var(--red); color: #fff; font-size: 10px; padding: 1px 6px; border-radius: 10px; font-weight: 700; }
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .topbar { height: 56px; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 20px; gap: 12px; flex-shrink: 0; }
  .topbar-title { font-size: 16px; font-weight: 700; flex: 1; }
  .content { flex: 1; overflow-y: auto; padding: 20px; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; }
  .card-title { font-size: 13px; font-weight: 600; color: var(--text2); margin-bottom: 12px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 20px; }
  .stat-label { font-size: 12px; color: var(--text2); margin-bottom: 6px; }
  .stat-value { font-size: 28px; font-weight: 800; line-height: 1; }
  .stat-sub { font-size: 11px; color: var(--text3); margin-top: 4px; }
  .stat-card.green .stat-value { color: var(--green); }
  .stat-card.yellow .stat-value { color: var(--yellow); }
  .stat-card.red .stat-value { color: var(--red); }
  .stat-card.accent .stat-value { color: var(--accent); }
  .status { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; padding: 3px 8px; border-radius: 6px; font-weight: 600; }
  .status::before { content:''; width:6px; height:6px; border-radius:50%; }
  .status.green { background: rgba(34,199,122,0.15); color: var(--green); } .status.green::before { background: var(--green); }
  .status.yellow { background: rgba(245,166,35,0.15); color: var(--yellow); } .status.yellow::before { background: var(--yellow); }
  .status.red { background: rgba(240,68,56,0.15); color: var(--red); } .status.red::before { background: var(--red); }
  .status.blue { background: rgba(79,142,247,0.15); color: var(--accent); } .status.blue::before { background: var(--accent); }
  .table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .table th { padding: 10px 12px; text-align: left; color: var(--text3); font-weight: 600; font-size: 11px; border-bottom: 1px solid var(--border); text-transform: uppercase; }
  .table td { padding: 12px; border-bottom: 1px solid var(--border); }
  .table tr:last-child td { border-bottom: none; }
  .table tr:hover td { background: var(--surface2); }
  .event-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border); margin-bottom: 8px; background: var(--surface2); transition: all 0.15s; }
  .event-item:hover { border-color: var(--accent); }
  .event-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .event-info { flex: 1; }
  .event-title { font-size: 13px; font-weight: 600; }
  .event-meta { font-size: 11px; color: var(--text2); margin-top: 3px; }
  .alert-item { display: flex; gap: 12px; padding: 12px; border-radius: var(--radius-sm); margin-bottom: 8px; border-left: 3px solid; }
  .alert-item.danger { background: rgba(240,68,56,0.08); border-color: var(--red); }
  .alert-item.warning { background: rgba(245,166,35,0.08); border-color: var(--yellow); }
  .alert-item.info { background: rgba(79,142,247,0.08); border-color: var(--accent); }
  .form-group { margin-bottom: 14px; }
  .form-label { font-size: 12px; color: var(--text2); margin-bottom: 6px; display: block; font-weight: 600; }
  .form-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 12px; color: var(--text); font-size: 13px; font-family: inherit; outline: none; transition: border-color 0.15s; }
  .form-input:focus { border-color: var(--accent); }
  .btn { padding: 9px 18px; border-radius: var(--radius-sm); font-size: 13px; font-family: inherit; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; display: inline-flex; align-items: center; gap: 6px; }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { opacity: 0.9; }
  .btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
  .btn-danger { background: rgba(240,68,56,0.15); color: var(--red); border: 1px solid var(--red); }
  .btn-success { background: rgba(34,199,122,0.15); color: var(--green); border: 1px solid var(--green); }
  .btn-sm { padding: 5px 12px; font-size: 11px; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; width: 100%; max-width: 460px; max-height: 90vh; overflow-y: auto; }
  .modal-title { font-size: 16px; font-weight: 700; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
  .modal-close { cursor: pointer; color: var(--text3); font-size: 22px; line-height: 1; }
  .flex { display: flex; } .items-center { align-items: center; } .justify-between { justify-content: space-between; }
  .gap-8 { gap: 8px; } .gap-12 { gap: 12px; }
  .mb-8 { margin-bottom: 8px; } .mb-12 { margin-bottom: 12px; } .mb-16 { margin-bottom: 16px; }
  .text-sm { font-size: 12px; } .text-xs { font-size: 11px; }
  .text-muted { color: var(--text2); } .text-accent { color: var(--accent); } .fw-700 { font-weight: 700; }
  .w-full { width: 100%; }
  .kit-card { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; margin-bottom: 10px; }
  .kit-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .kit-name { font-size: 13px; font-weight: 700; }
  .kit-items { display: flex; flex-wrap: wrap; gap: 5px; }
  .kit-tag { background: var(--surface); border: 1px solid var(--border); font-size: 11px; padding: 3px 8px; border-radius: 5px; color: var(--text2); }
  .error-box { background: rgba(240,68,56,0.1); border: 1px solid var(--red); border-radius: var(--radius-sm); padding: 12px; color: var(--red); font-size: 13px; margin-bottom: 12px; }
  .success-box { background: rgba(34,199,122,0.1); border: 1px solid var(--green); border-radius: var(--radius-sm); padding: 12px; color: var(--green); font-size: 13px; margin-bottom: 12px; }
  .loading { display: flex; align-items: center; justify-content: center; padding: 40px; color: var(--text2); font-size: 14px; gap: 10px; }
  .spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .login-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); }
  .login-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 40px; width: 100%; max-width: 400px; }
  .login-logo { font-size: 26px; font-weight: 800; color: var(--accent); margin-bottom: 6px; }
  .login-sub { color: var(--text2); font-size: 13px; margin-bottom: 28px; }
  .tabs { display: flex; gap: 4px; background: var(--surface2); padding: 4px; border-radius: var(--radius-sm); margin-bottom: 20px; }
  .tab { flex: 1; padding: 7px; text-align: center; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; color: var(--text2); transition: all 0.15s; }
  .tab.active { background: var(--accent); color: #fff; }
  .divider { border: none; border-top: 1px solid var(--border); margin: 16px 0; }
  .scrollbar::-webkit-scrollbar { width: 4px; }
  .scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  .chat-ch { padding: 8px 10px; border-radius: var(--radius-sm); cursor: pointer; font-size: 13px; color: var(--text2); display: flex; justify-content: space-between; align-items: center; }
  .chat-ch:hover, .chat-ch.active { background: var(--surface2); color: var(--text); }
  .chat-msg { display: flex; gap: 10px; margin-bottom: 14px; }
  .chat-bubble { font-size: 13px; color: var(--text2); background: var(--surface2); padding: 8px 12px; border-radius: 0 var(--radius-sm) var(--radius-sm) var(--radius-sm); display: inline-block; }
  select.form-input { appearance: none; cursor: pointer; }
`;

// ============================================================
// AUTH / LOGIN
// ============================================================
function LoginScreen({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("photographer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill all fields"); return; }
    setLoading(true); setError("");
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); return; }
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
    onLogin({ ...data.user, ...profile });
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!name || !email || !password) { setError("Please fill all fields"); return; }
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.signUp({
      email, password,
      options: { data: { name, role, avatar: name.charAt(0).toUpperCase() } }
    });
    if (err) { setError(err.message); setLoading(false); return; }
    setSuccess("Account created! You can now sign in.");
    setTab("login"); setLoading(false);
  };

  return (
    <>
      <style>{css}</style>
      <div className="login-screen">
        <div className="login-card">
          <div className="login-logo">📸 PhotoOps</div>
          <div className="login-sub">Photography Operations Management</div>
          <div className="tabs">
            <div className={`tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Sign In</div>
            <div className={`tab ${tab === "signup" ? "active" : ""}`} onClick={() => setTab("signup")}>Sign Up</div>
          </div>
          {error && <div className="error-box">⚠️ {error}</div>}
          {success && <div className="success-box">✓ {success}</div>}
          {tab === "signup" && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && (tab === "login" ? handleLogin() : handleSignup())} />
          </div>
          {tab === "signup" && (
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-input" value={role} onChange={e => setRole(e.target.value)}>
                <option value="photographer">Photographer</option>
                <option value="manager">Manager</option>
                <option value="coordinator">Equipment Coordinator</option>
              </select>
            </div>
          )}
          <button className="btn btn-primary w-full" onClick={tab === "login" ? handleLogin : handleSignup} disabled={loading}>
            {loading ? "Please wait..." : tab === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>
      </div>
    </>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
function Dashboard({ user }) {
  const [stats, setStats] = useState({ events: 0, ready: 0, missing: 0, gear: 0 });
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: evs }, { data: eq }, { data: als }] = await Promise.all([
        supabase.from("events").select("*, profiles(name)").order("event_date"),
        supabase.from("equipment").select("status"),
        supabase.from("alerts").select("*").eq("resolved", false).order("created_at", { ascending: false }).limit(4),
      ]);
      setEvents(evs || []);
      setAlerts(als || []);
      const available = (eq || []).filter(e => e.status === "available").length;
      setStats({
        events: (evs || []).length,
        ready: (evs || []).filter(e => e.status === "ready").length,
        missing: (evs || []).filter(e => e.status === "missing").length,
        gear: available,
      });
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="loading"><div className="spinner" />Loading...</div>;

  const myEvents = user.role === "photographer" ? events.filter(e => e.photographer_id === user.id) : events;

  return (
    <div>
      <div className="grid-4 mb-16">
        <div className="stat-card green"><div className="stat-label">Ready Events</div><div className="stat-value">{stats.ready}</div><div className="stat-sub">of {stats.events} total</div></div>
        <div className="stat-card yellow"><div className="stat-label">Incomplete</div><div className="stat-value">{stats.events - stats.ready - stats.missing}</div><div className="stat-sub">needs attention</div></div>
        <div className="stat-card red"><div className="stat-label">Missing Kit</div><div className="stat-value">{stats.missing}</div><div className="stat-sub">urgent</div></div>
        <div className="stat-card accent"><div className="stat-label">Gear Available</div><div className="stat-value">{stats.gear}</div><div className="stat-sub">items ready</div></div>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">📅 {user.role === "photographer" ? "My Events" : "Upcoming Events"}</div>
          {myEvents.length === 0 && <div className="text-muted text-sm">No events found</div>}
          {myEvents.slice(0, 5).map(ev => (
            <div key={ev.id} className="event-item">
              <div className="event-dot" style={{ background: ev.status === "ready" ? "var(--green)" : ev.status === "incomplete" ? "var(--yellow)" : "var(--red)" }} />
              <div className="event-info">
                <div className="event-title">{ev.title}</div>
                <div className="event-meta">{new Date(ev.event_date).toLocaleDateString()} · {ev.profiles?.name || "No photographer"}</div>
              </div>
              <span className={`status ${ev.status === "ready" ? "green" : ev.status === "incomplete" ? "yellow" : "red"}`}>
                {ev.status}
              </span>
            </div>
          ))}
        </div>
        {user.role !== "photographer" && (
          <div className="card">
            <div className="card-title">🚨 Active Alerts</div>
            {alerts.length === 0 && <div className="text-muted text-sm">No active alerts</div>}
            {alerts.map(a => (
              <div key={a.id} className={`alert-item ${a.type}`}>
                <span style={{ fontSize: 18 }}>{a.type === "danger" ? "🔴" : a.type === "warning" ? "🟡" : "🔵"}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{a.title}</div>
                  <div className="text-sm text-muted">{a.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// EQUIPMENT PAGE
// ============================================================
function EquipmentPage({ user }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", type: "camera", serial: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const canEdit = user.role === "coordinator" || user.role === "manager";

  const load = useCallback(async () => {
    const q = supabase.from("equipment").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q.eq("type", filter);
    const { data } = await q;
    setItems(data || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.name || !form.serial) { setError("Name and serial are required"); return; }
    setSaving(true); setError("");
    const { error: err } = await supabase.from("equipment").insert({ ...form });
    if (err) { setError(err.message); setSaving(false); return; }
    setShowModal(false); setForm({ name: "", type: "camera", serial: "", notes: "" }); load();
    setSaving(false);
  };

  const updateStatus = async (id, status) => {
    await supabase.from("equipment").update({ status }).eq("id", id);
    load();
  };

  const types = ["all", "camera", "flash", "lens", "tripod", "stand", "other"];

  return (
    <div>
      <div className="flex items-center gap-8 mb-16" style={{ flexWrap: "wrap" }}>
        {types.map(t => (
          <button key={t} className="btn btn-secondary btn-sm" style={filter === t ? { borderColor: "var(--accent)", color: "var(--accent)" } : {}} onClick={() => setFilter(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        {canEdit && <button className="btn btn-primary btn-sm" style={{ marginLeft: "auto" }} onClick={() => setShowModal(true)}>+ Add Item</button>}
      </div>

      {loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
        <div className="card">
          <table className="table">
            <thead><tr><th>Name</th><th>Type</th><th>Serial</th><th>Status</th>{canEdit && <th>Action</th>}</tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td className="fw-700">{item.name}</td>
                  <td className="text-muted" style={{ textTransform: "capitalize" }}>{item.type}</td>
                  <td><code style={{ fontSize: 11, background: "var(--surface2)", padding: "2px 6px", borderRadius: 4 }}>{item.serial}</code></td>
                  <td><span className={`status ${item.status === "available" ? "green" : item.status === "in-use" ? "blue" : "yellow"}`}>{item.status}</span></td>
                  {canEdit && (
                    <td>
                      <select className="form-input" style={{ width: "auto", padding: "4px 8px", fontSize: 11 }} value={item.status} onChange={e => updateStatus(item.id, e.target.value)}>
                        <option value="available">Available</option>
                        <option value="in-use">In Use</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--text3)", padding: 24 }}>No equipment found. Add your first item!</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Add Equipment <span className="modal-close" onClick={() => setShowModal(false)}>×</span></div>
            {error && <div className="error-box">{error}</div>}
            <div className="form-group"><label className="form-label">Name</label><input className="form-input" placeholder="e.g. Canon EOS R5" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Type</label>
              <select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                {["camera","flash","lens","tripod","stand","other"].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Serial Number</label><input className="form-input" placeholder="CAM-001" value={form.serial} onChange={e => setForm({ ...form, serial: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Notes (optional)</label><input className="form-input" placeholder="Any notes..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
            <button className="btn btn-primary w-full" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// EVENTS PAGE
// ============================================================
function EventsPage({ user }) {
  const [events, setEvents] = useState([]);
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", event_date: "", type: "school", notes: "", photographer_id: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const canEdit = user.role === "coordinator" || user.role === "manager";

  const load = useCallback(async () => {
    const [{ data: evs }, { data: ph }] = await Promise.all([
      supabase.from("events").select("*, profiles(name)").order("event_date"),
      supabase.from("profiles").select("id, name").eq("role", "photographer"),
    ]);
    setEvents(evs || []);
    setPhotographers(ph || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.title || !form.event_date) { setError("Title and date are required"); return; }
    setSaving(true); setError("");
    const payload = { ...form, photographer_id: form.photographer_id || null, status: form.photographer_id ? "incomplete" : "missing" };
    const { error: err } = await supabase.from("events").insert(payload);
    if (err) { setError(err.message); setSaving(false); return; }
    setShowModal(false); setForm({ title: "", event_date: "", type: "school", notes: "", photographer_id: "" }); load();
    setSaving(false);
  };

  const myEvents = user.role === "photographer" ? events.filter(e => e.photographer_id === user.id) : events;

  return (
    <div>
      <div className="flex justify-between mb-16">
        <div className="text-muted text-sm" style={{ lineHeight: "36px" }}>{myEvents.length} events</div>
        {canEdit && <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Event</button>}
      </div>

      {loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
        <div className="card">
          {myEvents.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>No events yet. Add your first event!</div>}
          {myEvents.map(ev => (
            <div key={ev.id} className="event-item">
              <div className="event-dot" style={{ background: ev.status === "ready" ? "var(--green)" : ev.status === "incomplete" ? "var(--yellow)" : "var(--red)" }} />
              <div className="event-info">
                <div className="event-title">{ev.title}</div>
                <div className="event-meta">{new Date(ev.event_date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {ev.profiles?.name || <span style={{ color: "var(--red)" }}>No photographer</span>}</div>
              </div>
              <span className={`status ${ev.status === "ready" ? "green" : ev.status === "incomplete" ? "yellow" : "red"}`}>{ev.status}</span>
            </div>
          ))}
        </div>
      )}

      {showModal && canEdit && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">New Event <span className="modal-close" onClick={() => setShowModal(false)}>×</span></div>
            {error && <div className="error-box">{error}</div>}
            <div className="form-group"><label className="form-label">Title</label><input className="form-input" placeholder="Event name" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Date & Time</label><input className="form-input" type="datetime-local" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Type</label>
              <select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="school">School</option><option value="event">Event</option><option value="portrait">Portrait</option><option value="other">Other</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Assign Photographer</label>
              <select className="form-input" value={form.photographer_id} onChange={e => setForm({ ...form, photographer_id: e.target.value })}>
                <option value="">Unassigned</option>
                {photographers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Notes</label><textarea className="form-input" rows={2} placeholder="Optional notes..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ resize: "none" }} /></div>
            <button className="btn btn-primary w-full" onClick={save} disabled={saving}>{saving ? "Saving..." : "Create Event"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// REPORTS PAGE
// ============================================================
function ReportsPage({ user }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", photo_count: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const isManager = user.role !== "photographer";

  const load = useCallback(async () => {
    let q = supabase.from("reports").select("*, profiles(name)").order("created_at", { ascending: false });
    if (!isManager) q = q.eq("user_id", user.id);
    const { data } = await q;
    setReports(data || []);
    setLoading(false);
  }, [isManager, user.id]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    const { error } = await supabase.from("reports").insert({ title: form.title, photo_count: parseInt(form.photo_count) || 0, notes: form.notes, user_id: user.id });
    if (!error) { setShowModal(false); setForm({ title: "", photo_count: "", notes: "" }); load(); }
  };

  const approve = async (id, status) => {
    await supabase.from("reports").update({ status }).eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex justify-between mb-16">
        <div />
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Report</button>
      </div>
      {loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
        <div className="card">
          <table className="table">
            <thead><tr><th>Title</th>{isManager && <th>By</th>}<th>Date</th><th>Photos</th><th>Status</th>{isManager && <th>Action</th>}</tr></thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td className="fw-700">{r.title}</td>
                  {isManager && <td className="text-muted">{r.profiles?.name}</td>}
                  <td className="text-muted">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td>{r.photo_count}</td>
                  <td><span className={`status ${r.status === "approved" ? "green" : r.status === "rejected" ? "red" : "yellow"}`}>{r.status}</span></td>
                  {isManager && r.status === "submitted" && (
                    <td className="flex gap-8">
                      <button className="btn btn-success btn-sm" onClick={() => approve(r.id, "approved")}>✓</button>
                      <button className="btn btn-danger btn-sm" onClick={() => approve(r.id, "rejected")}>✗</button>
                    </td>
                  )}
                  {isManager && r.status !== "submitted" && <td />}
                </tr>
              ))}
              {reports.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text3)", padding: 24 }}>No reports yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">New Report <span className="modal-close" onClick={() => setShowModal(false)}>×</span></div>
            <div className="form-group"><label className="form-label">Title</label><input className="form-input" placeholder="e.g. School shoot report" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Photo Count</label><input className="form-input" type="number" placeholder="0" value={form.photo_count} onChange={e => setForm({ ...form, photo_count: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Notes</label><textarea className="form-input" rows={3} placeholder="Any notes or issues..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ resize: "none" }} /></div>
            <button className="btn btn-primary w-full" onClick={save} disabled={saving}>{saving ? "Saving..." : "Submit Report"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// EXPENSES PAGE
// ============================================================
function ExpensesPage({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", amount: "" });
  const isManager = user.role !== "photographer";

  const load = useCallback(async () => {
    let q = supabase.from("expenses").select("*, profiles(name)").order("created_at", { ascending: false });
    if (!isManager) q = q.eq("user_id", user.id);
    const { data } = await q;
    setExpenses(data || []);
    setLoading(false);
  }, [isManager, user.id]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    await supabase.from("expenses").insert({ title: form.title, amount: parseFloat(form.amount), user_id: user.id });
    setShowModal(false); setForm({ title: "", amount: "" }); load();
  };

  const approve = async (id, status) => {
    await supabase.from("expenses").update({ status }).eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex justify-between mb-16">
        <div />
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Expense</button>
      </div>
      {loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
        <div className="card">
          <table className="table">
            <thead><tr><th>Description</th>{isManager && <th>Staff</th>}<th>Amount</th><th>Date</th><th>Status</th>{isManager && <th>Action</th>}</tr></thead>
            <tbody>
              {expenses.map(ex => (
                <tr key={ex.id}>
                  <td className="fw-700">{ex.title}</td>
                  {isManager && <td className="text-muted">{ex.profiles?.name}</td>}
                  <td>${parseFloat(ex.amount).toFixed(2)}</td>
                  <td className="text-muted">{new Date(ex.created_at).toLocaleDateString()}</td>
                  <td><span className={`status ${ex.status === "approved" ? "green" : ex.status === "rejected" ? "red" : "yellow"}`}>{ex.status}</span></td>
                  {isManager && ex.status === "pending" && (
                    <td className="flex gap-8">
                      <button className="btn btn-success btn-sm" onClick={() => approve(ex.id, "approved")}>✓</button>
                      <button className="btn btn-danger btn-sm" onClick={() => approve(ex.id, "rejected")}>✗</button>
                    </td>
                  )}
                  {isManager && ex.status !== "pending" && <td />}
                </tr>
              ))}
              {expenses.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text3)", padding: 24 }}>No expenses yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">New Expense <span className="modal-close" onClick={() => setShowModal(false)}>×</span></div>
            <div className="form-group"><label className="form-label">Description</label><input className="form-input" placeholder="e.g. Transportation" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Amount ($)</label><input className="form-input" type="number" step="0.01" placeholder="0.00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
            <button className="btn btn-primary w-full" onClick={save}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CHAT PAGE
// ============================================================
function ChatPage({ user }) {
  const [channel, setChannel] = useState("general");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const channels = ["general", "equipment", "events"];

  const load = useCallback(async () => {
    const { data } = await supabase.from("messages").select("*, profiles(name, avatar)").eq("channel", channel).order("created_at").limit(50);
    setMessages(data || []);
  }, [channel]);

  useEffect(() => { load(); }, [load]);

  const send = async () => {
    if (!input.trim()) return;
    await supabase.from("messages").insert({ channel, user_id: user.id, text: input });
    setInput(""); load();
  };

  return (
    <div style={{ height: "calc(100vh - 56px - 40px)", display: "flex", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", background: "var(--surface)" }}>
      <div style={{ width: 170, borderRight: "1px solid var(--border)", padding: 12, flexShrink: 0 }}>
        <div className="text-xs text-muted mb-8" style={{ padding: "0 4px" }}>Channels</div>
        {channels.map(ch => (
          <div key={ch} className={`chat-ch ${channel === ch ? "active" : ""}`} onClick={() => setChannel(ch)}># {ch}</div>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: 14 }}># {channel}</div>
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {messages.map(msg => (
            <div key={msg.id} className="chat-msg">
              <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{msg.profiles?.avatar || "?"}</div>
              <div>
                <div className="flex gap-8 items-center mb-8">
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{msg.profiles?.name}</span>
                  <span className="text-xs text-muted">{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <div className="chat-bubble">{msg.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border)", display: "flex", gap: 10 }}>
          <input className="form-input" style={{ flex: 1 }} placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
          <button className="btn btn-primary" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ALERTS PAGE
// ============================================================
function AlertsPage({ user }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: "warning", title: "", message: "" });
  const canEdit = user.role !== "photographer";

  const load = async () => {
    const { data } = await supabase.from("alerts").select("*").order("created_at", { ascending: false });
    setAlerts(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resolve = async (id) => {
    await supabase.from("alerts").update({ resolved: true }).eq("id", id);
    load();
  };

  const save = async () => {
    await supabase.from("alerts").insert(form);
    setShowModal(false); setForm({ type: "warning", title: "", message: "" }); load();
  };

  const active = alerts.filter(a => !a.resolved);
  const resolved = alerts.filter(a => a.resolved);

  return (
    <div>
      <div className="grid-3 mb-16">
        <div className="stat-card red"><div className="stat-label">Critical</div><div className="stat-value">{active.filter(a => a.type === "danger").length}</div></div>
        <div className="stat-card yellow"><div className="stat-label">Warnings</div><div className="stat-value">{active.filter(a => a.type === "warning").length}</div></div>
        <div className="stat-card accent"><div className="stat-label">Info</div><div className="stat-value">{active.filter(a => a.type === "info").length}</div></div>
      </div>
      <div className="flex justify-between mb-12">
        <div className="card-title" style={{ marginBottom: 0 }}>Active Alerts ({active.length})</div>
        {canEdit && <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ New Alert</button>}
      </div>
      {loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
        <div className="card">
          {active.length === 0 && <div style={{ textAlign: "center", padding: 24, color: "var(--green)" }}>✓ No active alerts!</div>}
          {active.map(a => (
            <div key={a.id} className={`alert-item ${a.type}`}>
              <span style={{ fontSize: 18 }}>{a.type === "danger" ? "🔴" : a.type === "warning" ? "🟡" : "🔵"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{a.title}</div>
                <div className="text-sm text-muted">{a.message}</div>
              </div>
              {canEdit && <button className="btn btn-secondary btn-sm" onClick={() => resolve(a.id)}>Resolve</button>}
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">New Alert <span className="modal-close" onClick={() => setShowModal(false)}>×</span></div>
            <div className="form-group"><label className="form-label">Type</label>
              <select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="danger">🔴 Critical</option><option value="warning">🟡 Warning</option><option value="info">🔵 Info</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Title</label><input className="form-input" placeholder="Alert title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Message</label><textarea className="form-input" rows={2} placeholder="Details..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ resize: "none" }} /></div>
            <button className="btn btn-primary w-full" onClick={save}>Create Alert</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// GUIDE PAGE (static - no DB needed)
// ============================================================
function GuidePage() {
  const [selected, setSelected] = useState(0);
  const guides = [
    { title: "School Photography", icon: "🏫", camera: "ISO 400–800 · f/2.8 · 1/200s", flash: "TTL · FEC +0.3 · Softbox", lens: "24-70mm f/2.8", notes: "Prioritize natural light from windows. Use f/5.6 for groups. Watch for mixed lighting." },
    { title: "Studio Portrait", icon: "🎭", camera: "ISO 100 · f/5.6 · 1/160s", flash: "Manual · 1/4 power · 80×120 softbox", lens: "85mm f/1.8", notes: "Key light at 45°. Fill ratio 2:1. Use white or gray backdrop." },
    { title: "Outdoor Event", icon: "🎉", camera: "ISO 800–3200 · f/2.8 · 1/500s", flash: "HSS · Auto · Diffuser", lens: "70-200mm f/2.8", notes: "High shutter for action. Keep AF-C active. Always carry backup batteries." },
  ];
  const g = guides[selected];
  return (
    <div className="grid-2" style={{ alignItems: "start" }}>
      <div className="card">
        <div className="card-title">📚 Photography Guides</div>
        {guides.map((guide, i) => (
          <div key={i} className="event-item" style={{ cursor: "pointer", border: selected === i ? "1px solid var(--accent)" : undefined }} onClick={() => setSelected(i)}>
            <span style={{ fontSize: 22 }}>{guide.icon}</span>
            <div className="event-info"><div className="event-title">{guide.title}</div></div>
            {selected === i && <span style={{ color: "var(--accent)" }}>▶</span>}
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title">{g.icon} {g.title}</div>
        {[["📷 Camera", g.camera], ["⚡ Flash", g.flash], ["🔭 Lens", g.lens]].map(([label, val]) => (
          <div key={label} style={{ background: "var(--surface2)", borderRadius: "var(--radius-sm)", padding: "12px 14px", marginBottom: 8 }}>
            <div className="text-xs text-muted mb-8">{label}</div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{val}</div>
          </div>
        ))}
        <div style={{ background: "rgba(79,142,247,0.08)", border: "1px solid rgba(79,142,247,0.2)", borderRadius: "var(--radius-sm)", padding: "12px 14px", marginTop: 8 }}>
          <div className="text-xs text-muted mb-8">💡 Notes</div>
          <div style={{ fontSize: 13, lineHeight: 1.7 }}>{g.notes}</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TEAM PAGE (coordinator/manager only)
// ============================================================
function TeamPage({ user }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("profiles").select("*").order("name").then(({ data }) => {
      setMembers(data || []);
      setLoading(false);
    });
  }, []);

  const roleColors = { coordinator: "var(--accent)", manager: "var(--yellow)", photographer: "var(--green)" };

  return (
    <div className="card">
      {loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
        <table className="table">
          <thead><tr><th>Name</th><th>Role</th><th>Email</th></tr></thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id}>
                <td>
                  <div className="flex items-center gap-8">
                    <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{m.avatar || m.name?.charAt(0)}</div>
                    <span className="fw-700">{m.name}</span>
                  </div>
                </td>
                <td><span style={{ color: roleColors[m.role], fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>{m.role}</span></td>
                <td className="text-muted text-sm">{m.id === user.id ? "(You)" : ""}</td>
              </tr>
            ))}
            {members.length === 0 && <tr><td colSpan={3} style={{ textAlign: "center", color: "var(--text3)", padding: 24 }}>No team members yet</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        if (profile) setUser({ ...session.user, ...profile });
      }
      setCheckingAuth(false);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setPage("dashboard");
  };

  if (checkingAuth) return (
    <>
      <style>{css}</style>
      <div className="loading" style={{ minHeight: "100vh" }}><div className="spinner" /> Loading PhotoOps...</div>
    </>
  );

  if (!user) return <LoginScreen onLogin={setUser} />;

  const roleLabels = { coordinator: "Equipment Coordinator", manager: "Photo Manager", photographer: "Photographer" };

  const navItems = {
    coordinator: [
      { id: "dashboard", icon: "🏠", label: "Dashboard" },
      { id: "events", icon: "📅", label: "Events" },
      { id: "equipment", icon: "📦", label: "Equipment" },
      { id: "checkin", icon: "🔲", label: "Check In/Out" },
      { id: "alerts", icon: "🚨", label: "Alerts" },
      { id: "reports", icon: "📋", label: "Reports" },
      { id: "expenses", icon: "💰", label: "Expenses" },
      { id: "chat", icon: "💬", label: "Chat" },
      { id: "team", icon: "👥", label: "Team" },
      { id: "guide", icon: "📚", label: "Photo Guide" },
    ],
    manager: [
      { id: "dashboard", icon: "🏠", label: "Dashboard" },
      { id: "events", icon: "📅", label: "Events" },
      { id: "equipment", icon: "📦", label: "Equipment" },
      { id: "reports", icon: "📋", label: "Reports" },
      { id: "expenses", icon: "💰", label: "Expenses" },
      { id: "alerts", icon: "🚨", label: "Alerts" },
      { id: "chat", icon: "💬", label: "Chat" },
      { id: "team", icon: "👥", label: "Team" },
    ],
    photographer: [
      { id: "dashboard", icon: "🏠", label: "My Dashboard" },
      { id: "events", icon: "📅", label: "My Events" },
      { id: "guide", icon: "📚", label: "Photo Guide" },
      { id: "reports", icon: "📋", label: "My Reports" },
      { id: "expenses", icon: "💰", label: "My Expenses" },
      { id: "chat", icon: "💬", label: "Chat" },
    ],
  };

  const pageTitles = {
    dashboard: "Dashboard", events: "Events", equipment: "Equipment",
    checkin: "Check In / Check Out", alerts: "Alerts", reports: "Reports",
    expenses: "Expenses", chat: "Chat", team: "Team", guide: "Photography Guide",
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard user={user} />;
      case "events": return <EventsPage user={user} />;
      case "equipment": return <EquipmentPage user={user} />;
      case "alerts": return <AlertsPage user={user} />;
      case "reports": return <ReportsPage user={user} />;
      case "expenses": return <ExpensesPage user={user} />;
      case "chat": return <ChatPage user={user} />;
      case "team": return <TeamPage user={user} />;
      case "guide": return <GuidePage />;
      case "checkin": return (
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔲</div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>QR Scanner</div>
          <div className="text-muted">Scan equipment QR codes to check in/out gear. Use the mobile camera to scan.</div>
          <button className="btn btn-primary" style={{ marginTop: 20 }}>📷 Open Camera</button>
        </div>
      );
      default: return null;
    }
  };

  const nav = navItems[user.role] || navItems.photographer;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="sidebar scrollbar">
          <div className="sidebar-logo">📸 PhotoOps <span>Operations Management</span></div>
          <div className="sidebar-user">
            <div className="avatar">{user.avatar || user.name?.charAt(0)}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.name}</div>
              <span className="role-badge">{roleLabels[user.role]}</span>
            </div>
          </div>
          <nav className="sidebar-nav">
            {nav.map(item => (
              <div key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => setPage(item.id)}>
                <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </nav>
          <div style={{ padding: 12, borderTop: "1px solid var(--border)" }}>
            <div className="nav-item" onClick={handleLogout} style={{ color: "var(--red)" }}>
              <span style={{ fontSize: 16 }}>🚪</span> Sign Out
            </div>
          </div>
        </div>
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">{pageTitles[page]}</div>
            <div className="text-sm text-muted">{user.name}</div>
          </div>
          <div className="content scrollbar">{renderPage()}</div>
        </div>
      </div>
    </>
  );
}
