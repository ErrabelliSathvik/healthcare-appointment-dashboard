import { useMemo, useState } from "react";
import {
  Activity, CalendarDays, CheckCircle2, Clock3, LayoutDashboard,
  Menu, Plus, Search, Stethoscope, Users, X, ChevronDown
} from "lucide-react";

const initialAppointments = [
  { id: 1001, patient: "Aarav Sharma", doctor: "Dr. Meera Rao", department: "Cardiology", date: "2026-11-06", time: "09:30", status: "Confirmed", reason: "Follow-up consultation" },
  { id: 1002, patient: "Diya Reddy", doctor: "Dr. Arjun Kumar", department: "Dermatology", date: "2026-11-06", time: "10:15", status: "Pending", reason: "Skin consultation" },
  { id: 1003, patient: "Kabir Patel", doctor: "Dr. Meera Rao", department: "Cardiology", date: "2026-11-06", time: "11:00", status: "Completed", reason: "Routine check-up" },
  { id: 1004, patient: "Ananya Iyer", doctor: "Dr. Sana Ali", department: "Neurology", date: "2026-11-07", time: "12:30", status: "Confirmed", reason: "Headache assessment" },
  { id: 1005, patient: "Ishaan Verma", doctor: "Dr. Arjun Kumar", department: "Dermatology", date: "2026-11-07", time: "14:00", status: "Cancelled", reason: "Rash review" },
  { id: 1006, patient: "Mira Nair", doctor: "Dr. Sana Ali", department: "Neurology", date: "2026-11-08", time: "15:15", status: "Pending", reason: "Neurological review" }
];

const doctors = ["Dr. Meera Rao", "Dr. Arjun Kumar", "Dr. Sana Ali"];
const today = "2026-11-06";

function readSaved() {
  try {
    const saved = localStorage.getItem("caredesk-appointments");
    return saved ? JSON.parse(saved) : initialAppointments;
  } catch {
    return initialAppointments;
  }
}

function StatCard({ icon: Icon, label, value, note }) {
  return <article className="stat-card">
    <div className="stat-top"><span>{label}</span><span className="stat-icon"><Icon size={18}/></span></div>
    <div className="stat-value">{value}</div>
    <div className="stat-note">{note}</div>
  </article>;
}

function App() {
  const [appointments, setAppointments] = useState(readSaved);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [form, setForm] = useState({
    patient: "", doctor: doctors[0], department: "Cardiology",
    date: today, time: "09:00", reason: ""
  });
  const [error, setError] = useState("");

  const save = (next) => {
    setAppointments(next);
    localStorage.setItem("caredesk-appointments", JSON.stringify(next));
  };

  const filtered = useMemo(() => appointments.filter((a) => {
    const text = `${a.patient} ${a.doctor} ${a.department} ${a.reason}`.toLowerCase();
    return text.includes(query.toLowerCase()) &&
      (statusFilter === "All" || a.status === statusFilter);
  }), [appointments, query, statusFilter]);

  const stats = {
    total: appointments.length,
    today: appointments.filter(a => a.date === today && a.status !== "Cancelled").length,
    confirmed: appointments.filter(a => a.status === "Confirmed").length,
    pending: appointments.filter(a => a.status === "Pending").length
  };

  function updateStatus(id, status) {
    save(appointments.map(a => a.id === id ? { ...a, status } : a));
  }

  function addAppointment(e) {
    e.preventDefault();
    if (!form.patient.trim() || !form.reason.trim()) {
      setError("Enter the patient name and appointment reason.");
      return;
    }
    if (new Date(`${form.date}T${form.time}`) < new Date("2026-11-05T00:00")) {
      setError("Choose a valid appointment date and time.");
      return;
    }
    const next = [{ ...form, id: Date.now(), status: "Pending" }, ...appointments];
    save(next);
    setShowForm(false);
    setError("");
    setForm({ patient: "", doctor: doctors[0], department: "Cardiology", date: today, time: "09:00", reason: "" });
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
      <div className="brand"><div className="brand-mark"><Activity size={21}/></div><span>CareDesk</span></div>
      <div className="nav-label">WORKSPACE</div>
      <button className="nav-item active"><LayoutDashboard size={18}/> Overview</button>
      <button className="nav-item" onClick={() => setStatusFilter("All")}><CalendarDays size={18}/> Appointments</button>
      <button className="nav-item" onClick={() => setQuery("")}><Users size={18}/> Patients</button>
      <button className="nav-item"><Stethoscope size={18}/> Physicians</button>
      <div className="sidebar-bottom"><div className="avatar">CD</div><div><strong>Clinic Admin</strong><small>Demo workspace</small></div></div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle menu"><Menu/></button>
        <div><div className="eyebrow">WORKSPACE / OVERVIEW</div><h1>Appointment overview</h1></div>
        <div className="topbar-right"><span className="today-label"><CalendarDays size={15}/> Friday, 6 Nov 2026</span><div className="avatar admin-avatar">CD</div></div>
      </header>

      <section className="welcome-row">
        <div><h2>Good morning, Admin</h2><p>Here’s what’s happening at your clinic today.</p></div>
        <button className="primary-btn" onClick={() => setShowForm(true)}><Plus size={17}/> New appointment</button>
      </section>

      <section className="stats-grid">
        <StatCard icon={CalendarDays} label="Total appointments" value={stats.total} note="All scheduled records"/>
        <StatCard icon={Clock3} label="Today's appointments" value={stats.today} note="Excluding cancelled"/>
        <StatCard icon={CheckCircle2} label="Confirmed" value={stats.confirmed} note="Ready for consultation"/>
        <StatCard icon={Users} label="Awaiting confirmation" value={stats.pending} note="Pending review"/>
      </section>

      <section className="panel">
        <div className="panel-heading"><div><h2>Appointments</h2><p>Search, review, and update appointment records.</p></div><span className="record-count">{filtered.length} records</span></div>
        <div className="toolbar">
          <div className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search patient, physician, department..." /></div>
          <div className="filter-wrap"><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} aria-label="Filter by status"><option>All</option><option>Confirmed</option><option>Pending</option><option>Completed</option><option>Cancelled</option></select><ChevronDown size={15}/></div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>PATIENT</th><th>PHYSICIAN</th><th>DATE & TIME</th><th>DEPARTMENT</th><th>STATUS</th><th>ACTION</th></tr></thead>
            <tbody>
              {filtered.map(a => <tr key={a.id}>
                <td><strong>{a.patient}</strong><small className="subline">ID #{a.id}</small></td>
                <td>{a.doctor}</td>
                <td>{new Date(`${a.date}T${a.time}:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}<small className="subline">{a.time}</small></td>
                <td>{a.department}</td>
                <td><span className={`status ${a.status.toLowerCase()}`}>{a.status}</span></td>
                <td><select className="action-select" value={a.status} onChange={e => updateStatus(a.id, e.target.value)} aria-label={`Update ${a.patient} status`}>
                  <option>Pending</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option>
                </select></td>
              </tr>)}
              {filtered.length === 0 && <tr><td colSpan="6" className="empty">No appointments match your search.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="panel-footer">Demo data only · Changes are saved in this browser using local storage.</div>
      </section>
      <footer>CareDesk UI demo · Not for use with real patient or medical information.</footer>
    </main>

    {showForm && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-head"><div><h2 id="modal-title">Create appointment</h2><p>Add a new appointment record.</p></div><button className="icon-btn" onClick={() => setShowForm(false)} aria-label="Close"><X/></button></div>
        <form onSubmit={addAppointment}>
          <label>Patient name<input value={form.patient} onChange={e => setForm({...form, patient: e.target.value})} placeholder="Enter patient name" /></label>
          <div className="form-grid">
            <label>Physician<select value={form.doctor} onChange={e => setForm({...form, doctor: e.target.value})}>{doctors.map(d => <option key={d}>{d}</option>)}</select></label>
            <label>Department<select value={form.department} onChange={e => setForm({...form, department: e.target.value})}><option>Cardiology</option><option>Dermatology</option><option>Neurology</option><option>General Medicine</option></select></label>
            <label>Date<input type="date" min="2026-11-05" value={form.date} onChange={e => setForm({...form, date: e.target.value})}/></label>
            <label>Time<input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})}/></label>
          </div>
          <label>Appointment reason<input value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} placeholder="e.g. Follow-up consultation" /></label>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-btn" type="submit">Save appointment</button></div>
        </form>
      </section>
    </div>}
  </div>;
}

export default App;