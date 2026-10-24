import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { fmtDate } from "../../utils";
import { Trash2 } from "lucide-react";

interface Entry { username: string; time: string; reason: string; }

export default function IllegalLogin() {
  const [log, setLog] = useState<Entry[]>([]);

  useEffect(() => {
    try { setLog(JSON.parse(localStorage.getItem("sms:illegalLogins") || "[]")); } catch { setLog([]); }
  }, []);

  const clear = () => {
    if (!confirm("Clear illegal login log?")) return;
    localStorage.removeItem("sms:illegalLogins");
    setLog([]);
  };

  return (
    <div>
      <PageHeader title="Illegal Login Attempts" subtitle="Failed sign-in attempts captured by the system." actions={<button className="btn-secondary" onClick={clear}><Trash2 className="w-4 h-4" /> Clear</button>} />
      <div className="card">
        <table className="table">
          <thead><tr><th>Username</th><th>When</th><th>Reason</th></tr></thead>
          <tbody>
            {log.slice().reverse().map((e, i) => (
              <tr key={i}><td className="font-mono text-sm">{e.username}</td><td>{fmtDate(e.time)} {new Date(e.time).toLocaleTimeString()}</td><td>{e.reason}</td></tr>
            ))}
            {!log.length && <tr><td colSpan={3} className="text-center text-slate-500 py-6">No illegal attempts recorded.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
