import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useSettings } from "../../store";
import { CLASSES, TERMS } from "../../utils";
import { Printer, Save, Plus, Trash2 } from "lucide-react";

type Q = { q: string; marks: number };
const KEY = (c: string, s: string, t: string) => `sms:paper:${c}:${s}:${t}`;

export default function Papers() {
  const [settings] = useSettings();
  const [cls, setCls] = useState("5");
  const [subject, setSubject] = useState("English");
  const [term, setTerm] = useState(TERMS[0]);
  const [qs, setQs] = useState<Q[]>([]);

  useEffect(() => {
    try { setQs(JSON.parse(localStorage.getItem(KEY(cls, subject, term)) || "[]")); } catch { setQs([]); }
  }, [cls, subject, term]);

  const save = () => { localStorage.setItem(KEY(cls, subject, term), JSON.stringify(qs)); alert("Paper saved."); };
  const total = qs.reduce((s, q) => s + q.marks, 0);

  return (
    <div>
      <PageHeader title="Question Papers" actions={<><button className="btn-secondary" onClick={save}><Save className="w-4 h-4" /> Save</button><button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button></>} />
      <div className="card mb-4 no-print"><div className="card-body grid grid-cols-1 md:grid-cols-4 gap-3">
        <div><label className="label">Class</label><select className="input" value={cls} onChange={(e) => setCls(e.target.value)}>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select></div>
        <div><label className="label">Subject</label><input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
        <div><label className="label">Term</label><select className="input" value={term} onChange={(e) => setTerm(e.target.value)}>{TERMS.map((t) => <option key={t}>{t}</option>)}</select></div>
        <div className="flex items-end"><button className="btn-primary w-full justify-center" onClick={() => setQs([...qs, { q: "", marks: 5 }])}><Plus className="w-4 h-4" /> Add Question</button></div>
      </div></div>
      <div className="card">
        <div className="card-body">
          <div className="text-center border-b pb-3 mb-4">
            <h2 className="font-semibold">{settings.name}</h2>
            <div className="text-xs text-slate-500">{term} Examination — {settings.session}</div>
            <div className="text-sm mt-1">Class {cls} · Subject: {subject} · Total Marks: {total}</div>
          </div>
          <ol className="space-y-3 list-decimal pl-5">
            {qs.map((q, i) => (
              <li key={i}>
                <div className="flex gap-2 items-start">
                  <textarea className="input flex-1" rows={2} placeholder="Question text" value={q.q} onChange={(e) => setQs(qs.map((x, j) => j === i ? { ...x, q: e.target.value } : x))} />
                  <input type="number" className="input w-24" value={q.marks} onChange={(e) => setQs(qs.map((x, j) => j === i ? { ...x, marks: Number(e.target.value) } : x))} />
                  <button className="btn-ghost text-rose-600 no-print" onClick={() => setQs(qs.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4" /></button>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
