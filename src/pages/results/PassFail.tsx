import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useResults, useStudents, useSubjects } from "../../store";
import { CLASSES, TERMS } from "../../utils";
import { Printer } from "lucide-react";

export default function PassFail() {
  const [results] = useResults();
  const [students] = useStudents();
  const [subjects] = useSubjects();
  const [cls, setCls] = useState("5");
  const [term, setTerm] = useState(TERMS[0]);

  const rows = useMemo(() => {
    const subs = subjects.filter((s) => s.className === cls);
    return results
      .filter((r) => r.className === cls && r.term === term)
      .map((r) => {
        const failed = subs.filter((sub) => (Number(r.marks[sub.id]) || 0) < sub.passingMarks);
        const name = students.find((x) => x.id === r.studentId)?.name ?? "";
        return { id: r.id, name, failedSubjects: failed.map((f) => f.name), passed: failed.length === 0 };
      });
  }, [results, subjects, students, cls, term]);

  const pass = rows.filter((r) => r.passed);
  const fail = rows.filter((r) => !r.passed);

  return (
    <div>
      <PageHeader title="Pass / Fail Students" subtitle={`${cls} • ${term}`} actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>} />
      <div className="card mb-5 no-print">
        <div className="card-body flex gap-3">
          <div><label className="label">Class</label><select className="input w-40" value={cls} onChange={(e) => setCls(e.target.value)}>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label">Term</label><select className="input w-56" value={term} onChange={(e) => setTerm(e.target.value)}>{TERMS.map((t) => <option key={t}>{t}</option>)}</select></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card"><div className="card-header"><h3 className="font-semibold text-emerald-700">Passed ({pass.length})</h3></div>
          <table className="table"><tbody>{pass.map((r) => <tr key={r.id}><td>{r.name}</td></tr>)}{!pass.length && <tr><td className="text-center text-slate-500 py-5">—</td></tr>}</tbody></table>
        </div>
        <div className="card"><div className="card-header"><h3 className="font-semibold text-rose-700">Failed ({fail.length})</h3></div>
          <table className="table"><thead><tr><th>Student</th><th>Failed in</th></tr></thead><tbody>{fail.map((r) => <tr key={r.id}><td>{r.name}</td><td className="text-rose-700">{r.failedSubjects.join(", ")}</td></tr>)}{!fail.length && <tr><td colSpan={2} className="text-center text-slate-500 py-5">—</td></tr>}</tbody></table>
        </div>
      </div>
    </div>
  );
}
