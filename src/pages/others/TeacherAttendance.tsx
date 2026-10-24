import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useAttendance, useStaff, uid } from "../../store";
import type { AttendanceRecord } from "../../types";
import { fmtDate, todayISO } from "../../utils";
import { Save } from "lucide-react";

export default function TeacherAttendance() {
  const [staff] = useStaff();
  const [attendance, setAttendance] = useAttendance();
  const [date, setDate] = useState(todayISO());
  const [data, setData] = useState<Record<string, AttendanceRecord["status"]>>({});
  const list = useMemo(() => staff.filter((s) => s.status === "Active"), [staff]);

  useEffect(() => {
    const next: Record<string, AttendanceRecord["status"]> = {};
    for (const s of list) {
      const f = attendance.find((a) => a.personId === s.id && a.date === date && a.personType === "Staff");
      next[s.id] = f?.status ?? "Present";
    }
    setData(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, list.length]);

  const save = () => {
    const rest = attendance.filter((a) => !(a.date === date && a.personType === "Staff" && data[a.personId]));
    setAttendance([...rest, ...list.map((s) => ({ id: uid(), date, personId: s.id, personType: "Staff" as const, status: data[s.id] ?? "Absent" }))]);
    alert("Saved.");
  };

  return (
    <div>
      <PageHeader title="Teacher / Staff Attendance" subtitle={fmtDate(date)} actions={<button className="btn-primary" onClick={save}><Save className="w-4 h-4" /> Save</button>} />
      <div className="card mb-4"><div className="card-body"><label className="label">Date</label><input type="date" className="input w-48" value={date} onChange={(e) => setDate(e.target.value)} /></div></div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Staff ID</th><th>Name</th><th>Designation</th><th>Status</th></tr></thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id}>
                <td>{s.staffId}</td><td>{s.name}</td><td>{s.designation}</td>
                <td>
                  <select className="input w-36" value={data[s.id] ?? "Present"} onChange={(e) => setData({ ...data, [s.id]: e.target.value as AttendanceRecord["status"] })}>
                    <option>Present</option><option>Absent</option><option>Leave</option><option>Late</option>
                  </select>
                </td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan={4} className="text-center text-slate-500 py-6">No active staff.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
