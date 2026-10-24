import PageHeader from "../../components/PageHeader";
import { useSettings } from "../../store";
import { School, Mail, Phone, MapPin } from "lucide-react";

export default function About() {
  const [settings] = useSettings();
  return (
    <div>
      <PageHeader title="About" />
      <div className="card max-w-2xl mx-auto">
        <div className="card-body text-center">
          {settings.logoDataUrl ? (
            <img src={settings.logoDataUrl} className="w-24 h-24 mx-auto rounded-full object-cover" />
          ) : (
            <div className="w-24 h-24 mx-auto rounded-full bg-brand-100 grid place-items-center text-brand-700"><School className="w-10 h-10" /></div>
          )}
          <h2 className="text-2xl font-semibold mt-3">{settings.name}</h2>
          <div className="italic text-slate-500">{settings.motto}</div>

          <dl className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 text-sm">
            <div className="p-3 bg-slate-50 rounded"><MapPin className="w-4 h-4 mx-auto text-brand-600" /><div className="mt-1 text-slate-500">Address</div><div className="font-medium">{settings.address}</div></div>
            <div className="p-3 bg-slate-50 rounded"><Phone className="w-4 h-4 mx-auto text-brand-600" /><div className="mt-1 text-slate-500">Phone</div><div className="font-medium">{settings.phone}</div></div>
            <div className="p-3 bg-slate-50 rounded"><Mail className="w-4 h-4 mx-auto text-brand-600" /><div className="mt-1 text-slate-500">Email</div><div className="font-medium">{settings.email}</div></div>
          </dl>

          <div className="mt-8 text-xs text-slate-500">
            School Management System • Built with React, TypeScript, Vite & Tailwind CSS
            <br />Data is stored locally in your browser. Export and keep a backup regularly.
          </div>
        </div>
      </div>
    </div>
  );
}
