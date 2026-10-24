import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import { useSettings } from "../../store";
import { Printer, Save } from "lucide-react";

const KEY = "sms:institutionRules";
const DEFAULT = `1. Students must reach school at least 10 minutes before the first bell.
2. School uniform is compulsory on all working days.
3. Any absence must be followed by a written leave application from the guardian.
4. Students shall maintain discipline inside the premises at all times.
5. Monthly fee must be paid by the 10th of each month to avoid a late fine.
6. Use of mobile phones is strictly prohibited inside the school.
7. Damage to school property will be charged to the responsible student.
8. Report cards will be issued only after full payment of dues.
9. Guardians are expected to attend every parent-teacher meeting.
10. The management reserves the right to amend these rules at any time.`;

export default function InstitutionRules() {
  const [settings] = useSettings();
  const [text, setText] = useState(DEFAULT);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved) setText(saved);
  }, []);

  const save = () => {
    localStorage.setItem(KEY, text);
    alert("Rules saved.");
  };

  return (
    <div>
      <PageHeader
        title="Institution Rules"
        subtitle="Edit and print the rules & regulations booklet."
        actions={
          <>
            <button className="btn-secondary" onClick={save}><Save className="w-4 h-4" /> Save</button>
            <button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>
          </>
        }
      />

      <div className="card mb-4 no-print">
        <div className="card-body">
          <textarea className="input font-mono text-sm" rows={14} value={text} onChange={(e) => setText(e.target.value)} />
        </div>
      </div>

      <div className="card print-area">
        <div className="card-body">
          <div className="text-center border-b pb-3 mb-5">
            <h2 className="text-xl font-semibold">{settings.name}</h2>
            <div className="text-xs text-slate-500">{settings.address} • {settings.phone}</div>
            <h3 className="mt-3 font-semibold">RULES & REGULATIONS — {settings.session}</h3>
          </div>
          <pre className="whitespace-pre-wrap font-sans leading-relaxed text-slate-800">{text}</pre>
          <div className="mt-10 text-right">
            <div className="inline-block text-center">
              {settings.signatureDataUrl && <img src={settings.signatureDataUrl} className="h-12 inline-block" />}
              <div className="border-t border-slate-400 pt-1 text-sm mt-1">{settings.principal} — Principal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
