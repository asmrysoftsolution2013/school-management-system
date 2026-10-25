import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ModuleHub from "./pages/ModuleHub";
import { MODULES } from "./modules";

// Students
import StudentForm from "./pages/students/StudentForm";
import StudentList from "./pages/students/StudentList";
import EmptyForm from "./pages/students/EmptyForm";
import FilledForms from "./pages/students/FilledForms";
import InstitutionRules from "./pages/students/InstitutionRules";
import Certificates from "./pages/students/Certificates";
import ComplaintLetter from "./pages/students/ComplaintLetter";
import ThankingLetter from "./pages/students/ThankingLetter";
import LetterHead from "./pages/students/LetterHead";
import StrengthStatement from "./pages/students/StrengthStatement";

// Accounts
import FeeCollection from "./pages/accounts/FeeCollection";
import FeeDefaulters from "./pages/accounts/FeeDefaulters";
import FeeRecovery from "./pages/accounts/FeeRecovery";
import CashBookHeading from "./pages/accounts/CashBookHeading";
import DailyCashBook from "./pages/accounts/DailyCashBook";
import LedgerBook from "./pages/accounts/LedgerBook";
import TrialBalance from "./pages/accounts/TrialBalance";
import FeeRegister from "./pages/accounts/FeeRegister";
import SalarySlip from "./pages/accounts/SalarySlip";

// Results
import Subjects from "./pages/results/Subjects";
import Awards from "./pages/results/Awards";
import DateSheet from "./pages/results/DateSheet";
import TermResults from "./pages/results/TermResults";
import Positions from "./pages/results/Positions";
import TopThree from "./pages/results/TopThree";
import PassFail from "./pages/results/PassFail";
import TermsSetup from "./pages/results/TermsSetup";
import TermsSummary from "./pages/results/TermsSummary";
import ProgressReports from "./pages/results/ProgressReports";
import Conduct from "./pages/results/Conduct";

// Admin
import Signature from "./pages/admin/Signature";
import IDCards from "./pages/admin/IDCards";
import InstitutionPass from "./pages/admin/InstitutionPass";
import Staff from "./pages/admin/Staff";
import NOC from "./pages/admin/NOC";
import Timetable from "./pages/admin/Timetable";
import NewSession from "./pages/admin/NewSession";
import Visitors from "./pages/admin/Visitors";
import IllegalLogin from "./pages/admin/IllegalLogin";
import LeaveRecord from "./pages/admin/LeaveRecord";
import Library from "./pages/admin/Library";
import Stock from "./pages/admin/Stock";
import StaffStatement from "./pages/admin/StaffStatement";
import SalaryRegister from "./pages/admin/SalaryRegister";
import StaffAttendanceReport from "./pages/admin/StaffAttendanceReport";
import SchoolInfo from "./pages/admin/SchoolInfo";

// Others
import CoCurricular from "./pages/others/CoCurricular";
import LessonPlan from "./pages/others/LessonPlan";
import Circular from "./pages/others/Circular";
import Memorandum from "./pages/others/Memorandum";
import Papers from "./pages/others/Papers";
import PaperAnswer from "./pages/others/PaperAnswer";
import About from "./pages/others/About";
import StudentAttendance from "./pages/others/StudentAttendance";
import TeacherAttendance from "./pages/others/TeacherAttendance";
import BiometricAttendance from "./pages/others/BiometricAttendance";
import TimetableView from "./pages/others/TimetableView";
import StudentAttendanceReport from "./pages/others/StudentAttendanceReport";

function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const mStudents = MODULES.find((m) => m.key === "students")!;
  const mAccounts = MODULES.find((m) => m.key === "accounts")!;
  const mResults  = MODULES.find((m) => m.key === "results")!;
  const mAdmin    = MODULES.find((m) => m.key === "admin")!;
  const mOthers   = MODULES.find((m) => m.key === "others")!;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protected><Layout /></Protected>}>
        <Route index element={<Dashboard />} />

        {/* Students */}
        <Route path="students"               element={<StudentList />} />
        <Route path="students/hub"           element={<ModuleHub group={mStudents} />} />
        <Route path="students/add"           element={<StudentForm />} />
        <Route path="students/edit/:id"      element={<StudentForm />} />
        <Route path="students/empty-form"    element={<EmptyForm />} />
        <Route path="students/filled-forms"  element={<FilledForms />} />
        <Route path="students/rules"         element={<InstitutionRules />} />
        <Route path="students/certificates"  element={<Certificates />} />
        <Route path="students/complaint"     element={<ComplaintLetter />} />
        <Route path="students/thanking"      element={<ThankingLetter />} />
        <Route path="students/letterhead"    element={<LetterHead />} />
        <Route path="students/strength"      element={<StrengthStatement />} />

        {/* Accounts */}
        <Route path="accounts"                 element={<ModuleHub group={mAccounts} />} />
        <Route path="accounts/fee-collection"  element={<FeeCollection />} />
        <Route path="accounts/fee-defaulters"  element={<FeeDefaulters />} />
        <Route path="accounts/fee-recovery"    element={<FeeRecovery />} />
        <Route path="accounts/cashbook-heading" element={<CashBookHeading />} />
        <Route path="accounts/daily-cashbook"  element={<DailyCashBook />} />
        <Route path="accounts/ledger-book"     element={<LedgerBook />} />
        <Route path="accounts/trial-balance"   element={<TrialBalance />} />
        <Route path="accounts/fee-register"    element={<FeeRegister />} />
        <Route path="accounts/salary-slip"     element={<SalarySlip />} />

        {/* Results */}
        <Route path="results"                    element={<ModuleHub group={mResults} />} />
        <Route path="results/subjects"           element={<Subjects />} />
        <Route path="results/awards"             element={<Awards />} />
        <Route path="results/datesheet"          element={<DateSheet />} />
        <Route path="results/term-results"       element={<TermResults />} />
        <Route path="results/positions"          element={<Positions />} />
        <Route path="results/top-three"          element={<TopThree />} />
        <Route path="results/pass-fail"          element={<PassFail />} />
        <Route path="results/terms-setup"        element={<TermsSetup />} />
        <Route path="results/terms-summary"      element={<TermsSummary />} />
        <Route path="results/progress-reports"   element={<ProgressReports />} />
        <Route path="results/conduct"            element={<Conduct />} />

        {/* Administration */}
        <Route path="admin"                   element={<ModuleHub group={mAdmin} />} />
        <Route path="admin/signature"         element={<Signature />} />
        <Route path="admin/id-cards"          element={<IDCards />} />
        <Route path="admin/institution-pass"  element={<InstitutionPass />} />
        <Route path="admin/staff"             element={<Staff />} />
        <Route path="admin/noc"               element={<NOC />} />
        <Route path="admin/timetable"         element={<Timetable />} />
        <Route path="admin/new-session"       element={<NewSession />} />
        <Route path="admin/visitors"          element={<Visitors />} />
        <Route path="admin/illegal-login"     element={<IllegalLogin />} />
        <Route path="admin/leave"             element={<LeaveRecord />} />
        <Route path="admin/library"           element={<Library />} />
        <Route path="admin/stock"             element={<Stock />} />
        <Route path="admin/staff-statement"   element={<StaffStatement />} />
        <Route path="admin/salary-register"   element={<SalaryRegister />} />
        <Route path="admin/staff-attendance-report" element={<StaffAttendanceReport />} />
        <Route path="settings"                element={<SchoolInfo />} />

        {/* Others */}
        <Route path="others"                    element={<ModuleHub group={mOthers} />} />
        <Route path="others/co-curricular"      element={<CoCurricular />} />
        <Route path="others/lesson-plan"        element={<LessonPlan />} />
        <Route path="others/circular"           element={<Circular />} />
        <Route path="others/memorandum"         element={<Memorandum />} />
        <Route path="others/papers"             element={<Papers />} />
        <Route path="others/paper-answer"       element={<PaperAnswer />} />
        <Route path="others/about"              element={<About />} />
        <Route path="others/teacher-attendance" element={<TeacherAttendance />} />
        <Route path="others/student-attendance" element={<StudentAttendance />} />
        <Route path="others/biometric-attendance" element={<BiometricAttendance />} />
        <Route path="others/timetable-view"     element={<TimetableView />} />
        <Route path="others/student-attendance-report" element={<StudentAttendanceReport />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
