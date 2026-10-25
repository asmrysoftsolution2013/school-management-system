// Lightweight localStorage-backed data store with React hook.
import { useCallback, useEffect, useState } from "react";
import type {
  SchoolSettings,
  Student,
  Staff,
  Subject,
  FeePayment,
  CashBookEntry,
  SalaryPayment,
  ExamResult,
  AttendanceRecord,
  Visitor,
  LeaveRecord,
  TimetableSlot,
  LessonPlan,
  LetterTemplate,
  StockItem,
  BookRecord,
} from "./types";

const PREFIX = "sms:";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("sms-store", { detail: key }));
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function useStore<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => read<T>(key, fallback));

  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<string>;
      if (ev.detail === key) setValue(read<T>(key, fallback));
    };
    window.addEventListener("sms-store", handler);
    return () => window.removeEventListener("sms-store", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const nextVal = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        write(key, nextVal);
        return nextVal;
      });
    },
    [key]
  );

  return [value, set] as const;
}

export const KEYS = {
  settings: "settings",
  students: "students",
  staff: "staff",
  subjects: "subjects",
  fees: "fees",
  cashbook: "cashbook",
  salaries: "salaries",
  results: "results",
  attendance: "attendance",
  visitors: "visitors",
  leaves: "leaves",
  timetable: "timetable",
  lessonplans: "lessonplans",
  letters: "letters",
  stock: "stock",
  books: "books",
  sessions: "sessions",
} as const;

export const defaultSettings: SchoolSettings = {
  name: "Al-Noor Public School",
  motto: "Knowledge • Discipline • Character",
  address: "Main Road, City",
  phone: "+92-300-0000000",
  email: "info@alnoor.edu",
  session: "2026-2027",
  principal: "Mr. Principal",
};

// Typed per-collection hooks for ergonomics.
export const useSettings    = () => useStore<SchoolSettings>(KEYS.settings, defaultSettings);
export function useAvailableClasses(): string[] {
  const [settings] = useSettings();
  const school = ["Nursery", "KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const college = ["11", "12", "BA-I", "BA-II", "BSc-I", "BSc-II", "BCom-I", "BCom-II"];
  switch (settings.institutionType) {
    case "School":  return school;
    case "College": return college;
    case "Both":    return [...school, ...college];
    default:        return [...school, ...college];
  }
}
export const useStudents    = () => useStore<Student[]>(KEYS.students, []);
export const useStaff       = () => useStore<Staff[]>(KEYS.staff, []);
export const useSubjects    = () => useStore<Subject[]>(KEYS.subjects, []);
export const useFees        = () => useStore<FeePayment[]>(KEYS.fees, []);
export const useCashBook    = () => useStore<CashBookEntry[]>(KEYS.cashbook, []);
export const useSalaries    = () => useStore<SalaryPayment[]>(KEYS.salaries, []);
export const useResults     = () => useStore<ExamResult[]>(KEYS.results, []);
export const useAttendance  = () => useStore<AttendanceRecord[]>(KEYS.attendance, []);
export const useVisitors    = () => useStore<Visitor[]>(KEYS.visitors, []);
export const useLeaves      = () => useStore<LeaveRecord[]>(KEYS.leaves, []);
export const useTimetable   = () => useStore<TimetableSlot[]>(KEYS.timetable, []);
export const useLessonPlans = () => useStore<LessonPlan[]>(KEYS.lessonplans, []);
export const useLetters     = () => useStore<LetterTemplate[]>(KEYS.letters, []);
export const useStock       = () => useStore<StockItem[]>(KEYS.stock, []);
export const useBooks       = () => useStore<BookRecord[]>(KEYS.books, []);
export const useSessions    = () => useStore<string[]>(KEYS.sessions, ["2026-2027"]);

export function seedIfEmpty() {
  const have = read<Student[]>(KEYS.students, []);
  if (have.length > 0) return;
  const sample: Student[] = [
    {
      id: uid(), admissionNo: "ADM-001", rollNo: "1", name: "Ahmad Ali", fatherName: "Mr. Ali",
      dob: "2015-05-14", gender: "Male", className: "5", section: "A", admissionDate: "2026-03-10",
      phone: "+92-300-1111111", address: "Street 1, City", monthlyFee: 2500, status: "Active",
    },
    {
      id: uid(), admissionNo: "ADM-002", rollNo: "2", name: "Fatima Khan", fatherName: "Mr. Khan",
      dob: "2014-08-21", gender: "Female", className: "6", section: "B", admissionDate: "2025-04-01",
      phone: "+92-300-2222222", address: "Street 2, City", monthlyFee: 3000, status: "Active",
    },
    {
      id: uid(), admissionNo: "ADM-003", rollNo: "3", name: "Hassan Raza", fatherName: "Mr. Raza",
      dob: "2013-11-02", gender: "Male", className: "7", section: "A", admissionDate: "2024-08-15",
      phone: "+92-300-3333333", address: "Street 3, City", monthlyFee: 3500, status: "Active",
    },
  ];
  write(KEYS.students, sample);

  const staff: Staff[] = [
    {
      id: uid(), staffId: "T-001", name: "Mr. Ahmed", fatherName: "Mr. Mahmood", designation: "Senior Teacher",
      qualification: "M.Sc", phone: "+92-301-1111111", cnic: "00000-0000000-0", address: "City",
      joiningDate: "2023-09-01", salary: 45000, type: "Teacher", classAssigned: "5", status: "Active",
      subjects: ["Math", "Science"],
    },
    {
      id: uid(), staffId: "T-002", name: "Ms. Sana", fatherName: "Mr. Iqbal", designation: "Teacher",
      qualification: "B.Ed", phone: "+92-301-2222222", cnic: "00000-0000000-0", address: "City",
      joiningDate: "2024-02-10", salary: 38000, type: "Teacher", classAssigned: "6", status: "Active",
      subjects: ["English", "Urdu"],
    },
  ];
  write(KEYS.staff, staff);

  const subjects: Subject[] = ["5", "6", "7"].flatMap((cls) => [
    { id: uid(), name: "English",  className: cls, maxMarks: 100, passingMarks: 33 },
    { id: uid(), name: "Urdu",     className: cls, maxMarks: 100, passingMarks: 33 },
    { id: uid(), name: "Math",     className: cls, maxMarks: 100, passingMarks: 33 },
    { id: uid(), name: "Science",  className: cls, maxMarks: 100, passingMarks: 33 },
    { id: uid(), name: "Islamiat", className: cls, maxMarks: 100, passingMarks: 33 },
  ]);
  write(KEYS.subjects, subjects);
}
