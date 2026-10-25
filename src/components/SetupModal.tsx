import { useState } from "react";
import { useSettings } from "../store";
import { School, GraduationCap, Building2, Sparkles } from "lucide-react";

type InstType = "School" | "College" | "Both";

export default function SetupModal() {
  const [settings, setSettings] = useSettings();
  const [choice, setChoice] = useState<InstType | null>(null);

  if (settings.institutionType) return null;

  const options: { key: InstType; icon: typeof School; title: string; subtitle: string; color: string }[] = [
    {
      key: "School",
      icon: School,
      title: "School",
      subtitle: "Classes up to 10th (Nursery, KG, 1 → 10)",
      color: "from-sky-500 to-sky-700",
    },
    {
      key: "College",
      icon: GraduationCap,
      title: "College",
      subtitle: "Intermediate & degree (11, 12, BA, BSc, BCom)",
      color: "from-emerald-500 to-emerald-700",
    },
    {
      key: "Both",
      icon: Building2,
      title: "School + College",
      subtitle: "A combined institute (Nursery → BCom)",
      color: "from-violet-500 to-violet-700",
    },
  ];

  const confirm = () => {
    if (!choice) return;
    setSettings({ ...settings, institutionType: choice });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        <div className="bg-gradient-to-r from-brand-700 to-brand-900 text-white px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6" />
            <div className="text-sm uppercase tracking-widest opacity-80">Welcome</div>
          </div>
          <h2 className="text-2xl font-bold">Let's set up your institution</h2>
          <p className="text-brand-100 text-sm mt-1">
            Pick the level you teach. We'll tailor classes, sections and reports to it. You can change this later in <b>School Info</b>.
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {options.map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => setChoice(o.key)}
              className={`relative text-left rounded-xl border-2 transition-all p-5 overflow-hidden ${
                choice === o.key
                  ? "border-brand-600 ring-4 ring-brand-100 shadow-lg -translate-y-0.5"
                  : "border-slate-200 hover:border-brand-300 hover:shadow-md"
              }`}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${o.color} text-white grid place-items-center mb-3`}>
                <o.icon className="w-6 h-6" />
              </div>
              <div className="font-semibold text-slate-900">{o.title}</div>
              <div className="text-xs text-slate-600 mt-1">{o.subtitle}</div>
              {choice === o.key && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-brand-600 text-white grid place-items-center text-xs font-bold">✓</div>
              )}
            </button>
          ))}
        </div>

        <div className="px-6 pb-6 flex justify-end">
          <button
            onClick={confirm}
            disabled={!choice}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
