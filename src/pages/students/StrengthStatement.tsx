import { useMemo } from "react";
import PageHeader from "../../components/PageHeader";
import { useStudents, useSettings } from "../../store";
import { Printer } from "lucide-react";
import { fmtDate, todayISO } from "../../utils";

export default function StrengthStatement() {
  const [students] = useStudents();
  const [settings] = useSettings();

  const summary = useMemo(() => {
    const by = new Map<string, { total: number; boys: number; girls: number; others: number }>();
    for (const s of students) {
      if (s.status !== "Active") continue;
      const key = `${s.className}-${s.section}`;
      const row = by.get(key) ?? { total: 0, boys: 0, girls: 0, others: 0 };
      row.total++;
      if (s.gender === "Male") row.boys++;
      else if (s.gender === "Female") row.girls++;
      else row.others++;
      by.set(key, row);
    }
    return [...by.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [students]);

  const totals = summary.reduce(
    (acc, [, r]) => ({ total: acc.total + r.total, boys: acc.boys + r.boys, girls: acc.girls + r.girls, others: acc.others + r.others }),
    { total: 0, boys: 0, girls: 0, others: 0 }
  );

  return (
    <div>
      <PageHeader
        title="Strength Statement"
        subtitle="Class-wise student strength (active only)."
        actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>}
      />
      <div className="card">
        <div className="card-body">
          <div className="text-center mb-4">
            <h2 className="font-semibold">{settings.name}</h2>
            <div className="text-xs text-slate-500">Strength Statement as of {fmtDate(todayISO())}</div>
          </div>
          <table className="table">
            <thead><tr><th>Class / Section</th><th>Boys</th><th>Girls</th><th>Others</th><th>Total</th></tr></thead>
            <tbody>
              {summary.map(([k, r]) => (
                <tr key={k}><td>{k}</td><td>{r.boys}</td><td>{r.girls}</td><td>{r.others}</td><td className="font-semibold">{r.total}</td></tr>
              ))}
              {!summary.length && <tr><td colSpan={5} className="text-center text-slate-500 py-6">No active students.</td></tr>}
            </tbody>
            {summary.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100 font-semibold"><td>Grand Total</td><td>{totals.boys}</td><td>{totals.girls}</td><td>{totals.others}</td><td>{totals.total}</td></tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
