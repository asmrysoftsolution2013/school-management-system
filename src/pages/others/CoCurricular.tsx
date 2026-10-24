import { useEffect, useState, type FormEvent } from "react";
import PageHeader from "../../components/PageHeader";
import { useStudents, uid } from "../../store";
import { Plus, Trash2 } from "lucide-react";
import { todayISO, fmtDate } from "../../utils";

interface Entry { id: string; studentId: string; activity: string; achievement: string; date: string; grade: string; }
const KEY = "sms:cocurricular";

export default function CoCurricular() {
  const [students] = useStudents();
  const [list, setList] = useState<Entry[]>([]);
  const [form, setForm] = useState<Entry>({ id: "", studentId: students[0]?.id ?? "", activity: "Sports", achievement: "", date: todayISO(), grade: "A" });

  useEffect(() => { try { setList(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { setList([]); } }, []);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(list)); }, [list]);

  const add = (e: FormEvent) => { e.preventDefault(); setList([...list, { ...form, id: uid() }]); setForm({ ...form, achievement: "" }); };

  return (
    <div>
      <PageHeader title="Co-Curricular Performance" subtitle="Record sports, debate, art and other achievements." />
      <form onSubmit={add} className="card mb-4">
        <div className="card-body grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <div className="md:col-span-2"><label className="label">Student</label><select className="input" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>{students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          <div><label className="label">Activity</label><input className="input" value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })} /></div>
          <div><label className="label">Date</label><input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          <div><label className="label">Grade</label><select className="input" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })}><option>A+</option><option>A</option><option>B</option><option>C</option><option>Participant</option></select></div>
          <div><button className="btn-primary w-full justify-center"><Plus className="w-4 h-4" /> Add</button></div>
          <div className="md:col-span-6"><label className="label">Achievement / Remarks</label><input className="input" value={form.achievement} onChange={(e) => setForm({ ...form, achievement: e.target.value })} /></div>
        </div>
      </form>
      <div className="card">
        <table className="table">
          <thead><tr><th>Date</th><th>Student</th><th>Activity</th><th>Achievement</th><th>Grade</th><th></th></tr></thead>
          <tbody>
            {list.slice().reverse().map((e) => (
              <tr key={e.id}><td>{fmtDate(e.date)}</td><td>{students.find((s) => s.id === e.studentId)?.name}</td><td>{e.activity}</td><td>{e.achievement}</td><td>{e.grade}</td><td><button className="btn-ghost text-rose-600" onClick={() => setList(list.filter((x) => x.id !== e.id))}><Trash2 className="w-4 h-4" /></button></td></tr>
            ))}
            {!list.length && <tr><td colSpan={6} className="text-center text-slate-500 py-6">No entries yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
