import { useState, type FormEvent } from "react";
import PageHeader from "../../components/PageHeader";
import { useSubjects, uid } from "../../store";
import { CLASSES } from "../../utils";
import type { Subject } from "../../types";
import { Plus, Trash2 } from "lucide-react";

export default function Subjects() {
  const [subjects, setSubjects] = useSubjects();
  const [cls, setCls] = useState("5");
  const [form, setForm] = useState<Omit<Subject, "id" | "className">>({ name: "", maxMarks: 100, passingMarks: 33 });

  const list = subjects.filter((s) => s.className === cls);

  const add = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setSubjects([...subjects, { id: uid(), className: cls, ...form }]);
    setForm({ name: "", maxMarks: 100, passingMarks: 33 });
  };

  const del = (id: string) => setSubjects(subjects.filter((s) => s.id !== id));

  return (
    <div>
      <PageHeader title="Subjects & Maximum Marks" subtitle="Define subjects per class with max and passing marks." />
      <div className="card mb-5">
        <div className="card-body">
          <label className="label">Class</label>
          <select className="input w-40" value={cls} onChange={(e) => setCls(e.target.value)}>
            {CLASSES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <form onSubmit={add} className="card mb-5">
        <div className="card-body grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div><label className="label">Subject Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Max Marks</label><input type="number" className="input" value={form.maxMarks} onChange={(e) => setForm({ ...form, maxMarks: Number(e.target.value) })} /></div>
          <div><label className="label">Passing Marks</label><input type="number" className="input" value={form.passingMarks} onChange={(e) => setForm({ ...form, passingMarks: Number(e.target.value) })} /></div>
          <button className="btn-primary"><Plus className="w-4 h-4" /> Add Subject</button>
        </div>
      </form>

      <div className="card">
        <table className="table">
          <thead><tr><th>Subject</th><th>Max</th><th>Passing</th><th></th></tr></thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td><td>{s.maxMarks}</td><td>{s.passingMarks}</td>
                <td><button className="btn-ghost text-rose-600" onClick={() => del(s.id)}><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan={4} className="text-center text-slate-500 py-6">No subjects for Class {cls}.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
