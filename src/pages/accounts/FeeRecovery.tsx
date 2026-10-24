import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useFees, useStudents } from "../../store";
import { fmtCurrency, fmtDate, monthISO } from "../../utils";
import { Printer } from "lucide-react";

export default function FeeRecovery() {
  const [students] = useStudents();
  const [fees] = useFees();
  const [month, setMonth] = useState(monthISO());

  const rows = useMemo(() => {
    return fees
      .filter((f) => f.month === month)
      .map((f) => ({ ...f, student: students.find((s) => s.id === f.studentId) }))
      .sort((a, b) => a.receiptNo.localeCompare(b.receiptNo));
  }, [fees, students, month]);

  const total = rows.reduce((s, r) => s + (r.amount - r.discount + r.fine), 0);

  return (
    <div>
      <PageHeader
        title="Fee Recovery Report"
        subtitle="All receipts collected for the selected month."
        actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>}
      />
      <div className="card mb-4 no-print">
        <div className="card-body flex items-center gap-3">
          <label className="label mb-0">Month</label>
          <input type="month" className="input w-56" value={month} onChange={(e) => setMonth(e.target.value)} />
          <div className="ml-auto text-sm">Collected: <b className="text-emerald-700">{fmtCurrency(total)}</b></div>
        </div>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Receipt</th><th>Date</th><th>Student</th><th>Class</th><th>Method</th><th>Amount</th><th>Discount</th><th>Fine</th><th>Net</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="font-medium">{r.receiptNo}</td>
                <td>{fmtDate(r.paidOn)}</td>
                <td>{r.student?.name}</td>
                <td>{r.student?.className}-{r.student?.section}</td>
                <td>{r.method}</td>
                <td>{fmtCurrency(r.amount)}</td>
                <td>{fmtCurrency(r.discount)}</td>
                <td>{fmtCurrency(r.fine)}</td>
                <td className="font-semibold">{fmtCurrency(r.amount - r.discount + r.fine)}</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={9} className="text-center text-slate-500 py-6">No receipts for {month}.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
