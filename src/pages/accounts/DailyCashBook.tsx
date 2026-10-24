import { useMemo, useState, type FormEvent } from "react";
import PageHeader from "../../components/PageHeader";
import { useCashBook, uid } from "../../store";
import { fmtCurrency, fmtDate, todayISO } from "../../utils";
import { Plus, Trash2, Printer } from "lucide-react";
import type { CashBookEntry } from "../../types";

const DEFAULT_CATS = ["Fee Income", "Donation", "Rent", "Utility", "Salary", "Stationery", "Transport", "Miscellaneous"];

export default function DailyCashBook() {
  const [entries, setEntries] = useCashBook();
  const [date, setDate] = useState(todayISO());
  const [type, setType] = useState<CashBookEntry["type"]>("Income");
  const [cats] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("sms:cashCategories") || "null") ?? DEFAULT_CATS; } catch { return DEFAULT_CATS; }
  });
  const [category, setCategory] = useState(cats[0]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [reference, setReference] = useState("");

  const todayList = useMemo(
    () => entries.filter((e) => e.date === date).sort((a, b) => a.id.localeCompare(b.id)),
    [entries, date]
  );
  const totals = todayList.reduce(
    (acc, e) => (e.type === "Income" ? { ...acc, income: acc.income + e.amount } : { ...acc, expense: acc.expense + e.amount }),
    { income: 0, expense: 0 }
  );

  const add = (e: FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    setEntries([...entries, { id: uid(), date, description, type, category, amount, reference }]);
    setDescription(""); setAmount(0); setReference("");
  };

  const del = (id: string) => setEntries(entries.filter((e) => e.id !== id));

  return (
    <div>
      <PageHeader title="Daily Cash Book" subtitle="Record daily income and expenses." actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>} />

      <form onSubmit={add} className="card mb-5 no-print">
        <div className="card-body grid grid-cols-1 md:grid-cols-6 gap-3">
          <div><label className="label">Date</label><input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div><label className="label">Type</label><select className="input" value={type} onChange={(e) => setType(e.target.value as CashBookEntry["type"])}><option>Income</option><option>Expense</option></select></div>
          <div><label className="label">Category</label><select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>{cats.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div className="md:col-span-2"><label className="label">Description</label><input className="input" value={description} onChange={(e) => setDescription(e.target.value)} required /></div>
          <div><label className="label">Amount</label><input type="number" className="input" value={amount} onChange={(e) => setAmount(Number(e.target.value))} required /></div>
          <div className="md:col-span-5"><label className="label">Reference</label><input className="input" value={reference} onChange={(e) => setReference(e.target.value)} /></div>
          <div className="md:col-span-1 flex items-end"><button className="btn-primary w-full justify-center"><Plus className="w-4 h-4" /> Add</button></div>
        </div>
      </form>

      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold">Entries for {fmtDate(date)}</h3>
          <div className="text-sm">
            <span className="mr-3">Income: <b className="text-emerald-700">{fmtCurrency(totals.income)}</b></span>
            <span className="mr-3">Expense: <b className="text-rose-700">{fmtCurrency(totals.expense)}</b></span>
            <span>Net: <b>{fmtCurrency(totals.income - totals.expense)}</b></span>
          </div>
        </div>
        <table className="table">
          <thead><tr><th>Type</th><th>Category</th><th>Description</th><th>Reference</th><th>Amount</th><th className="no-print"></th></tr></thead>
          <tbody>
            {todayList.map((e) => (
              <tr key={e.id}>
                <td><span className={`pill ${e.type === "Income" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>{e.type}</span></td>
                <td>{e.category}</td>
                <td>{e.description}</td>
                <td>{e.reference}</td>
                <td className="font-medium">{fmtCurrency(e.amount)}</td>
                <td className="no-print"><button className="btn-ghost text-rose-600" onClick={() => del(e.id)}><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
            {!todayList.length && <tr><td colSpan={6} className="text-center text-slate-500 py-6">No entries for this date.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
