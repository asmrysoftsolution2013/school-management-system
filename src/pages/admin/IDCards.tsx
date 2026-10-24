import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useSettings, useStudents } from "../../store";
import { CLASSES } from "../../utils";
import { Printer, School } from "lucide-react";

export default function IDCards() {
  const [students] = useStudents();
  const [settings] = useSettings();
  const [cls, setCls] = useState("");

  const list = students.filter((s) => (!cls || s.className === cls) && s.status === "Active");

  return (
    <div>
      <PageHeader title="Student ID Cards" subtitle="Printable ID cards for students." actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>} />
      <div className="card mb-4 no-print"><div className="card-body"><label className="label">Class (optional)</label><select className="input w-40" value={cls} onChange={(e) => setCls(e.target.value)}><option value="">All</option>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select></div></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((s) => (
          <div key={s.id} className="relative rounded-lg overflow-hidden shadow border bg-white print:break-inside-avoid">
            <div className="bg-gradient-to-r from-brand-700 to-brand-900 text-white p-3 flex items-center gap-3">
              {settings.logoDataUrl ? <img src={settings.logoDataUrl} className="w-10 h-10 rounded-full bg-white object-cover" /> : <div className="w-10 h-10 bg-white/20 rounded-full grid place-items-center"><School className="w-5 h-5" /></div>}
              <div className="min-w-0">
                <div className="font-semibold truncate">{settings.name}</div>
                <div className="text-xs text-brand-100">Student ID — {settings.session}</div>
              </div>
            </div>
            <div className="p-3 flex gap-3">
              <div className="w-20 h-24 bg-slate-100 overflow-hidden grid place-items-center text-xs text-slate-400">
                {s.photoDataUrl ? <img src={s.photoDataUrl} className="w-full h-full object-cover" /> : "Photo"}
              </div>
              <div className="text-sm flex-1 space-y-0.5">
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs text-slate-500">S/o {s.fatherName}</div>
                <div className="text-xs">Adm: <b>{s.admissionNo}</b></div>
                <div className="text-xs">Class: <b>{s.className}-{s.section}</b> · Roll {s.rollNo}</div>
                {s.bloodGroup && <div className="text-xs">Blood: <b>{s.bloodGroup}</b></div>}
                <div className="text-xs text-slate-500 truncate">📞 {s.phone}</div>
              </div>
            </div>
            <div className="bg-slate-100 text-[10px] text-slate-500 px-3 py-1 flex justify-between">
              <span>{settings.address}</span>
              <span>{settings.phone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
