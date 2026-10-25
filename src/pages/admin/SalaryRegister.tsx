import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useSalaries, useStaff, useSettings } from "../../store";
import { fmtCurrency, fmtDate, monthISO } from "../../utils";
import { Printer } from "lucide-react";

type TypeFilter = "All" | "Teacher" | "Admin" | "Support";

export default function SalaryRegister() {
  const [staff] = useStaff();
  const [salaries] = useSalaries();
  const [settings] = useSettings();

  const [month, setMonth] = useState(monthISO());
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");

  const rows = useMemo(() => {
    const filtered = staff
      .filter((s) => s.status === "Active")
      .filter((s) => (typeFilter === "All" ? true : s.type === typeFilter));
    return filtered.map((s) => {
      const pay = salaries.find((p) => p.staffId === s.id && p.month === month);
      return {
        staff: s,
        basic: pay?.basic ?? s.salary,
        allowances: pay?.allowances ?? 0,
        deductions: pay?.deductions ?? 0,
        net: pay?.net ?? s.salary,
        paid: !!pay,
        paidOn: pay?.paidOn,
        method: pay?.method,
      };
    });
  }, [staff, salaries, month, typeFilter]);

  const totals = rows.reduce(
    (t, r) => ({
      basic: t.basic + r.basic,
      allowances: t.allowances + r.allowances,
      deductions: t.deductions + r.deductions,
      net: t.net + r.net,
      paidCount: t.paidCount + (r.paid ? 1 : 0),
    }),
    { basic: 0, allowances: 0, deductions: 0, net: 0, paidCount: 0 }
  );

  return (
    <div>
      <PageHeader
        title="Salary Register"
        subtitle={`Monthly payroll statement for all staff`}
        actions={
          <button className="btn-primary" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print
          </button>
        }
      />

      <div className="card mb-4 no-print">
        <div className="card-body grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="label">Month</label>
            <input type="month" className="input" value={month} onChange={(e) => setMonth(e.target.value)} />
          </div>
          <div>
            <label className="label">Staff type</label>
            <select className="input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}>
              <option>All</option>
              <option>Teacher</option>
              <option>Admin</option>
              <option>Support</option>
            </select>
          </div>
          <div className="md:col-span-2 text-sm self-end text-slate-600">
            Showing <b>{rows.length}</b> staff ·
            Paid: <b className="text-emerald-700">{totals.paidCount}</b> ·
            Pending: <b className="text-rose-700">{rows.length - totals.paidCount}</b>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="text-center border-b pb-3 mb-4">
            {settings.logoDataUrl && <img src={settings.logoDataUrl} className="w-14 h-14 mx-auto rounded-full object-cover" />}
            <h2 className="text-xl font-semibold mt-2">{settings.name}</h2>
            <div className="text-xs text-slate-500">{settings.address}</div>
            <div className="mt-2 text-sm font-medium">Salary Register — {month}</div>
            {typeFilter !== "All" && <div className="text-xs text-slate-500">Staff type: {typeFilter}</div>}
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Staff ID</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Type</th>
                <th className="text-right">Basic</th>
                <th className="text-right">Allow.</th>
                <th className="text-right">Deduct.</th>
                <th className="text-right">Net Pay</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.staff.id}>
                  <td>{i + 1}</td>
                  <td>{r.staff.staffId}</td>
                  <td className="font-medium">{r.staff.name}</td>
                  <td>{r.staff.designation}</td>
                  <td>{r.staff.type}</td>
                  <td className="text-right">{fmtCurrency(r.basic)}</td>
                  <td className="text-right">{fmtCurrency(r.allowances)}</td>
                  <td className="text-right text-rose-700">{fmtCurrency(r.deductions)}</td>
                  <td className="text-right font-semibold">{fmtCurrency(r.net)}</td>
                  <td>
                    {r.paid ? (
                      <span className="text-xs text-emerald-700">
                        Paid {r.paidOn ? fmtDate(r.paidOn) : ""} {r.method ? `· ${r.method}` : ""}
                      </span>
                    ) : (
                      <span className="text-xs text-rose-700">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={10} className="text-center text-slate-500 py-6">
                    No staff match this filter.
                  </td>
                </tr>
              )}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100 font-semibold">
                  <td colSpan={5}>Total</td>
                  <td className="text-right">{fmtCurrency(totals.basic)}</td>
                  <td className="text-right">{fmtCurrency(totals.allowances)}</td>
                  <td className="text-right text-rose-700">{fmtCurrency(totals.deductions)}</td>
                  <td className="text-right">{fmtCurrency(totals.net)}</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>

          <div className="flex justify-between items-end mt-16 text-xs text-slate-600 pt-4">
            <div>
              <div className="border-t border-slate-400 pt-1 px-6">Prepared by</div>
            </div>
            <div className="text-center">
              {settings.signatureDataUrl && <img src={settings.signatureDataUrl} className="h-10 mx-auto" />}
              <div className="border-t border-slate-400 pt-1 px-6">{settings.principal}</div>
              <div className="text-slate-500">Principal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
