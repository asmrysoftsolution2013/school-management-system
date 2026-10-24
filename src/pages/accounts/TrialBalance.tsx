import { useMemo } from "react";
import PageHeader from "../../components/PageHeader";
import { useCashBook, useFees, useSalaries } from "../../store";
import { fmtCurrency } from "../../utils";
import { Printer } from "lucide-react";

export default function TrialBalance() {
  const [entries] = useCashBook();
  const [fees] = useFees();
  const [salaries] = useSalaries();

  const rows = useMemo(() => {
    const byCat = new Map<string, { income: number; expense: number }>();
    for (const e of entries) {
      const r = byCat.get(e.category) ?? { income: 0, expense: 0 };
      if (e.type === "Income") r.income += e.amount; else r.expense += e.amount;
      byCat.set(e.category, r);
    }
    const feesIncome = fees.reduce((s, f) => s + (f.amount - f.discount + f.fine), 0);
    const salaryExpense = salaries.reduce((s, x) => s + x.net, 0);
    if (feesIncome) byCat.set("Fee Income (Receipts)", { income: (byCat.get("Fee Income (Receipts)")?.income ?? 0) + feesIncome, expense: 0 });
    if (salaryExpense) byCat.set("Salary Paid", { income: 0, expense: (byCat.get("Salary Paid")?.expense ?? 0) + salaryExpense });
    return [...byCat.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [entries, fees, salaries]);

  const totals = rows.reduce(
    (a, [, r]) => ({ income: a.income + r.income, expense: a.expense + r.expense }),
    { income: 0, expense: 0 }
  );

  return (
    <div>
      <PageHeader title="Trial Balance" subtitle="Account summary across all categories." actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>} />
      <div className="card">
        <table className="table">
          <thead><tr><th>Category</th><th>Income</th><th>Expense</th><th>Net</th></tr></thead>
          <tbody>
            {rows.map(([k, r]) => (
              <tr key={k}>
                <td>{k}</td>
                <td className="text-emerald-700">{fmtCurrency(r.income)}</td>
                <td className="text-rose-700">{fmtCurrency(r.expense)}</td>
                <td className="font-semibold">{fmtCurrency(r.income - r.expense)}</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={4} className="text-center text-slate-500 py-6">No data yet.</td></tr>}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-semibold">
              <td>Totals</td>
              <td className="text-emerald-700">{fmtCurrency(totals.income)}</td>
              <td className="text-rose-700">{fmtCurrency(totals.expense)}</td>
              <td>{fmtCurrency(totals.income - totals.expense)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
