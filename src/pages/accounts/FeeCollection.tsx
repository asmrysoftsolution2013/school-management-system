import { useMemo, useState, type FormEvent } from "react";
import PageHeader from "../../components/PageHeader";
import { useFees, useStudents, useSettings, uid } from "../../store";
import { fmtCurrency, fmtDate, monthISO, todayISO } from "../../utils";
import { Receipt, Printer } from "lucide-react";
import type { FeePayment } from "../../types";

export default function FeeCollection() {
  const [students] = useStudents();
  const [fees, setFees] = useFees();
  const [settings] = useSettings();

  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [month, setMonth] = useState(monthISO());
  const [discount, setDiscount] = useState(0);
  const [fine, setFine] = useState(0);
  const [method, setMethod] = useState<FeePayment["method"]>("Cash");
  const [remarks, setRemarks] = useState("");

  const student = students.find((s) => s.id === studentId);
  const net = (student?.monthlyFee ?? 0) - discount + fine;
  const paidAlready = useMemo(
    () => fees.some((f) => f.studentId === studentId && f.month === month),
    [fees, studentId, month]
  );

  const [lastReceipt, setLastReceipt] = useState<FeePayment | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!student) return;
    const receiptNo = `R-${String(fees.length + 1).padStart(5, "0")}`;
    const rec: FeePayment = {
      id: uid(), studentId, month, amount: student.monthlyFee, discount, fine,
      paidOn: todayISO(), method, receiptNo, remarks,
    };
    setFees([...fees, rec]);
    setLastReceipt(rec);
    setDiscount(0); setFine(0); setRemarks("");
  };

  return (
    <div>
      <PageHeader title="Fee Collection" subtitle="Record a monthly fee payment and print a receipt." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <form onSubmit={submit} className="card lg:col-span-2">
          <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Student</label>
              <select className="input" value={studentId} onChange={(e) => setStudentId(e.target.value)} required>
                {students.map((s) => <option key={s.id} value={s.id}>{s.admissionNo} — {s.name} ({s.className}-{s.section})</option>)}
              </select>
            </div>
            <div>
              <label className="label">Month</label>
              <input type="month" className="input" value={month} onChange={(e) => setMonth(e.target.value)} />
            </div>
            <div>
              <label className="label">Monthly Fee</label>
              <input readOnly className="input bg-slate-50" value={student?.monthlyFee ?? 0} />
            </div>
            <div>
              <label className="label">Discount</label>
              <input type="number" className="input" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
            </div>
            <div>
              <label className="label">Late Fine</label>
              <input type="number" className="input" value={fine} onChange={(e) => setFine(Number(e.target.value))} />
            </div>
            <div>
              <label className="label">Payment Method</label>
              <select className="input" value={method} onChange={(e) => setMethod(e.target.value as FeePayment["method"])}>
                <option>Cash</option><option>Bank</option><option>Online</option>
              </select>
            </div>
            <div>
              <label className="label">Net Payable</label>
              <input readOnly className="input bg-emerald-50 text-emerald-700 font-semibold" value={fmtCurrency(net)} />
            </div>
            <div className="md:col-span-2">
              <label className="label">Remarks</label>
              <input className="input" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </div>
            {paidAlready && (
              <div className="md:col-span-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                Note: This student already has a payment recorded for {month}.
              </div>
            )}
          </div>
          <div className="card-header border-t justify-end">
            <button className="btn-primary" type="submit" disabled={!student}><Receipt className="w-4 h-4" /> Collect & Issue Receipt</button>
          </div>
        </form>

        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold">Receipt Preview</h3>
            {lastReceipt && <button className="btn-ghost" onClick={() => window.print()}><Printer className="w-4 h-4" /></button>}
          </div>
          <div className="card-body">
            {!lastReceipt ? (
              <div className="text-sm text-slate-500">Collect a payment to see the receipt.</div>
            ) : (
              <div className="text-sm">
                <div className="text-center border-b pb-2 mb-3">
                  <div className="font-semibold">{settings.name}</div>
                  <div className="text-xs text-slate-500">Fee Receipt</div>
                </div>
                <Row k="Receipt No" v={lastReceipt.receiptNo} />
                <Row k="Date" v={fmtDate(lastReceipt.paidOn)} />
                <Row k="Student" v={students.find((s) => s.id === lastReceipt.studentId)?.name ?? ""} />
                <Row k="Month" v={lastReceipt.month} />
                <Row k="Amount" v={fmtCurrency(lastReceipt.amount)} />
                <Row k="Discount" v={fmtCurrency(lastReceipt.discount)} />
                <Row k="Fine" v={fmtCurrency(lastReceipt.fine)} />
                <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
                  <span>Total Paid</span>
                  <span>{fmtCurrency(lastReceipt.amount - lastReceipt.discount + lastReceipt.fine)}</span>
                </div>
                <div className="text-xs text-slate-500 mt-4 text-center">{settings.motto}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between py-0.5">
      <span className="text-slate-500">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
