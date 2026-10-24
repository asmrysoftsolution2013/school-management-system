// Central module manifest — drives the dashboard tiles and routes list.
import {
  UserPlus, UserCog, Printer, FileText, ListChecks, FileSignature, Pencil,
  Receipt, AlertTriangle, BookOpen, Wallet, FileSpreadsheet, FileBarChart2,
  BookMarked, GraduationCap, Award, CalendarDays, Trophy, Medal, UserX,
  LayoutGrid, FileCheck2, IdCard, ShieldCheck, UserRound, UserMinus, Calendar,
  Timer, Users as UsersIcon, Boxes, ClipboardList, CalendarClock, Mail,
  BadgeCheck, Fingerprint, LogIn, StickyNote, Megaphone, FileQuestion, Info,
  Flag, UserCheck, ChartNoAxesColumn,
} from "lucide-react";

export interface ModuleItem {
  to: string;
  label: string;
  icon: typeof UserPlus;
}
export interface ModuleGroup {
  key: string;
  title: string;
  color: string; // tailwind bg classes for the header strip
  icon: typeof UserPlus;
  items: ModuleItem[];
}

export const MODULES: ModuleGroup[] = [
  {
    key: "students",
    title: "Student's Admission",
    color: "from-sky-500 to-sky-600",
    icon: GraduationCap,
    items: [
      { to: "/students/add",            label: "Add Student Record",        icon: UserPlus },
      { to: "/students",                label: "Edit / List Students",      icon: Pencil },
      { to: "/students/empty-form",     label: "Print Empty Form",          icon: Printer },
      { to: "/students/filled-forms",   label: "Print Fill Forms",          icon: FileText },
      { to: "/students/rules",          label: "Print Institution Rules",   icon: ListChecks },
      { to: "/students/certificates",   label: "Institution Certificates",  icon: FileCheck2 },
      { to: "/students",                label: "List Of Current Students",  icon: UsersIcon },
      { to: "/students/complaint",      label: "Student Complaint Letter",  icon: Mail },
      { to: "/students/thanking",       label: "Thanking Letter",           icon: Mail },
      { to: "/students/letterhead",     label: "Letter Head",               icon: FileSignature },
      { to: "/students/strength",       label: "Strength Statement",        icon: ChartNoAxesColumn },
    ],
  },
  {
    key: "accounts",
    title: "Institution's Account",
    color: "from-emerald-500 to-emerald-600",
    icon: Wallet,
    items: [
      { to: "/accounts/fee-collection",  label: "Fee Collection",            icon: Receipt },
      { to: "/accounts/fee-defaulters",  label: "Fee Defaulters",            icon: AlertTriangle },
      { to: "/accounts/fee-recovery",    label: "Print Fee Recovery Detail", icon: FileBarChart2 },
      { to: "/accounts/cashbook-heading",label: "Set Cash Book Heading",     icon: BookOpen },
      { to: "/accounts/daily-cashbook",  label: "Daily Cash Book",           icon: BookMarked },
      { to: "/accounts/ledger-book",     label: "Ledger Book",               icon: FileSpreadsheet },
      { to: "/accounts/trial-balance",   label: "Trial Balance",             icon: FileBarChart2 },
      { to: "/accounts/fee-register",    label: "Fee Register",              icon: BookOpen },
      { to: "/accounts/salary-slip",     label: "Salary Statement / Slip",   icon: Receipt },
    ],
  },
  {
    key: "results",
    title: "Progress Report Cards",
    color: "from-amber-500 to-amber-600",
    icon: Award,
    items: [
      { to: "/results/subjects",         label: "Add Subjects / Maximum Marks", icon: BookOpen },
      { to: "/results/awards",           label: "Student Award List",           icon: Trophy },
      { to: "/results/datesheet",        label: "Date Sheet",                   icon: CalendarDays },
      { to: "/results/term-results",     label: "Term Results",                 icon: GraduationCap },
      { to: "/results/positions",        label: "Position Holders",             icon: Medal },
      { to: "/results/top-three",        label: "Top Three Position Holders",   icon: Trophy },
      { to: "/results/pass-fail",        label: "List Of Pass / Fail Students", icon: UserX },
      { to: "/results/terms-setup",      label: "Set Terms & Subjects",         icon: ListChecks },
      { to: "/results/terms-summary",    label: "Summary Of All Terms",         icon: FileBarChart2 },
      { to: "/results/progress-reports", label: "Progress Reports",             icon: FileCheck2 },
      { to: "/results/conduct",          label: "Conduct Assessment",           icon: BadgeCheck },
    ],
  },
  {
    key: "admin",
    title: "Administration",
    color: "from-indigo-500 to-indigo-600",
    icon: ShieldCheck,
    items: [
      { to: "/admin/signature",         label: "Add / Edit Signature & Logo", icon: FileSignature },
      { to: "/admin/id-cards",          label: "Students ID Cards",           icon: IdCard },
      { to: "/admin/institution-pass",  label: "Institution Pass",            icon: BadgeCheck },
      { to: "/admin/staff",             label: "Institution Staff",           icon: UserCog },
      { to: "/admin/noc",               label: "No Objection Certificate",    icon: FileCheck2 },
      { to: "/admin/timetable",         label: "Teacher / Class Timetable",   icon: CalendarClock },
      { to: "/admin/new-session",       label: "Make New Session",            icon: Calendar },
      { to: "/admin/visitors",          label: "Visitor Register",            icon: UserRound },
      { to: "/admin/illegal-login",     label: "Illegal Login Attempts",      icon: LogIn },
      { to: "/admin/leave",             label: "Leave Record (Teacher)",      icon: UserMinus },
      { to: "/admin/library",           label: "Accession Register",          icon: BookMarked },
      { to: "/admin/stock",             label: "General Stock Register",      icon: Boxes },
      { to: "/admin/staff-statement",   label: "Staff Statement",             icon: ClipboardList },
      { to: "/settings",                label: "Add / Edit School Info",      icon: UserCog },
    ],
  },
  {
    key: "others",
    title: "Others",
    color: "from-rose-500 to-rose-600",
    icon: LayoutGrid,
    items: [
      { to: "/others/co-curricular",    label: "Co-Curricular Performance", icon: Flag },
      { to: "/others/lesson-plan",      label: "Lesson Plan",               icon: StickyNote },
      { to: "/others/circular",         label: "Circular Letter",           icon: Megaphone },
      { to: "/others/memorandum",       label: "Memorandum",                icon: Mail },
      { to: "/others/papers",           label: "Papers",                    icon: FileText },
      { to: "/others/paper-answer",     label: "Paper & Answer",            icon: FileQuestion },
      { to: "/others/about",            label: "About",                     icon: Info },
      { to: "/others/teacher-attendance",   label: "Teacher Attendance",    icon: UserCheck },
      { to: "/others/student-attendance",   label: "Student Attendance",    icon: UserCheck },
      { to: "/others/biometric-attendance", label: "Biometric Attendance",  icon: Fingerprint },
      { to: "/others/timetable-view",   label: "Timetable View",            icon: Timer },
    ],
  },
];
