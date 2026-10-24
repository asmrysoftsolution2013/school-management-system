import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useSettings, useStudents } from "../../store";
import { fmtDate, todayISO } from "../../utils";
import { Printer } from "lucide-react";

export default function NOC() {
  const [students] = useStudents();
  const [settings] = useSettings();
  const [sid, setSid] = useState(students[0]?.id ?? "");
  const [reason, setReason] = useState("appearing in a scholarship examination");
  const [date, setDate] = useState(todayISO());
  const s = students.find((x) => x.id === sid);

  return (
    <div>
      <PageHeader title="No Objection Certificate" actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>} />
      <div className="card mb-5 no-print"><div className="card-body grid grid-cols-1 md:grid-cols-3 gap-3">
        <div><label className="label">Student</label><select className="input" value={sid} onChange={(e) => setSid(e.target.value)}>{students.map((st) => <option key={st.id} value={st.id}>{st.name}</option>)}</select></div>
        <div className="md:col-span-2"><label className="label">Purpose</label><input className="input" value={reason} onChange={(e) => setReason(e.target.value)} /></div>
        <div><label className="label">Date</label><input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      </div></div>
      {s && (
        <div className="card">
          <div className="card-body text-center">
            {settings.logoDataUrl && <img src={settings.logoDataUrl} className="w-20 h-20 mx-auto rounded-full object-cover" />}
            <h2 className="text-2xl font-semibold mt-2">{settings.name}</h2>
            <div className="text-xs text-slate-500">{settings.address}</div>
            <div className="my-6 border-y py-2 font-semibold tracking-wider">NO OBJECTION CERTIFICATE</div>
            <p className="max-w-2xl mx-auto leading-8 text-slate-800">
              This is to certify that <b>{s.name}</b>, S/o <b>{s.fatherName}</b>, Admission No. <b>{s.admissionNo}</b>, Class <b>{s.className}-{s.section}</b>, is a bonafide student of this institution.
              <br /><br />
              The institution has <b>no objection</b> to the student {reason}.
            </p>
            <div className="flex justify-between items-end mt-16 max-w-2xl mx-auto">
              <div className="text-sm">Date: {fmtDate(date)}</div>
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
