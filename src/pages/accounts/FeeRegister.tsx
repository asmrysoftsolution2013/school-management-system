import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useFees, useStudents } from "../../store";
import { fmtCurrency, fmtDate } from "../../utils";
import { Printer, Download } from "lucide-react";
import { toCSV, download } from "../../utils";

export default function FeeRegister() {
  const [fees] = useFees();
  const [students] = useStudents();
  const [year, setYear] = useState(String(new Date().getFullYear()));

  const rows = useMemo(() => {
    return fees
      .filter((f) => f.month.startsWith(year))
      .map((f) => ({
        receipt: f.receiptNo,
        date: f.paidOn,
        student: students.find((s) => s.id === f.studentId)?.name ?? "",
        month: f.month,
        amount: f.amount, discount: f.discount, fine: f.fine,
        net: f.amount - f.discount + f.fine, method: f.method,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [fees, students, year]);

  const total = rows.reduce((s, r) => s + r.net, 0);

  return (
    <div>
      <PageHeader title="Fee Register" subtitle={`All fee transactions for ${year}.`}
        actions={<>
          <button className="btn-secondary" onClick={() => download("fee-register.csv", toCSV(rows as unknown as Record<string, unknown>[]), "text/csv")}><Download className="w-4 h-4" /> CSV</button>
          <button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>
        </>} />
      <div className="card mb-4 no-print">
        <div className="card-body flex items-center gap-3">
          <label className="label mb-0">Year</label>
          <input className="input w-32" value={year} onChange={(e) => setYear(e.target.value)} />
          <div className="ml-auto text-sm">Total: <b>{fmtCurrency(total)}</b></div>
        </div>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Receipt</th><th>Date</th><th>Student</th><th>Month</th><th>Amount</th><th>Discount</th><th>Fine</th><th>Net</th><th>Method</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.receipt}>
                <td className="font-medium">{r.receipt}</td>
                <td>{fmtDate(r.date)}</td>
                <td>{r.student}</td>
                <td>{r.month}</td>
                <td>{fmtCurrency(r.amount)}</td>
                <td>{fmtCurrency(r.discount)}</td>
                <td>{fmtCurrency(r.fine)}</td>
                <td className="font-semibold">{fmtCurrency(r.net)}</td>
                <td>{r.method}</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={9} className="text-center text-slate-500 py-6">No fee receipts yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
