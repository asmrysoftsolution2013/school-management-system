import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useResults, useStudents, useSubjects } from "../../store";
import { CLASSES, TERMS } from "../../utils";
import { Printer } from "lucide-react";

export default function Positions() {
  const [results] = useResults();
  const [students] = useStudents();
  const [subjects] = useSubjects();
  const [cls, setCls] = useState("5");
  const [term, setTerm] = useState(TERMS[0]);

  const ranked = useMemo(() => {
    const clsSubs = subjects.filter((s) => s.className === cls);
    const rows = results
      .filter((r) => r.className === cls && r.term === term)
      .map((r) => {
        const obtained = clsSubs.reduce((s, sub) => s + (Number(r.marks[sub.id]) || 0), 0);
        const max = clsSubs.reduce((s, sub) => s + sub.maxMarks, 0);
        const st = students.find((x) => x.id === r.studentId);
        return { id: r.id, name: st?.name ?? "", roll: st?.rollNo ?? "", obtained, max, pct: max ? (obtained / max) * 100 : 0 };
      })
      .sort((a, b) => b.obtained - a.obtained)
      .map((r, i) => ({ ...r, position: i + 1 }));
    return rows;
  }, [results, subjects, students, cls, term]);

  return (
    <div>
      <PageHeader title="Position Holders" subtitle="Ranked list for the selected class and term." actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>} />
      <div className="card mb-4 no-print">
        <div className="card-body flex gap-3">
          <div><label className="label">Class</label><select className="input w-40" value={cls} onChange={(e) => setCls(e.target.value)}>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label">Term</label><select className="input w-56" value={term} onChange={(e) => setTerm(e.target.value)}>{TERMS.map((t) => <option key={t}>{t}</option>)}</select></div>
        </div>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Position</th><th>Roll</th><th>Student</th><th>Obtained</th><th>Max</th><th>%</th></tr></thead>
          <tbody>
            {ranked.map((r) => (
              <tr key={r.id}>
                <td><span className={`pill ${r.position <= 3 ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"}`}>{r.position}</span></td>
                <td>{r.roll}</td><td>{r.name}</td><td className="font-semibold">{r.obtained}</td><td>{r.max}</td><td>{r.pct.toFixed(1)}%</td>
              </tr>
            ))}
            {!ranked.length && <tr><td colSpan={6} className="text-center text-slate-500 py-6">No results entered yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
