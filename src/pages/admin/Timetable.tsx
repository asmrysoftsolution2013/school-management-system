import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useTimetable, useStaff, uid } from "../../store";
import { CLASSES, DAYS } from "../../utils";
import type { TimetableSlot } from "../../types";
import { Save, Printer } from "lucide-react";

const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function Timetable() {
  const [slots, setSlots] = useTimetable();
  const [staff] = useStaff();
  const [cls, setCls] = useState("5");

  const map = useMemo(() => {
    const m: Record<string, TimetableSlot> = {};
    slots.filter((s) => s.className === cls).forEach((s) => { m[`${s.day}-${s.period}`] = s; });
    return m;
  }, [slots, cls]);

  const upd = (day: string, period: number, patch: Partial<TimetableSlot>) => {
    const key = `${day}-${period}`;
    const curr = map[key];
    if (curr) {
      setSlots(slots.map((s) => s.id === curr.id ? { ...s, ...patch } : s));
    } else {
      setSlots([...slots, { id: uid(), className: cls, day, period, subject: patch.subject ?? "", teacherId: patch.teacherId }]);
    }
  };

  return (
    <div>
      <PageHeader title="Teacher / Class Timetable" subtitle={`Class ${cls}`} actions={<><button className="btn-secondary" onClick={() => alert("Timetable auto-saves on change.")}><Save className="w-4 h-4" /> Saved</button><button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button></>} />
      <div className="card mb-4 no-print"><div className="card-body"><label className="label">Class</label><select className="input w-40" value={cls} onChange={(e) => setCls(e.target.value)}>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select></div></div>
      <div className="card overflow-x-auto">
        <table className="table">
          <thead><tr><th>Day / Period</th>{PERIODS.map((p) => <th key={p}>P{p}</th>)}</tr></thead>
          <tbody>
            {DAYS.map((d) => (
              <tr key={d}>
                <td className="font-medium">{d}</td>
                {PERIODS.map((p) => {
                  const slot = map[`${d}-${p}`];
                  return (
                    <td key={p} className="min-w-[160px]">
                      <input className="input mb-1" placeholder="Subject" value={slot?.subject ?? ""} onChange={(e) => upd(d, p, { subject: e.target.value })} />
                      <select className="input" value={slot?.teacherId ?? ""} onChange={(e) => upd(d, p, { teacherId: e.target.value || undefined })}>
                        <option value="">—</option>
                        {staff.filter((s) => s.type === "Teacher").map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
