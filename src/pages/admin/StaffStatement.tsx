import { useMemo } from "react";
import PageHeader from "../../components/PageHeader";
import { useStaff } from "../../store";
import { fmtCurrency } from "../../utils";
import { Printer } from "lucide-react";

export default function StaffStatement() {
  const [staff] = useStaff();
  const summary = useMemo(() => {
    const by: Record<string, { count: number; salary: number }> = {};
    for (const s of staff) {
      const k = s.type;
      by[k] = by[k] ?? { count: 0, salary: 0 };
      by[k].count++;
      by[k].salary += s.salary;
    }
    return by;
  }, [staff]);
  const total = { count: staff.length, salary: staff.reduce((s, x) => s + x.salary, 0) };

  return (
    <div>
      <PageHeader title="Staff Statement" subtitle="Headcount and payroll overview." actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>} />
      <div className="card">
        <table className="table">
          <thead><tr><th>Type</th><th>Count</th><th>Total Monthly Salary</th></tr></thead>
          <tbody>
            {Object.entries(summary).map(([k, v]) => <tr key={k}><td>{k}</td><td>{v.count}</td><td>{fmtCurrency(v.salary)}</td></tr>)}
            {!staff.length && <tr><td colSpan={3} className="text-center text-slate-500 py-6">No staff yet.</td></tr>}
          </tbody>
          <tfoot><tr className="bg-slate-100 font-semibold"><td>Total</td><td>{total.count}</td><td>{fmtCurrency(total.salary)}</td></tr></tfoot>
        </table>
      </div>
    </div>
  );
}
