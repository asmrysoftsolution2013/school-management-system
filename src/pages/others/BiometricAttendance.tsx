import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useAttendance, useStaff, uid } from "../../store";
import { Fingerprint } from "lucide-react";
import { fmtDate, todayISO } from "../../utils";

export default function BiometricAttendance() {
  const [staff] = useStaff();
  const [attendance, setAttendance] = useAttendance();
  const [staffId, setStaffId] = useState(staff[0]?.id ?? "");
  const [scanning, setScanning] = useState(false);
  const [last, setLast] = useState<string>("");

  const scan = () => {
    if (!staffId) return;
    setScanning(true);
    setTimeout(() => {
      const date = todayISO();
      const found = attendance.find((a) => a.personId === staffId && a.date === date && a.personType === "Staff");
      if (!found) {
        setAttendance([...attendance, { id: uid(), date, personId: staffId, personType: "Staff", status: "Present" }]);
      }
      setLast(`Verified at ${new Date().toLocaleTimeString()} — ${staff.find((s) => s.id === staffId)?.name}`);
      setScanning(false);
    }, 1200);
  };

  const todayLog = attendance.filter((a) => a.date === todayISO() && a.personType === "Staff");

  return (
    <div>
      <PageHeader title="Biometric Attendance" subtitle="Simulated fingerprint sign-in that writes to the staff attendance log." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card">
          <div className="card-body text-center">
            <Fingerprint className={`w-28 h-28 mx-auto ${scanning ? "text-brand-500 animate-pulse" : "text-slate-300"}`} />
            <div className="mt-3">
              <select className="input w-64 mx-auto" value={staffId} onChange={(e) => setStaffId(e.target.value)}>
                {staff.map((s) => <option key={s.id} value={s.id}>{s.staffId} — {s.name}</option>)}
              </select>
            </div>
            <button className="btn-primary mt-4" onClick={scan} disabled={scanning}>{scanning ? "Scanning…" : "Scan Finger"}</button>
            {last && <div className="text-sm text-emerald-700 mt-3">{last}</div>}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3 className="font-semibold">Today — {fmtDate(todayISO())}</h3></div>
          <table className="table">
            <thead><tr><th>Staff</th><th>Status</th></tr></thead>
            <tbody>
              {todayLog.map((a) => (
                <tr key={a.id}><td>{staff.find((s) => s.id === a.personId)?.name}</td><td>{a.status}</td></tr>
              ))}
              {!todayLog.length && <tr><td colSpan={2} className="text-center text-slate-500 py-6">No scans yet today.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
