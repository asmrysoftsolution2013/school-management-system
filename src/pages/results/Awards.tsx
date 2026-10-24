import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useResults, useStudents, useSubjects } from "../../store";
import { CLASSES, TERMS } from "../../utils";
import { Printer, Trophy } from "lucide-react";

export default function Awards() {
  const [results] = useResults();
  const [students] = useStudents();
  const [subjects] = useSubjects();
  const [cls, setCls] = useState("5");
  const [term, setTerm] = useState(TERMS[0]);

  const list = useMemo(() => {
    const subs = subjects.filter((s) => s.className === cls);
    return results
      .filter((r) => r.className === cls && r.term === term)
      .map((r) => {
        const obt = subs.reduce((s, sub) => s + (Number(r.marks[sub.id]) || 0), 0);
        const max = subs.reduce((s, sub) => s + sub.maxMarks, 0);
        const pct = max ? (obt / max) * 100 : 0;
        return { name: students.find((x) => x.id === r.studentId)?.name ?? "", pct };
      })
      .filter((r) => r.pct >= 80)
      .sort((a, b) => b.pct - a.pct);
  }, [results, subjects, students, cls, term]);

  return (
    <div>
      <PageHeader title="Student Award List" subtitle="Students scoring 80% or above receive an award." actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>} />
      <div className="card mb-5 no-print">
        <div className="card-body flex gap-3">
          <div><label className="label">Class</label><select className="input w-40" value={cls} onChange={(e) => setCls(e.target.value)}>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label">Term</label><select className="input w-56" value={term} onChange={(e) => setTerm(e.target.value)}>{TERMS.map((t) => <option key={t}>{t}</option>)}</select></div>
        </div>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th></th><th>Student</th><th>Percentage</th></tr></thead>
          <tbody>
            {list.map((r, i) => (
              <tr key={i}>
                <td><Trophy className="w-4 h-4 text-amber-500" /></td>
                <td>{r.name}</td>
                <td className="font-semibold">{r.pct.toFixed(1)}%</td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan={3} className="text-center text-slate-500 py-6">No awardees for this selection.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
