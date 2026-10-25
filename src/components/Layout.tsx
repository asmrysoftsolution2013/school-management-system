import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import {
  Home, Users, Wallet, GraduationCap, ShieldCheck, Settings as SettingsIcon,
  LogOut, Menu, X, Printer, FileText, UserCog, Bell, School,
} from "lucide-react";
import { useAuth } from "../auth";
import { useSettings } from "../store";
import SetupModal from "./SetupModal";

const NAV = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/students", label: "Students", icon: Users },
  { to: "/accounts", label: "Accounts", icon: Wallet },
  { to: "/results", label: "Results", icon: GraduationCap },
  { to: "/admin", label: "Administration", icon: ShieldCheck },
  { to: "/others", label: "Others", icon: FileText },
  { to: "/settings", label: "School Info", icon: SettingsIcon },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [settings] = useSettings();
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  return (
    <>
    <SetupModal />
    <div className="flex min-h-screen">
      <aside
        className={`fixed md:static z-30 inset-y-0 left-0 w-64 bg-gradient-to-b from-brand-800 to-brand-900 text-brand-50 transform transition-transform no-print ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-brand-700">
          {settings.logoDataUrl ? (
            <img src={settings.logoDataUrl} alt="logo" className="w-10 h-10 rounded-full object-cover bg-white" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-brand-600 grid place-items-center">
              <School className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0">
            <div className="font-semibold truncate">{settings.name}</div>
            <div className="text-xs text-brand-200 truncate">{settings.session}</div>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                  isActive ? "bg-brand-600 text-white" : "text-brand-100 hover:bg-brand-700"
                }`
              }
            >
              <n.icon className="w-4 h-4" />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 inset-x-0 p-3 border-t border-brand-700">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-brand-500 grid place-items-center text-white text-sm font-semibold">
              {user?.name?.[0] ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.name}</div>
              <div className="text-xs text-brand-200 capitalize">{user?.role}</div>
            </div>
            <button onClick={logout} className="p-2 rounded hover:bg-brand-700" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 no-print">
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-2 rounded hover:bg-slate-100"
                onClick={() => setOpen((o) => !o)}
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <Breadcrumbs path={loc.pathname} />
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-ghost" onClick={() => window.print()} title="Print this page">
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
              <Link to="/settings" className="btn-ghost">
                <UserCog className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
              <button className="btn-ghost" title="Notifications">
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 md:p-8 print-area">
          <Outlet />
        </main>
      </div>
    </div>
    </>
  );
}

function Breadcrumbs({ path }: { path: string }) {
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) return <h1 className="text-lg font-semibold">Dashboard</h1>;
  return (
    <nav className="text-sm text-slate-500 flex items-center gap-2">
      <Link to="/" className="hover:text-brand-600">Dashboard</Link>
      {parts.map((p, i) => {
        const to = "/" + parts.slice(0, i + 1).join("/");
        return (
          <span key={to} className="flex items-center gap-2">
            <span>/</span>
            <Link to={to} className="hover:text-brand-600 capitalize">
              {p.replace(/-/g, " ")}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
