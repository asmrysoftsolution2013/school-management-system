import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import { useStudents } from "../../store";
import { CLASSES, download, fmtCurrency, toCSV } from "../../utils";
import { UserPlus, Pencil, Trash2, Download, Printer, Search } from "lucide-react";

export default function StudentList() {
  const [students, setStudents] = useStudents();
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (q && !(`${s.name} ${s.fatherName} ${s.admissionNo}`.toLowerCase().includes(q.toLowerCase()))) return false;
      if (cls && s.className !== cls) return false;
      if (status && s.status !== status) return false;
      return true;
    });
  }, [students, q, cls, status]);

  const del = (id: string) => {
    if (!confirm("Delete this student?")) return;
    setStudents(students.filter((s) => s.id !== id));
  };

  const exportCSV = () => {
    download("students.csv", toCSV(filtered as unknown as Record<string, unknown>[]), "text/csv");
  };

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle="All current students. Add, edit, or print records."
        actions={
          <>
            <button className="btn-secondary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</button>
            <button className="btn-secondary" onClick={exportCSV}><Download className="w-4 h-4" /> Export CSV</button>
            <Link to="/students/add" className="btn-primary"><UserPlus className="w-4 h-4" /> Add Student</Link>
          </>
        }
      />

      <div className="card mb-4 no-print">
        <div className="card-body grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              placeholder="Search name, admission no, father…"
              className="input pl-9"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select className="input" value={cls} onChange={(e) => setCls(e.target.value)}>
            <option value="">All classes</option>
            {CLASSES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Any status</option>
            <option>Active</option><option>Left</option><option>Suspended</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="card-body">
            <EmptyState
              title="No students found"
              description="Try changing filters, or add a new student."
              action={<Link to="/students/add" className="btn-primary"><UserPlus className="w-4 h-4" /> Add Student</Link>}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Adm No</th><th>Name</th><th>Father</th><th>Class</th><th>Roll</th>
                  <th>Phone</th><th>Fee</th><th>Status</th><th className="no-print">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td className="font-medium text-brand-700">{s.admissionNo}</td>
                    <td>{s.name}</td>
                    <td>{s.fatherName}</td>
                    <td>{s.className}-{s.section}</td>
                    <td>{s.rollNo}</td>
                    <td>{s.phone}</td>
                    <td>{fmtCurrency(s.monthlyFee)}</td>
                    <td>
                      <span className={`pill ${
                        s.status === "Active" ? "bg-emerald-100 text-emerald-700" :
                        s.status === "Left" ? "bg-slate-100 text-slate-600" : "bg-rose-100 text-rose-700"
                      }`}>{s.status}</span>
                    </td>
                    <td className="no-print">
                      <div className="flex items-center gap-1">
                        <Link to={`/students/edit/${s.id}`} className="btn-ghost p-1.5"><Pencil className="w-4 h-4" /></Link>
                        <button className="btn-ghost p-1.5 text-rose-600" onClick={() => del(s.id)}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="text-xs text-slate-400 mt-3">Showing {filtered.length} of {students.length} students.</div>
    </div>
  );
}
