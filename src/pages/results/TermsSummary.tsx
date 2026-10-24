import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useResults, useStudents, useSubjects } from "../../store";
import { CLASSES, TERMS } from "../../utils";
import { Printer } from "lucide-react";

export default function TermsSummary() {
  const [results] = useResults();
  const [students] = useStudents();
  const [subjects] = useSubjects();
  const [cls, setCls] = useState("5");

  const data = useMemo(() => {
    const subs = subjects.filter((s) => s.className === cls);
    const max = subs.reduce((s, x) => s + x.maxMarks, 0);
    return students.filter((s) => s.className === cls && s.status === "Active").map((st) => {
      const perTerm: Record<string, number> = {};
      for (const t of TERMS) {
        const r = results.find((x) => x.studentId === st.id && x.className === cls && x.term === t);
        perTerm[t] = r ? subs.reduce((s, sub) => s + (Number(r.marks[sub.id]) || 0), 0) : 0;
      }
      const total = Object.values(perTerm).reduce((a, b) => a + b, 0);
      return { st, perTerm, total, max: max * TERMS.length };
    });
  }, [results, subjects, students, cls]);

  return (
    <div>
      <PageHeader title="Summary Of All Terms" subtitle="Term-wise comparison per student." actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>} />
      <div className="card mb-4 no-print"><div className="card-body"><label className="label">Class</label><select className="input w-40" value={cls} onChange={(e) => setCls(e.target.value)}>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select></div></div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Roll</th><th>Student</th>{TERMS.map((t) => <th key={t}>{t}</th>)}<th>Total</th><th>%</th></tr></thead>
          <tbody>
            {data.map(({ st, perTerm, total, max }) => (
              <tr key={st.id}>
                <td>{st.rollNo}</td>
                <td>{st.name}</td>
                {TERMS.map((t) => <td key={t}>{perTerm[t]}</td>)}
                <td className="font-semibold">{total}</td>
                <td>{max ? ((total / max) * 100).toFixed(1) : 0}%</td>
              </tr>
            ))}
            {!data.length && <tr><td colSpan={99} className="text-center text-slate-500 py-6">No students / results for this class.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
