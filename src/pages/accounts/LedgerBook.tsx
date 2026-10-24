import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useCashBook } from "../../store";
import { fmtCurrency, fmtDate } from "../../utils";
import { Printer } from "lucide-react";

export default function LedgerBook() {
  const [entries] = useCashBook();
  const cats = useMemo(() => [...new Set(entries.map((e) => e.category))].sort(), [entries]);
  const [cat, setCat] = useState(cats[0] ?? "");

  const list = entries.filter((e) => e.category === cat).sort((a, b) => a.date.localeCompare(b.date));
  const totals = list.reduce(
    (a, e) => (e.type === "Income" ? { ...a, income: a.income + e.amount } : { ...a, expense: a.expense + e.amount }),
    { income: 0, expense: 0 }
  );

  return (
    <div>
      <PageHeader title="Ledger Book" subtitle="Transactions grouped by category." actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>} />
      <div className="card mb-4 no-print">
        <div className="card-body flex items-center gap-3">
          <label className="label mb-0">Category</label>
          <select className="input w-72" value={cat} onChange={(e) => setCat(e.target.value)}>
            {cats.map((c) => <option key={c}>{c}</option>)}
          </select>
          <div className="ml-auto text-sm">
            In: <b className="text-emerald-700">{fmtCurrency(totals.income)}</b> ·
            Out: <b className="text-rose-700 ml-2">{fmtCurrency(totals.expense)}</b>
          </div>
        </div>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Date</th><th>Description</th><th>Reference</th><th>In</th><th>Out</th></tr></thead>
          <tbody>
            {list.map((e) => (
              <tr key={e.id}>
                <td>{fmtDate(e.date)}</td>
                <td>{e.description}</td>
                <td>{e.reference}</td>
                <td className="text-emerald-700">{e.type === "Income" ? fmtCurrency(e.amount) : ""}</td>
                <td className="text-rose-700">{e.type === "Expense" ? fmtCurrency(e.amount) : ""}</td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan={5} className="text-center text-slate-500 py-6">No entries in this category.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
