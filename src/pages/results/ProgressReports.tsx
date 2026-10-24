import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useResults, useSettings, useStudents, useSubjects } from "../../store";
import { CLASSES, TERMS } from "../../utils";
import { Printer } from "lucide-react";

export default function ProgressReports() {
  const [results] = useResults();
  const [students] = useStudents();
  const [subjects] = useSubjects();
  const [settings] = useSettings();
  const [cls, setCls] = useState("5");
  const [term, setTerm] = useState(TERMS[0]);

  const cards = useMemo(() => {
    const subs = subjects.filter((s) => s.className === cls);
    return results.filter((r) => r.className === cls && r.term === term).map((r) => {
      const student = students.find((x) => x.id === r.studentId);
      const subjectRows = subs.map((sub) => {
        const obt = Number(r.marks[sub.id]) || 0;
        return { name: sub.name, obt, max: sub.maxMarks, status: obt >= sub.passingMarks ? "Pass" : "Fail" };
      });
      const total = subjectRows.reduce((s, x) => s + x.obt, 0);
      const max = subjectRows.reduce((s, x) => s + x.max, 0);
      const pct = max ? (total / max) * 100 : 0;
      const grade = pct >= 80 ? "A+" : pct >= 70 ? "A" : pct >= 60 ? "B" : pct >= 50 ? "C" : pct >= 40 ? "D" : "F";
      return { student, subjectRows, total, max, pct, grade };
    });
  }, [results, subjects, students, cls, term]);

  return (
    <div>
      <PageHeader title="Progress Report Cards" subtitle={`${cls} • ${term}`} actions={<button className="btn-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>} />
      <div className="card mb-5 no-print">
        <div className="card-body flex gap-3">
          <div><label className="label">Class</label><select className="input w-40" value={cls} onChange={(e) => setCls(e.target.value)}>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label">Term</label><select className="input w-56" value={term} onChange={(e) => setTerm(e.target.value)}>{TERMS.map((t) => <option key={t}>{t}</option>)}</select></div>
        </div>
      </div>

      <div className="space-y-6">
        {cards.map((c, i) => (
          <div key={i} className="card print:page-break-after-always">
            <div className="card-body">
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <div className="flex items-center gap-3">
                  {settings.logoDataUrl && <img src={settings.logoDataUrl} className="w-12 h-12 rounded-full object-cover" />}
                  <div>
                    <div className="font-semibold">{settings.name}</div>
                    <div className="text-xs text-slate-500">Progress Report — {term}</div>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div>Class: <b>{c.student?.className}-{c.student?.section}</b></div>
                  <div>Roll: <b>{c.student?.rollNo}</b></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                <div><div className="text-slate-500">Student</div><div className="font-medium">{c.student?.name}</div></div>
                <div><div className="text-slate-500">Father</div><div className="font-medium">{c.student?.fatherName}</div></div>
                <div><div className="text-slate-500">Admission No</div><div className="font-medium">{c.student?.admissionNo}</div></div>
              </div>
              <table className="table">
                <thead><tr><th>Subject</th><th>Max</th><th>Obtained</th><th>Status</th></tr></thead>
                <tbody>
                  {c.subjectRows.map((s) => (
                    <tr key={s.name}><td>{s.name}</td><td>{s.max}</td><td className="font-medium">{s.obt}</td><td className={s.status === "Pass" ? "text-emerald-700" : "text-rose-700"}>{s.status}</td></tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-semibold"><td>Total</td><td>{c.max}</td><td>{c.total}</td><td>{c.pct.toFixed(1)}% · {c.grade}</td></tr>
                </tfoot>
              </table>
              <div className="flex justify-between items-end mt-10 text-sm">
                <div><div className="border-t border-slate-400 pt-1 inline-block px-6">Class Teacher</div></div>
                <div className="text-center">{settings.signatureDataUrl && <img src={settings.signatureDataUrl} className="h-12 mx-auto" />}<div className="border-t border-slate-400 pt-1 inline-block px-6">{settings.principal}</div></div>
              </div>
            </div>
          </div>
        ))}
        {!cards.length && <div className="text-center text-slate-500">No results for this selection.</div>}
      </div>
    </div>
  );
}
