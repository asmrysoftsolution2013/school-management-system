import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useStudents } from "../../store";
import { CLASSES } from "../../utils";
import { Save } from "lucide-react";

type Grade = "A" | "B" | "C" | "D" | "E";
const CATEGORIES = ["Discipline", "Punctuality", "Participation", "Cleanliness", "Teamwork"];
const KEY = "sms:conduct";

export default function Conduct() {
  const [students] = useStudents();
  const [cls, setCls] = useState("5");
  const [data, setData] = useState<Record<string, Record<string, Grade>>>({});

  useEffect(() => {
    try { setData(JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { setData({}); }
  }, []);

  const save = () => { localStorage.setItem(KEY, JSON.stringify(data)); alert("Conduct saved."); };
  const upd = (sid: string, cat: string, g: Grade) => setData((d) => ({ ...d, [sid]: { ...(d[sid] ?? {}), [cat]: g } }));
  const list = students.filter((s) => s.className === cls && s.status === "Active");

  return (
    <div>
      <PageHeader title="Conduct Assessment" subtitle="Grade students A–E across behavioural categories." actions={<button className="btn-primary" onClick={save}><Save className="w-4 h-4" /> Save</button>} />
      <div className="card mb-4"><div className="card-body"><label className="label">Class</label><select className="input w-40" value={cls} onChange={(e) => setCls(e.target.value)}>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select></div></div>
      <div className="card overflow-x-auto">
        <table className="table">
          <thead><tr><th>Student</th>{CATEGORIES.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {list.map((st) => (
              <tr key={st.id}>
                <td>{st.name}</td>
                {CATEGORIES.map((c) => (
                  <td key={c}>
                    <select className="input w-20" value={data[st.id]?.[c] ?? "A"} onChange={(e) => upd(st.id, c, e.target.value as Grade)}>
                      <option>A</option><option>B</option><option>C</option><option>D</option><option>E</option>
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
