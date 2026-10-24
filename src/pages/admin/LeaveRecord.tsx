import { useState, type FormEvent } from "react";
import PageHeader from "../../components/PageHeader";
import { useLeaves, useStaff, uid } from "../../store";
import type { LeaveRecord as LR } from "../../types";
import { Plus, Trash2 } from "lucide-react";
import { fmtDate, todayISO } from "../../utils";

const empty = (): LR => ({ id: "", staffId: "", from: todayISO(), to: todayISO(), reason: "", type: "Casual", status: "Pending" });

export default function LeaveRecord() {
  const [staff] = useStaff();
  const [leaves, setLeaves] = useLeaves();
  const [form, setForm] = useState<LR>({ ...empty(), staffId: staff[0]?.id ?? "" });

  const add = (e: FormEvent) => { e.preventDefault(); if (!form.staffId) return; setLeaves([...leaves, { ...form, id: uid() }]); setForm({ ...empty(), staffId: staff[0]?.id ?? "" }); };
  const setStatus = (id: string, status: LR["status"]) => setLeaves(leaves.map((l) => l.id === id ? { ...l, status } : l));

  return (
    <div>
      <PageHeader title="Leave Record (Teachers)" />
      <form onSubmit={add} className="card mb-4">
        <div className="card-body grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <div className="md:col-span-2"><label className="label">Staff</label><select className="input" value={form.staffId} onChange={(e) => setForm({ ...form, staffId: e.target.value })} required>{staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          <div><label className="label">From</label><input type="date" className="input" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} /></div>
          <div><label className="label">To</label><input type="date" className="input" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} /></div>
          <div><label className="label">Type</label><select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as LR["type"] })}><option>Casual</option><option>Medical</option><option>Earned</option></select></div>
          <div><button className="btn-primary w-full justify-center"><Plus className="w-4 h-4" /> Add</button></div>
          <div className="md:col-span-6"><label className="label">Reason</label><input className="input" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div>
        </div>
      </form>
      <div className="card">
        <table className="table">
          <thead><tr><th>Staff</th><th>From</th><th>To</th><th>Type</th><th>Reason</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {leaves.slice().reverse().map((l) => (
              <tr key={l.id}>
                <td>{staff.find((s) => s.id === l.staffId)?.name}</td>
                <td>{fmtDate(l.from)}</td><td>{fmtDate(l.to)}</td><td>{l.type}</td><td>{l.reason}</td>
                <td>
                  <select className="input w-32" value={l.status} onChange={(e) => setStatus(l.id, e.target.value as LR["status"])}>
                    <option>Pending</option><option>Approved</option><option>Rejected</option>
                  </select>
                </td>
                <td><button className="btn-ghost text-rose-600" onClick={() => setLeaves(leaves.filter((x) => x.id !== l.id))}><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
            {!leaves.length && <tr><td colSpan={7} className="text-center text-slate-500 py-6">No leaves recorded yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
