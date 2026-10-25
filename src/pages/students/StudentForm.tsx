import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { useAvailableClasses, useStudents, uid } from "../../store";
import { SECTIONS, fileToDataURL, todayISO } from "../../utils";
import type { Student } from "../../types";
import { Save, X, Upload } from "lucide-react";

const empty = (): Student => ({
  id: "", admissionNo: "", rollNo: "", name: "", fatherName: "", motherName: "",
  dob: "", gender: "Male", className: "1", section: "A", admissionDate: todayISO(),
  phone: "", address: "", cnic: "", bloodGroup: "", religion: "", previousSchool: "",
  guardianOccupation: "", monthlyFee: 0, status: "Active",
});

export default function StudentForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [students, setStudents] = useStudents();
  const CLASSES = useAvailableClasses();
  const existing = useMemo(() => students.find((s) => s.id === id), [students, id]);
  const [form, setForm] = useState<Student>(() => existing ?? empty());

  useEffect(() => {
    if (existing) setForm(existing);
    else if (!id) {
      setForm((f) => ({
        ...f,
        admissionNo: f.admissionNo || `ADM-${String(students.length + 1).padStart(3, "0")}`,
      }));
    }
  }, [existing, id, students.length]);

  const upd = <K extends keyof Student>(k: K, v: Student[K]) => setForm((f) => ({ ...f, [k]: v }));

  const onPhoto = async (f: File | null) => {
    if (!f) return;
    const url = await fileToDataURL(f);
    upd("photoDataUrl", url);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (existing) {
      setStudents(students.map((s) => (s.id === existing.id ? form : s)));
    } else {
      setStudents([...students, { ...form, id: uid() }]);
    }
    nav("/students");
  };

  return (
    <div>
      <PageHeader
        title={existing ? "Edit Student Record" : "Add Student Record"}
        subtitle="Fill in the student's bio data and admission details."
      />
      <form onSubmit={submit} className="card">
        <div className="card-body grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-3 flex items-center gap-5">
            <div className="w-28 h-28 rounded-lg bg-slate-100 overflow-hidden grid place-items-center text-slate-400 text-xs">
              {form.photoDataUrl ? (
                <img src={form.photoDataUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                "No Photo"
              )}
            </div>
            <label className="btn-secondary cursor-pointer">
              <Upload className="w-4 h-4" />
              Upload Photo
              <input hidden type="file" accept="image/*" onChange={(e) => onPhoto(e.target.files?.[0] ?? null)} />
            </label>
          </div>

          <Field label="Admission No" required>
            <input className="input" value={form.admissionNo} onChange={(e) => upd("admissionNo", e.target.value)} required />
          </Field>
          <Field label="Roll No">
            <input className="input" value={form.rollNo} onChange={(e) => upd("rollNo", e.target.value)} />
          </Field>
          <Field label="Admission Date">
            <input type="date" className="input" value={form.admissionDate} onChange={(e) => upd("admissionDate", e.target.value)} />
          </Field>

          <Field label="Student Name" required>
            <input className="input" value={form.name} onChange={(e) => upd("name", e.target.value)} required />
          </Field>
          <Field label="Father's Name" required>
            <input className="input" value={form.fatherName} onChange={(e) => upd("fatherName", e.target.value)} required />
          </Field>
          <Field label="Mother's Name">
            <input className="input" value={form.motherName ?? ""} onChange={(e) => upd("motherName", e.target.value)} />
          </Field>

          <Field label="Date of Birth">
            <input type="date" className="input" value={form.dob} onChange={(e) => upd("dob", e.target.value)} />
          </Field>
          <Field label="Gender">
            <select className="input" value={form.gender} onChange={(e) => upd("gender", e.target.value as Student["gender"])}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </Field>
          <Field label="Blood Group">
            <input className="input" value={form.bloodGroup ?? ""} onChange={(e) => upd("bloodGroup", e.target.value)} />
          </Field>

          <Field label="Class" required>
            <select className="input" value={form.className} onChange={(e) => upd("className", e.target.value)}>
              {CLASSES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Section">
            <select className="input" value={form.section} onChange={(e) => upd("section", e.target.value)}>
              {SECTIONS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Monthly Fee">
            <input type="number" className="input" value={form.monthlyFee} onChange={(e) => upd("monthlyFee", Number(e.target.value))} />
          </Field>

          <Field label="Phone">
            <input className="input" value={form.phone} onChange={(e) => upd("phone", e.target.value)} />
          </Field>
          <Field label="CNIC / B-Form">
            <input className="input" value={form.cnic ?? ""} onChange={(e) => upd("cnic", e.target.value)} />
          </Field>
          <Field label="Religion">
            <input className="input" value={form.religion ?? ""} onChange={(e) => upd("religion", e.target.value)} />
          </Field>

          <Field label="Address" className="md:col-span-3">
            <textarea className="input" rows={2} value={form.address} onChange={(e) => upd("address", e.target.value)} />
          </Field>

          <Field label="Previous School">
            <input className="input" value={form.previousSchool ?? ""} onChange={(e) => upd("previousSchool", e.target.value)} />
          </Field>
          <Field label="Guardian Occupation">
            <input className="input" value={form.guardianOccupation ?? ""} onChange={(e) => upd("guardianOccupation", e.target.value)} />
          </Field>
          <Field label="Status">
            <select className="input" value={form.status} onChange={(e) => upd("status", e.target.value as Student["status"])}>
              <option>Active</option><option>Left</option><option>Suspended</option>
            </select>
          </Field>
        </div>
        <div className="card-header border-t border-slate-200 justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={() => nav(-1)}><X className="w-4 h-4" /> Cancel</button>
          <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Save Student</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children, required, className = "" }: { label: string; children: React.ReactNode; required?: boolean; className?: string }) {
  return (
    <div className={className}>
      <label className="label">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
      {children}
    </div>
  );
}
