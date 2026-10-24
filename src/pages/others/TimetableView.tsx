import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useTimetable, useStaff } from "../../store";
import { CLASSES, DAYS } from "../../utils";
import { Printer } from "lucide-react";

const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function TimetableView() {
  const [slots] = useTimetable();
  const [staff] = useStaff();
  const [cls, setCls] = useState("5");

  const map = useMemo(() => {
    const m: Record<string, (typeof slots)[number] | undefined> = {};
    slots.filter((s) => s.className === cls).forEach((s) => { m[`${s.day}-${s.period}`] = s; });
    return m;
  }, [slots, cls]);

  return (
    <div>
      <PageHeader title="Timetable (Read-only View)" subtitle={`Class ${cls}`} actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>} />
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
                    <td key={p}>
                      {slot ? (
                        <div>
                          <div className="font-medium">{slot.subject}</div>
                          <div className="text-xs text-slate-500">{staff.find((s) => s.id === slot.teacherId)?.name ?? "—"}</div>
                        </div>
                      ) : <span className="text-slate-300">—</span>}
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
