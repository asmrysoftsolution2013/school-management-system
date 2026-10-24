import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="text-center py-12">
      <Inbox className="w-10 h-10 mx-auto text-slate-300" />
      <h3 className="mt-3 font-semibold text-slate-700">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
