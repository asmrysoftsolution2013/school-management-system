import { useEffect, useState } from "react";
import PageHeader from "./PageHeader";
import { useSettings } from "../store";
import { Printer, Save } from "lucide-react";
import { fmtDate, todayISO } from "../utils";

interface Props {
  title: string;
  storageKey: string;
  defaultTo: string;
  defaultSubject: string;
  defaultBody: string;
}

export default function LetterPage({ title, storageKey, defaultTo, defaultSubject, defaultBody }: Props) {
  const [settings] = useSettings();
  const [to, setTo] = useState(defaultTo);
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [date, setDate] = useState(todayISO());

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const o = JSON.parse(saved);
        setTo(o.to ?? defaultTo);
        setSubject(o.subject ?? defaultSubject);
        setBody(o.body ?? defaultBody);
      } catch { /* ignore */ }
    }
  }, [storageKey, defaultTo, defaultSubject, defaultBody]);

  const save = () => {
    localStorage.setItem(storageKey, JSON.stringify({ to, subject, body }));
    alert("Letter template saved.");
  };

  return (
    <div>
      <PageHeader
        title={title}
        subtitle="Edit, save, and print."
        actions={
          <>
            <button className="btn-secondary" onClick={save}><Save className="w-4 h-4" /> Save</button>
            <button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>
          </>
        }
      />

      <div className="card mb-5 no-print">
        <div className="card-body grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="label">To</label>
            <input className="input" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="md:col-span-3">
            <label className="label">Subject</label>
            <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="md:col-span-3">
            <label className="label">Body</label>
            <textarea className="input" rows={8} value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="text-center border-b pb-4 mb-6">
            {settings.logoDataUrl && <img src={settings.logoDataUrl} className="w-16 h-16 mx-auto rounded-full object-cover" />}
            <h2 className="text-xl font-semibold mt-2">{settings.name}</h2>
            <div className="text-xs text-slate-500">{settings.address} • {settings.phone} • {settings.email}</div>
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <div className="text-slate-500">To,</div>
              <div className="whitespace-pre-line font-medium">{to}</div>
            </div>
            <div className="text-right text-slate-600">Date: {fmtDate(date)}</div>
          </div>
          <div className="mt-6 text-sm">
            <div><span className="font-semibold">Subject:</span> {subject}</div>
            <p className="mt-4 leading-7 whitespace-pre-wrap">{body}</p>
          </div>
          <div className="mt-16 text-right">
            {settings.signatureDataUrl && <img src={settings.signatureDataUrl} className="h-12 inline-block" />}
            <div className="border-t border-slate-400 pt-1 inline-block px-6 ml-auto text-sm mt-1">{settings.principal}</div>
            <div className="text-xs text-slate-500">Principal</div>
          </div>
        </div>
      </div>
    </div>
  );
}
