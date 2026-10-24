import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useSettings, useStudents } from "../../store";
import { fmtDate } from "../../utils";
import { Printer } from "lucide-react";

export default function FilledForms() {
  const [settings] = useSettings();
  const [students] = useStudents();
  const [sel, setSel] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSel((s) => (s.includes(id) ? s.filter((i) => i !== id) : [...s, id]));

  const chosen = students.filter((s) => sel.includes(s.id));

  return (
    <div>
      <PageHeader
        title="Print Filled Admission Forms"
        subtitle="Pick students to print pre-filled forms."
        actions={<button className="btn-primary" onClick={() => window.print()} disabled={!chosen.length}><Printer className="w-4 h-4" /> Print Selected</button>}
      />

      <div className="card mb-5 no-print">
        <div className="card-body max-h-80 overflow-auto">
          <table className="table">
            <thead><tr><th></th><th>Adm No</th><th>Name</th><th>Father</th><th>Class</th></tr></thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td><input type="checkbox" checked={sel.includes(s.id)} onChange={() => toggle(s.id)} /></td>
                  <td>{s.admissionNo}</td><td>{s.name}</td><td>{s.fatherName}</td><td>{s.className}-{s.section}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        {chosen.map((s) => (
          <div key={s.id} className="card break-inside-avoid print:page-break-after-always">
            <div className="card-body">
              <div className="text-center border-b pb-3 mb-4">
                <h3 className="font-semibold">{settings.name}</h3>
                <div className="text-xs text-slate-500">{settings.address}</div>
                <div className="font-medium mt-1">Admission Form — {settings.session}</div>
              </div>
              <div className="flex justify-end mb-3">
                <div className="w-24 h-28 border border-slate-300 grid place-items-center text-xs text-slate-400 overflow-hidden">
                  {s.photoDataUrl ? <img src={s.photoDataUrl} className="object-cover w-full h-full" /> : "Photo"}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
                <Row label="Admission No" value={s.admissionNo} />
                <Row label="Admission Date" value={fmtDate(s.admissionDate)} />
                <Row label="Name" value={s.name} />
                <Row label="Father" value={s.fatherName} />
                <Row label="Mother" value={s.motherName} />
                <Row label="DOB" value={fmtDate(s.dob)} />
                <Row label="Gender" value={s.gender} />
                <Row label="Religion" value={s.religion} />
                <Row label="Class / Section" value={`${s.className} / ${s.section}`} />
                <Row label="Roll No" value={s.rollNo} />
                <Row label="CNIC / B-Form" value={s.cnic} />
                <Row label="Blood Group" value={s.bloodGroup} />
                <Row label="Phone" value={s.phone} />
                <Row label="Monthly Fee" value={String(s.monthlyFee)} />
                <div className="col-span-2"><Row label="Address" value={s.address} /></div>
                <Row label="Previous School" value={s.previousSchool} />
                <Row label="Guardian Occupation" value={s.guardianOccupation} />
              </div>
            </div>
          </div>
        ))}
        {!chosen.length && <div className="text-sm text-slate-500">Select students above to generate forms.</div>}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="border-b border-dotted border-slate-400 py-0.5">{value || "—"}</div>
    </div>
  );
}
