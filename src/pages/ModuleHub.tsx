import { Link } from "react-router-dom";
import type { ModuleGroup } from "../modules";
import PageHeader from "../components/PageHeader";

export default function ModuleHub({ group }: { group: ModuleGroup }) {
  return (
    <div>
      <PageHeader title={group.title} subtitle="Choose an action below." />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {group.items.map((it) => (
          <Link
            key={it.to + it.label}
            to={it.to}
            className="card hover:border-brand-400 hover:shadow transition group"
          >
            <div className="card-body flex items-center gap-4">
              <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${group.color} text-white grid place-items-center`}>
                <it.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-slate-900 group-hover:text-brand-700">{it.label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{group.title}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
