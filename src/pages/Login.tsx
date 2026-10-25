import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { School, LogIn } from "lucide-react";
import { useAuth } from "../auth";
import { useSettings } from "../store";

export default function Login() {
  const { login } = useAuth();
  const [settings] = useSettings();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const r = login(u, p);
    if (r) setErr(r);
    else nav("/");
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-slate-100">
      <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-brand-700 to-brand-900 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 grid place-items-center">
            <School className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-semibold">{settings.name}</div>
            <div className="text-brand-200 text-sm">{settings.motto}</div>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-semibold leading-tight">Learning Management System</h2>
          <p className="mt-3 text-brand-100 max-w-md">
            Admissions, fees, results, staff, attendance, library & stock — all in one place.
          </p>
        </div>
        <div className="text-brand-200 text-xs">© {new Date().getFullYear()} {settings.name}</div>
      </div>

      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="card w-full max-w-md">
          <div className="card-body space-y-4">
            <div>
              <h1 className="text-xl font-semibold">Sign in</h1>
              <p className="text-sm text-slate-500 mt-1">
                Enter your credentials to continue.
              </p>
            </div>
            {err && <div className="text-rose-600 text-sm bg-rose-50 border border-rose-200 rounded p-2">{err}</div>}
            <div>
              <label className="label">Username</label>
              <input className="input" value={u} onChange={(e) => setU(e.target.value)} autoFocus />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" value={p} onChange={(e) => setP(e.target.value)} />
            </div>
            <button className="btn-primary w-full justify-center" type="submit">
              <LogIn className="w-4 h-4" /> Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
