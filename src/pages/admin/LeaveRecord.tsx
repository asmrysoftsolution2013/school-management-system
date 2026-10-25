import { useMemo, useState, type FormEvent } from "react";
import PageHeader from "../../components/PageHeader";
import { useLeaves, useStaff, useSettings, uid } from "../../store";
import type { LeaveRecord as LR } from "../../types";
import { Plus, Printer, Trash2 } from "lucide-react";
import { fmtDate, todayISO } from "../../utils";

const empty = (): LR => ({ id: "", staffId: "", from: todayISO(), to: todayISO(), reason: "", type: "Casual", status: "Pending" });

function firstOfYear(): string {
  const d = new Date();
  return new Date(d.getFullYear(), 0, 1).toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const d1 = new Date(a).getTime();
  const d2 = new Date(b).getTime();
  if (isNaN(d1) || isNaN(d2) || d2 < d1) return 0;
  return Math.round((d2 - d1) / 86400000) + 1;
}

export default function LeaveRecord() {
  const [staff] = useStaff();
  const [leaves, setLeaves] = useLeaves();
  const [settings] = useSettings();
  const [form, setForm] = useState<LR>({ ...empty(), staffId: staff[0]?.id ?? "" });

  const [from, setFrom] = useState(firstOfYear());
  const [to, setTo] = useState(todayISO());
  const [staffFilter, setStaffFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | LR["status"]>("All");

  const add = (e: FormEvent) => {
    e.preventDefault();
    if (!form.staffId) return;
    setLeaves([...leaves, { ...form, id: uid() }]);
    setForm({ ...empty(), staffId: staff[0]?.id ?? "" });
  };
  const setStatus = (id: string, status: LR["status"]) =>
    setLeaves(leaves.map((l) => (l.id === id ? { ...l, status } : l)));

  const filtered = useMemo(() => {
    return leaves
      .filter((l) => l.from >= from && l.from <= to)
      .filter((l) => (staffFilter === "All" ? true : l.staffId === staffFilter))
      .filter((l) => (statusFilter === "All" ? true : l.status === statusFilter))
      .sort((a, b) => (a.from < b.from ? 1 : -1));
  }, [leaves, from, to, staffFilter, statusFilter]);

  const byType = filtered.reduce(
    (c, l) => ({ ...c, [l.type]: (c[l.type] ?? 0) + daysBetween(l.from, l.to) }),
    {} as Record<string, number>
  );
  const totalDays = (byType["Casual"] ?? 0) + (byType["Medical"] ?? 0) + (byType["Earned"] ?? 0);

  return (
    <div>
      <PageHeader
        title="Leave Record (Teachers)"
        subtitle="Add, approve, and print staff leave records."
        actions={
          <button className="btn-primary" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print
          </button>
        }
      />

      <form onSubmit={add} className="card mb-4 no-print">
        <div className="card-body grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="label">Staff</label>
            <select className="input" value={form.staffId} onChange={(e) => setForm({ ...form, staffId: e.target.value })} required>
              {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div><label className="label">From</label><input type="date" className="input" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} /></div>
          <div><label className="label">To</label><input type="date" className="input" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} /></div>
          <div>
            <label className="label">Type</label>
            <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as LR["type"] })}>
              <option>Casual</option><option>Medical</option><option>Earned</option>
            </select>
          </div>
          <div><button className="btn-primary w-full justify-center"><Plus className="w-4 h-4" /> Add</button></div>
          <div className="md:col-span-6"><label className="label">Reason</label><input className="input" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div>
        </div>
      </form>

      <div className="card mb-4 no-print">
        <div className="card-body grid grid-cols-1 md:grid-cols-5 gap-3">
          <div>
            <label className="label">From</label>
            <input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="label">To</label>
            <input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div>
            <label className="label">Staff</label>
            <select className="input" value={staffFilter} onChange={(e) => setStaffFilter(e.target.value)}>
              <option value="All">All</option>
              {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "All" | LR["status"])}>
              <option>All</option><option>Pending</option><option>Approved</option><option>Rejected</option>
            </select>
          </div>
          <div className="text-sm self-end text-slate-600">
            <b>{filtered.length}</b> leave{filtered.length === 1 ? "" : "s"} ·
            Casual: <b>{byType["Casual"] ?? 0}</b> ·
            Medical: <b>{byType["Medical"] ?? 0}</b> ·
            Earned: <b>{byType["Earned"] ?? 0}</b> ·
            Total days: <b>{totalDays}</b>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="text-center border-b pb-3 mb-4 hidden print:block">
            {settings.logoDataUrl && <img src={settings.logoDataUrl} className="w-14 h-14 mx-auto rounded-full object-cover" />}
            <h2 className="text-xl font-semibold mt-2">{settings.name}</h2>
            <div className="text-xs text-slate-500">{settings.address}</div>
            <div className="mt-2 text-sm font-medium">Leave Record · {fmtDate(from)} to {fmtDate(to)}</div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>#</th><th>Staff</th><th>From</th><th>To</th><th>Days</th><th>Type</th><th>Reason</th><th>Status</th><th className="no-print"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <tr key={l.id}>
                  <td>{i + 1}</td>
                  <td>{staff.find((s) => s.id === l.staffId)?.name ?? "—"}</td>
                  <td>{fmtDate(l.from)}</td>
                  <td>{fmtDate(l.to)}</td>
                  <td>{daysBetween(l.from, l.to)}</td>
                  <td>{l.type}</td>
                  <td>{l.reason}</td>
                  <td>
                    <select
                      className="input w-32 no-print"
                      value={l.status}
                      onChange={(e) => setStatus(l.id, e.target.value as LR["status"])}
                    >
                      <option>Pending</option><option>Approved</option><option>Rejected</option>
                    </select>
                    <span className="hidden print:inline">{l.status}</span>
                  </td>
                  <td className="no-print">
                    <button className="btn-ghost text-rose-600" onClick={() => setLeaves(leaves.filter((x) => x.id !== l.id))}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan={9} className="text-center text-slate-500 py-6">No leaves match this filter.</td></tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-end mt-16 text-xs text-slate-600 pt-4 hidden print:flex">
            <div className="text-center">
              {settings.signatureDataUrl && <img src={settings.signatureDataUrl} className="h-10 mx-auto" />}
              <div className="border-t border-slate-400 pt-1 px-6">{settings.principal}</div>
              <div className="text-slate-500">Principal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
