import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useSessions, useSettings, useStudents } from "../../store";
import { Save, CalendarPlus, ArrowRight } from "lucide-react";

export default function NewSession() {
  const [sessions, setSessions] = useSessions();
  const [settings, setSettings] = useSettings();
  const [students, setStudents] = useStudents();
  const [draft, setDraft] = useState("");

  const promote = () => {
    if (!confirm("Promote all active students to the next class and set the new session?")) return;
    setStudents(students.map((s) => {
      if (s.status !== "Active") return s;
      const next = s.className === "10" ? "10" : /^\d+$/.test(s.className) ? String(Number(s.className) + 1) : s.className;
      return { ...s, className: next };
    }));
    if (draft && !sessions.includes(draft)) setSessions([...sessions, draft]);
    if (draft) setSettings({ ...settings, session: draft });
    alert("Promotion complete.");
  };

  return (
    <div>
      <PageHeader title="Make New Session" subtitle="Create a new academic session and promote students." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card">
          <div className="card-header"><h3 className="font-semibold">New Session</h3></div>
          <div className="card-body space-y-3">
            <div><label className="label">Session Name (e.g. 2026-2027)</label><input className="input" value={draft} onChange={(e) => setDraft(e.target.value)} /></div>
            <button className="btn-primary" onClick={() => { if (draft && !sessions.includes(draft)) { setSessions([...sessions, draft]); setDraft(""); } }}><CalendarPlus className="w-4 h-4" /> Add</button>
            <div className="pt-3 border-t">
              <label className="label">Active Session</label>
              <select className="input" value={settings.session} onChange={(e) => setSettings({ ...settings, session: e.target.value })}>
                {sessions.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <button className="btn-primary w-full justify-center" onClick={() => alert("Active session saved.")}><Save className="w-4 h-4" /> Save</button>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3 className="font-semibold">Promote Students</h3></div>
          <div className="card-body text-sm space-y-3">
            <p>This will advance every active student by one class (1→2, 2→3 … Class 10 stays). It cannot be undone, so take a backup first.</p>
            <button className="btn-danger" onClick={promote}><ArrowRight className="w-4 h-4" /> Promote All Active Students</button>
          </div>
        </div>
      </div>
    </div>
  );
}
