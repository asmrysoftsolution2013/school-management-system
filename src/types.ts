// Shared domain types for the Learning Management System.

export type ID = string;

export interface SchoolSettings {
  name: string;
  motto: string;
  address: string;
  phone: string;
  email: string;
  session: string;
  principal: string;
  logoDataUrl?: string;
  signatureDataUrl?: string;
  institutionType?: "School" | "College" | "Both";
}

export interface Student {
  id: ID;
  admissionNo: string;
  rollNo: string;
  name: string;
  fatherName: string;
  motherName?: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  className: string;
  section: string;
  admissionDate: string;
  phone: string;
  address: string;
  cnic?: string;
  bloodGroup?: string;
  religion?: string;
  previousSchool?: string;
  guardianOccupation?: string;
  monthlyFee: number;
  status: "Active" | "Left" | "Suspended";
  photoDataUrl?: string;
}

export interface Staff {
  id: ID;
  staffId: string;
  name: string;
  fatherName: string;
  designation: string;
  qualification: string;
  phone: string;
  cnic: string;
  address: string;
  joiningDate: string;
  salary: number;
  type: "Teacher" | "Admin" | "Support";
  subjects?: string[];
  classAssigned?: string;
  status: "Active" | "On Leave" | "Resigned";
  photoDataUrl?: string;
}

export interface Subject {
  id: ID;
  name: string;
  className: string;
  maxMarks: number;
  passingMarks: number;
}

export interface FeePayment {
  id: ID;
  studentId: ID;
  month: string; // e.g. "2026-10"
  amount: number;
  discount: number;
  fine: number;
  paidOn: string;
  method: "Cash" | "Bank" | "Online";
  receiptNo: string;
  remarks?: string;
}

export interface CashBookEntry {
  id: ID;
  date: string;
  description: string;
  type: "Income" | "Expense";
  category: string;
  amount: number;
  reference?: string;
}

export interface SalaryPayment {
  id: ID;
  staffId: ID;
  month: string;
  basic: number;
  allowances: number;
  deductions: number;
  net: number;
  paidOn: string;
  method: "Cash" | "Bank";
  remarks?: string;
}

export interface ExamResult {
  id: ID;
  studentId: ID;
  term: string;
  className: string;
  marks: Record<string, number>; // subjectId -> marks
  remarks?: string;
}

export interface AttendanceRecord {
  id: ID;
  date: string;
  personId: ID;
  personType: "Student" | "Staff";
  status: "Present" | "Absent" | "Leave" | "Late";
  remarks?: string;
}

export interface Visitor {
  id: ID;
  date: string;
  name: string;
  cnic: string;
  purpose: string;
  meetingWith: string;
  timeIn: string;
  timeOut?: string;
  contact: string;
}

export interface LeaveRecord {
  id: ID;
  staffId: ID;
  from: string;
  to: string;
  reason: string;
  type: "Casual" | "Medical" | "Earned";
  status: "Pending" | "Approved" | "Rejected";
}

export interface TimetableSlot {
  id: ID;
  className: string;
  day: string;
  period: number;
  subject: string;
  teacherId?: ID;
}

export interface LessonPlan {
  id: ID;
  className: string;
  subject: string;
  teacherId?: ID;
  week: string;
  topic: string;
  objectives: string;
  activities: string;
  resources: string;
}

export interface LetterTemplate {
  id: ID;
  kind: "Complaint" | "Thanking" | "Memorandum" | "Circular" | "NOC";
  title: string;
  body: string;
  createdOn: string;
}

export interface StockItem {
  id: ID;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  purchaseDate: string;
  value: number;
}

export interface BookRecord {
  id: ID;
  accessionNo: string;
  title: string;
  author: string;
  category: string;
  purchasedOn: string;
  price: number;
  issuedTo?: string;
  issuedOn?: string;
}
