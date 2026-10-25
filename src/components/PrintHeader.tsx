import { useSettings } from "../store";

interface Props {
  documentTitle?: string;
  subtitle?: string;
  showOnScreen?: boolean;
}

export default function PrintHeader({ documentTitle, subtitle, showOnScreen = false }: Props) {
  const [settings] = useSettings();
  const className = showOnScreen ? "" : "print-only";

  return (
    <div className={`${className} border-b-2 border-slate-800 pb-3 mb-4`}>
      <div className="flex items-center gap-4">
        {settings.logoDataUrl && (
          <img src={settings.logoDataUrl} className="w-20 h-20 rounded-full object-cover border border-slate-300" />
        )}
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold text-slate-900 tracking-wide">{settings.name}</h1>
          {settings.motto && <div className="text-xs italic text-slate-600">{settings.motto}</div>}
          <div className="text-xs text-slate-700 mt-1">
            {settings.address}
            {settings.phone && <> • {settings.phone}</>}
            {settings.email && <> • {settings.email}</>}
          </div>
        </div>
        {settings.logoDataUrl && <div className="w-20 h-20" />}
      </div>
      {documentTitle && (
        <div className="text-center mt-3">
          <div className="inline-block border border-slate-700 px-4 py-1 text-sm font-semibold uppercase tracking-wider">
            {documentTitle}
          </div>
          {subtitle && <div className="text-xs text-slate-600 mt-1">{subtitle}</div>}
        </div>
      )}
    </div>
  );
}
