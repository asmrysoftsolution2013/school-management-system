import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { School, LogIn, GraduationCap, BookOpen, Users } from "lucide-react";
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
    <div className="min-h-screen grid md:grid-cols-5 bg-slate-100">
      {/* Hero panel */}
      <div className="hidden md:flex md:col-span-3 flex-col justify-between p-12 bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 text-white relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          {settings.logoDataUrl ? (
            <img src={settings.logoDataUrl} className="w-14 h-14 rounded-full object-cover ring-4 ring-white/20" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur grid place-items-center ring-4 ring-white/10">
              <School className="w-7 h-7" />
            </div>
          )}
          <div>
            <div className="text-xl font-semibold">{settings.name}</div>
            <div className="text-brand-200 text-sm">{settings.motto}</div>
          </div>
        </div>

        <div className="relative">
          <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs tracking-widest uppercase backdrop-blur border border-white/10 mb-4">
            Welcome
          </div>
          <h2 className="text-5xl font-bold leading-tight tracking-tight">
            Learning <br /> Management System
          </h2>
          <p className="mt-5 text-brand-100 text-lg max-w-md">
            Admissions, fees, results, staff, attendance, library & stock — all in one place.
          </p>

          <div className="grid grid-cols-3 gap-3 mt-10 max-w-md">
            {[
              { icon: Users,         label: "Students" },
              { icon: GraduationCap, label: "Results" },
              { icon: BookOpen,      label: "Library" },
            ].map((f) => (
              <div key={f.label} className="rounded-xl bg-white/10 backdrop-blur border border-white/10 p-4 text-center">
                <f.icon className="w-5 h-5 mx-auto mb-2 text-brand-100" />
                <div className="text-xs text-brand-50">{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-brand-200 text-xs">© {new Date().getFullYear()} {settings.name}</div>
      </div>

      {/* Login card */}
      <div className="md:col-span-2 flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 space-y-5">
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white grid place-items-center mx-auto mb-3 shadow-lg shadow-brand-500/30">
                <LogIn className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
              <p className="text-sm text-slate-500 mt-1">
                Enter your credentials to continue.
              </p>
            </div>

            {err && (
              <div className="text-rose-700 text-sm bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-start gap-2">
                <span className="font-semibold">⚠</span><span>{err}</span>
              </div>
            )}

            <div>
              <label className="label">Username</label>
              <input className="input" value={u} onChange={(e) => setU(e.target.value)} autoFocus placeholder="username" />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" value={p} onChange={(e) => setP(e.target.value)} placeholder="••••••••" />
            </div>

            <button className="btn-primary w-full justify-center text-base py-2.5" type="submit">
              <LogIn className="w-4 h-4" /> Sign in
            </button>

            <div className="text-center text-xs text-slate-400">
              Secured session · stored locally in this browser
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
