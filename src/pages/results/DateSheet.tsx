import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useSettings, useSubjects } from "../../store";
import { CLASSES, TERMS, fmtDate, todayISO } from "../../utils";
import { Save, Printer, Plus, Trash2 } from "lucide-react";

type Row = { date: string; subject: string; from: string; to: string };
const KEY = (c: string, t: string) => `sms:datesheet:${c}:${t}`;

export default function DateSheet() {
  const [settings] = useSettings();
  const [subjects] = useSubjects();
  const [cls, setCls] = useState("5");
  const [term, setTerm] = useState(TERMS[0]);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    try { setRows(JSON.parse(localStorage.getItem(KEY(cls, term)) || "[]")); } catch { setRows([]); }
  }, [cls, term]);

  const save = () => { localStorage.setItem(KEY(cls, term), JSON.stringify(rows)); alert("Date sheet saved."); };
  const addRow = () => setRows([...rows, { date: todayISO(), subject: subjects.find((s) => s.className === cls)?.name ?? "", from: "09:00", to: "11:00" }]);

  return (
    <div>
      <PageHeader title="Date Sheet" subtitle="Exam schedule per class and term." actions={<><button className="btn-secondary" onClick={save}><Save className="w-4 h-4" /> Save</button><button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button></>} />
      <div className="card mb-4 no-print">
        <div className="card-body flex gap-3">
          <div><label className="label">Class</label><select className="input w-40" value={cls} onChange={(e) => setCls(e.target.value)}>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label">Term</label><select className="input w-56" value={term} onChange={(e) => setTerm(e.target.value)}>{TERMS.map((t) => <option key={t}>{t}</option>)}</select></div>
          <button className="btn-primary ml-auto self-end" onClick={addRow}><Plus className="w-4 h-4" /> Add Paper</button>
        </div>
      </div>
      <div className="card">
        <div className="card-body text-center border-b">
          <h3 className="font-semibold">{settings.name}</h3>
          <div className="text-xs text-slate-500">Date Sheet — Class {cls} — {term} — {settings.session}</div>
        </div>
        <table className="table">
          <thead><tr><th>Date</th><th>Day</th><th>Subject</th><th>From</th><th>To</th><th className="no-print"></th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td><input type="date" className="input w-40" value={r.date} onChange={(e) => setRows(rows.map((x, j) => j === i ? { ...x, date: e.target.value } : x))} /></td>
                <td>{new Date(r.date).toLocaleDateString("en-GB", { weekday: "long" })}</td>
                <td><input className="input" value={r.subject} onChange={(e) => setRows(rows.map((x, j) => j === i ? { ...x, subject: e.target.value } : x))} /></td>
                <td><input className="input w-28" value={r.from} onChange={(e) => setRows(rows.map((x, j) => j === i ? { ...x, from: e.target.value } : x))} /></td>
                <td><input className="input w-28" value={r.to} onChange={(e) => setRows(rows.map((x, j) => j === i ? { ...x, to: e.target.value } : x))} /></td>
                <td className="no-print"><button className="btn-ghost text-rose-600" onClick={() => setRows(rows.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={6} className="text-center text-slate-500 py-6">Add papers to build the date sheet.</td></tr>}
          </tbody>
        </table>
        <div className="card-body text-xs text-slate-500 text-right">Issued on {fmtDate(todayISO())}</div>
      </div>
    </div>
  );
}
