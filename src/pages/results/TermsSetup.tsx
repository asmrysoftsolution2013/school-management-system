import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { Plus, Save, Trash2 } from "lucide-react";

const KEY = "sms:terms";
const DEFAULT = ["First Term", "Mid Term", "Final Term"];

export default function TermsSetup() {
  const [terms, setTerms] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "null") ?? DEFAULT; } catch { return DEFAULT; }
  });
  const [draft, setDraft] = useState("");

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(terms)); }, [terms]);

  return (
    <div>
      <PageHeader title="Set Terms & Subjects" subtitle="Terms used across result entry and report cards." actions={<button className="btn-primary" onClick={() => alert("Saved.")}><Save className="w-4 h-4" /> Save</button>} />
      <div className="card">
        <div className="card-body">
          <div className="flex gap-2 mb-4"><input className="input" placeholder="e.g. Second Term" value={draft} onChange={(e) => setDraft(e.target.value)} /><button className="btn-primary" onClick={() => { if (draft) { setTerms([...terms, draft]); setDraft(""); } }}><Plus className="w-4 h-4" /> Add Term</button></div>
          <ul className="divide-y">
            {terms.map((t, i) => (
              <li key={t + i} className="flex items-center justify-between py-2">
                <span>{t}</span>
                <button className="btn-ghost text-rose-600" onClick={() => setTerms(terms.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4" /></button>
              </li>
            ))}
          </ul>
          <p className="text-sm text-slate-500 mt-4">Subjects are managed per class on the <b>Subjects & Max Marks</b> page.</p>
        </div>
      </div>
    </div>
  );
}
