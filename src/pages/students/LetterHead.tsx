import PageHeader from "../../components/PageHeader";
import { useSettings } from "../../store";
import { Printer } from "lucide-react";

export default function LetterHead() {
  const [settings] = useSettings();
  return (
    <div>
      <PageHeader
        title="Letter Head"
        subtitle="Printable school letterhead for official correspondence."
        actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>}
      />
      <div className="card">
        <div className="card-body">
          <header className="flex items-center gap-5 border-b pb-5">
            {settings.logoDataUrl && <img src={settings.logoDataUrl} className="w-20 h-20 rounded-full object-cover" />}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-brand-800">{settings.name}</h1>
              <div className="italic text-sm text-slate-500">{settings.motto}</div>
              <div className="text-xs text-slate-500 mt-1">{settings.address}</div>
            </div>
            <div className="text-right text-xs text-slate-600">
              <div>Phone: {settings.phone}</div>
              <div>Email: {settings.email}</div>
              <div>Session: {settings.session}</div>
            </div>
          </header>
          <div className="h-[70vh]" />
          <footer className="border-t pt-3 text-center text-xs text-slate-500">
            {settings.address} · {settings.phone} · {settings.email}
          </footer>
        </div>
      </div>
    </div>
  );
}
