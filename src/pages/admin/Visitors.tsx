import { useState, type FormEvent } from "react";
import PageHeader from "../../components/PageHeader";
import { useVisitors, uid } from "../../store";
import type { Visitor } from "../../types";
import { Plus, Trash2, Printer } from "lucide-react";
import { fmtDate, todayISO } from "../../utils";

const empty = (): Visitor => ({ id: "", date: todayISO(), name: "", cnic: "", purpose: "", meetingWith: "", timeIn: new Date().toTimeString().slice(0, 5), contact: "" });

export default function Visitors() {
  const [list, setList] = useVisitors();
  const [form, setForm] = useState<Visitor>(empty());

  const add = (e: FormEvent) => { e.preventDefault(); setList([...list, { ...form, id: uid() }]); setForm(empty()); };
  const checkOut = (id: string) => setList(list.map((v) => v.id === id ? { ...v, timeOut: new Date().toTimeString().slice(0, 5) } : v));

  return (
    <div>
      <PageHeader title="Visitor Register" actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>} />
      <form onSubmit={add} className="card mb-4 no-print">
        <div className="card-body grid grid-cols-1 md:grid-cols-7 gap-3 items-end">
          <div><label className="label">Date</label><input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          <div className="md:col-span-2"><label className="label">Visitor Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div><label className="label">CNIC</label><input className="input" value={form.cnic} onChange={(e) => setForm({ ...form, cnic: e.target.value })} /></div>
          <div className="md:col-span-2"><label className="label">Purpose</label><input className="input" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} /></div>
          <div><label className="label">Meeting With</label><input className="input" value={form.meetingWith} onChange={(e) => setForm({ ...form, meetingWith: e.target.value })} /></div>
          <div><label className="label">Time In</label><input type="time" className="input" value={form.timeIn} onChange={(e) => setForm({ ...form, timeIn: e.target.value })} /></div>
          <div className="md:col-span-1"><button className="btn-primary w-full justify-center"><Plus className="w-4 h-4" /> Add</button></div>
        </div>
      </form>
      <div className="card">
        <table className="table">
          <thead><tr><th>Date</th><th>Name</th><th>CNIC</th><th>Purpose</th><th>Meeting</th><th>In</th><th>Out</th><th className="no-print"></th></tr></thead>
          <tbody>
            {list.slice().reverse().map((v) => (
              <tr key={v.id}>
                <td>{fmtDate(v.date)}</td><td>{v.name}</td><td>{v.cnic}</td><td>{v.purpose}</td><td>{v.meetingWith}</td>
                <td>{v.timeIn}</td><td>{v.timeOut ?? "—"}</td>
                <td className="no-print">
                  <div className="flex gap-1">
                    {!v.timeOut && <button className="btn-secondary" onClick={() => checkOut(v.id)}>Check out</button>}
                    <button className="btn-ghost text-rose-600" onClick={() => setList(list.filter((x) => x.id !== v.id))}><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan={8} className="text-center text-slate-500 py-6">No visitors logged yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
