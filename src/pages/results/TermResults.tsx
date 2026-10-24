import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useResults, useStudents, useSubjects, uid } from "../../store";
import { CLASSES, TERMS } from "../../utils";
import { Save } from "lucide-react";

export default function TermResults() {
  const [students] = useStudents();
  const [subjects] = useSubjects();
  const [results, setResults] = useResults();
  const [cls, setCls] = useState("5");
  const [term, setTerm] = useState(TERMS[0]);
  const [marks, setMarks] = useState<Record<string, Record<string, number>>>({});

  const clsStudents = students.filter((s) => s.className === cls && s.status === "Active");
  const clsSubjects = subjects.filter((s) => s.className === cls);

  useEffect(() => {
    const next: Record<string, Record<string, number>> = {};
    for (const st of clsStudents) {
      const existing = results.find((r) => r.studentId === st.id && r.term === term && r.className === cls);
      next[st.id] = existing?.marks ?? {};
    }
    setMarks(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cls, term, students.length, results.length]);

  const setMark = (sid: string, subId: string, v: number) =>
    setMarks((m) => ({ ...m, [sid]: { ...(m[sid] ?? {}), [subId]: v } }));

  const totals = useMemo(() => {
    const t: Record<string, { obtained: number; max: number }> = {};
    for (const st of clsStudents) {
      const m = marks[st.id] ?? {};
      const obtained = clsSubjects.reduce((s, sub) => s + (Number(m[sub.id]) || 0), 0);
      const max = clsSubjects.reduce((s, sub) => s + sub.maxMarks, 0);
      t[st.id] = { obtained, max };
    }
    return t;
  }, [clsStudents, clsSubjects, marks]);

  const save = () => {
    const next = results.filter((r) => !(r.term === term && r.className === cls && marks[r.studentId]));
    for (const st of clsStudents) {
      next.push({
        id: uid(), studentId: st.id, term, className: cls, marks: marks[st.id] ?? {},
      });
    }
    setResults(next);
    alert("Results saved.");
  };

  return (
    <div>
      <PageHeader title="Enter Term Results" subtitle="Record marks subject-wise for each student." actions={<button className="btn-primary" onClick={save}><Save className="w-4 h-4" /> Save</button>} />
      <div className="card mb-4">
        <div className="card-body flex gap-3">
          <div><label className="label">Class</label><select className="input w-40" value={cls} onChange={(e) => setCls(e.target.value)}>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label">Term</label><select className="input w-56" value={term} onChange={(e) => setTerm(e.target.value)}>{TERMS.map((t) => <option key={t}>{t}</option>)}</select></div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Roll</th><th>Student</th>
              {clsSubjects.map((s) => <th key={s.id}>{s.name}<div className="text-[10px] font-normal text-slate-400">/{s.maxMarks}</div></th>)}
              <th>Obt.</th><th>Max</th><th>%</th>
            </tr>
          </thead>
          <tbody>
            {clsStudents.map((st) => (
              <tr key={st.id}>
                <td>{st.rollNo}</td>
                <td>{st.name}</td>
                {clsSubjects.map((sub) => (
                  <td key={sub.id}>
                    <input
                      type="number"
                      min={0}
                      max={sub.maxMarks}
                      className="input w-20"
                      value={marks[st.id]?.[sub.id] ?? ""}
                      onChange={(e) => setMark(st.id, sub.id, Number(e.target.value))}
                    />
                  </td>
                ))}
                <td className="font-semibold">{totals[st.id]?.obtained ?? 0}</td>
                <td>{totals[st.id]?.max ?? 0}</td>
                <td>{totals[st.id]?.max ? ((totals[st.id].obtained / totals[st.id].max) * 100).toFixed(1) : 0}%</td>
              </tr>
            ))}
            {(!clsStudents.length || !clsSubjects.length) && (
              <tr><td colSpan={99} className="text-center text-slate-500 py-6">Add students and subjects for this class first.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
