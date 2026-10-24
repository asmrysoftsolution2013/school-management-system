import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useAttendance, useStudents, uid } from "../../store";
import type { AttendanceRecord } from "../../types";
import { CLASSES, fmtDate, todayISO } from "../../utils";
import { Save, Printer } from "lucide-react";

export default function StudentAttendance() {
  const [students] = useStudents();
  const [attendance, setAttendance] = useAttendance();
  const [cls, setCls] = useState("5");
  const [date, setDate] = useState(todayISO());
  const [data, setData] = useState<Record<string, AttendanceRecord["status"]>>({});

  const list = useMemo(() => students.filter((s) => s.className === cls && s.status === "Active"), [students, cls]);

  useEffect(() => {
    const next: Record<string, AttendanceRecord["status"]> = {};
    for (const s of list) {
      const found = attendance.find((a) => a.personId === s.id && a.date === date && a.personType === "Student");
      next[s.id] = found?.status ?? "Present";
    }
    setData(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cls, date, list.length]);

  const save = () => {
    const remaining = attendance.filter((a) => !(a.date === date && a.personType === "Student" && data[a.personId]));
    const next = [...remaining, ...list.map((s) => ({ id: uid(), date, personId: s.id, personType: "Student" as const, status: data[s.id] ?? "Absent" }))];
    setAttendance(next);
    alert("Attendance saved.");
  };

  const totals = Object.values(data).reduce((a, s) => ({ ...a, [s]: (a[s] ?? 0) + 1 }), {} as Record<string, number>);

  return (
    <div>
      <PageHeader title="Student Attendance" subtitle={`Class ${cls} on ${fmtDate(date)}`} actions={<><button className="btn-secondary" onClick={save}><Save className="w-4 h-4" /> Save</button><button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button></>} />
      <div className="card mb-4 no-print">
        <div className="card-body flex gap-3">
          <div><label className="label">Class</label><select className="input w-40" value={cls} onChange={(e) => setCls(e.target.value)}>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label">Date</label><input type="date" className="input w-48" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div className="ml-auto text-sm self-end">
            P: <b className="text-emerald-700">{totals["Present"] ?? 0}</b> ·
            A: <b className="text-rose-700 ml-2">{totals["Absent"] ?? 0}</b> ·
            L: <b className="text-amber-700 ml-2">{totals["Leave"] ?? 0}</b> ·
            Late: <b className="text-slate-700 ml-2">{totals["Late"] ?? 0}</b>
          </div>
        </div>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Roll</th><th>Name</th><th>Status</th></tr></thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id}>
                <td>{s.rollNo}</td><td>{s.name}</td>
                <td>
                  <div className="flex gap-2">
                    {(["Present", "Absent", "Leave", "Late"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          data[s.id] === st
                            ? st === "Present" ? "bg-emerald-600 text-white"
                              : st === "Absent" ? "bg-rose-600 text-white"
                              : st === "Leave" ? "bg-amber-500 text-white"
                              : "bg-slate-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                        onClick={() => setData({ ...data, [s.id]: st })}
                      >{st}</button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan={3} className="text-center text-slate-500 py-6">No active students in this class.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
