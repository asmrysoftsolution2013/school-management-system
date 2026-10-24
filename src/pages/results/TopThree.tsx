import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useResults, useStudents, useSubjects } from "../../store";
import { CLASSES, TERMS } from "../../utils";
import { Trophy, Printer } from "lucide-react";

export default function TopThree() {
  const [results] = useResults();
  const [students] = useStudents();
  const [subjects] = useSubjects();
  const [cls, setCls] = useState("5");
  const [term, setTerm] = useState(TERMS[0]);

  const top = useMemo(() => {
    const subs = subjects.filter((s) => s.className === cls);
    return results
      .filter((r) => r.className === cls && r.term === term)
      .map((r) => {
        const obt = subs.reduce((s, sub) => s + (Number(r.marks[sub.id]) || 0), 0);
        const max = subs.reduce((s, sub) => s + sub.maxMarks, 0);
        return { name: students.find((x) => x.id === r.studentId)?.name ?? "", obt, max };
      })
      .sort((a, b) => b.obt - a.obt)
      .slice(0, 3);
  }, [results, subjects, students, cls, term]);

  const colors = ["bg-amber-200 text-amber-900", "bg-slate-200 text-slate-800", "bg-orange-200 text-orange-900"];

  return (
    <div>
      <PageHeader title="Top Three Position Holders" subtitle={`${cls} • ${term}`} actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>} />
      <div className="card mb-5 no-print">
        <div className="card-body flex gap-3">
          <div><label className="label">Class</label><select className="input w-40" value={cls} onChange={(e) => setCls(e.target.value)}>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label">Term</label><select className="input w-56" value={term} onChange={(e) => setTerm(e.target.value)}>{TERMS.map((t) => <option key={t}>{t}</option>)}</select></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {top.map((r, i) => (
          <div key={i} className={`rounded-lg ${colors[i]} p-6 text-center shadow`}>
            <Trophy className="w-10 h-10 mx-auto" />
            <div className="text-sm mt-2">Position {i + 1}</div>
            <div className="text-xl font-semibold mt-1">{r.name}</div>
            <div className="text-sm mt-2">{r.obt} / {r.max} ({r.max ? ((r.obt / r.max) * 100).toFixed(1) : 0}%)</div>
          </div>
        ))}
        {!top.length && <div className="col-span-3 text-center text-slate-500">No results entered yet.</div>}
      </div>
    </div>
  );
}
