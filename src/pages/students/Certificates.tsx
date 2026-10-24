import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useSettings, useStudents } from "../../store";
import { fmtDate, todayISO } from "../../utils";
import { Printer } from "lucide-react";

const TYPES = ["Character Certificate", "Bonafide Certificate", "School Leaving Certificate"] as const;

export default function Certificates() {
  const [settings] = useSettings();
  const [students] = useStudents();
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [type, setType] = useState<(typeof TYPES)[number]>("Character Certificate");
  const [date, setDate] = useState(todayISO());

  const s = students.find((x) => x.id === studentId);

  const body = () => {
    if (!s) return "";
    const common = `This is to certify that ${s.name} S/o ${s.fatherName}, bearing Admission No. ${s.admissionNo}, was a student of ${settings.name} in Class ${s.className}${s.section ? "-" + s.section : ""}.`;
    switch (type) {
      case "Character Certificate":
        return `${common} During their stay, their conduct and character remained excellent. We wish them success in future endeavours.`;
      case "Bonafide Certificate":
        return `${common} They are a bonafide student of this institution for the session ${settings.session}.`;
      case "School Leaving Certificate":
        return `${common} They have left this institution on ${fmtDate(date)}. Their dues have been cleared and no record is pending against them.`;
    }
  };

  return (
    <div>
      <PageHeader
        title="Institution Certificates"
        subtitle="Generate character, bonafide, and school-leaving certificates."
        actions={<button className="btn-primary" onClick={() => window.print()} disabled={!s}><Printer className="w-4 h-4" /> Print</button>}
      />

      <div className="card mb-5 no-print">
        <div className="card-body grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Student</label>
            <select className="input" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
              {students.map((st) => <option key={st.id} value={st.id}>{st.admissionNo} — {st.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Certificate Type</label>
            <select className="input" value={type} onChange={(e) => setType(e.target.value as typeof type)}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
      </div>

      {s && (
        <div className="card">
          <div className="card-body text-center">
            {settings.logoDataUrl && <img src={settings.logoDataUrl} className="w-20 h-20 mx-auto rounded-full object-cover" />}
            <h2 className="text-2xl font-semibold mt-2">{settings.name}</h2>
            <div className="text-xs text-slate-500">{settings.address} • {settings.phone}</div>
            <div className="my-6 border-y py-2 font-semibold tracking-wider">{type.toUpperCase()}</div>
            <p className="max-w-2xl mx-auto leading-8 text-slate-800 text-base">{body()}</p>
            <div className="flex justify-between items-end mt-20 max-w-2xl mx-auto">
              <div className="text-sm">
                <div>Issued on: {fmtDate(date)}</div>
                <div>Session: {settings.session}</div>
              </div>
              <div className="text-center">
                {settings.signatureDataUrl && <img src={settings.signatureDataUrl} className="h-12 mx-auto" />}
                <div className="border-t border-slate-400 pt-1 text-sm">{settings.principal}</div>
                <div className="text-xs text-slate-500">Principal</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
