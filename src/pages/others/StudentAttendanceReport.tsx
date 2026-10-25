import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useAttendance, useStudents, useSettings } from "../../store";
import { CLASSES, fmtDate, todayISO } from "../../utils";
import { Printer } from "lucide-react";

function firstOfMonth(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

export default function StudentAttendanceReport() {
  const [students] = useStudents();
  const [attendance] = useAttendance();
  const [settings] = useSettings();

  const [cls, setCls] = useState<string>("All");
  const [from, setFrom] = useState(firstOfMonth());
  const [to, setTo] = useState(todayISO());

  const rows = useMemo(() => {
    const list = students
      .filter((s) => s.status === "Active")
      .filter((s) => (cls === "All" ? true : s.className === cls));
    return list.map((s) => {
      const recs = attendance.filter(
        (a) => a.personType === "Student" && a.personId === s.id && a.date >= from && a.date <= to
      );
      const counts = recs.reduce(
        (c, r) => ({ ...c, [r.status]: (c[r.status] ?? 0) + 1 }),
        {} as Record<string, number>
      );
      const total = recs.length;
      const present = counts["Present"] ?? 0;
      const pct = total ? Math.round((present / total) * 100) : 0;
      return {
        student: s,
        Present: counts["Present"] ?? 0,
        Absent: counts["Absent"] ?? 0,
        Leave: counts["Leave"] ?? 0,
        Late: counts["Late"] ?? 0,
        total,
        pct,
      };
    });
  }, [students, attendance, cls, from, to]);

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
        title="Student Attendance Report"
        subtitle="Present / Absent / Leave summary over a date range"
        actions={
          <button className="btn-primary" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print
          </button>
        }
      />

      <div className="card mb-4 no-print">
        <div className="card-body grid grid-cols-1 md:grid-cols-5 gap-3">
          <div>
            <label className="label">Class</label>
            <select className="input" value={cls} onChange={(e) => setCls(e.target.value)}>
              <option>All</option>
              {CLASSES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">From</label>
            <input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="label">To</label>
            <input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="md:col-span-2 text-sm self-end text-slate-600">
            <b className="text-emerald-700">{totals.Present}</b> present ·
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
              Student Attendance Report {cls === "All" ? "" : `· Class ${cls}`} · {fmtDate(from)} to {fmtDate(to)}
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Roll</th>
                <th>Admission</th>
                <th>Name</th>
                <th>Class</th>
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
                <tr key={r.student.id}>
                  <td>{i + 1}</td>
                  <td>{r.student.rollNo}</td>
                  <td>{r.student.admissionNo}</td>
                  <td className="font-medium">{r.student.name}</td>
                  <td>{r.student.className}-{r.student.section}</td>
                  <td className="text-right text-emerald-700">{r.Present}</td>
                  <td className="text-right text-rose-700">{r.Absent}</td>
                  <td className="text-right text-amber-700">{r.Leave}</td>
                  <td className="text-right text-slate-700">{r.Late}</td>
                  <td className="text-right">{r.total}</td>
                  <td className="text-right font-semibold">{r.total ? `${r.pct}%` : "—"}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr><td colSpan={11} className="text-center text-slate-500 py-6">No active students match this filter.</td></tr>
              )}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100 font-semibold">
                  <td colSpan={5}>Total</td>
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
