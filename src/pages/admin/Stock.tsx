import { useState, type FormEvent } from "react";
import PageHeader from "../../components/PageHeader";
import { useStock, uid } from "../../store";
import type { StockItem } from "../../types";
import { Plus, Trash2 } from "lucide-react";
import { fmtCurrency, fmtDate, todayISO } from "../../utils";

const empty = (): StockItem => ({ id: "", name: "", category: "", quantity: 0, unit: "pcs", purchaseDate: todayISO(), value: 0 });

export default function Stock() {
  const [items, setItems] = useStock();
  const [form, setForm] = useState<StockItem>(empty());

  const add = (e: FormEvent) => { e.preventDefault(); setItems([...items, { ...form, id: uid() }]); setForm(empty()); };

  return (
    <div>
      <PageHeader title="General Stock Register" subtitle="Furniture, equipment and supplies on hand." />
      <form onSubmit={add} className="card mb-4">
        <div className="card-body grid grid-cols-1 md:grid-cols-7 gap-3 items-end">
          <div className="md:col-span-2"><label className="label">Item</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div><label className="label">Category</label><input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
          <div><label className="label">Qty</label><input type="number" className="input" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} /></div>
          <div><label className="label">Unit</label><input className="input" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} /></div>
          <div><label className="label">Value</label><input type="number" className="input" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} /></div>
          <div><label className="label">Purchased</label><input type="date" className="input" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} /></div>
          <div className="md:col-span-7 flex"><button className="btn-primary ml-auto"><Plus className="w-4 h-4" /> Add</button></div>
        </div>
      </form>
      <div className="card">
        <table className="table">
          <thead><tr><th>Item</th><th>Category</th><th>Qty</th><th>Unit</th><th>Value</th><th>Purchased</th><th></th></tr></thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}><td>{i.name}</td><td>{i.category}</td><td>{i.quantity}</td><td>{i.unit}</td><td>{fmtCurrency(i.value)}</td><td>{fmtDate(i.purchaseDate)}</td><td><button className="btn-ghost text-rose-600" onClick={() => setItems(items.filter((x) => x.id !== i.id))}><Trash2 className="w-4 h-4" /></button></td></tr>
            ))}
            {!items.length && <tr><td colSpan={7} className="text-center text-slate-500 py-6">No stock recorded.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
