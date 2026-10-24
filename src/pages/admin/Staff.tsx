import { useState, type FormEvent } from "react";
import PageHeader from "../../components/PageHeader";
import { useStaff, uid } from "../../store";
import type { Staff as StaffT } from "../../types";
import Modal from "../../components/Modal";
import { Plus, Pencil, Trash2, Save } from "lucide-react";
import { fmtCurrency } from "../../utils";

const empty = (): StaffT => ({
  id: "", staffId: "", name: "", fatherName: "", designation: "Teacher",
  qualification: "", phone: "", cnic: "", address: "", joiningDate: new Date().toISOString().slice(0, 10),
  salary: 0, type: "Teacher", status: "Active", subjects: [],
});

export default function Staff() {
  const [staff, setStaff] = useStaff();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<StaffT>(empty());

  const upd = <K extends keyof StaffT>(k: K, v: StaffT[K]) => setForm((f) => ({ ...f, [k]: v }));

  const edit = (s: StaffT) => { setForm(s); setOpen(true); };
  const add = () => { setForm({ ...empty(), staffId: `T-${String(staff.length + 1).padStart(3, "0")}` }); setOpen(true); };

  const save = (e: FormEvent) => {
    e.preventDefault();
    if (form.id) setStaff(staff.map((s) => s.id === form.id ? form : s));
    else setStaff([...staff, { ...form, id: uid() }]);
    setOpen(false);
  };

  const del = (id: string) => { if (confirm("Delete staff?")) setStaff(staff.filter((s) => s.id !== id)); };

  return (
    <div>
      <PageHeader title="Institution Staff" subtitle="Teachers, admin, and support staff." actions={<button className="btn-primary" onClick={add}><Plus className="w-4 h-4" /> Add Staff</button>} />
      <div className="card">
        <table className="table">
          <thead><tr><th>Staff ID</th><th>Name</th><th>Designation</th><th>Type</th><th>Phone</th><th>Salary</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id}>
                <td className="font-medium">{s.staffId}</td>
                <td>{s.name}</td><td>{s.designation}</td><td>{s.type}</td>
                <td>{s.phone}</td><td>{fmtCurrency(s.salary)}</td>
                <td><span className={`pill ${s.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{s.status}</span></td>
                <td><div className="flex gap-1"><button className="btn-ghost" onClick={() => edit(s)}><Pencil className="w-4 h-4" /></button><button className="btn-ghost text-rose-600" onClick={() => del(s.id)}><Trash2 className="w-4 h-4" /></button></div></td>
              </tr>
            ))}
            {!staff.length && <tr><td colSpan={8} className="text-center text-slate-500 py-6">No staff yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? "Edit Staff" : "Add Staff"} size="lg">
        <form onSubmit={save} className="grid grid-cols-2 gap-3">
          <div><label className="label">Staff ID</label><input className="input" value={form.staffId} onChange={(e) => upd("staffId", e.target.value)} required /></div>
          <div><label className="label">Type</label><select className="input" value={form.type} onChange={(e) => upd("type", e.target.value as StaffT["type"])}><option>Teacher</option><option>Admin</option><option>Support</option></select></div>
          <div><label className="label">Name</label><input className="input" value={form.name} onChange={(e) => upd("name", e.target.value)} required /></div>
          <div><label className="label">Father's Name</label><input className="input" value={form.fatherName} onChange={(e) => upd("fatherName", e.target.value)} /></div>
          <div><label className="label">Designation</label><input className="input" value={form.designation} onChange={(e) => upd("designation", e.target.value)} /></div>
          <div><label className="label">Qualification</label><input className="input" value={form.qualification} onChange={(e) => upd("qualification", e.target.value)} /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => upd("phone", e.target.value)} /></div>
          <div><label className="label">CNIC</label><input className="input" value={form.cnic} onChange={(e) => upd("cnic", e.target.value)} /></div>
          <div><label className="label">Joining Date</label><input type="date" className="input" value={form.joiningDate} onChange={(e) => upd("joiningDate", e.target.value)} /></div>
          <div><label className="label">Salary</label><input type="number" className="input" value={form.salary} onChange={(e) => upd("salary", Number(e.target.value))} /></div>
          <div><label className="label">Class Assigned</label><input className="input" value={form.classAssigned ?? ""} onChange={(e) => upd("classAssigned", e.target.value)} /></div>
          <div><label className="label">Status</label><select className="input" value={form.status} onChange={(e) => upd("status", e.target.value as StaffT["status"])}><option>Active</option><option>On Leave</option><option>Resigned</option></select></div>
          <div className="col-span-2"><label className="label">Address</label><input className="input" value={form.address} onChange={(e) => upd("address", e.target.value)} /></div>
          <div className="col-span-2"><label className="label">Subjects (comma separated)</label><input className="input" value={(form.subjects ?? []).join(", ")} onChange={(e) => upd("subjects", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} /></div>
          <div className="col-span-2 flex justify-end gap-2"><button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button><button className="btn-primary"><Save className="w-4 h-4" /> Save</button></div>
        </form>
      </Modal>
    </div>
  );
}
