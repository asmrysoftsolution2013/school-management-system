import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useSettings } from "../../store";
import { Printer } from "lucide-react";
import { fmtDate, todayISO } from "../../utils";

export default function InstitutionPass() {
  const [settings] = useSettings();
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("Entry Pass");
  const [valid, setValid] = useState(todayISO());

  return (
    <div>
      <PageHeader title="Institution Pass" subtitle="Issue a short entry / gate pass." actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>} />
      <div className="card mb-5 no-print"><div className="card-body grid grid-cols-1 md:grid-cols-3 gap-3">
        <div><label className="label">Holder Name</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div><label className="label">Purpose</label><input className="input" value={purpose} onChange={(e) => setPurpose(e.target.value)} /></div>
        <div><label className="label">Valid Till</label><input type="date" className="input" value={valid} onChange={(e) => setValid(e.target.value)} /></div>
      </div></div>
      <div className="card max-w-md mx-auto">
        <div className="card-body text-center">
          {settings.logoDataUrl && <img src={settings.logoDataUrl} className="w-16 h-16 mx-auto rounded-full object-cover" />}
          <h2 className="font-semibold mt-2">{settings.name}</h2>
          <div className="text-xs text-slate-500">{settings.address}</div>
          <div className="my-4 border-y py-2 font-semibold tracking-widest">INSTITUTION PASS</div>
          <div className="text-sm space-y-1">
            <div>This pass is issued to:</div>
            <div className="text-lg font-semibold">{name || "____________"}</div>
            <div>Purpose: {purpose}</div>
            <div className="text-xs text-slate-500">Valid till {fmtDate(valid)}</div>
          </div>
          <div className="mt-10">
            {settings.signatureDataUrl && <img src={settings.signatureDataUrl} className="h-10 mx-auto" />}
            <div className="border-t border-slate-400 pt-1 inline-block px-6 text-sm mt-1">{settings.principal}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
