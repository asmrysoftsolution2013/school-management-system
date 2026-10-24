import { useState, type FormEvent } from "react";
import PageHeader from "../../components/PageHeader";
import { useBooks, uid } from "../../store";
import type { BookRecord } from "../../types";
import { Plus, Trash2 } from "lucide-react";
import { fmtCurrency, fmtDate, todayISO } from "../../utils";

const empty = (): BookRecord => ({ id: "", accessionNo: "", title: "", author: "", category: "", purchasedOn: todayISO(), price: 0 });

export default function Library() {
  const [books, setBooks] = useBooks();
  const [form, setForm] = useState<BookRecord>(empty());

  const add = (e: FormEvent) => { e.preventDefault(); setBooks([...books, { ...form, id: uid(), accessionNo: form.accessionNo || `BK-${String(books.length + 1).padStart(4, "0")}` }]); setForm(empty()); };

  return (
    <div>
      <PageHeader title="Accession Register" subtitle="Library inventory and issue tracking." />
      <form onSubmit={add} className="card mb-4">
        <div className="card-body grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <div><label className="label">Accession No</label><input className="input" value={form.accessionNo} onChange={(e) => setForm({ ...form, accessionNo: e.target.value })} /></div>
          <div className="md:col-span-2"><label className="label">Title</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
          <div><label className="label">Author</label><input className="input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
          <div><label className="label">Category</label><input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
          <div><label className="label">Price</label><input type="number" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
          <div><label className="label">Purchased On</label><input type="date" className="input" value={form.purchasedOn} onChange={(e) => setForm({ ...form, purchasedOn: e.target.value })} /></div>
          <div className="md:col-span-5 flex"><button className="btn-primary ml-auto"><Plus className="w-4 h-4" /> Add Book</button></div>
        </div>
      </form>
      <div className="card">
        <table className="table">
          <thead><tr><th>Accession</th><th>Title</th><th>Author</th><th>Category</th><th>Price</th><th>Purchased</th><th>Issued To</th><th></th></tr></thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id}>
                <td className="font-medium">{b.accessionNo}</td>
                <td>{b.title}</td><td>{b.author}</td><td>{b.category}</td><td>{fmtCurrency(b.price)}</td>
                <td>{fmtDate(b.purchasedOn)}</td>
                <td><input className="input" value={b.issuedTo ?? ""} onChange={(e) => setBooks(books.map((x) => x.id === b.id ? { ...x, issuedTo: e.target.value, issuedOn: e.target.value ? todayISO() : undefined } : x))} /></td>
                <td><button className="btn-ghost text-rose-600" onClick={() => setBooks(books.filter((x) => x.id !== b.id))}><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
            {!books.length && <tr><td colSpan={8} className="text-center text-slate-500 py-6">No books in the register.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
