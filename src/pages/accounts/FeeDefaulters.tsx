import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useFees, useStudents } from "../../store";
import { fmtCurrency, monthISO } from "../../utils";
import { Printer } from "lucide-react";

export default function FeeDefaulters() {
  const [students] = useStudents();
  const [fees] = useFees();
  const [month, setMonth] = useState(monthISO());

  const defaulters = useMemo(() => {
    const paid = new Set(fees.filter((f) => f.month === month).map((f) => f.studentId));
    return students.filter((s) => s.status === "Active" && !paid.has(s.id));
  }, [students, fees, month]);

  const total = defaulters.reduce((s, d) => s + d.monthlyFee, 0);

  return (
    <div>
      <PageHeader
        title="Fee Defaulters"
        subtitle="Active students without a payment for the selected month."
        actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>}
      />
      <div className="card mb-4 no-print">
        <div className="card-body flex items-center gap-3">
          <label className="label mb-0">Month</label>
          <input type="month" className="input w-56" value={month} onChange={(e) => setMonth(e.target.value)} />
          <div className="ml-auto text-sm">Total outstanding: <b className="text-rose-700">{fmtCurrency(total)}</b></div>
        </div>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Adm No</th><th>Name</th><th>Father</th><th>Class</th><th>Phone</th><th>Monthly Fee</th></tr></thead>
          <tbody>
            {defaulters.map((s) => (
              <tr key={s.id}><td>{s.admissionNo}</td><td>{s.name}</td><td>{s.fatherName}</td><td>{s.className}-{s.section}</td><td>{s.phone}</td><td>{fmtCurrency(s.monthlyFee)}</td></tr>
            ))}
            {!defaulters.length && <tr><td colSpan={6} className="text-center text-slate-500 py-6">All clear for {month}. </td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
