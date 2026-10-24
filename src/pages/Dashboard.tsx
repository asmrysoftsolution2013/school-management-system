import { Link } from "react-router-dom";
import { MODULES } from "../modules";
import { useStudents, useStaff, useFees, useAttendance } from "../store";
import { fmtCurrency, fmtDate, monthISO, todayISO } from "../utils";
import {
  Users, Wallet, GraduationCap, UserCheck, AlertTriangle, TrendingUp, UserPlus,
} from "lucide-react";

function lastNMonths(n: number): string[] {
  const out: string[] = [];
  const d = new Date();
  d.setDate(1);
  for (let i = n - 1; i >= 0; i--) {
    const copy = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push(copy.toISOString().slice(0, 7));
  }
  return out;
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function monthLabel(ym: string): string {
  const m = Number(ym.split("-")[1]);
  return MONTHS_SHORT[m - 1] ?? "";
}

export default function Dashboard() {
  const [students] = useStudents();
  const [staff] = useStaff();
  const [fees] = useFees();
  const [attendance] = useAttendance();

  const thisMonth = monthISO();
  const today = todayISO();

  const activeStudents = students.filter((s) => s.status === "Active").length;
  const activeStaff = staff.filter((s) => s.status === "Active").length;

  const feesByMonth = new Map<string, number>();
  for (const f of fees) {
    const net = f.amount - f.discount + f.fine;
    feesByMonth.set(f.month, (feesByMonth.get(f.month) || 0) + net);
  }
  const collectedThisMonth = feesByMonth.get(thisMonth) || 0;

  const paidThisMonth = new Set(fees.filter((f) => f.month === thisMonth).map((f) => f.studentId));
  const defaulters = students.filter((s) => s.status === "Active" && !paidThisMonth.has(s.id)).length;

  const todayStudent = attendance.filter((a) => a.date === today && a.personType === "Student");
  const presentToday = todayStudent.filter((a) => a.status === "Present").length;
  const attendanceRate = todayStudent.length
    ? Math.round((presentToday / todayStudent.length) * 100)
    : null;

  const months = lastNMonths(6);
  const trend = months.map((m) => ({ month: m, total: feesByMonth.get(m) || 0 }));
  const trendMax = Math.max(1, ...trend.map((t) => t.total));

  const recentAdmissions = [...students]
    .filter((s) => s.admissionDate)
    .sort((a, b) => (a.admissionDate < b.admissionDate ? 1 : -1))
    .slice(0, 5);

  const stats = [
    { label: "Active Students", value: activeStudents, icon: Users,         color: "bg-sky-500" },
    { label: "Active Staff",    value: activeStaff,    icon: UserCheck,     color: "bg-indigo-500" },
    { label: "Fees This Month", value: fmtCurrency(collectedThisMonth), icon: Wallet, color: "bg-emerald-500" },
    { label: "Present Today",   value: presentToday,   icon: GraduationCap, color: "bg-amber-500" },
    { label: "Defaulters",      value: defaulters,     icon: AlertTriangle, color: "bg-rose-500" },
    {
      label: "Attendance Rate",
      value: attendanceRate == null ? "—" : `${attendanceRate}%`,
      icon: TrendingUp,
      color: "bg-fuchsia-500",
    },
  ];

  // SVG geometry
  const chartW = 560;
  const chartH = 180;
  const padL = 36;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;
  const barGap = 14;
  const barW = (innerW - barGap * (trend.length - 1)) / trend.length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <div className="card-body flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg ${s.color} text-white grid place-items-center shrink-0`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</div>
                <div className="text-xl font-semibold text-slate-900 mt-0.5 truncate">{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card lg:col-span-2">
          <div className="card-body">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-slate-800">Fee Collection — Last 6 Months</div>
                <div className="text-xs text-slate-500">
                  Total: {fmtCurrency(trend.reduce((s, t) => s + t.total, 0))}
                </div>
              </div>
              <Link to="/accounts/fee-collection" className="text-xs text-brand-700 hover:underline">
                Open fee collection →
              </Link>
            </div>

            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" role="img" aria-label="Fee collection chart">
              <defs>
                <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              {[0, 0.25, 0.5, 0.75, 1].map((p) => {
                const y = padT + innerH * (1 - p);
                return (
                  <g key={p}>
                    <line x1={padL} x2={chartW - padR} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="2 3" />
                    <text x={padL - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8">
                      {Math.round((trendMax * p) / 1000)}k
                    </text>
                  </g>
                );
              })}

              {trend.map((t, i) => {
                const h = (t.total / trendMax) * innerH;
                const x = padL + i * (barW + barGap);
                const y = padT + innerH - h;
                return (
                  <g key={t.month}>
                    <rect x={x} y={y} width={barW} height={h} rx="4" fill="url(#barGrad)" />
                    {t.total > 0 && (
                      <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="9" fill="#334155">
                        {Math.round(t.total / 1000)}k
                      </text>
                    )}
                    <text x={x + barW / 2} y={chartH - 10} textAnchor="middle" fontSize="10" fill="#64748b">
                      {monthLabel(t.month)}
                    </text>
                  </g>
                );
              })}

              {trend.every((t) => t.total === 0) && (
                <text
                  x={padL + innerW / 2}
                  y={padT + innerH / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="#94a3b8"
                >
                  No fee payments recorded yet.
                </text>
              )}
            </svg>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-slate-800">Recent Admissions</div>
              <Link to="/students" className="text-xs text-brand-700 hover:underline">All →</Link>
            </div>
            {recentAdmissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-sm">
                <UserPlus className="w-8 h-8 mb-2 text-slate-300" />
                No students yet.
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recentAdmissions.map((s) => (
                  <li key={s.id}>
                    <Link
                      to={`/students/edit/${s.id}`}
                      className="flex items-center justify-between py-2.5 hover:bg-slate-50 -mx-2 px-2 rounded"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-800 truncate">{s.name}</div>
                        <div className="text-xs text-slate-500">
                          Class {s.className}-{s.section} · {s.admissionNo}
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 shrink-0 ml-3">{fmtDate(s.admissionDate)}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
        {MODULES.map((m) => (
          <div key={m.key} className="card overflow-hidden flex flex-col">
            <div className={`bg-gradient-to-r ${m.color} text-white px-4 py-3 flex items-center gap-2`}>
              <m.icon className="w-5 h-5" />
              <h3 className="font-semibold text-sm">{m.title}</h3>
            </div>
            <ul className="divide-y divide-slate-100 flex-1">
              {m.items.map((it) => (
                <li key={it.to + it.label}>
                  <Link
                    to={it.to}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                  >
                    <it.icon className="w-4 h-4 text-slate-400" />
                    <span>{it.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
