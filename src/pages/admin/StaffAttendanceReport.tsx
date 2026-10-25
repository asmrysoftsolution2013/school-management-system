import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useAttendance, useStaff, useSettings } from "../../store";
import { fmtDate, todayISO } from "../../utils";
import { Printer } from "lucide-react";

function firstOfMonth(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

export default function StaffAttendanceReport() {
  const [staff] = useStaff();
  const [attendance] = useAttendance();
  const [settings] = useSettings();

  const [from, setFrom] = useState(firstOfMonth());
  const [to, setTo] = useState(todayISO());

  const rows = useMemo(() => {
    return staff
      .filter((s) => s.status === "Active")
      .map((s) => {
        const recs = attendance.filter(
          (a) => a.personType === "Staff" && a.personId === s.id && a.date >= from && a.date <= to
        );
        const counts = recs.reduce(
          (c, r) => ({ ...c, [r.status]: (c[r.status] ?? 0) + 1 }),
          {} as Record<string, number>
        );
        const total = recs.length;
        const present = counts["Present"] ?? 0;
        const pct = total ? Math.round((present / total) * 100) : 0;
        return {
          staff: s,
          Present: counts["Present"] ?? 0,
          Absent: counts["Absent"] ?? 0,
          Leave: counts["Leave"] ?? 0,
          Late: counts["Late"] ?? 0,
          total,
          pct,
        };
      });
  }, [staff, attendance, from, to]);

  const totals = rows.reduce(
    (t, r) => ({
      Present: t.Present + r.Present,
      Absent: t.Absent + r.Absent,
      Leave: t.Leave + r.Leave,
      Late: t.Late + r.Late,
      total: t.total + r.total,
    }),
    { Present: 0, Absent: 0, Leave: 0, Late: 0, total: 0 }
  );
  const overallPct = totals.total ? Math.round((totals.Present / totals.total) * 100) : 0;

  return (
    <div>
      <PageHeader
        title="Staff Attendance Report"
        subtitle="Present / Absent / Leave summary over a date range"
        actions={
          <button className="btn-primary" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print
          </button>
        }
      />

      <div className="card mb-4 no-print">
        <div className="card-body grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="label">From</label>
            <input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="label">To</label>
            <input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="md:col-span-2 text-sm self-end text-slate-600">
            Overall:
            <b className="text-emerald-700 ml-2">{totals.Present}</b> present ·
            <b className="text-rose-700 ml-2">{totals.Absent}</b> absent ·
            <b className="text-amber-700 ml-2">{totals.Leave}</b> leave ·
            <b className="text-slate-700 ml-2">{totals.Late}</b> late ·
            Rate: <b>{overallPct}%</b>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="text-center border-b pb-3 mb-4">
            {settings.logoDataUrl && <img src={settings.logoDataUrl} className="w-14 h-14 mx-auto rounded-full object-cover" />}
            <h2 className="text-xl font-semibold mt-2">{settings.name}</h2>
            <div className="text-xs text-slate-500">{settings.address}</div>
            <div className="mt-2 text-sm font-medium">
              Staff Attendance Report · {fmtDate(from)} to {fmtDate(to)}
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Staff ID</th>
                <th>Name</th>
                <th>Designation</th>
                <th className="text-right">Present</th>
                <th className="text-right">Absent</th>
                <th className="text-right">Leave</th>
                <th className="text-right">Late</th>
                <th className="text-right">Days</th>
                <th className="text-right">Rate</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.staff.id}>
                  <td>{i + 1}</td>
                  <td>{r.staff.staffId}</td>
                  <td className="font-medium">{r.staff.name}</td>
                  <td>{r.staff.designation}</td>
                  <td className="text-right text-emerald-700">{r.Present}</td>
                  <td className="text-right text-rose-700">{r.Absent}</td>
                  <td className="text-right text-amber-700">{r.Leave}</td>
                  <td className="text-right text-slate-700">{r.Late}</td>
                  <td className="text-right">{r.total}</td>
                  <td className="text-right font-semibold">{r.total ? `${r.pct}%` : "—"}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr><td colSpan={10} className="text-center text-slate-500 py-6">No active staff.</td></tr>
              )}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100 font-semibold">
                  <td colSpan={4}>Total</td>
                  <td className="text-right text-emerald-700">{totals.Present}</td>
                  <td className="text-right text-rose-700">{totals.Absent}</td>
                  <td className="text-right text-amber-700">{totals.Leave}</td>
                  <td className="text-right text-slate-700">{totals.Late}</td>
                  <td className="text-right">{totals.total}</td>
                  <td className="text-right">{overallPct}%</td>
                </tr>
              </tfoot>
            )}
          </table>

          <div className="flex justify-end mt-16 text-xs text-slate-600 pt-4">
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
