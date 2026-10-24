import PageHeader from "../../components/PageHeader";
import { useSettings } from "../../store";
import { Printer } from "lucide-react";

export default function EmptyForm() {
  const [settings] = useSettings();

  const rows = [
    ["Admission No", "Admission Date"],
    ["Student's Name", "Father's Name"],
    ["Mother's Name", "Date of Birth"],
    ["Gender", "Religion"],
    ["Class / Section", "Roll No"],
    ["CNIC / B-Form No", "Blood Group"],
    ["Guardian Occupation", "Monthly Fee"],
    ["Phone", "Emergency Contact"],
    ["Previous School", "Previous Class"],
  ];

  return (
    <div>
      <PageHeader
        title="Print Empty Admission Form"
        subtitle="A blank admission form you can print and fill by hand."
        actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>}
      />
      <div className="card">
        <div className="card-body">
          <div className="text-center border-b pb-4 mb-6">
            {settings.logoDataUrl && <img src={settings.logoDataUrl} className="w-16 h-16 mx-auto rounded-full object-cover" alt="" />}
            <h2 className="text-2xl font-semibold mt-2">{settings.name}</h2>
            <p className="text-sm text-slate-500">{settings.address} • {settings.phone}</p>
            <p className="text-xs mt-2 italic">{settings.motto}</p>
            <h3 className="mt-4 font-semibold tracking-wide">ADMISSION FORM — {settings.session}</h3>
          </div>

          <div className="flex justify-end mb-4">
            <div className="w-28 h-32 border border-slate-400 border-dashed grid place-items-center text-xs text-slate-400">
              Paste Photo
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-5">
            {rows.flat().map((label) => (
              <div key={label}>
                <div className="text-xs text-slate-500">{label}</div>
                <div className="border-b border-dotted border-slate-400 h-6" />
              </div>
            ))}
            <div className="col-span-2">
              <div className="text-xs text-slate-500">Address</div>
              <div className="border-b border-dotted border-slate-400 h-6" />
              <div className="border-b border-dotted border-slate-400 h-6 mt-5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 mt-16">
            <div className="text-center">
              <div className="border-t border-slate-400 pt-2 text-sm">Signature of Guardian</div>
            </div>
            <div className="text-center">
              <div className="border-t border-slate-400 pt-2 text-sm">Signature of Principal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
