export const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(n || 0);

export const fmtDate = (d: string | Date) => {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return typeof d === "string" ? d : "";
  return date.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "2-digit" });
};

export const todayISO = () => new Date().toISOString().slice(0, 10);
export const monthISO = () => new Date().toISOString().slice(0, 7);

export function download(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function toCSV<T extends Record<string, unknown>>(rows: T[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}

export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

// Pakistani BISE-style class list.
// School = Nursery → 10. College = full set of intermediate groups, diplomas,
// and bachelor programs commonly offered under BISE/HEC-affiliated boards.

const SCHOOL_CLASSES = [
  "Nursery", "KG",
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
];

const COLLEGE_CLASSES = [
  // Intermediate (HSSC)
  "FSc Pre-Engineering (Part I)",
  "FSc Pre-Engineering (Part II)",
  "FSc Pre-Medical (Part I)",
  "FSc Pre-Medical (Part II)",
  "ICS Physics (Part I)",
  "ICS Physics (Part II)",
  "ICS Statistics (Part I)",
  "ICS Statistics (Part II)",
  "ICS Economics (Part I)",
  "ICS Economics (Part II)",
  "ICom (Part I)",
  "ICom (Part II)",
  "FA General Science (Part I)",
  "FA General Science (Part II)",
  "FA Humanities (Part I)",
  "FA Humanities (Part II)",
  "FA IT (Part I)",
  "FA IT (Part II)",
  "I.Hsc Home Economics (Part I)",
  "I.Hsc Home Economics (Part II)",

  // Diplomas
  "D.Com (Part I)",
  "D.Com (Part II)",
  "DAE Civil (Year I)",
  "DAE Civil (Year II)",
  "DAE Civil (Year III)",
  "DAE Electrical (Year I)",
  "DAE Electrical (Year II)",
  "DAE Electrical (Year III)",
  "DAE Mechanical (Year I)",
  "DAE Mechanical (Year II)",
  "DAE Mechanical (Year III)",

  // Bachelor
  "BA (Year I)",
  "BA (Year II)",
  "BSc (Year I)",
  "BSc (Year II)",
  "BCom (Year I)",
  "BCom (Year II)",
  "BBA (Year I)",
  "BBA (Year II)",
  "BS CS (Year I)",
  "BS CS (Year II)",
  "BS CS (Year III)",
  "BS CS (Year IV)",
  "BS IT (Year I)",
  "BS IT (Year II)",
  "BS IT (Year III)",
  "BS IT (Year IV)",
  "BS English (Year I)",
  "BS English (Year II)",
  "BS English (Year III)",
  "BS English (Year IV)",
];

export const CLASSES = [...SCHOOL_CLASSES, ...COLLEGE_CLASSES];
export const SECTIONS = [
  "A", "B", "C", "D",
  "Morning", "Evening",
  "Boys", "Girls",
];
export const CLASS_LEVELS = {
  School:  SCHOOL_CLASSES,
  College: COLLEGE_CLASSES,
} as const;
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const TERMS = ["First Term", "Mid Term", "Final Term"];
