import { useState, type FormEvent } from "react";
import PageHeader from "../../components/PageHeader";
import { useSettings } from "../../store";
import { fileToDataURL } from "../../utils";
import { Save, Upload, Trash2 } from "lucide-react";

export default function SchoolInfo() {
  const [settings, setSettings] = useSettings();
  const [form, setForm] = useState(settings);

  const upd = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const onLogo = async (f: File | null) => f && upd("logoDataUrl", await fileToDataURL(f));
  const onSig = async (f: File | null) => f && upd("signatureDataUrl", await fileToDataURL(f));

  const submit = (e: FormEvent) => { e.preventDefault(); setSettings(form); alert("School info saved."); };

  return (
    <div>
      <PageHeader title="School Information" subtitle="Logo, signature, and basic details used across the app." />
      <form onSubmit={submit} className="card">
        <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="label">Logo</label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden grid place-items-center text-xs text-slate-400">
                {form.logoDataUrl ? <img src={form.logoDataUrl} className="w-full h-full object-cover" /> : "No Logo"}
              </div>
              <label className="btn-secondary cursor-pointer"><Upload className="w-4 h-4" /> Upload<input hidden type="file" accept="image/*" onChange={(e) => onLogo(e.target.files?.[0] ?? null)} /></label>
              {form.logoDataUrl && <button type="button" className="btn-ghost text-rose-600" onClick={() => upd("logoDataUrl", "")}><Trash2 className="w-4 h-4" /></button>}
            </div>
          </div>
          <div>
            <label className="label">Principal's Signature</label>
            <div className="flex items-center gap-3">
              <div className="w-40 h-16 bg-slate-100 overflow-hidden grid place-items-center text-xs text-slate-400">
                {form.signatureDataUrl ? <img src={form.signatureDataUrl} className="w-full h-full object-contain" /> : "No Signature"}
              </div>
              <label className="btn-secondary cursor-pointer"><Upload className="w-4 h-4" /> Upload<input hidden type="file" accept="image/*" onChange={(e) => onSig(e.target.files?.[0] ?? null)} /></label>
              {form.signatureDataUrl && <button type="button" className="btn-ghost text-rose-600" onClick={() => upd("signatureDataUrl", "")}><Trash2 className="w-4 h-4" /></button>}
            </div>
          </div>

          <div><label className="label">School Name</label><input className="input" value={form.name} onChange={(e) => upd("name", e.target.value)} /></div>
          <div><label className="label">Motto</label><input className="input" value={form.motto} onChange={(e) => upd("motto", e.target.value)} /></div>
          <div className="md:col-span-2"><label className="label">Address</label><input className="input" value={form.address} onChange={(e) => upd("address", e.target.value)} /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => upd("phone", e.target.value)} /></div>
          <div><label className="label">Email</label><input className="input" value={form.email} onChange={(e) => upd("email", e.target.value)} /></div>
          <div><label className="label">Session</label><input className="input" value={form.session} onChange={(e) => upd("session", e.target.value)} /></div>
          <div><label className="label">Principal</label><input className="input" value={form.principal} onChange={(e) => upd("principal", e.target.value)} /></div>
        </div>
        <div className="card-header border-t justify-end"><button className="btn-primary"><Save className="w-4 h-4" /> Save</button></div>
      </form>
    </div>
  );
}
