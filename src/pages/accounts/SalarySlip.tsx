import { useMemo, useState, type FormEvent } from "react";
import PageHeader from "../../components/PageHeader";
import { useSalaries, useStaff, useSettings, uid } from "../../store";
import { fmtCurrency, fmtDate, monthISO, todayISO } from "../../utils";
import { Printer, Save } from "lucide-react";
import type { SalaryPayment } from "../../types";

export default function SalarySlip() {
  const [staff] = useStaff();
  const [salaries, setSalaries] = useSalaries();
  const [settings] = useSettings();

  const [staffId, setStaffId] = useState(staff[0]?.id ?? "");
  const [month, setMonth] = useState(monthISO());
  const [allowances, setAllowances] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [method, setMethod] = useState<SalaryPayment["method"]>("Bank");
  const [remarks, setRemarks] = useState("");

  const s = staff.find((x) => x.id === staffId);
  const basic = s?.salary ?? 0;
  const net = basic + allowances - deductions;

  const existing = useMemo(() => salaries.find((p) => p.staffId === staffId && p.month === month), [salaries, staffId, month]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!s) return;
    const rec: SalaryPayment = { id: uid(), staffId, month, basic, allowances, deductions, net, paidOn: todayISO(), method, remarks };
    setSalaries([...salaries, rec]);
    alert("Salary recorded.");
  };

  return (
    <div>
      <PageHeader title="Salary Slip" subtitle="Pay staff and generate a printable salary slip." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <form onSubmit={submit} className="card">
          <div className="card-body grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Staff</label>
              <select className="input" value={staffId} onChange={(e) => setStaffId(e.target.value)} required>
                {staff.map((x) => <option key={x.id} value={x.id}>{x.staffId} — {x.name} ({x.designation})</option>)}
              </select>
            </div>
            <div><label className="label">Month</label><input type="month" className="input" value={month} onChange={(e) => setMonth(e.target.value)} /></div>
            <div><label className="label">Basic</label><input readOnly className="input bg-slate-50" value={basic} /></div>
            <div><label className="label">Allowances</label><input type="number" className="input" value={allowances} onChange={(e) => setAllowances(Number(e.target.value))} /></div>
            <div><label className="label">Deductions</label><input type="number" className="input" value={deductions} onChange={(e) => setDeductions(Number(e.target.value))} /></div>
            <div><label className="label">Method</label><select className="input" value={method} onChange={(e) => setMethod(e.target.value as SalaryPayment["method"])}><option>Bank</option><option>Cash</option></select></div>
            <div><label className="label">Net</label><input readOnly className="input bg-emerald-50 font-semibold text-emerald-700" value={fmtCurrency(net)} /></div>
            <div className="col-span-2"><label className="label">Remarks</label><input className="input" value={remarks} onChange={(e) => setRemarks(e.target.value)} /></div>
            {existing && <div className="col-span-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">Already paid for {month}.</div>}
          </div>
          <div className="card-header border-t justify-end"><button className="btn-primary"><Save className="w-4 h-4" /> Save Payment</button></div>
        </form>

        <div className="card">
          <div className="card-header"><h3 className="font-semibold">Salary Slip</h3><button className="btn-ghost" onClick={() => window.print()}><Printer className="w-4 h-4" /></button></div>
          <div className="card-body text-sm">
            <div className="text-center border-b pb-2 mb-3">
              <div className="font-semibold">{settings.name}</div>
              <div className="text-xs text-slate-500">Salary Slip for {month}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-slate-500">Staff ID</div><div>{s?.staffId}</div>
              <div className="text-slate-500">Name</div><div>{s?.name}</div>
              <div className="text-slate-500">Designation</div><div>{s?.designation}</div>
              <div className="text-slate-500">Pay Date</div><div>{fmtDate(todayISO())}</div>
            </div>
            <table className="table mt-4">
              <tbody>
                <tr><td>Basic</td><td className="text-right">{fmtCurrency(basic)}</td></tr>
                <tr><td>Allowances</td><td className="text-right">{fmtCurrency(allowances)}</td></tr>
                <tr><td>Deductions</td><td className="text-right text-rose-700">- {fmtCurrency(deductions)}</td></tr>
                <tr className="font-semibold bg-slate-50"><td>Net Pay</td><td className="text-right">{fmtCurrency(net)}</td></tr>
              </tbody>
            </table>
            <div className="flex justify-between items-end mt-10 text-xs">
              <div>{method}</div>
              <div className="text-center">
                {settings.signatureDataUrl && <img src={settings.signatureDataUrl} className="h-10 mx-auto" />}
                <div className="border-t border-slate-400 pt-1">Authorised Signatory</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-5">
        <div className="card-header"><h3 className="font-semibold">Recent Salary Payments</h3></div>
        <table className="table">
          <thead><tr><th>Date</th><th>Staff</th><th>Month</th><th>Basic</th><th>Allow.</th><th>Deduct.</th><th>Net</th><th>Method</th></tr></thead>
          <tbody>
            {salaries.slice().reverse().slice(0, 20).map((p) => (
              <tr key={p.id}>
                <td>{fmtDate(p.paidOn)}</td>
                <td>{staff.find((x) => x.id === p.staffId)?.name}</td>
                <td>{p.month}</td>
                <td>{fmtCurrency(p.basic)}</td>
                <td>{fmtCurrency(p.allowances)}</td>
                <td>{fmtCurrency(p.deductions)}</td>
                <td className="font-semibold">{fmtCurrency(p.net)}</td>
                <td>{p.method}</td>
              </tr>
            ))}
            {!salaries.length && <tr><td colSpan={8} className="text-center text-slate-500 py-6">No salary payments yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
