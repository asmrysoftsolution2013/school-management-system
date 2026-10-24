import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { Save, Trash2, Plus } from "lucide-react";

const KEY = "sms:cashCategories";
const DEFAULTS = ["Fee Income", "Donation", "Rent", "Utility", "Salary", "Stationery", "Transport", "Miscellaneous"];

export default function CashBookHeading() {
  const [list, setList] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "null") ?? DEFAULTS; } catch { return DEFAULTS; }
  });
  const [draft, setDraft] = useState("");

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(list)); }, [list]);

  return (
    <div>
      <PageHeader title="Set Cash Book Headings" subtitle="Categories used in Daily Cash Book and Ledger." actions={<button className="btn-primary" onClick={() => alert("Saved.")}><Save className="w-4 h-4" /> Save</button>} />
      <div className="card">
        <div className="card-body">
          <div className="flex gap-2 mb-3">
            <input className="input" placeholder="New category…" value={draft} onChange={(e) => setDraft(e.target.value)} />
            <button className="btn-primary" onClick={() => { if (draft) { setList([...list, draft]); setDraft(""); } }}><Plus className="w-4 h-4" /> Add</button>
          </div>
          <ul className="divide-y">
            {list.map((c, i) => (
              <li key={c + i} className="flex items-center justify-between py-2">
                <span>{c}</span>
                <button className="btn-ghost text-rose-600" onClick={() => setList(list.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4" /></button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
