import { useState, type FormEvent } from "react";
import PageHeader from "../../components/PageHeader";
import { useLessonPlans, useStaff, uid } from "../../store";
import type { LessonPlan as LP } from "../../types";
import { CLASSES } from "../../utils";
import { Plus, Trash2, Printer } from "lucide-react";

const empty = (): LP => ({ id: "", className: "5", subject: "", week: "", topic: "", objectives: "", activities: "", resources: "" });

export default function LessonPlan() {
  const [plans, setPlans] = useLessonPlans();
  const [staff] = useStaff();
  const [form, setForm] = useState<LP>(empty());

  const add = (e: FormEvent) => { e.preventDefault(); setPlans([...plans, { ...form, id: uid() }]); setForm(empty()); };

  return (
    <div>
      <PageHeader title="Lesson Plan" subtitle="Weekly lesson plans by teacher and subject." actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>} />
      <form onSubmit={add} className="card mb-4 no-print">
        <div className="card-body grid grid-cols-1 md:grid-cols-4 gap-3">
          <div><label className="label">Class</label><select className="input" value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })}>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label">Subject</label><input className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
          <div><label className="label">Teacher</label><select className="input" value={form.teacherId ?? ""} onChange={(e) => setForm({ ...form, teacherId: e.target.value || undefined })}><option value="">—</option>{staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          <div><label className="label">Week</label><input className="input" placeholder="e.g. Week 3 (Oct 20–26)" value={form.week} onChange={(e) => setForm({ ...form, week: e.target.value })} /></div>
          <div className="md:col-span-2"><label className="label">Topic</label><input className="input" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} required /></div>
          <div className="md:col-span-2"><label className="label">Objectives</label><input className="input" value={form.objectives} onChange={(e) => setForm({ ...form, objectives: e.target.value })} /></div>
          <div className="md:col-span-2"><label className="label">Activities</label><input className="input" value={form.activities} onChange={(e) => setForm({ ...form, activities: e.target.value })} /></div>
          <div className="md:col-span-2"><label className="label">Resources</label><input className="input" value={form.resources} onChange={(e) => setForm({ ...form, resources: e.target.value })} /></div>
          <div className="md:col-span-4 flex"><button className="btn-primary ml-auto"><Plus className="w-4 h-4" /> Add Plan</button></div>
        </div>
      </form>
      <div className="space-y-3">
        {plans.map((p) => (
          <div key={p.id} className="card">
            <div className="card-header">
              <div><h3 className="font-semibold">{p.topic}</h3><div className="text-xs text-slate-500">{p.subject} · Class {p.className} · {p.week}</div></div>
              <button className="btn-ghost text-rose-600 no-print" onClick={() => setPlans(plans.filter((x) => x.id !== p.id))}><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="card-body text-sm grid grid-cols-1 md:grid-cols-3 gap-3">
              <div><div className="text-xs text-slate-500">Objectives</div>{p.objectives}</div>
              <div><div className="text-xs text-slate-500">Activities</div>{p.activities}</div>
              <div><div className="text-xs text-slate-500">Resources</div>{p.resources}</div>
            </div>
          </div>
        ))}
        {!plans.length && <div className="text-sm text-slate-500">No lesson plans yet.</div>}
      </div>
    </div>
  );
}
